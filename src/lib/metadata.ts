import { parseBuffer } from 'music-metadata';

export async function extractMetadata(buffer: Buffer) {
  const { common, format } = await parseBuffer(buffer);
  const durationSec = format.duration ? Math.round(format.duration) : null;
  const duration = durationSec
    ? `${Math.floor(durationSec / 60).toString().padStart(2, '0')}:${(durationSec % 60).toString().padStart(2, '0')}`
    : null;
  return {
    artist: common.artist ?? null,
    albumArtist: common.albumartist ?? null,
    album: common.album ?? null,
    track: common.title ?? null,
    trackNumber: common.track.no ?? null,
    duration,
    genre: common.genre?.[0] ?? null,
    year: common.year ?? null,
    bitrate: format.bitrate ? Math.round(format.bitrate / 1000) : null,
    codec: format.codec ?? null,
    picture: common.picture?.[0] ?? null,
  };
}
