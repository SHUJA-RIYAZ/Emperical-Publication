"""Site-wide search across books, authors, journals and blog posts."""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Author, BlogPost, Book, Journal
from ..schemas import SearchHit, SearchResults

router = APIRouter(tags=["search"])


@router.get("/search", response_model=SearchResults, response_model_by_alias=True)
def search(
    q: str,
    limit: int = Query(4, ge=1, le=20),
    db: Session = Depends(get_db),
):
    term = f"%{q.strip().lower()}%"
    if not q.strip():
        return SearchResults()

    books = db.scalars(
        select(Book)
        .where(
            or_(
                func.lower(Book.title).like(term),
                func.lower(func.coalesce(Book.subtitle, "")).like(term),
                Book.isbn.like(f"%{q.strip()}%"),
                func.lower(cast(Book.tags, String)).like(term),
            )
        )
        .order_by(Book.publication_date.desc())
        .limit(limit)
    ).all()

    authors = db.scalars(
        select(Author)
        .where(
            or_(
                func.lower(Author.name).like(term),
                func.lower(Author.institution).like(term),
                func.lower(cast(Author.research_interests, String)).like(term),
            )
        )
        .order_by(Author.name)
        .limit(limit)
    ).all()

    journals = db.scalars(
        select(Journal)
        .where(or_(func.lower(Journal.title).like(term), func.lower(Journal.field).like(term)))
        .limit(limit)
    ).all()

    posts = db.scalars(
        select(BlogPost)
        .where(
            or_(
                func.lower(BlogPost.title).like(term),
                func.lower(BlogPost.excerpt).like(term),
                func.lower(cast(BlogPost.tags, String)).like(term),
            )
        )
        .order_by(BlogPost.published_at.desc())
        .limit(limit)
    ).all()

    results = SearchResults(
        books=[
            SearchHit(
                type="book",
                title=b.title,
                subtitle=f"{b.category} · {b.publication_year}",
                slug=b.slug,
            )
            for b in books
        ],
        authors=[
            SearchHit(type="author", title=a.name, subtitle=a.institution, slug=a.slug)
            for a in authors
        ],
        journals=[
            SearchHit(type="journal", title=j.title, subtitle=j.field, slug=j.slug)
            for j in journals
        ],
        blogs=[
            SearchHit(type="blog", title=p.title, subtitle=p.category, slug=p.slug) for p in posts
        ],
    )
    results.total = (
        len(results.books) + len(results.authors) + len(results.journals) + len(results.blogs)
    )
    return results
