import math

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Book
from ..schemas import BookOut, PaginatedBooks

router = APIRouter(prefix="/books", tags=["books"])

SORTERS = {
    "newest": (Book.publication_date.desc(), Book.id.desc()),
    "oldest": (Book.publication_date.asc(), Book.id.asc()),
    "title-asc": (Book.title.asc(),),
    "title-desc": (Book.title.desc(),),
    "price-asc": (Book.price.asc(),),
    "price-desc": (Book.price.desc(),),
    "rating": (Book.rating.desc(),),
}


def to_book_out(book: Book) -> BookOut:
    out = BookOut.model_validate(book)
    out.author_ids = [str(a.id) for a in book.authors]
    return out


@router.get("", response_model=PaginatedBooks, response_model_by_alias=True)
def list_books(
    search: str | None = None,
    category: str | None = None,
    language: str | None = None,
    year: str | None = None,
    sort: str = "newest",
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=200, alias="pageSize"),
    db: Session = Depends(get_db),
):
    query = select(Book).options(selectinload(Book.authors))

    if search:
        term = f"%{search.lower()}%"
        query = query.where(
            or_(
                func.lower(Book.title).like(term),
                func.lower(func.coalesce(Book.subtitle, "")).like(term),
                Book.isbn.like(f"%{search}%"),
                func.lower(cast(Book.tags, String)).like(term),
            )
        )
    if category and category != "all":
        query = query.where(Book.category == category)
    if language and language != "all":
        query = query.where(Book.language == language)
    if year and year != "all":
        query = query.where(Book.publication_year == int(year))

    total = db.scalar(select(func.count()).select_from(query.subquery())) or 0
    total_pages = max(1, math.ceil(total / page_size))
    page = min(page, total_pages)

    order_by = SORTERS.get(sort, SORTERS["newest"])
    rows = db.scalars(
        query.order_by(*order_by).offset((page - 1) * page_size).limit(page_size)
    ).all()

    return PaginatedBooks(
        items=[to_book_out(b) for b in rows],
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/featured", response_model=list[BookOut], response_model_by_alias=True)
def featured_books(db: Session = Depends(get_db)):
    rows = db.scalars(
        select(Book).options(selectinload(Book.authors)).where(Book.featured)
    ).all()
    return [to_book_out(b) for b in rows]


@router.get("/years", response_model=list[int])
def book_years(db: Session = Depends(get_db)):
    rows = db.scalars(
        select(Book.publication_year).distinct().order_by(Book.publication_year.desc())
    ).all()
    return list(rows)


@router.get("/categories", response_model=list[str])
def book_categories(db: Session = Depends(get_db)):
    """Distinct categories actually in the catalogue, so admin-added ones appear in filters."""
    rows = db.scalars(select(Book.category).distinct().order_by(Book.category)).all()
    return [c for c in rows if c]


@router.get("/languages", response_model=list[str])
def book_languages(db: Session = Depends(get_db)):
    rows = db.scalars(select(Book.language).distinct().order_by(Book.language)).all()
    return [lang for lang in rows if lang]


@router.get("/quick-search", response_model=list[BookOut], response_model_by_alias=True)
def quick_search(q: str, limit: int = Query(5, ge=1, le=20), db: Session = Depends(get_db)):
    term = f"%{q.lower()}%"
    rows = db.scalars(
        select(Book)
        .options(selectinload(Book.authors))
        .where(
            or_(
                func.lower(Book.title).like(term),
                func.lower(cast(Book.tags, String)).like(term),
            )
        )
        .limit(limit)
    ).all()
    return [to_book_out(b) for b in rows]


@router.get("/{slug}", response_model=BookOut, response_model_by_alias=True)
def get_book(slug: str, db: Session = Depends(get_db)):
    book = db.scalar(
        select(Book).options(selectinload(Book.authors)).where(Book.slug == slug)
    )
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return to_book_out(book)


@router.get("/{slug}/related", response_model=list[BookOut], response_model_by_alias=True)
def related_books(slug: str, limit: int = Query(4, ge=1, le=12), db: Session = Depends(get_db)):
    book = db.scalar(select(Book).where(Book.slug == slug))
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")

    candidates = db.scalars(
        select(Book).options(selectinload(Book.authors)).where(Book.id != book.id)
    ).all()
    base_tags = set(book.tags or [])

    def score(candidate: Book) -> int:
        return (2 if candidate.category == book.category else 0) + len(
            base_tags & set(candidate.tags or [])
        )

    candidates.sort(key=score, reverse=True)
    return [to_book_out(b) for b in candidates[:limit]]
