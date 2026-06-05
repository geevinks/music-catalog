'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? { fontWeight: 'bold', borderBottom: '2px solid #3b82f6' } : {};
  };

  return (
    <header style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '16px 0', marginBottom: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', textDecoration: 'none', color: 'white' }}>
          Music Catalog
        </Link>
        
        <nav style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link href="/artists" style={{ textDecoration: 'none', color: 'white', padding: '8px 0', ...isActive('/artists') }}>
            Исполнители
          </Link>
          <Link href="/albums" style={{ textDecoration: 'none', color: 'white', padding: '8px 0', ...isActive('/albums') }}>
            Альбомы
          </Link>
          <Link href="/tracks/new" style={{ textDecoration: 'none', color: 'white', padding: '8px 0', ...isActive('/tracks/new') }}>
            Добавить трек
          </Link>
        </nav>
      </div>
    </header>
  );
}