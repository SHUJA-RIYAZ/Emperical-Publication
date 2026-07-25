"""Public blog comment endpoints.

New comments are held for moderation; only approved ones are served publicly.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth import get_optional_user
from ..database import get_db
from ..models import BlogPost, Comment, User
from ..schemas import CommentIn, CommentOut, MessageOut

router = APIRouter(prefix="/blogs", tags=["comments"])


def _post_or_404(db: Session, slug: str) -> BlogPost:
    post = db.scalar(select(BlogPost).where(BlogPost.slug == slug))
    if post is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return post


@router.get("/{slug}/comments", response_model=list[CommentOut], response_model_by_alias=True)
def list_comments(slug: str, db: Session = Depends(get_db)):
    post = _post_or_404(db, slug)
    rows = db.scalars(
        select(Comment)
        .where(Comment.post_id == post.id, Comment.status == "approved")
        .order_by(Comment.created_at.desc())
    ).all()
    return [CommentOut.model_validate(c) for c in rows]


@router.post("/{slug}/comments", response_model=MessageOut, response_model_by_alias=True, status_code=201)
def create_comment(
    slug: str,
    payload: CommentIn,
    db: Session = Depends(get_db),
    user: User | None = Depends(get_optional_user),
):
    post = _post_or_404(db, slug)
    db.add(
        Comment(
            post_id=post.id,
            user_id=user.id if user else None,
            name=payload.name.strip(),
            email=payload.email.lower(),
            body=payload.body.strip(),
            status="pending",
        )
    )
    db.commit()
    return MessageOut(
        message="Thank you — your comment has been submitted and will appear once reviewed."
    )
