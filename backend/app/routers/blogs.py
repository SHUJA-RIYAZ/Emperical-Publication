import json

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import BlogPost
from ..schemas import BlogPostOut

router = APIRouter(prefix="/blogs", tags=["blog"])


@router.get("", response_model=list[BlogPostOut], response_model_by_alias=True)
def list_blogs(
    search: str | None = None,
    category: str | None = None,
    tag: str | None = None,
    limit: int | None = Query(None, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = select(BlogPost)
    if search:
        term = f"%{search.lower()}%"
        query = query.where(
            or_(func.lower(BlogPost.title).like(term), func.lower(BlogPost.excerpt).like(term))
        )
    if category and category != "all":
        query = query.where(BlogPost.category == category)
    if tag and tag != "all":
        # MySQL JSON array membership: JSON_CONTAINS(col, '"value"')
        query = query.where(func.json_contains(BlogPost.tags, json.dumps(tag)))

    query = query.order_by(BlogPost.published_at.desc(), BlogPost.id.desc())
    if limit:
        query = query.limit(limit)
    rows = db.scalars(query).all()
    return [BlogPostOut.model_validate(p) for p in rows]


@router.get("/categories", response_model=list[str])
def blog_categories(db: Session = Depends(get_db)):
    rows = db.scalars(select(BlogPost.category).distinct().order_by(BlogPost.category)).all()
    return [c for c in rows if c]


@router.get("/tags", response_model=list[str])
def blog_tags(db: Session = Depends(get_db)):
    rows = db.scalars(select(BlogPost.tags)).all()
    tags = sorted({t for tag_list in rows for t in (tag_list or [])})
    return tags


@router.get("/{slug}", response_model=BlogPostOut, response_model_by_alias=True)
def get_blog(slug: str, db: Session = Depends(get_db)):
    post = db.scalar(select(BlogPost).where(BlogPost.slug == slug))
    if post is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return BlogPostOut.model_validate(post)


@router.get("/{slug}/related", response_model=list[BlogPostOut], response_model_by_alias=True)
def related_blogs(slug: str, limit: int = Query(3, ge=1, le=12), db: Session = Depends(get_db)):
    post = db.scalar(select(BlogPost).where(BlogPost.slug == slug))
    if post is None:
        raise HTTPException(status_code=404, detail="Article not found")

    candidates = db.scalars(select(BlogPost).where(BlogPost.id != post.id)).all()
    base_tags = set(post.tags or [])

    def score(candidate: BlogPost) -> int:
        return (2 if candidate.category == post.category else 0) + len(
            base_tags & set(candidate.tags or [])
        )

    candidates.sort(key=score, reverse=True)
    return [BlogPostOut.model_validate(p) for p in candidates[:limit]]
