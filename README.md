# GameHub

A full game library / downloads platform with a complete admin panel. Next.js (App Router),
TypeScript, Tailwind CSS, Prisma + PostgreSQL.

## Feature list

**Public site**
- Search, category filter chips, tag pages, category pages
- Rich (HTML) game descriptions, image galleries, download links with provider badges
- Reviews & star ratings, "report a problem" on any game/link
- Visitor accounts: register / log in / favorites
- About, Contact (saved to DB), Privacy pages
- SEO: per-game meta title/description overrides, sitemap.xml, robots.txt, JSON-LD (incl. ratings)
- Maintenance mode page, admin-configurable redirects for renamed/removed game URLs

**Admin panel** (role-based: Super Admin / Editor / Moderator)
- Games: create/edit/delete with category, tags, gallery images, draft/scheduled/published/hidden
  status, scheduled publish date, per-game SEO fields, multiple download links with providers
- Categories: independent management with icon + cover image + custom order
- Tags: auto-created from the game form, manageable/removable separately
- Download links: dead-link checker (pings each URL, flags it as working/dead)
- Reviews: moderate/delete any review
- Reports: visitors can flag a broken link or bad content; admins resolve/dismiss
- Users: list, ban/unban registered visitors
- Admin team (Super Admin only): add/remove other admins with a role
- Site settings (Super Admin only): site name, logo, accent color, maintenance mode toggle,
  allow/disallow new registrations, ad-slot embed codes (header/sidebar/footer)
- Activity log (Super Admin only): who did what, and when
- Stats: totals, a real views/downloads line chart, top games, top search terms, and searches
  that returned zero results (so you know what to add next)

**Explicitly NOT included** (need a paid third-party account, can't be wired from here):
- Visitor geolocation / browser analytics — needs a GeoIP or analytics service (e.g. Vercel
  Analytics, MaxMind)
- Real push notifications — needs Firebase Cloud Messaging or similar
- Actual ads — needs an approved AdSense (or similar) account; the "ad slots" in Settings are
  ready to paste that code into once you have one

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Then edit `.env`:

- `DATABASE_URL` — a PostgreSQL connection string (Neon, Vercel Postgres, Railway, Supabase...).
- `SESSION_SECRET` — any long random string (e.g. `openssl rand -hex 32`).
- `SITE_URL` — your public URL once deployed.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` — your first Super Admin account. Generate the hash with:

  ```bash
  node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
  ```

## 3. Set up the database

```bash
npx prisma db push
npm run seed
```

`seed` creates: your Super Admin account, a starter "Action" category, and one sample game so
the site isn't empty.

## 4. Run it

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin panel: http://localhost:3000/admin/login (separate from visitor login at `/login`)

## Deploying (Vercel)

1. Push this project to a GitHub repo.
2. Import it in Vercel.
3. Add a Postgres database from Vercel's Storage tab (or use your own Neon/Railway one) —
   make sure the connection variable is named exactly `DATABASE_URL`.
4. Add `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SITE_URL` as environment variables.
5. Deploy. The build script runs `prisma db push` automatically before building, so your tables
   get created on first deploy.
6. After the first successful deploy, run the seed once against your production database from
   your own machine (with `DATABASE_URL` in your local `.env` pointed at production):
   ```bash
   npm run seed
   ```
   This creates your Super Admin account and starter category in production.

## Project structure

```
src/app/                       → public pages
src/app/admin/login/           → admin login (outside the sidebar layout)
src/app/admin/(dashboard)/     → every protected admin section
src/app/go/[linkId]/route.ts   → tracks a download click, then redirects to the real URL
src/app/[...slug]/page.tsx     → catch-all: serves admin-configured redirects, else 404
src/app/actions/               → server actions, grouped by feature
src/components/                → shared UI (forms, cards, rich text editor, charts)
src/lib/                       → Prisma client, admin/visitor session helpers, settings, activity log
src/middleware.ts              → protects /admin/* routes
prisma/schema.prisma           → full data model
prisma/seed.ts                 → creates Super Admin, starter category, sample game, settings row
```

## Notes

- This is a clean, original build — it does not copy code, design, or content from any other site.
- The rich text editor, dead-link checker, and redirects manager are intentionally simple —
  they cover the real use case without pulling in heavy third-party editor/monitoring services.
- You're responsible for only uploading/linking content you have the rights to distribute.
