"""Manuscript file uploads.

Files are stored outside the database under `UPLOAD_DIR` with generated names;
the submission record keeps both the original filename (for display) and the
stored relative path (for admin download).
"""

import secrets
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from ..auth import get_optional_user
from ..config import get_settings
from ..models import User
from ..schemas import UploadResult

router = APIRouter(prefix="/uploads", tags=["uploads"])

ALLOWED_EXTENSIONS = {".pdf", ".doc", ".docx", ".zip", ".tex", ".rtf", ".odt"}
MANUSCRIPT_SUBDIR = "manuscripts"
CHUNK_SIZE = 1024 * 1024


def manuscripts_dir() -> Path:
    path = Path(get_settings().upload_dir) / MANUSCRIPT_SUBDIR
    path.mkdir(parents=True, exist_ok=True)
    return path


def resolve_stored_file(relative_path: str) -> Path:
    """Safely resolves a stored path, refusing anything outside the upload dir."""
    base = Path(get_settings().upload_dir).resolve()
    target = (base / relative_path).resolve()
    if not target.is_relative_to(base) or not target.is_file():
        raise HTTPException(status_code=404, detail="File not found")
    return target


@router.post("/manuscript", response_model=UploadResult, response_model_by_alias=True, status_code=201)
async def upload_manuscript(
    file: UploadFile = File(...),
    _user: User | None = Depends(get_optional_user),
):
    settings = get_settings()
    original_name = Path(file.filename or "manuscript").name
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
        )

    max_bytes = settings.max_upload_mb * 1024 * 1024
    stored_name = f"{secrets.token_hex(16)}{extension}"
    destination = manuscripts_dir() / stored_name

    size = 0
    try:
        with destination.open("wb") as buffer:
            while chunk := await file.read(CHUNK_SIZE):
                size += len(chunk)
                if size > max_bytes:
                    raise HTTPException(
                        status_code=413,
                        detail=f"File is larger than the {settings.max_upload_mb} MB limit.",
                    )
                buffer.write(chunk)
    except HTTPException:
        destination.unlink(missing_ok=True)
        raise
    except Exception:
        destination.unlink(missing_ok=True)
        raise HTTPException(status_code=500, detail="Upload failed. Please try again.")
    finally:
        await file.close()

    return UploadResult(
        file_name=original_name,
        file_path=f"{MANUSCRIPT_SUBDIR}/{stored_name}",
        file_size=size,
    )
