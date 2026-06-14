import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('@/lib/search', () => ({
  search: vi.fn(),
}));

import { search } from '@/lib/search';
import { GET } from '../search/route';

const mockSearch = search as ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
});

function createRequest(q: string) {
  return new NextRequest(`http://localhost:3000/api/search?q=${encodeURIComponent(q)}`);
}

describe('GET /api/search', () => {
  it('returns empty arrays for empty query', async () => {
    const res = await GET(createRequest(''));
    expect(await res.json()).toEqual({ artists: [], albums: [], tracks: [] });
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('returns empty arrays for whitespace-only query', async () => {
    const res = await GET(createRequest('   '));
    expect(await res.json()).toEqual({ artists: [], albums: [], tracks: [] });
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('calls search function and returns results', async () => {
    const results = {
      artists: [{ id: 1, name: 'Madonna' }],
      albums: [{ id: 1, name: 'Ray of Light' }],
      tracks: [{ id: 1, name: 'Frozen' }],
    };
    mockSearch.mockResolvedValue(results);

    const res = await GET(createRequest('Madonna'));

    expect(mockSearch).toHaveBeenCalledWith('Madonna');
    expect(await res.json()).toEqual(results);
  });
});
