# Test Implementation Plan — MusicMETA V2

**Framework:** vitest + @testing-library/react + jsdom  
**Run:** `npm test` (watch mode) or `npm run test:run` (CI)

---

## 0. Setup Improvements

### Test helpers (`tests/helpers.tsx`)
Create a shared utility for common mocks and wrappers.

```ts
// tests/helpers.tsx
import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Reusable wrapper if providers are needed in the future
function AllTheProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) {
  return render(ui, { wrapper: AllTheProviders, ...options });
}

export * from '@testing-library/react';
```

### Mock patterns (reference)
All Prisma-dependent tests use this pattern:
```ts
import { prisma } from '@/lib/prisma';
vi.mock('@/lib/prisma', () => ({ prisma: { artist: { findMany: vi.fn(), upsert: vi.fn() }, album: { ... }, track: { ... } } }));
```

---

## 1. Lib Tests (pure logic, no DOM)

### `src/lib/__tests__/metadata.test.ts`

| Test | Input | Assertion |
|------|-------|-----------|
| extracts all fields | mock `parseBuffer` returning full `common` + `format` | returns correct artist, album, track, duration, genre, year, bitrate, codec, picture |
| null duration | `format.duration = null` | `duration` is `null` |
| zero duration | `format.duration = 0` | `duration` is `null` |
| duration formatting | `format.duration = 65` | `duration` is `"01:05"` |
| duration rounding | `format.duration = 90.7` | `durationSec = 91` → `"01:31"` |
| missing optional fields | `common.artist = undefined`, `common.track = undefined` | returns `null` for those fields |
| no picture | `common.picture = undefined` | `picture` is `null` |
| bitrate null | `format.bitrate = undefined` | `bitrate` is `null` |
| bitrate conversion | `format.bitrate = 128000` | `bitrate` is `128` |
| genre as first element | `common.genre = ['Rock', 'Pop']` | `genre` is `'Rock'` |

### `src/lib/__tests__/search.test.ts`

| Test | Assertion |
|------|-----------|
| calls prisma with query params | `prisma.artist.findMany` called with `{ where: { name: { contains: 'madonna', mode: 'insensitive' } } }` |
| returns combined results | mock all 3 findMany → returns `{ artists, albums, tracks }` |
| empty results | all findMany return empty arrays → returns `{ artists: [], albums: [], tracks: [] }` |
| albums include artist | `prisma.album.findMany` called with `{ include: { artist: true } }` |
| tracks include album+artist | `prisma.track.findMany` called with `{ include: { album: { include: { artist: true } } } }` |

---

## 2. Component Tests

### `src/components/MetadataDisplay.test.tsx`

| Test | Input | Assertion |
|------|-------|-----------|
| renders all 6 fields | full track data | renders Track, Duration, Genre, Year, Bitrate, Codec |
| hides null fields | `duration: null`, `bitrate: null` | only 4 `<dt>` elements rendered |
| bitrate formatting | `bitrate: 320` | displays `"320 kbps"` |
| track number + name | `number: 2, name: 'Song'` | displays `"2. Song"` |
| empty track object | all nullable fields null | only renders Track line |

---

## 3. API Route Tests

### `src/app/api/__tests__/upload.test.ts`

| Test | Mock Setup | Assertion |
|------|-----------|-----------|
| 400 when no file | `formData.get` returns null | response status 400, `{ error: 'No file provided' }` |
| creates artist, album, track | `extractMetadata` returns full meta; `prisma.*.upsert` returns entities | response 200 with `{ artist, album, track }` |
| fallback names | `meta.artist = null`, `meta.album = null` | upsert called with `'Unknown Artist'`, `'Unknown Album'` |
| null trackNumber | `meta.trackNumber = null` | upsert called with `number: 1` |
| saves picture data | `meta.picture` present | album upsert includes `image: Buffer`, `imageMime` |
| no picture | `meta.picture = null` | album upsert called without image/imageMime |
| album update preserves image | meta without picture, existing DB row has image | upsert `update: {}` (no image fields) |

### `src/app/api/__tests__/search.test.ts`

