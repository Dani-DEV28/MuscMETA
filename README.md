# MusicMETA V2

A music metadata database with a clean, modern UI — an alternative to cluttered databases like MusicBrainz.

---

## V2 Migration Plan

### Overview

V1 is a monolithic Express + EJS + MariaDB app with all routes in a single `app.js`, no tests, and manual data entry. V2 rebuilds the project with:

- **Next.js** (App Router) — React-based full-stack framework
- **Prisma** — Type-safe ORM replacing raw SQL queries
- **Isolated components** — Each UI piece testable in isolation
- **Music file metadata scraping** — Auto-extract tags from uploaded audio files
- **Search engine** — Full-text query across artists, albums, and tracks

---

## Tech Stack

| Layer | V1 | V2 |
|-------|----|----|
| Framework | Express + EJS | Next.js (App Router) |
| Database | MariaDB (raw SQL) | PostgreSQL + Prisma |
| Styling | Single CSS file | Tailwind CSS |
| Testing | None | Vitest + React Testing Library |
| Metadata | Manual admin form | `music-metadata` parser |
| Search | SQL `WHERE =` | Prisma full-text search / pg_trgm |
| Deployment | `npx nodemon` | Vercel / Docker |

---

## Project Structure

```
muscmeta-v2/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home / search page
│   │   ├── artist/[id]/
│   │   │   └── page.tsx       # Artist detail
│   │   ├── album/[id]/
│   │   │   └── page.tsx       # Album tracklist
│   │   ├── track/[id]/
│   │   │   └── page.tsx       # Track info
│   │   ├── upload/
│   │   │   └── page.tsx       # File upload + metadata scrape
│   │   └── admin/
│   │       └── page.tsx       # Admin panel
│   ├── components/
│   │   ├── SearchBar.tsx
│   │   ├── SearchBar.test.tsx
│   │   ├── AlbumCard.tsx
│   │   ├── AlbumCard.test.tsx
│   │   ├── TrackList.tsx
│   │   ├── TrackList.test.tsx
│   │   ├── UploadForm.tsx
│   │   ├── UploadForm.test.tsx
│   │   └── MetadataDisplay.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── metadata.ts        # music-metadata parsing logic
│   │   └── search.ts          # Search query builder
│   └── api/
│       ├── upload/route.ts    # POST: receive file, extract metadata, save
│       └── search/route.ts    # GET: full-text search endpoint
├── public/
│   └── img/                   # Album artwork (migrated from V1)
├── tests/
│   └── setup.ts               # Vitest global setup
├── .env
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Artist {
  id          Int      @id @default(autoincrement())
  name        String
  albumArtist String?
  albums      Album[]
  createdAt   DateTime @default(now())

  @@unique([name, albumArtist])
}

model Album {
  id        Int      @id @default(autoincrement())
  name      String
  image     Bytes?   // Album artwork stored as binary data
  imageMime String?  // MIME type (e.g. "image/png", "image/jpeg")
  artistId  Int
  artist    Artist   @relation(fields: [artistId], references: [id], onDelete: Cascade)
  tracks    Track[]
  createdAt DateTime @default(now())

  @@unique([artistId, name])
}

model Track {
  id       Int     @id @default(autoincrement())
  number   Int
  name     String
  duration String? // "MM:SS"
  info     String? // Lyrics, notes, etc.
  albumId  Int
  album    Album   @relation(fields: [albumId], references: [id], onDelete: Cascade)

  // Scraped metadata fields
  genre    String?
  bitrate  Int?
  codec    String?
  year     Int?

  @@unique([albumId, number])
}
```

---

## Core Features

### 1. Music File Metadata Scraping

Users upload audio files (MP3, FLAC, WAV, etc.) and the system auto-extracts:
- Artist name, album name, track title
- Track number, duration, genre, year
- Embedded album artwork
- Codec, bitrate, sample rate

**Library:** [`music-metadata`](https://github.com/Borewit/music-metadata)

```ts
// src/lib/metadata.ts
import { parseBuffer } from 'music-metadata';

export async function extractMetadata(buffer: Buffer) {
  const { common, format } = await parseBuffer(buffer);
  return {
    artist: common.artist,
    album: common.album,
    track: common.title,
    trackNumber: common.track.no,
    duration: format.duration,
    genre: common.genre?.[0],
    year: common.year,
    bitrate: format.bitrate,
    codec: format.codec,
    picture: common.picture?.[0], // embedded artwork
  };
}
```

### 2. Search Engine

Full-text search across artists, albums, and tracks using PostgreSQL:

- **pg_trgm extension** for fuzzy/partial matching
- **Prisma raw queries** for `ILIKE` and trigram similarity
- Debounced client-side input for instant results

```ts
// src/lib/search.ts
import { prisma } from './prisma';

export async function search(query: string) {
  const term = `%${query}%`;
  const artists = await prisma.artist.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
  });
  const albums = await prisma.album.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    include: { artist: true },
  });
  const tracks = await prisma.track.findMany({
    where: { name: { contains: query, mode: 'insensitive' } },
    include: { album: { include: { artist: true } } },
  });
  return { artists, albums, tracks };
}
```

### 3. Isolated Components (Testable)

Every UI component lives in `src/components/` with a co-located `.test.tsx` file:

```ts
// src/components/SearchBar.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('calls onSearch with user input', async () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Madonna' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(onSearch).toHaveBeenCalledWith('Madonna');
  });
});
```

---

## Migration Steps

### Phase 1: Scaffold
1. Initialize Next.js with TypeScript and Tailwind
2. Set up Prisma with PostgreSQL
3. Define schema and run initial migration
4. Configure Vitest + React Testing Library

### Phase 2: Core Pages
1. Build `SearchBar`, `AlbumCard`, `TrackList` components with tests
2. Implement home page with search
3. Implement artist, album, and track detail pages
4. Wire up Prisma queries via Server Components

### Phase 3: Upload & Metadata
1. Build `UploadForm` component with drag-and-drop
2. Create `/api/upload` route to accept files
3. Integrate `music-metadata` to parse uploaded audio
4. Auto-populate artist/album/track from extracted tags
5. Save embedded artwork to `/public/img/`

### Phase 4: Search Engine
1. Enable `pg_trgm` extension in PostgreSQL
2. Implement full-text search API at `/api/search`
3. Add debounced live search on the frontend
4. Display categorized results (artists, albums, tracks)

### Phase 5: Admin & Polish
1. Rebuild admin panel with form validation
2. Add auth (NextAuth.js) to protect admin routes
3. Mobile-first responsive design
4. Deploy via Vercel or Docker

---

## Environment Setup

```env
DATABASE_URL="postgresql://user:password@localhost:5432/musicmeta"
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

---

## Build Commands

```bash
# Install dependencies
npm install

# Set up database
npx prisma migrate dev --name init

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

---

## Dependencies

```json
{
  "dependencies": {
    "next": "^14.x",
    "@prisma/client": "^5.x",
    "music-metadata": "^10.x",
    "tailwindcss": "^3.x",
    "next-auth": "^4.x"
  },
  "devDependencies": {
    "prisma": "^5.x",
    "typescript": "^5.x",
    "vitest": "^2.x",
    "@testing-library/react": "^16.x",
    "@testing-library/jest-dom": "^6.x",
    "jsdom": "^25.x"
  }
}
```

---

## V1 Reference

The original V1 implementation (Express + EJS + MariaDB) remains in this repo for reference:
- `app.js` — All routes and DB logic
- `views/` — EJS templates
- `SQL/` — MariaDB schema and test data
- `docs/` — Original task docs and wireframes
