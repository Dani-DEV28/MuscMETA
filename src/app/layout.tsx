import './globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MusicMETA',
  description: 'Simplest page for Music Info',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-bg text-text min-h-screen font-sans">{children}</body>
    </html>
  );
}
