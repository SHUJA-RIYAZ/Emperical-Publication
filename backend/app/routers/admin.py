from dataclasses import dataclass
from typing import Type

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy import delete as sa_delete
from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from ..auth import create_access_token, get_current_admin, verify_password
from ..database import get_db
from ..models import (
    Author,
    BlogPost,
    Book,
    BookAuthor,
    ContactMessage,
    Faq,
    Journal,
    NewsletterSubscriber,
    PublishingRequest,
    Service,
    Testimonial,
    User,
)
from ..schemas import (
    ApiModel,
    AuthorBase,
    AuthorOut,
    BlogPostBase,
    BlogPostOut,
    BookCreate,
    BookOut,
    ContactMessageOut,
    DashboardStats,
    FaqBase,
    FaqOut,
    JournalBase,
    JournalOut,
    LoginIn,
    PublishingRequestOut,
    ServiceBase,
    ServiceOut,
    StatusUpdate,
    SubscriberOut,
    TestimonialBase,
    TestimonialOut,
    TokenOut,
    UserOut,
)
from ..schemas import SiteSettingsPayload
from ..settings_store import get_settings, save_settings
from ..utils import ensure_unique_slug, slugify
from .books import to_book_out

router = APIRouter(prefix="/admin", tags=["admin"])


# ------------------------------------------------------------------- auth ---

@router.post("/login", response_model=TokenOut, response_model_by_alias=True)
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account disabled")
    return TokenOut(access_token=create_access_token(user), user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut, response_model_by_alias=True)
def me(user: User = Depends(get_current_admin)):
    return UserOut.model_validate(user)


# -------------------------------------------------------- generic CRUD ------

@dataclass(frozen=True)
class Resource:
    model: Type
    schema_in: Type[ApiModel]
    schema_out: Type[ApiModel]
    sluggable: str | None = None  # field used to derive the slug, if any


RESOURCES: dict[str, Resource] = {
    "books": Resource(Book, BookCreate, BookOut, sluggable="title"),
    "authors": Resource(Author, AuthorBase, AuthorOut, sluggable="name"),
    "blogs": Resource(BlogPost, BlogPostBase, BlogPostOut, sluggable="title"),
    "journals": Resource(Journal, JournalBase, JournalOut, sluggable="title"),
    "services": Resource(Service, ServiceBase, ServiceOut, sluggable="title"),
    "testimonials": Resource(Testimonial, TestimonialBase, TestimonialOut),
    "faqs": Resource(Faq, FaqBase, FaqOut),
}


def get_resource(name: str) -> Resource:
    resource = RESOURCES.get(name)
    if resource is None:
        raise HTTPException(status_code=404, detail=f"Unknown resource '{name}'")
    return resource


def serialize(resource: Resource, row) -> ApiModel:
    if resource.model is Book:
        return to_book_out(row)
    return resource.schema_out.model_validate(row)


def apply_slug(resource: Resource, db: Session, data: dict, current_id: int | None = None) -> dict:
    if resource.sluggable is None or "slug" not in resource.schema_in.model_fields:
        return data
    base = data.get("slug") or slugify(data.get(resource.sluggable) or "")

    def exists(slug: str) -> bool:
        query = select(resource.model).where(resource.model.slug == slug)
        if current_id is not None:
            query = query.where(resource.model.id != current_id)
        return db.scalar(query) is not None

    data["slug"] = ensure_unique_slug(exists, slugify(base))
    return data


def sync_book_authors(db: Session, book: Book, author_ids: list[int]) -> None:
    db.execute(sa_delete(BookAuthor).where(BookAuthor.book_id == book.id))
    for position, author_id in enumerate(author_ids):
        if db.get(Author, author_id) is not None:
            db.add(BookAuthor(book_id=book.id, author_id=author_id, position=position))


