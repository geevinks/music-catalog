'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

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
    return pathname === `${basePath}/new` || (pathname.includes(`${basePath}/`) && pathname.includes('/edit'));
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold" onClick={closeMenu}>
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
            <span className="text-gray-200">Music Catalog</span>
          </Link>
          
          <nav className="hidden md:flex gap-8">
            <div className="flex flex-col">
              <Link href="/artists" className={`text-xl transition ${isActivePage('/artists') ? 'text-blue-500' : 'text-gray-300 hover:text-gray-100'}`}>
                Исполнители
              </Link>
              <Link href="/artists/new" className={`pl-3 text-xs transition ${isFormActive('/artists') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}>
                └ + добавить
              </Link>
            </div>
            <div className="flex flex-col">
              <Link href="/albums" className={`text-xl transition ${isActivePage('/albums') ? 'text-blue-500' : 'text-gray-300 hover:text-gray-100'}`}>
                Альбомы
              </Link>
              <Link href="/albums/new" className={`pl-3 text-xs transition ${isFormActive('/albums') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'}`}>
                └ + добавить
              </Link>
            </div>
            <Link href="/tracks/new" className={`text-xl transition ${pathname === '/tracks/new' ? 'text-blue-500' : 'text-gray-300 hover:text-gray-100'}`}>
              Добавить трек
            </Link>
          </nav>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-200 text-2xl focus:outline-none"
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
        <nav className="flex flex-col justify-center h-full mx-auto gap-6" style={{ width: 'fit-content' }}>    
          <div className="flex flex-col">
            <Link href="/artists" className={`transition text-3xl ${isActivePage('/artists') ? 'text-blue-500 font-bold' : 'text-gray-300 hover:text-gray-100'}`} onClick={closeMenu}>
              Исполнители
            </Link>
            <Link href="/artists/new" className={`pl-4 text-xl transition ${isFormActive('/artists') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'}`} onClick={closeMenu} >
              └ + добавить
            </Link>
          </div>

          <div className="flex flex-col">
            <Link href="/albums" className={`transition text-3xl ${isActivePage('/albums') ? 'text-blue-500 font-bold' : 'text-gray-300 hover:text-gray-100'}`} onClick={closeMenu}>
              Альбомы
            </Link>
            <Link href="/albums/new" className={`pl-4 text-xl transition ${isFormActive('/albums') ? 'text-blue-500' : 'text-gray-400 hover:text-gray-200'}`} onClick={closeMenu}>
              └ + добавить
            </Link>
          </div>

          <Link href="/tracks/new" className={`transition text-2xl ${pathname === '/tracks/new' ? 'text-blue-500 font-bold' : 'text-gray-300 hover:text-gray-100'}`} onClick={closeMenu}>
            Добавить трек
          </Link>
        </nav>
      </div>
    </>
  );
}