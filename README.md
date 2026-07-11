# Emperical International Publication

A premium, production-quality publishing platform: a Next.js 15 frontend, a FastAPI + MySQL backend (yoyo-migrations), and a full admin panel. The public site is **API-first with automatic mock fallback** — it runs fully featured even when the backend is offline, and becomes fully dynamic when it's up.

## Getting started

```bash
# Frontend
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # ESLint

# Backend (see backend/README.md for full setup: DB, migrations, seeding)
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
yoyo apply --batch                     # apply MySQL migrations
npm --prefix ../frontend run export-seed
python seed.py                         # seed content + admin user
uvicorn app.main:app --reload --port 8000
```

**Admin panel:** http://localhost:3000/admin — default login
`admin@empericalpublication.com` / `Admin@123` (set in `backend/.env` before seeding).

## Tech stack

- **Next.js 15** (App Router, Turbopack) + **React 19** + **TypeScript (strict)**
- **Tailwind CSS v4** (CSS-first theming with OKLCH design tokens, dark mode)
- **Shadcn-style UI** built on Radix primitives (dialog, sheet, select, tabs, accordion…)
- **Framer Motion** — page transitions, scroll reveals, staggered grids, counters, timeline
- **React Hook Form + Zod** — all forms with local validation
- **Zustand** (persisted) — wishlist state
- **Swiper** — featured books and testimonials carousels
- **Lucide** icons + custom inline brand glyphs
- **Sonner** toasts, **next-themes** theme toggle

## Architecture

```
src/
├── app/            # Routes: home, about, services, books(+details), authors(+profile),
│                   # journals, blog(+details), publish, contact, auth screens, 404,
│                   # sitemap.ts, robots.ts
├── components/
│   ├── ui/         # Reusable primitives (button, card, dialog, table, pagination…)
│   ├── common/     # Reveal, SectionHeading, BookCover, EmptyState, ErrorState…
│   ├── home|books|authors|journals|blog|forms|layout|services/
├── data/           # Mock data: 50 books, 25 authors, 15 blogs, 15 journals,
│                   # 10 testimonials, 10 FAQs, 20 services
├── services/       # Mock service layer (async + artificial latency)
├── hooks/          # useAsync, useDebounce, useWishlist
├── types/          # Shared TypeScript models
├── constants/      # Site config, nav, categories
└── lib/            # cn(), formatters, deterministic hashing
```

### Backend integration

Components never touch data directly — they call service functions
(`getBooks()`, `getAuthorBySlug()`, `submitPublishingRequest()`, …). Each
service now calls the FastAPI backend (`NEXT_PUBLIC_API_URL`, default
`http://localhost:8000/api`) and **falls back to the bundled mock data when the
API is unreachable**, so builds and local demos never break. Detail pages
(books/authors/blog) are server-rendered on demand, so content created in the
admin panel appears immediately.

### Admin panel (`/admin`)

- JWT login backed by the FastAPI `users` table (bcrypt hashes)
- Dashboard with content counts, pending submissions, and recent activity
- Config-driven CRUD (one `CrudManager` component + `src/config/admin-resources.ts`)
  for Books (incl. author assignment), Authors, Blog Posts, Journals, Services,
  Testimonials, and FAQs — create/edit dialogs, search, delete confirmation
- Inboxes for publishing submissions (pending → in review → accepted/rejected),
  contact messages (new → responded → archived), and newsletter subscribers

### Notable features

- Books: search, category/language/year filters, 7 sort options, grid/list toggle,
  pagination, persisted wishlist, PDF sample preview modal, related titles
- Publish: 5-step wizard with per-step Zod validation, progress indicator,
  localStorage autosave/restore, file-upload preview, success modal, reset
- Global search dialog (Ctrl/Cmd+K) over the catalogue
- Fully responsive, WCAG-minded (skip link, ARIA labels, focus rings,
  keyboard navigation, `prefers-reduced-motion` respected)
- SEO: per-page metadata, Open Graph, sitemap.xml, robots.txt, SSG for all
  detail pages (books, authors, blog posts)
- Deterministic CSS-generated book covers and avatars — zero external image
  dependencies, no broken placeholders
