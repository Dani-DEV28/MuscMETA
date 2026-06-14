'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AlbumCard } from '@/components/AlbumCard';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState<any>({ artists: [], albums: [], tracks: [] });

  useEffect(() => {
    if (q) fetch(`/api/search?q=${encodeURIComponent(q)}`).then(r => r.json()).then(setResults);
  }, [q]);

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 bg-bg-secondary p-4 border-b border-border">
        <Link href="/" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded">🔙 Go Home</Link>
        <h2 className="text-2xl font-bold">Results for: <span className="text-accent">{q}</span></h2>
      </div>

      {results.artists.length > 0 && (
        <section className="mt-6">
          <h3 className="text-xl font-bold mb-3">Artists</h3>
          <div className="flex flex-wrap gap-4">
            {results.artists.map((a: any) => (
              <Link key={a.id} href={`/artist/${a.id}`} className="bg-bg-secondary p-3 rounded hover:text-accent">{a.name}</Link>
            ))}
          </div>
        </section>
      )}

      {results.albums.length > 0 && (
        <section className="mt-6">
          <h3 className="text-xl font-bold mb-3">Albums</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {results.albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {results.tracks.length > 0 && (
        <section className="mt-6">
          <h3 className="text-xl font-bold mb-3">Tracks</h3>
          <ul>
            {results.tracks.map((t: any) => (
              <li key={t.id} className="py-2 border-b border-border">
                <Link href={`/track/${t.id}`} className="hover:text-accent">{t.name}</Link>
                <span className="text-text-muted ml-2">— {t.album?.artist?.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!results.artists.length && !results.albums.length && !results.tracks.length && q && (
        <p className="text-center text-text-muted mt-8">No results found.</p>
      )}
    </div>
  );
}
