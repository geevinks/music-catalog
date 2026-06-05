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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px' }}>Альбомы</h1>
        <Link href="/albums/new" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' }}>
          + Новый альбом
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
        />
        <select
          value={artistId}
          onChange={e => { setArtistId(e.target.value); setPage(1); }}
          style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
        >
          <option value="">Все исполнители</option>
          {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {albums.map(album => (
          <div key={album.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link href={`/albums/${album.id}`} style={{ fontSize: '18px', fontWeight: 'bold', textDecoration: 'none', color: '#3b82f6' }}>
                {album.title}
              </Link>
              <p style={{ color: '#666', marginTop: '4px' }}>{album.artistName} • {album.releaseYear} • {album.genre}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/albums/${album.id}/edit`} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', textDecoration: 'none', color: '#333' }}>
                ✏️
              </Link>
              <button onClick={() => deleteAlbum(album.id)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '24px' }}>
          <button onClick={() => setPage(p => p-1)} disabled={page === 1} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
            Назад
          </button>
          <span style={{ padding: '8px 16px' }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => p+1)} disabled={page >= totalPages} style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
            Вперёд
          </button>
        </div>
      )}
    </div>
  );
}