@router.get("/resources/{name}")
def admin_list(
    name: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    resource = get_resource(name)
    query = select(resource.model)
    if resource.model is Book:
        query = query.options(selectinload(Book.authors))
    rows = db.scalars(query.order_by(resource.model.id.desc())).all()
    return [serialize(resource, r).model_dump(by_alias=True) for r in rows]


@router.post("/resources/{name}", status_code=201)
def admin_create(
    name: str,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    resource = get_resource(name)
    parsed = resource.schema_in.model_validate(payload)
    data = parsed.model_dump()
    author_ids: list[int] = data.pop("author_ids", []) if resource.model is Book else []
    data = apply_slug(resource, db, data)

    row = resource.model(**data)
    db.add(row)
    db.flush()
    if resource.model is Book:
        sync_book_authors(db, row, author_ids)
    db.commit()
    db.refresh(row)
    return serialize(resource, row).model_dump(by_alias=True)


@router.put("/resources/{name}/{item_id}")
def admin_update(
    name: str,
    item_id: int,
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    resource = get_resource(name)
    row = db.get(resource.model, item_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Item not found")

    parsed = resource.schema_in.model_validate(payload)
    data = parsed.model_dump()
    author_ids: list[int] = data.pop("author_ids", []) if resource.model is Book else []
    data = apply_slug(resource, db, data, current_id=item_id)

    for key, value in data.items():
        setattr(row, key, value)
    if resource.model is Book:
        sync_book_authors(db, row, author_ids)
    db.commit()
    db.refresh(row)
    return serialize(resource, row).model_dump(by_alias=True)


@router.delete("/resources/{name}/{item_id}", status_code=204)
def admin_delete(
    name: str,
    item_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    resource = get_resource(name)
    row = db.get(resource.model, item_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(row)
    db.commit()


# --------------------------------------------------------- submissions ------

@router.get(
    "/publishing-requests",
    response_model=list[PublishingRequestOut],
    response_model_by_alias=True,
)
def list_publishing_requests(
    db: Session = Depends(get_db), _: User = Depends(get_current_admin)
):
    rows = db.scalars(
        select(PublishingRequest).order_by(PublishingRequest.created_at.desc())
    ).all()
    return [PublishingRequestOut.model_validate(r) for r in rows]


@router.patch(
    "/publishing-requests/{item_id}/status",
    response_model=PublishingRequestOut,
    response_model_by_alias=True,
)
def update_request_status(
    item_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    if payload.status not in {"pending", "in_review", "accepted", "rejected"}:
        raise HTTPException(status_code=422, detail="Invalid status")
    row = db.get(PublishingRequest, item_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Request not found")
    row.status = payload.status
    db.commit()
    db.refresh(row)
    return PublishingRequestOut.model_validate(row)


@router.get(
    "/contact-messages", response_model=list[ContactMessageOut], response_model_by_alias=True
)
def list_contact_messages(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    rows = db.scalars(select(ContactMessage).order_by(ContactMessage.created_at.desc())).all()
    return [ContactMessageOut.model_validate(m) for m in rows]


@router.patch(
    "/contact-messages/{item_id}/status",
    response_model=ContactMessageOut,
    response_model_by_alias=True,
)
def update_message_status(
    item_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    if payload.status not in {"new", "responded", "archived"}:
        raise HTTPException(status_code=422, detail="Invalid status")
    row = db.get(ContactMessage, item_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Message not found")
    row.status = payload.status
    db.commit()
    db.refresh(row)
    return ContactMessageOut.model_validate(row)


@router.get("/subscribers", response_model=list[SubscriberOut], response_model_by_alias=True)
def list_subscribers(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    rows = db.scalars(
        select(NewsletterSubscriber).order_by(NewsletterSubscriber.created_at.desc())
    ).all()
    return [SubscriberOut.model_validate(s) for s in rows]


@router.delete("/subscribers/{item_id}", status_code=204)
def delete_subscriber(
    item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)
):
    row = db.get(NewsletterSubscriber, item_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    db.delete(row)
    db.commit()


# --------------------------------------------------------------- settings ---

@router.get("/settings", response_model=SiteSettingsPayload, response_model_by_alias=True)
def admin_get_settings(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return get_settings(db)


@router.put("/settings", response_model=SiteSettingsPayload, response_model_by_alias=True)
def admin_save_settings(
    payload: SiteSettingsPayload,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    save_settings(db, payload)
    return get_settings(db)


# ------------------------------------------------------------- dashboard ----

@router.get("/dashboard", response_model=DashboardStats, response_model_by_alias=True)
def dashboard(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    def count(model) -> int:
        return db.scalar(select(func.count()).select_from(model)) or 0

    recent_requests = db.scalars(
        select(PublishingRequest).order_by(PublishingRequest.created_at.desc()).limit(5)
    ).all()
    recent_messages = db.scalars(
        select(ContactMessage).order_by(ContactMessage.created_at.desc()).limit(5)
    ).all()

    return DashboardStats(
        books=count(Book),
        authors=count(Author),
        journals=count(Journal),
        blog_posts=count(BlogPost),
        services=count(Service),
        testimonials=count(Testimonial),
        faqs=count(Faq),
        pending_requests=db.scalar(
            select(func.count())
            .select_from(PublishingRequest)
            .where(PublishingRequest.status == "pending")
        )
        or 0,
        total_requests=count(PublishingRequest),
        new_messages=db.scalar(
            select(func.count())
            .select_from(ContactMessage)
            .where(ContactMessage.status == "new")
        )
        or 0,
        subscribers=count(NewsletterSubscriber),
        recent_requests=[PublishingRequestOut.model_validate(r) for r in recent_requests],
        recent_messages=[ContactMessageOut.model_validate(m) for m in recent_messages],
    )
