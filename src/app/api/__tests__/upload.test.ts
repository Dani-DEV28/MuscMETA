import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    artist: { upsert: vi.fn() },
    album: { upsert: vi.fn() },
    track: { upsert: vi.fn() },
  },
}));

vi.mock('@/lib/metadata', () => ({
  extractMetadata: vi.fn(),
}));

import { prisma } from '@/lib/prisma';
import { extractMetadata } from '@/lib/metadata';
import { POST } from '../upload/route';

const mockExtract = extractMetadata as ReturnType<typeof vi.fn>;
const mockArtistUpsert = prisma.artist.upsert as ReturnType<typeof vi.fn>;
const mockAlbumUpsert = prisma.album.upsert as ReturnType<typeof vi.fn>;
const mockTrackUpsert = prisma.track.upsert as ReturnType<typeof vi.fn>;

function createMockRequest(file?: { name: string } | null) {
  const mockFile = file ? { ...file, arrayBuffer: () => Promise.resolve(new ArrayBuffer(8)) } : null;
  const formData = { get: (key: string) => (key === 'file' ? mockFile : null) };
  return { formData: () => Promise.resolve(formData) } as any;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockArtistUpsert.mockResolvedValue({ id: 1, name: 'Artist', albumArtist: null });
  mockAlbumUpsert.mockResolvedValue({ id: 1, name: 'Album' });
  mockTrackUpsert.mockResolvedValue({ id: 1, number: 1, name: 'Track' });
});

describe('POST /api/upload', () => {
  it('returns 400 when no file in formData', async () => {
    const req = createMockRequest(null);
    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'No file provided' });
  });

  it('creates artist, album, track with correct data', async () => {
    mockExtract.mockResolvedValue({
      artist: 'Madonna', album: 'Ray of Light', track: 'Frozen',
      trackNumber: 3, duration: '3:45', genre: 'Pop', year: 1998,
      bitrate: 320, codec: 'MP3', albumArtist: null, picture: null,
    });

    const res = await POST(createMockRequest({ name: 'test.mp3' }));

    expect(mockArtistUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { name_albumArtist: { name: 'Madonna', albumArtist: null } },
      create: { name: 'Madonna', albumArtist: null },
    }));
    expect(mockAlbumUpsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ name: 'Ray of Light', artistId: 1 }),
    }));
    expect(mockTrackUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { albumId_number: { albumId: 1, number: 3 } },
      create: expect.objectContaining({ name: 'Frozen', genre: 'Pop', year: 1998 }),
    }));
    expect(res.status).toBe(200);
  });

  it("uses 'Unknown Artist' and 'Unknown Album' as fallback names", async () => {
    mockExtract.mockResolvedValue({
      artist: null, album: null, track: null,
      trackNumber: null, duration: null, genre: null, year: null,
      bitrate: null, codec: null, albumArtist: null, picture: null,
    });

    await POST(createMockRequest({ name: 'test.mp3' }));

    expect(mockArtistUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { name_albumArtist: { name: 'Unknown Artist', albumArtist: null } },
      create: { name: 'Unknown Artist', albumArtist: null },
    }));
    expect(mockAlbumUpsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ name: 'Unknown Album' }),
    }));
  });

  it('uses trackNumber 1 when meta.trackNumber is null', async () => {
    mockExtract.mockResolvedValue({
      artist: 'A', album: 'B', track: 'C',
      trackNumber: null, duration: null, genre: null, year: null,
      bitrate: null, codec: null, albumArtist: null, picture: null,
    });

    await POST(createMockRequest({ name: 'test.mp3' }));

    expect(mockTrackUpsert).toHaveBeenCalledWith(expect.objectContaining({
      where: { albumId_number: { albumId: 1, number: 1 } },
      create: expect.objectContaining({ number: 1 }),
    }));
  });

  it('saves picture data when meta.picture is present', async () => {
    const pictureData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
    mockExtract.mockResolvedValue({
      artist: 'A', album: 'B', track: 'C',
      trackNumber: 1, duration: null, genre: null, year: null,
      bitrate: null, codec: null, albumArtist: null,
      picture: { data: pictureData, format: 'image/png' },
    });

    await POST(createMockRequest({ name: 'test.mp3' }));

    expect(mockAlbumUpsert).toHaveBeenCalledWith(expect.objectContaining({
      create: expect.objectContaining({ image: Buffer.from(pictureData), imageMime: 'image/png' }),
    }));
  });

  it('does not include image fields when meta.picture is null', async () => {
    mockExtract.mockResolvedValue({
      artist: 'A', album: 'B', track: 'C',
      trackNumber: 1, duration: null, genre: null, year: null,
      bitrate: null, codec: null, albumArtist: null, picture: null,
    });

    await POST(createMockRequest({ name: 'test.mp3' }));

    const call = mockAlbumUpsert.mock.calls[0][0];
    expect(call.update).toEqual({});
    expect(call.create.image).toBeUndefined();
    expect(call.create.imageMime).toBeUndefined();
  });

  it('returns hasImage true when picture exists', async () => {
    mockExtract.mockResolvedValue({
      artist: 'A', album: 'B', track: 'C',
      trackNumber: 1, duration: null, genre: null, year: null,
      bitrate: null, codec: null, albumArtist: null,
      picture: { data: new Uint8Array([1, 2, 3]), format: 'image/jpeg' },
    });

    const res = await POST(createMockRequest({ name: 'test.mp3' }));
    const json = await res.json();

    expect(json.album.hasImage).toBe(true);
  });
});
