from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import ContactMessage, NewsletterSubscriber, PublishingRequest
from ..schemas import ContactMessageIn, NewsletterIn, PublishingRequestIn, SubmissionResult
from ..utils import make_reference_id

router = APIRouter(tags=["submissions"])


@router.post("/publishing-requests", response_model=SubmissionResult, response_model_by_alias=True, status_code=201)
def submit_publishing_request(payload: PublishingRequestIn, db: Session = Depends(get_db)):
    request = PublishingRequest(
        reference_id=make_reference_id("EIP"),
        **payload.model_dump(),
    )
    db.add(request)
    db.commit()
    return SubmissionResult(
        reference_id=request.reference_id,
        message=(
            "Your manuscript submission has been received. "
            "Our editorial team will contact you within two business days."
        ),
    )


@router.post("/contact-messages", response_model=SubmissionResult, response_model_by_alias=True, status_code=201)
def submit_contact_message(payload: ContactMessageIn, db: Session = Depends(get_db)):
    message = ContactMessage(reference_id=make_reference_id("MSG"), **payload.model_dump())
    db.add(message)
    db.commit()
    return SubmissionResult(
        reference_id=message.reference_id,
        message="Thank you for reaching out. Our team will respond within one business day.",
    )


@router.post("/newsletter", response_model=SubmissionResult, response_model_by_alias=True, status_code=201)
def subscribe_newsletter(payload: NewsletterIn, db: Session = Depends(get_db)):
    existing = db.scalar(
        select(NewsletterSubscriber).where(NewsletterSubscriber.email == payload.email.lower())
    )
    if existing is None:
        db.add(NewsletterSubscriber(email=payload.email.lower()))
        db.commit()
    return SubmissionResult(
        reference_id=make_reference_id("NL"),
        message="You are subscribed. Welcome to the Emperical community.",
    )
