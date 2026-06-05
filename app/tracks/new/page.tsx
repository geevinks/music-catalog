'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

type Album = {
  id: string;
  title: string;
};

export default function NewTrackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumIdParam = searchParams.get('albumId');
  
  const [albums, setAlbums] = useState<Album[]>([]);
  const [title, setTitle] = useState('');
  const [albumId, setAlbumId] = useState(albumIdParam || '');
  const [audioPath, setAudioPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/albums?limit=100')
      .then(res => res.json())
      .then(data => setAlbums(data.items));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!audioPath) {
      setError('URL аудиофайла обязателен');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, albumId, audioPath }),
    });

    if (res.ok) {
      router.push(`/albums/${albumId}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Добавить трек</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название трека *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Альбом *</label>
          <select
            required
            value={albumId}
            onChange={(e) => setAlbumId(e.target.value)}
          >
            <option value="">Выберите альбом</option>
            {albums.map(a => (
              <option key={a.id} value={a.id}>{a.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Путь к аудиофайлу *</label>
          <input
            type="text"
            required
            placeholder="/uploads/audio/song.mp3"
            value={audioPath}
            onChange={(e) => setAudioPath(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Добавление...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
}