# GameHub

A game library / downloads website with a full admin panel, built with Next.js (App Router), TypeScript, Tailwind CSS, and Prisma (SQLite by default).

## Features

**Public site**
- Game library with search + category filter
- Game detail pages with view counter, download-click tracking, and JSON-LD SEO markup
- Visitor accounts: register / log in / log out, favorite games, "My favorites" page
- About, Contact (working form saved to the DB), and Privacy Policy pages
- Auto-generated `sitemap.xml` and `robots.txt`

**Admin panel** (separate login, protected by middleware)
- Games: create / edit / delete, each with multiple download links
- Stats dashboard: total games, users, views, downloads, contact messages, top games by downloads
- Users: list of everyone who registered, with their favorite count

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`:

- `DATABASE_URL` — leave as-is for SQLite, or point it at a `postgresql://...` URL later.
- `SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`).
- `SITE_URL` — your public URL once deployed (used by the sitemap/robots files).
- `ADMIN_EMAIL` — the email you'll log in to `/admin` with.
- `ADMIN_PASSWORD_HASH` — generate it with:

  ```bash
  node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
  ```

  Paste the output (starts with `$2a$...`) into `.env`.

## 3. Set up the database

```bash
npx prisma migrate dev --name init
npm run seed   # optional: adds one sample game
```

## 4. Run it

```bash
npm run dev
```

- Public site: http://localhost:3000
- Visitor login/register: http://localhost:3000/login, /register
- Admin panel: http://localhost:3000/admin (redirects to /admin/login first)

## Switching to PostgreSQL later

1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`.
2. Set `DATABASE_URL` in `.env` to your Postgres connection string.
3. Run `npx prisma migrate dev`.

## Deploying

Any host that runs Node.js works (Vercel, Railway, a VPS with PM2, etc.). Set the same environment
variables on the host, and make sure your database persists between deploys.

## Project structure

```
src/app/                       → public pages (App Router)
src/app/admin/login/           → admin login (outside the sidebar layout)
src/app/admin/(dashboard)/     → protected admin pages: games, stats, users
src/app/go/[linkId]/route.ts   → tracks a download click, then redirects to the real URL
src/app/actions/               → server actions (games, admin auth, visitor auth, contact)
src/components/                → shared UI (Navbar, GameCard, GameForm)
src/lib/                       → Prisma client + admin/visitor session helpers
src/middleware.ts              → protects /admin/* routes, redirects to /admin/login
prisma/schema.prisma           → Game, DownloadLink, User, Favorite, ContactMessage
```

## Notes

- This is a clean, original build — it does not copy code or design from any other site.
- Design, copy, and branding (logo, colors, name) are meant as a starting point — swap them for your own.
- You're responsible for only uploading/linking content you have the rights to distribute.
