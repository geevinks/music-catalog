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
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Новый альбом</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="block font-medium mb-1">Название *</label>
          <input type="text" required className="w-full border p-2 rounded" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block font-medium mb-1">Год выпуска *</label>
          <input type="number" required className="w-full border p-2 rounded" value={releaseYear} onChange={e => setReleaseYear(Number(e.target.value))} />
        </div>
        <div>
          <label className="block font-medium mb-1">Жанр *</label>
          <input type="text" required className="w-full border p-2 rounded" value={genre} onChange={e => setGenre(e.target.value)} />
        </div>
        <div>
          <label className="block font-medium mb-1">Исполнитель *</label>
          <select required className="w-full border p-2 rounded" value={artistId} onChange={e => setArtistId(e.target.value)}>
            <option value="">Выберите</option>
            {artists.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Обложка</label>
          <FileUpload type="cover" onUpload={setCoverPath} />
          {coverPath && <img src={coverPath} alt="Обложка" className="w-24 h-24 object-cover rounded mt-2" />}
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isStudio} onChange={e => setIsStudio(e.target.checked)} />
            Студийный альбом
          </label>
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {loading ? 'Создание...' : 'Создать'}
        </button>
      </form>
    </div>
  );
}