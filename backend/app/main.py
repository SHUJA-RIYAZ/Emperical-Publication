from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routers import admin, authors, blogs, books, content, journals, submissions

settings = get_settings()

app = FastAPI(
    title="Emperical International Publication API",
    description="Backend API for the Emperical publishing platform.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_PREFIX = "/api"
app.include_router(books.router, prefix=API_PREFIX)
app.include_router(authors.router, prefix=API_PREFIX)
app.include_router(blogs.router, prefix=API_PREFIX)
app.include_router(journals.router, prefix=API_PREFIX)
app.include_router(content.router, prefix=API_PREFIX)
app.include_router(submissions.router, prefix=API_PREFIX)
app.include_router(admin.router, prefix=API_PREFIX)


@app.get("/api/health", tags=["meta"])
def health():
    return {"status": "ok"}
