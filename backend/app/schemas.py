"""Pydantic schemas.

Serialized with camelCase aliases and string ids so responses match the
frontend TypeScript models in src/types exactly.
"""

from datetime import date, datetime
from typing import Annotated, Any, Literal

from pydantic import AfterValidator, BaseModel, BeforeValidator, ConfigDict, EmailStr, Field
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
    manuscript_file_path: str | None = None
    manuscript_file_size: int | None = None
    agreed_to_terms: bool
    is_original_work: bool


class PublishingRequestOut(PublishingRequestIn):
    id: StrId
    reference_id: str
    status: str
    reviewer_notes: str | None = None
    user_id: StrId | None = None
    created_at: datetime


class MySubmissionOut(ApiModel):
    """Trimmed submission view for the author portal."""

    id: StrId
    reference_id: str
    book_title: str
    category: str
    language: str
    word_count: str
    synopsis: str
    manuscript_file_name: str | None = None
    status: str
    reviewer_notes: str | None = None
    created_at: datetime


class UploadResult(ApiModel):
    file_name: str
    file_path: str
    file_size: int


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


# --------------------------------------------------------------- comments ---

class CommentIn(ApiModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    body: str = Field(min_length=5, max_length=4000)


class CommentOut(ApiModel):
    id: StrId
    name: str
    body: str
    created_at: datetime


class AdminCommentOut(CommentOut):
    email: str
    status: str
    post_id: StrId
    post_title: str
    post_slug: str


# ----------------------------------------------------------------- search ---

class SearchHit(ApiModel):
    type: Literal["book", "author", "journal", "blog"]
    title: str
    subtitle: str = ""
    slug: str


class SearchResults(ApiModel):
    books: list[SearchHit] = Field(default_factory=list)
    authors: list[SearchHit] = Field(default_factory=list)
    journals: list[SearchHit] = Field(default_factory=list)
    blogs: list[SearchHit] = Field(default_factory=list)
    total: int = 0


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


class NotesUpdate(ApiModel):
    reviewer_notes: str | None = None


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


class IconCard(ApiModel):
    """Icon + title + description block (About values, Why-choose-us reasons)."""

    icon: str = "star"
    title: str
    description: str


class Milestone(ApiModel):
    year: int
    event: str


class LeaderProfile(ApiModel):
    name: str
    role: str
    bio: str


class SiteSettingsPayload(ApiModel):
    site: SiteInfo
    stats: list[StatItem]
    trusted_by: list[str]
    socials: dict[str, str]
    offices: list[OfficeItem]
    process: list[ProcessStep]
    values: list[IconCard] = Field(default_factory=list)
    reasons: list[IconCard] = Field(default_factory=list)
    milestones: list[Milestone] = Field(default_factory=list)
    leadership: list[LeaderProfile] = Field(default_factory=list)
    departments: list[str] = Field(default_factory=list)


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
    phone: str = ""
    affiliation: str = ""
    country: str = ""


class AdminUserOut(UserOut):
    is_active: bool
    created_at: datetime


PASSWORD_RULES = (
    "Password must be at least 8 characters and include an uppercase letter and a number."
)


def _validate_password(value: str) -> str:
    if len(value) < 8 or not any(c.isupper() for c in value) or not any(c.isdigit() for c in value):
        raise ValueError(PASSWORD_RULES)
    return value


Password = Annotated[str, AfterValidator(_validate_password)]


class RegisterIn(ApiModel):
    full_name: str = Field(min_length=2)
    email: EmailStr
    password: Password
    phone: str = ""
    affiliation: str = ""
    country: str = ""


class ProfileUpdateIn(ApiModel):
    full_name: str = Field(min_length=2)
    phone: str = ""
    affiliation: str = ""
    country: str = ""


class ChangePasswordIn(ApiModel):
    current_password: str
    new_password: Password


class ForgotPasswordIn(ApiModel):
    email: EmailStr


class ResetPasswordIn(ApiModel):
    token: str
    password: Password


class AdminUserCreateIn(ApiModel):
    full_name: str = Field(min_length=2)
    email: EmailStr
    password: Password
    role: Literal["admin", "user"] = "admin"


class AdminUserUpdateIn(ApiModel):
    full_name: str | None = None
    role: Literal["admin", "user"] | None = None
    is_active: bool | None = None
    password: Password | None = None


class MessageOut(ApiModel):
    success: bool = True
    message: str


class WishlistOut(ApiModel):
    book_ids: list[StrId] = Field(default_factory=list)


class WishlistIn(ApiModel):
    book_ids: list[int] = Field(default_factory=list)


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
    registered_users: int = 0
    recent_requests: list[PublishingRequestOut]
    recent_messages: list[ContactMessageOut]


def dump(model: ApiModel | list[Any]) -> Any:
    """Serialize with camelCase aliases."""
    if isinstance(model, list):
        return [m.model_dump(by_alias=True) for m in model]
    return model.model_dump(by_alias=True)
