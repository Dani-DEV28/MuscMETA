'use client';
import { useState } from 'react';

export function UploadForm() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(null);
    setError(null);
    setResults([]);
    const formData = new FormData(e.currentTarget);
    const files = formData.getAll('files') as File[];
    if (!files.length) return setError('No files selected.');

    const uploaded: any[] = [];
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (res.ok) uploaded.push(await res.json());
    }

    if (uploaded.length) {
      setResults(uploaded);
      setStatus(`${uploaded.length} file(s) uploaded and metadata extracted.`);
    } else {
      setError('Upload failed.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} role="form" className="flex flex-col gap-3">
        {/* @ts-expect-error webkitdirectory is non-standard */}
        <label className="text-text-muted text-sm">Select files:</label>
        <input type="file" name="files" accept="audio/*" multiple className="text-text" />
        <label className="text-text-muted text-sm">Or select a folder:</label>
        <input type="file" name="files" accept="audio/*" multiple webkitdirectory="" directory="" className="text-text" />
        <button type="submit" className="bg-accent hover:bg-accent-hover text-white py-3 rounded font-bold">Upload & Extract Metadata</button>
      </form>
      {status && <p className="text-success text-center mt-3">{status}</p>}
      {error && <p className="text-error text-center mt-3">{error}</p>}
      {results.length > 0 && (
        <div className="mt-6 space-y-4">
          {results.map((result, i) => (
            <div key={i} className="bg-bg-secondary p-4 rounded border border-border">
              <h3 className="text-lg font-bold text-accent mb-2">{result.track?.name || `Track ${i + 1}`}</h3>
              <dl className="grid grid-cols-2 gap-1 text-sm">
                <dt className="text-text-muted">Artist</dt><dd>{result.artist?.name}</dd>
                <dt className="text-text-muted">Album</dt><dd>{result.album?.name}</dd>
                <dt className="text-text-muted">Track #</dt><dd>{result.track?.number}</dd>
                <dt className="text-text-muted">Duration</dt><dd>{result.track?.duration || '—'}</dd>
                <dt className="text-text-muted">Genre</dt><dd>{result.track?.genre || '—'}</dd>
                <dt className="text-text-muted">Year</dt><dd>{result.track?.year || '—'}</dd>
                <dt className="text-text-muted">Bitrate</dt><dd>{result.track?.bitrate ? `${result.track.bitrate} kbps` : '—'}</dd>
                <dt className="text-text-muted">Codec</dt><dd>{result.track?.codec || '—'}</dd>
              </dl>
              {result.album?.hasImage && <p className="text-success mt-2 text-sm">✓ Artwork saved</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
