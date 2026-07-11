from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Journal
from ..schemas import JournalOut

router = APIRouter(prefix="/journals", tags=["journals"])


@router.get("", response_model=list[JournalOut], response_model_by_alias=True)
def list_journals(search: str | None = None, db: Session = Depends(get_db)):
    query = select(Journal)
    if search:
        term = f"%{search.lower()}%"
        query = query.where(
            or_(func.lower(Journal.title).like(term), func.lower(Journal.field).like(term))
        )
    rows = db.scalars(query.order_by(Journal.id)).all()
    return [JournalOut.model_validate(j) for j in rows]


@router.get("/featured", response_model=list[JournalOut], response_model_by_alias=True)
def featured_journals(limit: int = Query(6, ge=1, le=20), db: Session = Depends(get_db)):
    rows = db.scalars(
        select(Journal).order_by(Journal.impact_factor.desc()).limit(limit)
    ).all()
    return [JournalOut.model_validate(j) for j in rows]


@router.get("/{slug}", response_model=JournalOut, response_model_by_alias=True)
def get_journal(slug: str, db: Session = Depends(get_db)):
    journal = db.scalar(select(Journal).where(Journal.slug == slug))
    if journal is None:
        raise HTTPException(status_code=404, detail="Journal not found")
    return JournalOut.model_validate(journal)
