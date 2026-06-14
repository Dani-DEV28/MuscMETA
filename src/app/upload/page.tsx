import { UploadForm } from '@/components/UploadForm';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-4 bg-bg-secondary p-4 border-b border-border">
        <Link href="/" className="bg-accent hover:bg-accent-hover text-white px-4 py-2 rounded">🔙 Go Home</Link>
        <h2 className="text-2xl font-bold">Upload Music</h2>
      </div>
      <div className="max-w-xl mx-auto mt-8">
        <UploadForm />
      </div>
    </div>
  );
}
