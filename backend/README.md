# Emperical Publication — Backend API

FastAPI + **MySQL 8** backend. Schema is managed with **yoyo-migrations** (raw SQL), data access with SQLAlchemy 2.0 (PyMySQL driver), and admin auth with JWT (bcrypt-hashed passwords).

## Prerequisites

- Python 3.11+
- MySQL 8.0+ running locally (Windows service `MySQL80`), or set `DATABASE_URL` to any MySQL server

## Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows (source .venv/bin/activate on Unix)
pip install -r requirements.txt

# 1. Create the database (in MySQL Workbench or the mysql CLI)
#    CREATE DATABASE emperical CHARACTER SET utf8mb4;

# 2. Configure environment
copy .env.example .env           # then set DATABASE_URL with YOUR MySQL user/password
#    Format: mysql+pymysql://USER:PASSWORD@localhost:3306/emperical
#    Also update the `database` line in yoyo.ini to the same DSN.

# 3. Apply migrations
yoyo apply --batch

# 4. Export seed JSON from the frontend mock data (from the project root)
npm --prefix ../frontend run export-seed

# 5. Seed the database (content + admin user)
python seed.py

# 6. Run the API
uvicorn app.main:app --reload --port 8000
```

Interactive docs: http://localhost:8000/docs

The admin account is created from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` on
the first `python seed.py` run. **Set a strong password before seeding** — and
if you have already seeded with a default, change it from Admin → Users.

### Forgot your MySQL root password?

1. Open an **administrator** PowerShell.
2. `Stop-Service MySQL80`
3. Create `C:\mysql-init.txt` containing exactly:
   `ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root@123';`
4. Run mysqld once with the init file (adjust the path to your version):
   `& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --init-file=C:\mysql-init.txt --console`
5. After it finishes starting, press Ctrl+C, delete `C:\mysql-init.txt`, then `Start-Service MySQL80`.
6. Root's password is now `Root@123` — put it in `.env` and `yoyo.ini` (and change it afterwards).

## Deployment checklist (cPanel)

1. **`CORS_ORIGINS` must include your frontend origin** (`https://irmms.org`).
   Every browser request fails the CORS preflight otherwise — this is the most
   common cause of a deployed site that loads but shows no data.
2. **`SITE_URL`** must be the public site URL including the sub-path
   (`https://irmms.org/emperical-publication`) so password-reset links work.
3. **`UPLOAD_DIR`** must be writable by the app user, and should live outside
   the web root so manuscripts are not publicly downloadable. Files are served
   only through the authenticated admin endpoint.
4. Run `yoyo apply --batch` after every deploy that includes new migrations.
5. Set `SMTP_*` to enable password-reset emails. Until then the reset endpoint
   still issues tokens but writes the message to the log instead of sending it.

## Architecture

```
backend/
├── yoyo.ini                 # yoyo-migrations config (MySQL DSN)
├── migrations/              # raw SQL migrations (+ .rollback.sql files)
├── seed/                    # JSON exported from the frontend mock data
├── seed.py                  # idempotent seeder (content + admin user)
└── app/
    ├── main.py              # FastAPI app, CORS, router registration
    ├── config.py            # pydantic-settings (.env)
    ├── database.py          # SQLAlchemy engine/session
    ├── models.py            # ORM models (12 tables, generic JSON columns)
    ├── schemas.py           # Pydantic schemas — camelCase aliases matching the frontend
    ├── auth.py              # bcrypt + JWT + admin dependency
    └── routers/
        ├── books.py         # list (search/filter/sort/pagination), featured, years,
        │                    # quick-search, by-slug, related
        ├── authors.py       # list/filter, featured, countries, by-ids, by-slug, books
        ├── blogs.py         # list/filter, categories, tags, by-slug, related
        ├── journals.py      # list, featured, by-slug
        ├── content.py       # services, testimonials, faqs
        ├── submissions.py   # POST publishing-requests / contact-messages / newsletter
        ├── auth.py          # author portal: register, login, me, profile,
        │                    # change/forgot/reset password, my submissions, wishlist
        ├── comments.py      # public blog comments (held for moderation)
        ├── search.py        # site-wide search across all four content types
        ├── uploads.py       # manuscript upload (multipart, type + size validated)
        └── admin.py         # JWT login, generic CRUD for 7 resources, user
                             # management, submission status + reviewer notes,
                             # manuscript download, comment moderation,
                             # settings, dashboard stats
```

### Site settings sections

`site_settings` is a JSON key/value table — each admin-editable section is one
row, with `backend/seed/settings.json` supplying defaults for any section not
yet saved. Sections: `site`, `stats`, `trustedBy`, `socials`, `offices`,
`process`, `values`, `reasons`, `milestones`, `leadership`, `departments`.
Adding a section needs no migration: extend `SiteSettingsPayload`, add it to
the frontend `defaultSettings`, and re-run `npm --prefix frontend run export-seed`.

## Design notes

- **Response shape parity** — every public endpoint returns the exact camelCase
  shapes the frontend service layer already consumed from mock data (including
  the `{items,total,page,pageSize,totalPages}` pagination envelope), so no UI
  changes were needed when switching to the API.
- **String ids** — auto-increment integer PKs are serialized as strings to match
  the frontend `id: string` types and the persisted wishlist.
- **`book_authors`** join table keeps author ordering via `position`.
- **MySQL specifics** — JSON columns use the generic SQLAlchemy `JSON` type;
  array membership filters use `JSON_CONTAINS`; `updated_at` uses
  `ON UPDATE CURRENT_TIMESTAMP`; tables are InnoDB/utf8mb4.
- **Admin CRUD** is registry-driven (`RESOURCES` in `routers/admin.py`):
  adding a new managed entity is one line plus a Pydantic schema.
  Slugs are auto-generated and de-duplicated server-side.
- **Migrations** are plain SQL with paired `.rollback.sql` files, applied with
  `yoyo apply` / undone with `yoyo rollback`.
