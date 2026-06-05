'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const isActive = (path: string) => {
    return pathname === path ? { fontWeight: 'bold', borderBottom: '2px solid #3b82f6' } : {};
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={closeMenu}>
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-white">Music Catalog</span>
          </Link>

          <nav className="hidden md:flex gap-6">
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

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl focus:outline-none"
            aria-label="Меню"
          >
            {isOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-md transition-all duration-300 md:hidden ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeMenu}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8 text-2xl">
          <Link href="/artists" className="text-white/80 hover:text-white transition" onClick={closeMenu}>
            Исполнители
          </Link>
          <Link href="/albums" className="text-white/80 hover:text-white transition" onClick={closeMenu}>
            Альбомы
          </Link>
          <Link href="/tracks/new" className="text-white/80 hover:text-white transition" onClick={closeMenu}>
            Добавить трек
          </Link>
        </nav>
      </div>
    </>
  );
}