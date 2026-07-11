import re
import secrets
import time


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9\s-]", "", text.lower()).strip()
    return re.sub(r"\s+", "-", slug)


def make_reference_id(prefix: str) -> str:
    stamp = format(int(time.time() * 1000), "x").upper()
    return f"{prefix}-{stamp}{secrets.randbelow(900) + 100}"


def ensure_unique_slug(db_query_fn, base_slug: str) -> str:
    """Append -2, -3… until the slug is free. db_query_fn(slug) -> bool exists."""
    slug = base_slug or "item"
    counter = 2
    while db_query_fn(slug):
        slug = f"{base_slug}-{counter}"
        counter += 1
    return slug