| Test | Assertion |
|------|-----------|
| returns empty arrays for empty query | response 200, `{ artists: [], albums: [], tracks: [] }` |
| returns empty for whitespace | query `'   '` → empty arrays |
| returns results from lib/search | mock `search` → response 200 with mocked data |

---

## 4. Page Tests

### `src/app/__tests__/SearchPage.test.tsx` (client component)

| Test | Assertion |
|------|-----------|
| renders heading with query | search params `?q=Madonna` → heading shows `"Results for: Madonna"` |
| renders artists as links | mock fetch returns artists → each renders as `<a>` linking to `/artist/{id}` |
| renders albums via AlbumCard | mock fetch returns albums → AlbumCard renders album name |
| renders tracks | mock fetch returns tracks → track name + artist name rendered |
| empty state message | mock fetch returns empty arrays → `"No results found."` shown |
| no fetch when query empty | search params `?q=` → fetch never called |

### `src/app/__tests__/TrackPage.test.tsx` (server component)

**Note:** Server component testing may require [next-test-utils](https://nextjs.org/docs/app/building-your-application/testing/testing-server-components) or rendering via a helper.

| Test | Assertion |
|------|-----------|
| renders track name and MetadataDisplay | track found → heading shows track name, MetadataDisplay rendered |
| renders album cover from DB | `album.image` present → `<img>` src is base64 data URI |
| renders fallback image | `album.image` null → `<img>` src is `/img/CD-Image.jpg` |
| renders track info | `track.info` present → `<pre>` rendered |
| hides info paragraph | `track.info` null → no `<pre>` rendered |
| calls notFound for missing track | `prisma.track.findUnique` returns null → `notFound()` called |

### `src/app/__tests__/ArtistPage.test.tsx` (server component)

| Test | Assertion |
|------|-----------|
| renders artist name | heading shows artist.name |
| renders AlbumCard for each album | 5 albums → 5 AlbumCard components rendered |
| renders grid placeholders | 5 albums (5 % 3 = 2) → 1 placeholder div rendered |
| no placeholders for exact multiple | 3 albums → 0 placeholder divs |
| calls notFound for missing artist | artist not found → `notFound()` called |

### `src/app/__tests__/AlbumPage.test.tsx` (server component)

| Test | Assertion |
|------|-----------|
| renders album name and artist | heading shows album name, artist name rendered |
| renders TrackList | tracks rendered in order by number |
| renders album cover or fallback | same pattern as TrackPage |
| calls notFound for missing album | album not found → `notFound()` called |

---

## 5. Integration / E2E (Optional, Future)

| Area | Approach |
|------|----------|
| Upload flow | Create a small test MP3 fixture (`tests/fixtures/sample.mp3`), test real `music-metadata` output |
| Full search flow | Seed test DB, hit `/api/search`, verify joined results |
| E2E | Use Playwright or Cypress for browser-level tests |

---

## 6. Implementation Order

| Phase | Files | Est. tests |
|-------|-------|-----------|
| 1 | `lib/__tests__/metadata.test.ts` | ~10–12 tests |
| 2 | `lib/__tests__/search.test.ts` | ~5 tests |
| 3 | `components/MetadataDisplay.test.tsx` | ~5 tests |
| 4 | `app/api/__tests__/upload.test.ts` | ~7 tests |
| 5 | `app/api/__tests__/search.test.ts` | ~3 tests |
| 6 | `app/__tests__/SearchPage.test.tsx` | ~6 tests |
| 7 | `app/__tests__/TrackPage.test.tsx` | ~6 tests |
| 8 | `app/__tests__/ArtistPage.test.tsx` | ~5 tests |
| 9 | `app/__tests__/AlbumPage.test.tsx` | ~4 tests |

**Total:** ~50–55 tests across 9 new files.

---

## Key Decisions

- **`music-metadata`** is a native module — always mock `parseBuffer` in unit tests
- **Prisma** — always mock at module level via `vi.mock('@/lib/prisma')`
- **Server components** — use `vi.mock` for `@/lib/prisma` and `next/navigation` (for `notFound`)
- **Client components** — use `vi.mock('next/navigation', () => ({ useSearchParams: ..., useRouter: ... }))`
- **`fetch`** in client pages — mock via `vi.stubGlobal('fetch', vi.fn())`
