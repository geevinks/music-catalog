'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';

type Artist = {
  id: string;
  name: string;
};

export default function NewAlbumPage() {
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState(new Date().getFullYear());
  const [genre, setGenre] = useState('');
  const [artistId, setArtistId] = useState('');
  const [isStudio, setIsStudio] = useState(true);
  const [coverPath, setCoverPath] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/artists?limit=100')
      .then(res => res.json())
      .then(data => setArtists(data.items));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        releaseYear: Number(releaseYear),
        genre,
        artistId,
        isStudio,
        coverPath: coverPath || null,
      }),
    });

    if (res.ok) {
      router.push('/albums');
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Новый альбом</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название *</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Год выпуска *</label>
          <input type="number" required value={releaseYear} onChange={(e) => setReleaseYear(Number(e.target.value))} />
        </div>
        <div>
          <label>Жанр *</label>
          <input type="text" required value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div>
          <label>Исполнитель *</label>
          <select required value={artistId} onChange={(e) => setArtistId(e.target.value)}>
            <option value="">Выберите</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label>Обложка</label>
          <FileUpload type="cover" onUpload={setCoverPath} />
          {coverPath && <img src={coverPath} alt="Обложка" style={{ width: '100px', marginTop: '8px' }} />}
        </div>
        <div>
          <label>
            <input type="checkbox" checked={isStudio} onChange={(e) => setIsStudio(e.target.checked)} />
            Студийный альбом
          </label>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>
    </div>
  );
}