from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    full_name: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(64), default="")
    affiliation: Mapped[str] = mapped_column(String(255), default="")
    country: Mapped[str] = mapped_column(String(120), default="")
    role: Mapped[str] = mapped_column(String(32), default="user")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    token_hash: Mapped[str] = mapped_column(String(64), unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class WishlistItem(Base):
    __tablename__ = "wishlist_items"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="CASCADE"), primary_key=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class BookAuthor(Base):
    __tablename__ = "book_authors"

    book_id: Mapped[int] = mapped_column(
        ForeignKey("books.id", ondelete="CASCADE"), primary_key=True
    )
    author_id: Mapped[int] = mapped_column(
        ForeignKey("authors.id", ondelete="CASCADE"), primary_key=True
    )
    position: Mapped[int] = mapped_column(Integer, default=0)


class Author(TimestampMixin, Base):
    __tablename__ = "authors"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True)
    name: Mapped[str] = mapped_column(String(255))
    title: Mapped[str] = mapped_column(String(255), default="")
    institution: Mapped[str] = mapped_column(String(255), default="")
    department: Mapped[str] = mapped_column(String(255), default="")
    country: Mapped[str] = mapped_column(String(120), default="")
    bio: Mapped[str] = mapped_column(Text, default="")
    email: Mapped[str] = mapped_column(String(255), default="")
    research_interests: Mapped[list] = mapped_column(JSON, default=list)
    publications: Mapped[list] = mapped_column(JSON, default=list)
    social: Mapped[dict] = mapped_column(JSON, default=dict)
    h_index: Mapped[int] = mapped_column(Integer, default=0)
    citations: Mapped[int] = mapped_column(Integer, default=0)
    books_published: Mapped[int] = mapped_column(Integer, default=0)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)

    books: Mapped[list["Book"]] = relationship(
        secondary="book_authors", back_populates="authors", viewonly=True
    )


class Book(TimestampMixin, Base):
    __tablename__ = "books"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True)
    title: Mapped[str] = mapped_column(String(500))
    subtitle: Mapped[str | None] = mapped_column(String(500), nullable=True)
    description: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(120))
    language: Mapped[str] = mapped_column(String(60), default="English")
    publication_year: Mapped[int] = mapped_column(Integer)
    publication_date: Mapped[date] = mapped_column(Date)
    isbn: Mapped[str] = mapped_column(String(32), default="")
    pages: Mapped[int] = mapped_column(Integer, default=0)
    price: Mapped[Decimal] = mapped_column(Numeric(8, 2), default=0)
    formats: Mapped[list] = mapped_column(JSON, default=list)
    rating: Mapped[Decimal] = mapped_column(Numeric(2, 1), default=0)
    reviews_count: Mapped[int] = mapped_column(Integer, default=0)
    tags: Mapped[list] = mapped_column(JSON, default=list)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)
    bestseller: Mapped[bool] = mapped_column(Boolean, default=False)

    authors: Mapped[list[Author]] = relationship(
        secondary="book_authors",
        back_populates="books",
        order_by="BookAuthor.position",
        viewonly=True,
    )


class Journal(TimestampMixin, Base):
    __tablename__ = "journals"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True)
    title: Mapped[str] = mapped_column(String(500))
    issn: Mapped[str] = mapped_column(String(20), default="")
    e_issn: Mapped[str] = mapped_column(String(20), default="")
    field: Mapped[str] = mapped_column(String(120), default="")
    impact_factor: Mapped[Decimal] = mapped_column(Numeric(4, 1), default=0)
    cite_score: Mapped[Decimal] = mapped_column(Numeric(4, 1), default=0)
    frequency: Mapped[str] = mapped_column(String(32), default="Quarterly")
    open_access: Mapped[bool] = mapped_column(Boolean, default=False)
    description: Mapped[str] = mapped_column(Text, default="")
    editor_in_chief: Mapped[str] = mapped_column(String(255), default="")
    established: Mapped[int] = mapped_column(Integer, default=2000)
    acceptance_rate: Mapped[int] = mapped_column(Integer, default=0)
    review_time_weeks: Mapped[int] = mapped_column(Integer, default=0)
    indexing: Mapped[list] = mapped_column(JSON, default=list)


