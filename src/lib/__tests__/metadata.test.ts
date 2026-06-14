import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('music-metadata', () => ({
  parseBuffer: vi.fn(),
}));

import { parseBuffer } from 'music-metadata';
import { extractMetadata } from '../metadata';

const mockedParseBuffer = vi.mocked(parseBuffer);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('extractMetadata', () => {
  it('extracts all fields from full metadata', async () => {
    mockedParseBuffer.mockResolvedValue({
      common: {
        artist: 'Artist',
        albumartist: 'Album Artist',
        album: 'Album',
        title: 'Track',
        track: { no: 3 },
        genre: ['Rock'],
        year: 2020,
        picture: [{ format: 'image/png', data: Buffer.from('img') }],
      },
      format: {
        duration: 240,
        bitrate: 320000,
        codec: 'MP3',
      },
    } as any);

    const result = await extractMetadata(Buffer.from('fake'));

    expect(result).toEqual({
      artist: 'Artist',
      albumArtist: 'Album Artist',
      album: 'Album',
      track: 'Track',
      trackNumber: 3,
      duration: '04:00',
      genre: 'Rock',
      year: 2020,
      bitrate: 320,
      codec: 'MP3',
      picture: { format: 'image/png', data: Buffer.from('img') },
    });
  });

  it('returns null duration when format.duration is null', async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: { duration: null },
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.duration).toBeNull();
  });

  it('returns null duration when format.duration is 0', async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: { duration: 0 },
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.duration).toBeNull();
  });

  it("formats duration 65 as '01:05'", async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: { duration: 65 },
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.duration).toBe('01:05');
  });

  it("rounds duration 90.7 to 91 → '01:31'", async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: { duration: 90.7 },
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.duration).toBe('01:31');
  });

  it('returns null for missing optional fields (artist, track undefined)', async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: {},
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.artist).toBeNull();
    expect(result.track).toBeNull();
  });

  it('returns null picture when common.picture is undefined', async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: {},
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.picture).toBeNull();
  });

  it('returns null bitrate when format.bitrate is undefined', async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: {},
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.bitrate).toBeNull();
  });

  it('converts bitrate 128000 to 128', async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {} },
      format: { bitrate: 128000 },
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.bitrate).toBe(128);
  });

  it("picks first genre from array ['Rock', 'Pop'] → 'Rock'", async () => {
    mockedParseBuffer.mockResolvedValue({
      common: { track: {}, genre: ['Rock', 'Pop'] },
      format: {},
    } as any);

    const result = await extractMetadata(Buffer.from(''));
    expect(result.genre).toBe('Rock');
  });
});
