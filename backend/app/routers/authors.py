import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import String, cast, func, or_, select
from sqlalchemy.orm import Session, selectinload

from ..database import get_db
from ..models import Author, Book, BookAuthor
from ..schemas import AuthorOut, BookOut
from .books import to_book_out

router = APIRouter(prefix="/authors", tags=["authors"])


@router.get("", response_model=list[AuthorOut], response_model_by_alias=True)
def list_authors(
    search: str | None = None,
    country: str | None = None,
    interest: str | None = None,
    db: Session = Depends(get_db),
):
    query = select(Author)
    if search:
        term = f"%{search.lower()}%"
        query = query.where(
            or_(
                func.lower(Author.name).like(term),
                func.lower(Author.institution).like(term),
                func.lower(cast(Author.research_interests, String)).like(term),
            )
        )
    if country and country != "all":
        query = query.where(Author.country == country)
    if interest and interest != "all":
        # MySQL JSON array membership: JSON_CONTAINS(col, '"value"')
        query = query.where(func.json_contains(Author.research_interests, json.dumps(interest)))

    rows = db.scalars(query.order_by(Author.name.asc())).all()
    return [AuthorOut.model_validate(a) for a in rows]


@router.get("/featured", response_model=list[AuthorOut], response_model_by_alias=True)
def featured_authors(db: Session = Depends(get_db)):
    rows = db.scalars(select(Author).where(Author.featured).order_by(Author.id)).all()
    return [AuthorOut.model_validate(a) for a in rows]


@router.get("/countries", response_model=list[str])
def author_countries(db: Session = Depends(get_db)):
    rows = db.scalars(select(Author.country).distinct().order_by(Author.country)).all()
    return [c for c in rows if c]


@router.get("/by-ids", response_model=list[AuthorOut], response_model_by_alias=True)
def authors_by_ids(ids: str, db: Session = Depends(get_db)):
    id_list = [int(i) for i in ids.split(",") if i.strip().isdigit()]
    rows = db.scalars(select(Author).where(Author.id.in_(id_list))).all()
    return [AuthorOut.model_validate(a) for a in rows]


@router.get("/{slug}", response_model=AuthorOut, response_model_by_alias=True)
def get_author(slug: str, db: Session = Depends(get_db)):
    author = db.scalar(select(Author).where(Author.slug == slug))
    if author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    return AuthorOut.model_validate(author)


@router.get("/{slug}/books", response_model=list[BookOut], response_model_by_alias=True)
def author_books(slug: str, db: Session = Depends(get_db)):
    author = db.scalar(select(Author).where(Author.slug == slug))
    if author is None:
        raise HTTPException(status_code=404, detail="Author not found")
    rows = db.scalars(
        select(Book)
        .options(selectinload(Book.authors))
        .join(BookAuthor, BookAuthor.book_id == Book.id)
        .where(BookAuthor.author_id == author.id)
        .order_by(Book.publication_date.desc())
    ).all()
    return [to_book_out(b) for b in rows]
