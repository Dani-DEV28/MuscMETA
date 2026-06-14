# Human Guideline — MusicMETA V2 Setup

## Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **Docker** — [Download](https://www.docker.com/products/docker-desktop/)
- **npm** (comes with Node.js)

---

## 1. Clone & Install

```bash
git clone https://github.com/Dani-DEV28/MuscMETA.git
cd MuscMETA
npm install
```

---

## 2. Start PostgreSQL with Docker

```bash
docker run -d \
  --name musicmeta-db \
  -e POSTGRES_USER=musicmeta_user \
  -e POSTGRES_PASSWORD=musicmeta_pass \
  -e POSTGRES_DB=musicmeta \
  -p 5432:5432 \
  postgres:16
```

> Stop: `docker stop musicmeta-db` | Restart: `docker start musicmeta-db` | Remove: `docker rm -f musicmeta-db`

---

## 3. Configure Environment

```bash
cp .env .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://musicmeta_user:musicmeta_pass@localhost:5432/musicmeta"
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

> Generate a secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 4. Run Database Migration

```bash
npx prisma migrate dev --name init
```

This creates all tables (Artist, Album, Track) in your PostgreSQL database.

---

## 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Run Tests

```bash
npm test
```

---

## Project Structure (Quick Reference)

```
├── prisma/schema.prisma    → Database models
├── src/app/                → Pages (Next.js App Router)
├── src/components/         → UI components + tests
├── src/lib/                → Prisma client, metadata parser, search
├── src/app/api/            → API routes (upload, search)
├── public/img/             → Fallback album artwork
└── tests/setup.ts          → Test configuration
```

---

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm test` | Run all tests |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Apply schema changes |

---

## How to Use

1. **Search** — Type an artist, album, or track name on the home page
2. **Upload** — Go to `/upload`, drag & drop an audio file (MP3, FLAC, etc.) to auto-extract metadata
3. **Admin** — Go to `/admin` to manually add entries
4. **Browse** — Click through artists → albums → tracks

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Docker container won't start | Ensure port 5432 isn't already in use (`docker ps`) |
| `prisma migrate` fails | Check DATABASE_URL matches the Docker credentials above |
| Port 3000 in use | Kill the process or set `PORT=3001` before `npm run dev` |
| Upload not working | Ensure the file is a supported audio format (MP3, FLAC, WAV, OGG, M4A) |
| Images not showing | Fallback uses `public/img/CD-Image.jpg` — ensure it exists |
