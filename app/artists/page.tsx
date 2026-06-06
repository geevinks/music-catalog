'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

type Artist = { id: string; name: string; country: string; birthYear: number | null; isActive: boolean };

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hoveredArtistId, setHoveredArtistId] = useState<string | null>(null);
  const [activeArtistId, setActiveArtistId] = useState<string | null>(null);

  const fetchArtists = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/artists?page=${page}&limit=5`);
    const data = await res.json();
    setArtists(data.items);
    setTotalPages(data.pages);
    setLoading(false);
  }, [page]);

  useEffect(() => { fetchArtists(); }, [fetchArtists]);

  const deleteArtist = async (id: string) => {
    setActiveArtistId(id);
    setTimeout(async () => {
      if (!confirm('Удалить исполнителя?')) {
        setActiveArtistId(null);
        return;
      }
      await fetch(`/api/artists/${id}`, { method: 'DELETE' });
      setActiveArtistId(null);
      fetchArtists();
    }, 200);
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Исполнители</h1>
        <Link href="/artists/new" className="bg-blue-600 text-white px-4 py-2 rounded">+ Новый</Link>
      </div>

      <div className="space-y-3">
        {artists.map(artist => {
          const isHovered = hoveredArtistId === artist.id;
          const isActive = activeArtistId === artist.id;
          
          return (
            <div 
              key={artist.id} 
              className="relative rounded overflow-hidden bg-gray-200"
            >
              {/* Красная плашка справа */}
              <div
                className="absolute top-0 right-0 h-full pointer-events-none transition-all duration-300"
                style={{
                  width: isActive ? '100%' : (isHovered ? '50%' : '0%'),
                  background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(230,30,30) 100%)',
                }}
              />
              
              <div className="relative z-10 p-4 flex justify-between items-center">
                <div>
                  <Link href={`/artists/${artist.id}`} className="text-xl font-semibold text-blue-600">{artist.name}</Link>
                  <p className="text-gray-600">{artist.country} • {artist.isActive ? 'Активен' : 'Не активен'}</p>
                </div>
                <div className="space-x-2 flex">
                  <Link href={`/artists/${artist.id}/edit`} className="w-8 h-8 rounded-lg border-gray-300 border bg-gray-200 flex items-center justify-center hover:bg-gray-300 duration-200">✏️</Link>
                  <button 
                    onMouseEnter={() => setHoveredArtistId(artist.id)}
                    onMouseLeave={() => setHoveredArtistId(null)}
                    onClick={() => deleteArtist(artist.id)} 
                    className="w-8 h-8 rounded-lg border-gray-300 border bg-gray-200"
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
          <button onClick={() => setPage(p => p-1)} disabled={page===1} className="px-4 py-2 bg-gray-200 rounded text-gray-600">Назад</button>
          <span>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page>=totalPages} className="px-4 py-2 bg-gray-200 rounded text-gray-600">Вперёд</button>
        </div>
      )}
    </div>
  );
}