class BlogPost(TimestampMixin, Base):
    __tablename__ = "blog_posts"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True)
    title: Mapped[str] = mapped_column(String(500))
    excerpt: Mapped[str] = mapped_column(Text, default="")
    content: Mapped[list] = mapped_column(JSON, default=list)
    category: Mapped[str] = mapped_column(String(120), default="")
    tags: Mapped[list] = mapped_column(JSON, default=list)
    author_name: Mapped[str] = mapped_column(String(255), default="")
    author_role: Mapped[str] = mapped_column(String(255), default="")
    published_at: Mapped[date] = mapped_column(Date, default=date.today)
    read_time_minutes: Mapped[int] = mapped_column(Integer, default=5)
    featured: Mapped[bool] = mapped_column(Boolean, default=False)


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)
    post_id: Mapped[int] = mapped_column(ForeignKey("blog_posts.id", ondelete="CASCADE"))
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255), default="")
    body: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(16), default="pending")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class Service(TimestampMixin, Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(255), unique=True)
    title: Mapped[str] = mapped_column(String(255))
    short_description: Mapped[str] = mapped_column(Text, default="")
    description: Mapped[str] = mapped_column(Text, default="")
    icon: Mapped[str] = mapped_column(String(64), default="star")
    features: Mapped[list] = mapped_column(JSON, default=list)
    category: Mapped[str] = mapped_column(String(64), default="Editorial")
    popular: Mapped[bool] = mapped_column(Boolean, default=False)


class Testimonial(TimestampMixin, Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(255), default="")
    institution: Mapped[str] = mapped_column(String(255), default="")
    quote: Mapped[str] = mapped_column(Text)
    rating: Mapped[int] = mapped_column(Integer, default=5)


class Faq(TimestampMixin, Base):
    __tablename__ = "faqs"

    id: Mapped[int] = mapped_column(primary_key=True)
    question: Mapped[str] = mapped_column(Text)
    answer: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(64), default="General")
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class PublishingRequest(Base):
    __tablename__ = "publishing_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    reference_id: Mapped[str] = mapped_column(String(32), unique=True)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    full_name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    phone: Mapped[str] = mapped_column(String(64), default="")
    country: Mapped[str] = mapped_column(String(120), default="")
    affiliation: Mapped[str] = mapped_column(String(255), default="")
    book_title: Mapped[str] = mapped_column(String(500))
    category: Mapped[str] = mapped_column(String(120), default="")
    language: Mapped[str] = mapped_column(String(60), default="English")
    word_count: Mapped[str] = mapped_column(String(64), default="")
    synopsis: Mapped[str] = mapped_column(Text, default="")
    manuscript_file_name: Mapped[str | None] = mapped_column(String(500), nullable=True)
    manuscript_file_path: Mapped[str | None] = mapped_column(String(500), nullable=True)
    manuscript_file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    agreed_to_terms: Mapped[bool] = mapped_column(Boolean, default=False)
    is_original_work: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[str] = mapped_column(String(32), default="pending")
    reviewer_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    reference_id: Mapped[str] = mapped_column(String(32), unique=True)
    name: Mapped[str] = mapped_column(String(255))
    email: Mapped[str] = mapped_column(String(255))
    department: Mapped[str] = mapped_column(String(120), default="")
    subject: Mapped[str] = mapped_column(String(500), default="")
    message: Mapped[str] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), default="new")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class SiteSetting(Base):
    __tablename__ = "site_settings"

    setting_key: Mapped[str] = mapped_column(String(64), primary_key=True)
    value: Mapped[dict | list] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class NewsletterSubscriber(Base):
    __tablename__ = "newsletter_subscribers"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
