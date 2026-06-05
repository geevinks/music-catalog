'use client';
import Link from 'next/link';

export default function Navigation() {
  return (
    <header>
      <div>
        <Link href="/">Music Catalog</Link>
        <nav>
          <Link href="/artists">Исполнители</Link>
          <Link href="/albums">Альбомы</Link>
        </nav>
      </div>
    </header>
  );
}