import { SearchBar } from '@/components/SearchBar';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <nav className="fixed top-4 left-4 flex gap-2">
        <Link href="/search" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded font-bold">🔍 Search</Link>
        <Link href="/upload" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded font-bold">⬆ Upload</Link>
      </nav>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-accent">MusicMETA</h1>
          <p className="text-xl text-text-muted mt-2">Simplest page for Music Info</p>
        </header>
        <SearchBar />
      </div>
    </main>
  );
}
