'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Album = {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  artistName: string;
  artistId: string;
  coverPath: string | null;
};

type Artist = {
  id: string;
  name: string;
};

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [artistId, setArtistId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredAlbumId, setHoveredAlbumId] = useState<string | null>(null);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '5',
      ...(debouncedSearch && { search: debouncedSearch }),
      ...(artistId && { artistId })
    });
    
    const [albumsRes, artistsRes] = await Promise.all([
      fetch(`/api/albums?${params}`),
      fetch('/api/artists?limit=100')
    ]);
    
    const albumsData = await albumsRes.json();
    const artistsData = await artistsRes.json();
    
    setAlbums(albumsData.items);
    setTotalPages(albumsData.pages);
    setArtists(artistsData.items);
    setLoading(false);
  }, [page, debouncedSearch, artistId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteAlbum = async (id: string) => {
    setActiveAlbumId(id);
    setTimeout(async () => {
      if (!confirm('Удалить альбом?')) {
        setActiveAlbumId(null);
        return;
      }
      await fetch(`/api/albums/${id}`, { method: 'DELETE' });
      setActiveAlbumId(null);
      fetchData();
    }, 200);
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Альбомы</h1>
        <Link href="/albums/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ Новый</Link>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Поиск..."
          className="border p-2 rounded"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={artistId}
          onChange={e => { setArtistId(e.target.value); setPage(1); }}
        >
          <option value="">Все исполнители</option>
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {albums.map(album => {
          const isHovered = hoveredAlbumId === album.id;
          const isActive = activeAlbumId === album.id;
          
          return (
            <div key={album.id} className="relative rounded overflow-hidden bg-gray-200">
              <div
                className="absolute top-0 right-0 h-full pointer-events-none transition-all duration-300"
                style={{
                  width: isActive ? '100%' : (isHovered ? '50%' : '0%'),
                  background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(230,30,30) 100%)',
                }}
              />
              <div className="relative z-10 p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded flex items-center justify-center">
                  {album.coverPath ? (
                    <img src={album.coverPath} alt={album.title} className="w-full h-full object-cover rounded" />
                  ) : (
                    <img src="/logo.svg" alt="Logo" className="w-16 h-16 object-cover rounded" />
                  )}
                </div>
                <div className="flex-1">
                  <Link href={`/albums/${album.id}`} className="font-semibold text-blue-600">
                    {album.title}
                  </Link>
                  <p className="text-sm text-gray-600">{album.artistName} • {album.releaseYear} • {album.genre}</p>
                </div>
                <div className="space-x-2 flex">
                  <Link href={`/albums/${album.id}/edit`} className="w-8 h-8 rounded-lg border border-gray-300 bg-gray-200 flex items-center justify-center">
                    ✏️
                  </Link>
                  <button 
                    onMouseEnter={() => setHoveredAlbumId(album.id)}
                    onMouseLeave={() => setHoveredAlbumId(null)}
                    onClick={() => deleteAlbum(album.id)} 
                    className="w-8 h-8 rounded-lg border border-gray-300 bg-gray-200"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setPage(p => p-1)} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded">
            Назад
          </button>
          <span>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page >= totalPages} className="px-4 py-2 bg-gray-200 rounded">
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}