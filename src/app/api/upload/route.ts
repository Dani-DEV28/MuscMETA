import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractMetadata } from '@/lib/metadata';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const meta = await extractMetadata(buffer);

  const artistName = meta.artist || 'Unknown Artist';
  const albumName = meta.album || 'Unknown Album';

  const artist = await prisma.artist.upsert({
    where: { name_albumArtist: { name: artistName, albumArtist: meta.albumArtist } },
    update: {},
    create: { name: artistName, albumArtist: meta.albumArtist },
  });

  let imageData: Buffer | undefined;
  let imageMime: string | undefined;
  if (meta.picture) {
    imageData = Buffer.from(meta.picture.data);
    imageMime = meta.picture.format;
  }

  const album = await prisma.album.upsert({
    where: { artistId_name: { artistId: artist.id, name: albumName } },
    update: imageData ? { image: imageData, imageMime } : {},
    create: { name: albumName, artistId: artist.id, image: imageData, imageMime },
  });

  const track = await prisma.track.upsert({
    where: { albumId_number: { albumId: album.id, number: meta.trackNumber || 1 } },
    update: { name: meta.track || albumName, duration: meta.duration, genre: meta.genre, year: meta.year, bitrate: meta.bitrate, codec: meta.codec },
    create: { albumId: album.id, number: meta.trackNumber || 1, name: meta.track || albumName, duration: meta.duration, genre: meta.genre, year: meta.year, bitrate: meta.bitrate, codec: meta.codec },
  });

  return NextResponse.json({ artist, album: { id: album.id, name: album.name, hasImage: !!imageData }, track });
}
