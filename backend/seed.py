"""Seed PostgreSQL with the exported frontend mock data plus an admin user.

Usage:
    1. npm --prefix frontend run export-seed    (from the project root)
    2. yoyo apply                               (from backend/)
    3. python seed.py                           (from backend/)

The script is idempotent: it skips any table that already has rows.
"""

import json
from pathlib import Path

from sqlalchemy import select

from app.auth import hash_password
from app.config import get_settings
from app.database import SessionLocal
from app.models import (
    Author,
    BlogPost,
    Book,
    BookAuthor,
    Faq,
    Journal,
    Service,
    Testimonial,
    User,
)

SEED_DIR = Path(__file__).parent / "seed"


def load(name: str) -> list[dict]:
    path = SEED_DIR / f"{name}.json"
    if not path.exists():
        raise SystemExit(
            f"Missing {path}. Run `npm --prefix frontend run export-seed` from the project root first."
        )
    return json.loads(path.read_text(encoding="utf-8"))


def table_empty(db, model) -> bool:
    return db.scalar(select(model).limit(1)) is None


def seed_admin(db) -> None:
    settings = get_settings()
    if db.scalar(select(User).where(User.email == settings.admin_email.lower())):
        print("Admin user already exists — skipped.")
        return
    db.add(
        User(
            email=settings.admin_email.lower(),
            password_hash=hash_password(settings.admin_password),
            full_name="Site Administrator",
            role="admin",
        )
    )
    db.commit()
    print(f"Created admin user {settings.admin_email}")


def seed_authors(db) -> dict[str, int]:
    """Returns mapping of mock id ('author-1') -> database id."""
    mapping: dict[str, int] = {}
    records = load("authors")
    if not table_empty(db, Author):
        print("Authors already seeded — building id map from slugs.")
        for record in records:
            row = db.scalar(select(Author).where(Author.slug == record["slug"]))
            if row:
                mapping[record["id"]] = row.id
        return mapping

    for record in records:
        row = Author(
            slug=record["slug"],
            name=record["name"],
            title=record["title"],
            institution=record["institution"],
            department=record["department"],
            country=record["country"],
            bio=record["bio"],
            email=record["email"],
            research_interests=record["researchInterests"],
            publications=record["publications"],
            social=record["social"],
            h_index=record["hIndex"],
            citations=record["citations"],
            books_published=record["booksPublished"],
            featured=record.get("featured", False),
        )
        db.add(row)
        db.flush()
        mapping[record["id"]] = row.id
    db.commit()
    print(f"Seeded {len(records)} authors.")
    return mapping


def seed_books(db, author_map: dict[str, int]) -> None:
    if not table_empty(db, Book):
        print("Books already seeded — skipped.")
        return
    records = load("books")
    for record in records:
        row = Book(
            slug=record["slug"],
            title=record["title"],
            subtitle=record.get("subtitle"),
            description=record["description"],
            category=record["category"],
            language=record["language"],
            publication_year=record["publicationYear"],
            publication_date=record["publicationDate"],
            isbn=record["isbn"],
            pages=record["pages"],
            price=record["price"],
            formats=record["formats"],
            rating=record["rating"],
            reviews_count=record["reviewsCount"],
            tags=record["tags"],
            featured=record.get("featured", False),
            bestseller=record.get("bestseller", False),
        )
        db.add(row)
        db.flush()
        for position, mock_author_id in enumerate(record["authorIds"]):
            db_author_id = author_map.get(mock_author_id)
            if db_author_id:
                db.add(BookAuthor(book_id=row.id, author_id=db_author_id, position=position))
    db.commit()
    print(f"Seeded {len(records)} books.")


def seed_simple(db, model, name: str, mapper) -> None:
    if not table_empty(db, model):
        print(f"{name} already seeded — skipped.")
        return
    records = load(name)
    for record in records:
        db.add(model(**mapper(record)))
    db.commit()
    print(f"Seeded {len(records)} {name}.")


def main() -> None:
    db = SessionLocal()
    try:
        seed_admin(db)
        author_map = seed_authors(db)
        seed_books(db, author_map)

        seed_simple(
            db,
            Journal,
            "journals",
            lambda r: dict(
                slug=r["slug"],
                title=r["title"],
                issn=r["issn"],
                e_issn=r["eIssn"],
                field=r["field"],
                impact_factor=r["impactFactor"],
                cite_score=r["citeScore"],
                frequency=r["frequency"],
                open_access=r["openAccess"],
                description=r["description"],
                editor_in_chief=r["editorInChief"],
                established=r["established"],
                acceptance_rate=r["acceptanceRate"],
                review_time_weeks=r["reviewTimeWeeks"],
                indexing=r["indexing"],
            ),
        )
        seed_simple(
            db,
            BlogPost,
            "blogs",
            lambda r: dict(
                slug=r["slug"],
                title=r["title"],
                excerpt=r["excerpt"],
                content=r["content"],
                category=r["category"],
                tags=r["tags"],
                author_name=r["authorName"],
                author_role=r["authorRole"],
                published_at=r["publishedAt"],
                read_time_minutes=r["readTimeMinutes"],
                featured=r.get("featured", False),
            ),
        )
        seed_simple(
            db,
            Service,
            "services",
            lambda r: dict(
                slug=r["slug"],
                title=r["title"],
                short_description=r["shortDescription"],
                description=r["description"],
                icon=r["icon"],
                features=r["features"],
                category=r["category"],
                popular=r.get("popular", False),
            ),
        )
        seed_simple(
            db,
            Testimonial,
            "testimonials",
            lambda r: dict(
                name=r["name"],
                role=r["role"],
                institution=r["institution"],
                quote=r["quote"],
                rating=r["rating"],
            ),
        )
        seed_simple(
            db,
            Faq,
            "faqs",
            lambda r: dict(
                question=r["question"],
                answer=r["answer"],
                category=r["category"],
            ),
        )
        print("Seeding complete.")
    finally:
        db.close()


if __name__ == "__main__":
    main()
