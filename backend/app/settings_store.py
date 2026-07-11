"""Load/save site-wide settings.

Settings live in the `site_settings` table as one JSON row per section.
`seed/settings.json` (exported from the frontend constants) provides the
defaults for any section that has not been saved yet.
"""

import json
from functools import lru_cache
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import SiteSetting
from .schemas import SiteSettingsPayload

SETTINGS_FILE = Path(__file__).parent.parent / "seed" / "settings.json"


@lru_cache
def load_defaults() -> dict:
    if SETTINGS_FILE.exists():
        return json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
    return {}


def get_settings(db: Session) -> SiteSettingsPayload:
    data = dict(load_defaults())
    for row in db.scalars(select(SiteSetting)).all():
        data[row.setting_key] = row.value
    return SiteSettingsPayload.model_validate(data)


def save_settings(db: Session, payload: SiteSettingsPayload) -> None:
    sections = payload.model_dump(by_alias=True)
    for key, value in sections.items():
        row = db.get(SiteSetting, key)
        if row is None:
            db.add(SiteSetting(setting_key=key, value=value))
        else:
            row.value = value
    db.commit()
