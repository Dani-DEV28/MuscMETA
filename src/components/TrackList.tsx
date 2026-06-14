import Link from 'next/link';

interface Track {
  id: number;
  number: number;
  name: string;
  duration: string | null;
}

export function TrackList({ tracks }: { tracks: Track[] }) {
  return (
    <ul className="mt-6 text-left max-w-md mx-auto">
      {tracks.map((t) => (
        <li key={t.id} className="flex justify-between py-2 border-b border-border">
          <Link href={`/track/${t.id}`} className="hover:text-accent">
            <span className="text-text-muted mr-2">{t.number}.</span>{t.name}
          </Link>
          {t.duration && <span className="text-text-muted">{t.duration}</span>}
        </li>
      ))}
    </ul>
  );
}
