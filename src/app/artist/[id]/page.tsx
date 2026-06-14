import { prisma } from '@/lib/prisma';
import { AlbumCard } from '@/components/AlbumCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ArtistPage({ params }: { params: { id: string } }) {
  const artist = await prisma.artist.findUnique({
    where: { id: Number(params.id) },
    include: { albums: true },
  });
  if (!artist) notFound();
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 bg-bg-secondary p-4 border-b border-border">
        <Link href="/" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded">🔙 Go Home</Link>
        <h2 className="text-2xl font-bold">{artist.name}</h2>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-8 w-3/5 mx-auto">
        {artist.albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
        {artist.albums.length % 3 !== 0 &&
          Array.from({ length: 3 - (artist.albums.length % 3) }).map((_, i) => (
            <div key={`placeholder-${i}`} className="aspect-square bg-bg-secondary rounded border border-border opacity-30" />
          ))}
      </div>
    </div>
  );
}
