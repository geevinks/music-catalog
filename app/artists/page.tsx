'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type Artist = {
  id: string;
  name: string;
  country: string;
  isActive: boolean;
};

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchArtists = async () => {
    const res = await fetch('/api/artists');
    const data = await res.json();
    setArtists(data.items);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const deleteArtist = async (id: string) => {
    if (!confirm('Удалить исполнителя?')) return;
    await fetch(`/api/artists/${id}`, { method: 'DELETE' });
    fetchArtists();
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px' }}>Исполнители</h1>
        <Link href="/artists/new" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none' }}>
          + Новый исполнитель
        </Link>
      </div>

      <div style={{ display: 'grid', gap: '16px' }}>
        {artists.map(artist => (
          <div key={artist.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link href={`/artists/${artist.id}`} style={{ fontSize: '20px', fontWeight: 'bold', textDecoration: 'none', color: '#3b82f6' }}>
                {artist.name}
              </Link>
              <p style={{ color: '#666', marginTop: '4px' }}>{artist.country} • {artist.isActive ? 'Активен' : 'Не активен'}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link href={`/artists/${artist.id}/edit`} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', textDecoration: 'none', color: '#333' }}>
                ✏️
              </Link>
              <button onClick={() => deleteArtist(artist.id)} style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}