"""Author-portal authentication and account endpoints.

Registered authors can sign in, manage their profile, track the manuscript
submissions tied to their account, and keep a wishlist synced across devices.
"""

import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete as sa_delete
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import create_access_token, get_current_user, hash_password, verify_password
from ..config import get_settings
from ..database import get_db
from ..mailer import send_email
from ..models import Book, PasswordResetToken, PublishingRequest, User, WishlistItem
from ..schemas import (
    ChangePasswordIn,
    ForgotPasswordIn,
    LoginIn,
    MessageOut,
    MySubmissionOut,
    ProfileUpdateIn,
    RegisterIn,
    ResetPasswordIn,
    TokenOut,
    UserOut,
    WishlistIn,
    WishlistOut,
)

router = APIRouter(prefix="/auth", tags=["account"])

RESET_TOKEN_TTL_HOURS = 2


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


# ------------------------------------------------------------- register/login ---

@router.post("/register", response_model=TokenOut, response_model_by_alias=True, status_code=201)
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.scalar(select(User).where(User.email == email)):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user = User(
        email=email,
        password_hash=hash_password(payload.password),
        full_name=payload.full_name.strip(),
        phone=payload.phone,
        affiliation=payload.affiliation,
        country=payload.country,
        role="user",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return TokenOut(access_token=create_access_token(user), user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenOut, response_model_by_alias=True)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="This account has been disabled.")
    return TokenOut(access_token=create_access_token(user), user=UserOut.model_validate(user))


# --------------------------------------------------------------------- profile ---

@router.get("/me", response_model=UserOut, response_model_by_alias=True)
def me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)


@router.patch("/me", response_model=UserOut, response_model_by_alias=True)
def update_profile(
    payload: ProfileUpdateIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    user.full_name = payload.full_name.strip()
    user.phone = payload.phone
    user.affiliation = payload.affiliation
    user.country = payload.country
    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


@router.post("/change-password", response_model=MessageOut, response_model_by_alias=True)
def change_password(
    payload: ChangePasswordIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    if not verify_password(payload.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Your current password is incorrect.")
    user.password_hash = hash_password(payload.new_password)
    db.commit()
    return MessageOut(message="Your password has been updated.")


# -------------------------------------------------------------- password reset ---

@router.post("/forgot-password", response_model=MessageOut, response_model_by_alias=True)
def forgot_password(payload: ForgotPasswordIn, db: Session = Depends(get_db)):
    settings = get_settings()
    user = db.scalar(select(User).where(User.email == payload.email.lower()))

    # Always return the same response so accounts cannot be enumerated.
    generic = MessageOut(
        message="If an account exists for that address, a reset link is on its way."
    )
    if user is None or not user.is_active:
        return generic

    token = secrets.token_urlsafe(32)
    db.add(
        PasswordResetToken(
            user_id=user.id,
            token_hash=_hash_token(token),
            expires_at=datetime.now(timezone.utc) + timedelta(hours=RESET_TOKEN_TTL_HOURS),
        )
    )
    db.commit()

    reset_url = f"{settings.site_url.rstrip('/')}/reset-password?token={token}"
    send_email(
        to=user.email,
        subject="Reset your Emperical account password",
        body=(
            f"Hello {user.full_name},\n\n"
            "We received a request to reset your password. Use the link below within "
            f"{RESET_TOKEN_TTL_HOURS} hours:\n\n{reset_url}\n\n"
            "If you did not request this, you can safely ignore this email.\n\n"
            "— Emperical International Publication"
        ),
    )
    return generic


@router.post("/reset-password", response_model=MessageOut, response_model_by_alias=True)
def reset_password(payload: ResetPasswordIn, db: Session = Depends(get_db)):
    record = db.scalar(
        select(PasswordResetToken).where(PasswordResetToken.token_hash == _hash_token(payload.token))
    )
    invalid = HTTPException(
        status_code=400, detail="This reset link is invalid or has expired. Please request a new one."
    )
    if record is None or record.used_at is not None:
        raise invalid

    expires_at = record.expires_at
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise invalid

    user = db.get(User, record.user_id)
    if user is None:
        raise invalid

    user.password_hash = hash_password(payload.password)
    record.used_at = datetime.now(timezone.utc)
    db.commit()
    return MessageOut(message="Your password has been reset. You can now sign in.")


# ----------------------------------------------------------------- submissions ---

@router.get("/submissions", response_model=list[MySubmissionOut], response_model_by_alias=True)
def my_submissions(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.scalars(
        select(PublishingRequest)
        .where(PublishingRequest.user_id == user.id)
        .order_by(PublishingRequest.created_at.desc())
    ).all()
    return [MySubmissionOut.model_validate(r) for r in rows]


# -------------------------------------------------------------------- wishlist ---

def _wishlist_ids(db: Session, user_id: int) -> list[str]:
    rows = db.scalars(
        select(WishlistItem.book_id)
        .where(WishlistItem.user_id == user_id)
        .order_by(WishlistItem.created_at.desc())
    ).all()
    return [str(book_id) for book_id in rows]


@router.get("/wishlist", response_model=WishlistOut, response_model_by_alias=True)
def get_wishlist(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return WishlistOut(book_ids=_wishlist_ids(db, user.id))


@router.put("/wishlist", response_model=WishlistOut, response_model_by_alias=True)
def merge_wishlist(
    payload: WishlistIn,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Merges ids into the account's wishlist — used to adopt a guest wishlist at sign-in."""
    existing = set(int(i) for i in _wishlist_ids(db, user.id))
    valid_ids = set(
        db.scalars(select(Book.id).where(Book.id.in_(payload.book_ids or [0]))).all()
    )
    for book_id in valid_ids - existing:
        db.add(WishlistItem(user_id=user.id, book_id=book_id))
    db.commit()
    return WishlistOut(book_ids=_wishlist_ids(db, user.id))


@router.post("/wishlist/{book_id}", response_model=WishlistOut, response_model_by_alias=True)
def add_to_wishlist(
    book_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    if db.get(Book, book_id) is None:
        raise HTTPException(status_code=404, detail="Book not found")
    if db.get(WishlistItem, (user.id, book_id)) is None:
        db.add(WishlistItem(user_id=user.id, book_id=book_id))
        db.commit()
    return WishlistOut(book_ids=_wishlist_ids(db, user.id))


@router.delete("/wishlist/{book_id}", response_model=WishlistOut, response_model_by_alias=True)
def remove_from_wishlist(
    book_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    db.execute(
        sa_delete(WishlistItem).where(
            WishlistItem.user_id == user.id, WishlistItem.book_id == book_id
        )
    )
    db.commit()
    return WishlistOut(book_ids=_wishlist_ids(db, user.id))
