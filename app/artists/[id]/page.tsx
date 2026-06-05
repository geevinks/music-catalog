'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Album {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  isStudio: boolean;
  coverPath: string | null;
}

interface Artist {
  id: string;
  name: string;
  country: string;
  birthYear: number | null;
  isActive: boolean;
  albums: Album[];
}

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hoveredAlbumId, setHoveredAlbumId] = useState<string | null>(null);
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null);

  const loadArtist = async () => {
    try {
      const res = await fetch(`/api/artists/${params.id}`);
      if (!res.ok) throw new Error('Не найден');
      const data = await res.json();
      setArtist(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtist();
  }, [params.id]);

  const handleDeleteArtist = async () => {
    if (!confirm('Удалить исполнителя?')) return;
    const res = await fetch(`/api/artists/${params.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/artists');
    else alert('Ошибка');
  };

  const deleteAlbum = async (albumId: string) => {
    setActiveAlbumId(albumId);
    setTimeout(async () => {
      if (!confirm('Удалить альбом?')) {
        setActiveAlbumId(null);
        return;
      }
      await fetch(`/api/albums/${albumId}`, { method: 'DELETE' });
      setActiveAlbumId(null);
      loadArtist();
    }, 200);
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!artist) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{artist.name}</h1>
          <div className="flex rounded overflow-hidden">
            <Link
              href={`/artists/${artist.id}/edit`}
              className="bg-yellow-500 w-10 h-10 flex items-center justify-center"
            >
              ✏️
            </Link>
            <button
              onClick={handleDeleteArtist}
              className="bg-red-600 w-10 h-10 flex items-center justify-center"
            >
              🗑️
            </button>
          </div>
        </div>
        <p><span className="font-semibold">Страна:</span> {artist.country}</p>
        <p><span className="font-semibold">Год основания:</span> {artist.birthYear || '—'}</p>
        <p><span className="font-semibold">Статус:</span> {artist.isActive ? 'Активен' : 'Не активен'}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Альбомы</h2>
          <Link href={`/albums/new?artistId=${artist.id}`} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
            + Добавить альбом
          </Link>
        </div>
        {artist.albums.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Нет альбомов</p>
        ) : (
          <div className="grid gap-3">
            {artist.albums.map(album => {
              const isHovered = hoveredAlbumId === album.id;
              const isActive = activeAlbumId === album.id;
              
              return (
                <div
                  key={album.id}
                  className="relative rounded overflow-hidden bg-gray-200"
                >
                  <div
                    className="absolute top-0 right-0 h-full pointer-events-none transition-all duration-300"
                    style={{
                      width: isActive ? '100%' : (isHovered ? '50%' : '0%'),
                      background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(230,30,30) 100%)',
                    }}
                  />
                  
                  <div className="relative z-10 p-3 flex items-center gap-3">
                    {album.coverPath ? (
                      <img src={album.coverPath} alt={album.title} className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <img src="/logo.svg" alt="Logo" className="w-12 h-12 object-cover rounded" />
                    )}
                    <div className="flex-1">
                      <Link href={`/albums/${album.id}`} className="font-semibold text-blue-600 hover:underline">
                        {album.title}
                      </Link>
                      <p className="text-sm text-gray-600">{album.releaseYear} • {album.genre}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/albums/${album.id}/edit`}
                        className="w-8 h-8 rounded-lg border-gray-300 border bg-gray-200 flex items-center justify-center hover:bg-gray-300 duration-200"
                      >
                        ✏️
                      </Link>
                      <button
                        onMouseEnter={() => setHoveredAlbumId(album.id)}
                        onMouseLeave={() => setHoveredAlbumId(null)}
                        onClick={() => deleteAlbum(album.id)}
                        className="w-8 h-8 rounded-lg border-gray-300 border bg-gray-200 flex items-center justify-center"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}