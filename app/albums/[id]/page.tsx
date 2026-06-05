'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Album = {
  id: string;
  title: string;
  releaseYear: number;
  genre: string;
  artistId: string;
  coverPath: string | null;
  isStudio: boolean;
};

type Artist = {
  name: string;
};

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/albums/${params.id}`)
      .then(res => {
        if (!res.ok) throw new Error('Не найден');
        return res.json();
      })
      .then(async (albumData) => {
        setAlbum(albumData);
        const artistRes = await fetch(`/api/artists/${albumData.artistId}`);
        const artistData = await artistRes.json();
        setArtistName(artistData.name);
        setLoading(false);
      })
      .catch(() => {
        setError('Альбом не найден');
        setLoading(false);
      });
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Удалить альбом?')) return;
    const res = await fetch(`/api/albums/${params.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/albums');
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!album) return null;

  return (
    <div>
      <div>
        <h1>{album.title}</h1>
        <div>
          <Link href={`/albums/${album.id}/edit`}>✏️</Link>
          <button onClick={handleDelete}>🗑️</button>
        </div>
      </div>
      <p>Исполнитель: {artistName}</p>
      <p>Год: {album.releaseYear}</p>
      <p>Жанр: {album.genre}</p>
      <p>Тип: {album.isStudio ? 'Студийный' : 'Концертный'}</p>
      <Link href="/albums">← Назад к списку</Link>
    </div>
  );
}