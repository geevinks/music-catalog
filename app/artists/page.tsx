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
      <div>
        <h1>Исполнители</h1>
        <Link href="/artists/new">+ Новый</Link>
      </div>
      <div>
        {artists.map(artist => (
          <div key={artist.id}>
            <div>
              <Link href={`/artists/${artist.id}`}>{artist.name}</Link>
              <p>{artist.country}</p>
            </div>
            <div>
              <Link href={`/artists/${artist.id}/edit`}>✏️</Link>
              <button onClick={() => deleteArtist(artist.id)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}