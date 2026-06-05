'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Artist = {
  id: string;
  name: string;
  country: string;
  birthYear: number | null;
  isActive: boolean;
};

export default function ArtistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/artists/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Не найден');
        return res.json();
      })
      .then(setArtist)
      .catch(() => setError('Исполнитель не найден'))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Удалить исполнителя?')) return;
    const res = await fetch(`/api/artists/${params.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/artists');
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!artist) return null;

  return (
    <div>
      <div>
        <h1>{artist.name}</h1>
        <div>
          <Link href={`/artists/${artist.id}/edit`}>✏️</Link>
          <button onClick={handleDelete}>🗑️</button>
        </div>
      </div>
      <p>Страна: {artist.country}</p>
      <p>Год основания: {artist.birthYear || '—'}</p>
      <p>Статус: {artist.isActive ? 'Активен' : 'Не активен'}</p>
      <Link href="/artists">← Назад к списку</Link>
    </div>
  );
}