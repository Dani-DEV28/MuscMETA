import { prisma } from '@/lib/prisma';
import { TrackList } from '@/components/TrackList';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function AlbumPage({ params }: { params: { id: string } }) {
  const album = await prisma.album.findUnique({
    where: { id: Number(params.id) },
    include: { tracks: { orderBy: { number: 'asc' } }, artist: true },
  });
  if (!album) notFound();
  const imageSrc = album.image
    ? `data:${album.imageMime};base64,${Buffer.from(album.image).toString('base64')}`
    : '/img/CD-Image.jpg';
  return (
    <div className="p-4">
      <div className="flex items-center justify-between bg-bg-secondary p-4 border-b border-border">
        <Link href="/" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded">🔙 Go Home</Link>
        <h2 className="text-2xl font-bold">{album.name}</h2>
        <Link href={`/artist/${album.artistId}`} className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded">🔙 Go Back</Link>
      </div>
      <div className="grid grid-cols-[auto_1fr] gap-8 mt-8 max-w-4xl mx-auto">
        <div className="text-center">
          <img src={imageSrc} alt="Album cover" className="w-64 aspect-square object-cover rounded-lg" />
          <h3 className="mt-3 text-lg font-bold">{album.name}</h3>
          <p className="text-text-muted">{album.artist.name}</p>
        </div>
        <div>
          <TrackList tracks={album.tracks} />
        </div>
      </div>
    </div>
  );
}
