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
  isStudio: boolean;
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
  const [artistId, setArtistId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '5',
      ...(search && { search }),
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
  }, [page, search, artistId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const deleteAlbum = async (id: string) => {
    if (!confirm('Удалить альбом?')) return;
    await fetch(`/api/albums/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div>
        <h1>Альбомы</h1>
        <Link href="/albums/new">+ Новый</Link>
      </div>

      <div>
        <input
          type="text"
          placeholder="Поиск..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          value={artistId}
          onChange={e => { setArtistId(e.target.value); setPage(1); }}
        >
          <option value="">Все исполнители</option>
          {artists.map(a => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      <div>
        {albums.map(album => (
          <div key={album.id}>
            <div>
              <Link href={`/albums/${album.id}`}>
                {album.title}
              </Link>
              <p>{album.artistName} • {album.releaseYear} • {album.genre}</p>
            </div>
            <div>
              <Link href={`/albums/${album.id}/edit`}>✏️</Link>
              <button onClick={() => deleteAlbum(album.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div>
          <button onClick={() => setPage(p => p-1)} disabled={page === 1}>
            Назад
          </button>
          <span>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page >= totalPages}>
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}