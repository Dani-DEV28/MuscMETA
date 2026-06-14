import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { extractMetadata } from '@/lib/metadata';

const mp3Path = path.resolve(__dirname, '../../01 - Ironmouse - Hell Again.mp3');
const buffer = readFileSync(mp3Path);

describe('extractMetadata (real MP3 file)', () => {
  let result: Awaited<ReturnType<typeof extractMetadata>>;

  it('reads the real MP3 file and extracts metadata successfully', async () => {
    result = await extractMetadata(buffer);
    expect(result).toBeDefined();
  });

  it('artist field is a non-empty string', () => {
    expect(typeof result.artist).toBe('string');
    expect(result.artist!.length).toBeGreaterThan(0);
  });

  it('track field is a non-empty string', () => {
    expect(typeof result.track).toBe('string');
    expect(result.track!.length).toBeGreaterThan(0);
  });

  it('duration is a string matching MM:SS format', () => {
    expect(result.duration).toMatch(/^\d{2}:\d{2}$/);
  });

  it('bitrate is a positive number or null', () => {
    if (result.bitrate !== null) {
      expect(result.bitrate).toBeGreaterThan(0);
    } else {
      expect(result.bitrate).toBeNull();
    }
  });

  it('codec is a non-empty string', () => {
    expect(typeof result.codec).toBe('string');
    expect(result.codec!.length).toBeGreaterThan(0);
  });

  it('picture is either null or has data and format (string)', () => {
    if (result.picture !== null) {
      expect(result.picture.data).toBeDefined();
      expect(result.picture.data.length).toBeGreaterThan(0);
      expect(typeof result.picture.format).toBe('string');
      expect(result.picture.format.length).toBeGreaterThan(0);
    } else {
      expect(result.picture).toBeNull();
    }
  });
});
