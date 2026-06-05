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

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Редактирование альбома</h1>
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
          <FileUpload type="cover" onUpload={setCoverPath} label="Заменить обложку" />
          {(coverPath || existingCover) && (
            <img src={coverPath || existingCover} alt="Обложка" style={{ width: '100px', marginTop: '8px' }} />
          )}
        </div>
        <div>
          <label>
            <input type="checkbox" checked={isStudio} onChange={(e) => setIsStudio(e.target.checked)} />
            Студийный альбом
          </label>
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}