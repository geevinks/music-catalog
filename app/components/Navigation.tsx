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

  const isActivePage = (basePath: string) => {
    if (basePath === '/artists' && (pathname === '/artists' || (pathname.startsWith('/artists/') && pathname !== '/artists/new' && !pathname.includes('/edit')))) {
      return true;
    }
    if (basePath === '/albums' && (pathname === '/albums' || (pathname.startsWith('/albums/') && pathname !== '/albums/new' && !pathname.includes('/edit')))) {
      return true;
    }
    return pathname === basePath;
  };

  const isFormActive = (basePath: string) => {
    return pathname === `${basePath}/new` || pathname.includes(`${basePath}/`) && pathname.includes('/edit');
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={closeMenu}>
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-white">Music Catalog</span>
          </Link>

          <nav className="hidden md:flex gap-8">
            <div className="flex flex-col items-center">
              <Link href="/artists" className={`transition ${isActivePage('/artists') ? 'text-blue-400 font-bold' : 'text-white/80 hover:text-white'}`}>
                Исполнители
              </Link>
              <Link href="/artists/new" className={`text-xs mt-0.5 transition ${isFormActive('/artists') ? 'text-blue-400' : 'text-white/40 hover:text-white/70'}`}>
                + добавить
              </Link>
            </div>
            <div className="flex flex-col items-center">
              <Link href="/albums" className={`transition ${isActivePage('/albums') ? 'text-blue-400 font-bold' : 'text-white/80 hover:text-white'}`}>
                Альбомы
              </Link>
              <Link href="/albums/new" className={`text-xs mt-0.5 transition ${isFormActive('/albums') ? 'text-blue-400' : 'text-white/40 hover:text-white/70'}`}>
                + добавить
              </Link>
            </div>
            <Link href="/tracks/new" className={`transition ${pathname === '/tracks/new' ? 'text-blue-400 font-bold' : 'text-white/80 hover:text-white'}`}>
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
          <div className="flex items-center gap-3">
            <Link href="/artists" className={`transition ${isActivePage('/artists') ? 'text-blue-400 font-bold' : 'text-white/80 hover:text-white'}`} onClick={closeMenu}>
              Исполнители
            </Link>
            <Link href="/artists/new" className={`text-lg transition ${isFormActive('/artists') ? 'text-blue-400' : 'text-white/40 hover:text-white/70'}`} onClick={closeMenu}>
              +
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/albums" className={`transition ${isActivePage('/albums') ? 'text-blue-400 font-bold' : 'text-white/80 hover:text-white'}`} onClick={closeMenu}>
              Альбомы
            </Link>
            <Link href="/albums/new" className={`text-lg transition ${isFormActive('/albums') ? 'text-blue-400' : 'text-white/40 hover:text-white/70'}`} onClick={closeMenu}>
              +
            </Link>
          </div>
          <Link href="/tracks/new" className={`transition ${pathname === '/tracks/new' ? 'text-blue-400 font-bold' : 'text-white/80 hover:text-white'}`} onClick={closeMenu}>
            Добавить трек
          </Link>
        </nav>
      </div>
    </>
  );
}