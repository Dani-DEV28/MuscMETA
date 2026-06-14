import { prisma } from './prisma';

export async function search(query: string) {
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
