from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Faq, Service, Testimonial
from ..schemas import FaqOut, ServiceOut, SiteSettingsPayload, TestimonialOut
from ..settings_store import get_settings

router = APIRouter(tags=["content"])


@router.get("/settings", response_model=SiteSettingsPayload, response_model_by_alias=True)
def site_settings(db: Session = Depends(get_db)):
    return get_settings(db)


@router.get("/services", response_model=list[ServiceOut], response_model_by_alias=True)
def list_services(db: Session = Depends(get_db)):
    rows = db.scalars(select(Service).order_by(Service.id)).all()
    return [ServiceOut.model_validate(s) for s in rows]


@router.get("/services/featured", response_model=list[ServiceOut], response_model_by_alias=True)
def featured_services(limit: int = Query(6, ge=1, le=30), db: Session = Depends(get_db)):
    rows = db.scalars(
        select(Service).order_by(Service.popular.desc(), Service.id).limit(limit)
    ).all()
    return [ServiceOut.model_validate(s) for s in rows]


@router.get("/testimonials", response_model=list[TestimonialOut], response_model_by_alias=True)
def list_testimonials(db: Session = Depends(get_db)):
    rows = db.scalars(select(Testimonial).order_by(Testimonial.id)).all()
    return [TestimonialOut.model_validate(t) for t in rows]


@router.get("/faqs", response_model=list[FaqOut], response_model_by_alias=True)
def list_faqs(db: Session = Depends(get_db)):
    rows = db.scalars(select(Faq).order_by(Faq.sort_order, Faq.id)).all()
    return [FaqOut.model_validate(f) for f in rows]
