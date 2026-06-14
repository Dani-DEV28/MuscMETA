import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFindManyArtist = vi.fn();
const mockFindManyAlbum = vi.fn();
const mockFindManyTrack = vi.fn();

vi.mock('@/lib/prisma', () => ({
  prisma: {
    artist: { findMany: (...args: any[]) => mockFindManyArtist(...args) },
    album: { findMany: (...args: any[]) => mockFindManyAlbum(...args) },
    track: { findMany: (...args: any[]) => mockFindManyTrack(...args) },
  },
}));

import { search } from '../search';

beforeEach(() => {
  vi.clearAllMocks();
  mockFindManyArtist.mockResolvedValue([]);
  mockFindManyAlbum.mockResolvedValue([]);
  mockFindManyTrack.mockResolvedValue([]);
});

describe('search', () => {
  it('calls prisma.artist.findMany with correct where clause', async () => {
    await search('Madonna');

    expect(mockFindManyArtist).toHaveBeenCalledWith({
      where: { name: { contains: 'Madonna', mode: 'insensitive' } },
    });
  });

  it('returns combined results object', async () => {
    const artists = [{ id: 1, name: 'Madonna' }];
    const albums = [{ id: 1, name: 'Ray of Light', artist: { id: 1, name: 'Madonna' } }];
    const tracks = [{ id: 1, name: 'Frozen', album: { id: 1, name: 'Ray of Light', artist: { id: 1, name: 'Madonna' } } }];

    mockFindManyArtist.mockResolvedValue(artists);
    mockFindManyAlbum.mockResolvedValue(albums);
    mockFindManyTrack.mockResolvedValue(tracks);

    const result = await search('Madonna');

    expect(result).toEqual({ artists, albums, tracks });
  });

  it('returns empty arrays when all findMany return []', async () => {
    const result = await search('nonexistent');

    expect(result).toEqual({ artists: [], albums: [], tracks: [] });
  });

  it('albums query includes artist relation', async () => {
    await search('test');

    expect(mockFindManyAlbum).toHaveBeenCalledWith({
      where: { name: { contains: 'test', mode: 'insensitive' } },
      include: { artist: true },
    });
  });

  it('tracks query includes album with nested artist', async () => {
    await search('test');

    expect(mockFindManyTrack).toHaveBeenCalledWith({
      where: { name: { contains: 'test', mode: 'insensitive' } },
      include: { album: { include: { artist: true } } },
    });
  });
});
