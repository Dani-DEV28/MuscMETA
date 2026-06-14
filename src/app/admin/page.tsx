import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 bg-bg-secondary p-4 border-b border-border">
        <Link href="/" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded">🔙 Go Home</Link>
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>
      <div className="max-w-xl mx-auto mt-8">
        <form action="/api/upload" method="post" className="flex flex-col gap-3">
          <input name="artistName" placeholder="Artist Name..." required className="p-3 rounded border border-border bg-bg text-text" />
          <input name="albumArtist" placeholder="Album Artist..." className="p-3 rounded border border-border bg-bg text-text" />
          <input name="albumName" placeholder="Album Name..." required className="p-3 rounded border border-border bg-bg text-text" />
          <input name="trackNum" type="number" placeholder="Track Number..." className="p-3 rounded border border-border bg-bg text-text" />
          <input name="trackName" placeholder="Track Name..." className="p-3 rounded border border-border bg-bg text-text" />
          <input name="trackLength" placeholder="Track Length (MM:SS)..." className="p-3 rounded border border-border bg-bg text-text" />
          <textarea name="trackInfo" placeholder="Track info / lyrics..." className="p-3 rounded border border-border bg-bg text-text" />
          <button type="submit" className="bg-accent hover:bg-accent-hover text-white py-3 rounded font-bold">SUBMIT</button>
        </form>
      </div>
    </div>
  );
}
