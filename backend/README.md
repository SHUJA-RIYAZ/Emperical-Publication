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

Default admin login (change in `.env` before seeding):
`admin@empericalpublication.com` / `Admin@123`

### Forgot your MySQL root password?

1. Open an **administrator** PowerShell.
2. `Stop-Service MySQL80`
3. Create `C:\mysql-init.txt` containing exactly:
   `ALTER USER 'root'@'localhost' IDENTIFIED BY 'Root@123';`
4. Run mysqld once with the init file (adjust the path to your version):
   `& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld.exe" --init-file=C:\mysql-init.txt --console`
5. After it finishes starting, press Ctrl+C, delete `C:\mysql-init.txt`, then `Start-Service MySQL80`.
6. Root's password is now `Root@123` — put it in `.env` and `yoyo.ini` (and change it afterwards).

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
        └── admin.py         # JWT login, generic CRUD for 7 resources,
                             # submission status workflows, dashboard stats
```

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
