'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSubmit} role="form" className="flex gap-2 w-full max-w-lg">
      <input
        type="search"
        role="searchbox"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Artist..."
        required
        className="flex-1 p-3 rounded border border-border bg-bg text-text"
      />
      <button type="submit" className="bg-accent hover:bg-accent-hover text-white px-4 py-3 rounded">🔍</button>
    </form>
  );
}
