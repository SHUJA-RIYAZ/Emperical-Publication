"""Pydantic schemas.

Serialized with camelCase aliases and string ids so responses match the
frontend TypeScript models in src/types exactly.
"""

from datetime import date, datetime
from typing import Annotated, Any, Literal

from pydantic import BaseModel, BeforeValidator, ConfigDict, EmailStr, Field
from pydantic.alias_generators import to_camel

StrId = Annotated[str, BeforeValidator(lambda v: str(v))]
NumFloat = Annotated[float, BeforeValidator(lambda v: float(v))]


class ApiModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


# ---------------------------------------------------------------- authors ---

class AuthorPublication(ApiModel):
    title: str
    venue: str
    year: int
    type: str


class AuthorBase(ApiModel):
    slug: str = ""
    name: str
    title: str = ""
    institution: str = ""
    department: str = ""
    country: str = ""
    bio: str = ""
    email: str = ""
    research_interests: list[str] = Field(default_factory=list)
    publications: list[AuthorPublication] = Field(default_factory=list)
    social: dict[str, str] = Field(default_factory=dict)
    h_index: int = 0
    citations: int = 0
    books_published: int = 0
    featured: bool = False


class AuthorOut(AuthorBase):
    id: StrId


# ------------------------------------------------------------------ books ---

class BookBase(ApiModel):
    slug: str = ""
    title: str
    subtitle: str | None = None
    description: str = ""
    category: str
    language: str = "English"
    publication_year: int
    publication_date: date
    isbn: str = ""
    pages: int = 0
    price: NumFloat = 0
    formats: list[str] = Field(default_factory=list)
    rating: NumFloat = 0
    reviews_count: int = 0
    tags: list[str] = Field(default_factory=list)
    featured: bool = False
    bestseller: bool = False


class BookCreate(BookBase):
    author_ids: list[int] = Field(default_factory=list)


class BookOut(BookBase):
    id: StrId
    author_ids: list[StrId] = Field(default_factory=list)


class PaginatedBooks(ApiModel):
    items: list[BookOut]
    total: int
    page: int
    page_size: int
    total_pages: int


# --------------------------------------------------------------- journals ---

class JournalBase(ApiModel):
    slug: str = ""
    title: str
    issn: str = ""
    e_issn: str = ""
    field: str = ""
    impact_factor: NumFloat = 0
    cite_score: NumFloat = 0
    frequency: str = "Quarterly"
    open_access: bool = False
    description: str = ""
    editor_in_chief: str = ""
    established: int = 2000
    acceptance_rate: int = 0
    review_time_weeks: int = 0
    indexing: list[str] = Field(default_factory=list)


class JournalOut(JournalBase):
    id: StrId


# ------------------------------------------------------------------- blog ---

class BlogPostBase(ApiModel):
    slug: str = ""
    title: str
    excerpt: str = ""
    content: list[str] = Field(default_factory=list)
    category: str = ""
    tags: list[str] = Field(default_factory=list)
    author_name: str = ""
    author_role: str = ""
    published_at: date
    read_time_minutes: int = 5
    featured: bool = False


class BlogPostOut(BlogPostBase):
    id: StrId


# ---------------------------------------------------------------- content ---

class ServiceBase(ApiModel):
    slug: str = ""
    title: str
    short_description: str = ""
    description: str = ""
    icon: str = "star"
    features: list[str] = Field(default_factory=list)
    category: str = "Editorial"
    popular: bool = False


class ServiceOut(ServiceBase):
    id: StrId


class TestimonialBase(ApiModel):
    name: str
    role: str = ""
    institution: str = ""
    quote: str
    rating: int = Field(default=5, ge=1, le=5)


class TestimonialOut(TestimonialBase):
    id: StrId


class FaqBase(ApiModel):
    question: str
    answer: str
    category: str = "General"
    sort_order: int = 0


class FaqOut(FaqBase):
    id: StrId


# ------------------------------------------------------------ submissions ---

class PublishingRequestIn(ApiModel):
    full_name: str
    email: EmailStr
    phone: str = ""
    country: str = ""
    affiliation: str = ""
    book_title: str
    category: str = ""
    language: str = "English"
    word_count: str = ""
    synopsis: str = ""
    manuscript_file_name: str | None = None
    agreed_to_terms: bool
    is_original_work: bool


class PublishingRequestOut(PublishingRequestIn):
    id: StrId
    reference_id: str
    status: str
    created_at: datetime


class ContactMessageIn(ApiModel):
    name: str
    email: EmailStr
    department: str = ""
    subject: str = ""
    message: str


class ContactMessageOut(ContactMessageIn):
    id: StrId
    reference_id: str
    status: str
    created_at: datetime


class NewsletterIn(ApiModel):
    email: EmailStr


class SubscriberOut(ApiModel):
    id: StrId
    email: str
    created_at: datetime


class SubmissionResult(ApiModel):
    success: bool = True
    reference_id: str
    message: str


class StatusUpdate(ApiModel):
    status: str


# --------------------------------------------------------------- settings ---

class SiteInfo(ApiModel):
    name: str
    short_name: str
    tagline: str
    description: str
    email: str
    phone: str
    address: str
    founded: int


class StatItem(ApiModel):
    label: str
    value: int
    suffix: str = ""


class OfficeItem(ApiModel):
    city: str
    address: str
    hours: str


class ProcessStep(ApiModel):
    step: int
    title: str
    description: str


class SiteSettingsPayload(ApiModel):
    site: SiteInfo
    stats: list[StatItem]
    trusted_by: list[str]
    socials: dict[str, str]
    offices: list[OfficeItem]
    process: list[ProcessStep]


# ------------------------------------------------------------------- auth ---

class LoginIn(ApiModel):
    email: EmailStr
    password: str


class TokenOut(ApiModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: "UserOut"


class UserOut(ApiModel):
    id: StrId
    email: str
    full_name: str
    role: str


# -------------------------------------------------------------- dashboard ---

class DashboardStats(ApiModel):
    books: int
    authors: int
    journals: int
    blog_posts: int
    services: int
    testimonials: int
    faqs: int
    pending_requests: int
    total_requests: int
    new_messages: int
    subscribers: int
    recent_requests: list[PublishingRequestOut]
    recent_messages: list[ContactMessageOut]


def dump(model: ApiModel | list[Any]) -> Any:
    """Serialize with camelCase aliases."""
    if isinstance(model, list):
        return [m.model_dump(by_alias=True) for m in model]
    return model.model_dump(by_alias=True)
