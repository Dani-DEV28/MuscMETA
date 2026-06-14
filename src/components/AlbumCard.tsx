import Link from 'next/link';

interface AlbumCardProps {
  album: { id: number; name: string; image: Buffer | null; imageMime: string | null };
}

export function AlbumCard({ album }: AlbumCardProps) {
  const src = album.image
    ? `data:${album.imageMime};base64,${Buffer.from(album.image).toString('base64')}`
    : '/img/CD-Image.jpg';
  return (
    <Link href={`/album/${album.id}`} className="block w-full]">
      <img src={src} alt={album.name} className="w-full aspect-square object-cover rounded" />
      <p className="text-center mt-1 text-text-muted">{album.name}</p>
    </Link>
  );
}
