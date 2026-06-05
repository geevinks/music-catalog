'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';

type Artist = {
  id: string;
  name: string;
};

export default function EditAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState(2000);
  const [genre, setGenre] = useState('');
  const [artistId, setArtistId] = useState('');
  const [isStudio, setIsStudio] = useState(true);
  const [coverPath, setCoverPath] = useState('');
  const [existingCover, setExistingCover] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/artists?limit=100').then(res => res.json()),
      fetch(`/api/albums/${params.id}`).then(res => res.json())
    ]).then(([artistsData, albumData]) => {
      setArtists(artistsData.items);
      setTitle(albumData.title);
      setReleaseYear(albumData.releaseYear);
      setGenre(albumData.genre);
      setArtistId(albumData.artistId);
      setIsStudio(albumData.isStudio);
      setExistingCover(albumData.coverPath || '');
      setLoading(false);
    }).catch(() => setError('Ошибка загрузки'));
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const res = await fetch(`/api/albums/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        releaseYear: Number(releaseYear),
        genre,
        artistId,
        isStudio,
        coverPath: coverPath || existingCover || null,
      }),
    });

    if (res.ok) {
      router.push(`/albums/${params.id}`);
    } else {
      const data = await res.json();
      setError(data.error || 'Ошибка');
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Редактирование альбома</h1>
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
          <FileUpload type="cover" onUpload={setCoverPath} label="Заменить обложку" />
          {(coverPath || existingCover) && (
            <img src={coverPath || existingCover} alt="Обложка" className="w-24 h-24 object-cover rounded mt-2" />
          )}
        </div>
        <div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isStudio} onChange={e => setIsStudio(e.target.checked)} />
            Студийный альбом
          </label>
        </div>
        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}