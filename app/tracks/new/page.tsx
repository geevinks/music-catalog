'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import FileUpload from '@/app/components/FileUpload';

export default function NewTrackPage() {
  const router = useRouter();
  const albumId = useSearchParams().get('albumId');
  const [albums, setAlbums] = useState<{ id: string; title: string }[]>([]);
  const [title, setTitle] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(albumId || '');
  const [audioPath, setAudioPath] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/albums?limit=100').then(res => res.json()).then(data => setAlbums(data.items));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioPath) return alert('Загрузите аудио');
    setLoading(true);
    const res = await fetch('/api/tracks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, albumId: selectedAlbum, audioPath }),
    });
    if (res.ok) router.push(`/albums/${selectedAlbum}`);
    else alert('Ошибка');
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Добавить трек</h1>
      <form onSubmit={submit} className="bg-white rounded-lg shadow p-6 space-y-4">
        <input type="text" placeholder="Название трека" required className="w-full border p-2 rounded"
          value={title} onChange={e => setTitle(e.target.value)} />
        <select required className="w-full border p-2 rounded" value={selectedAlbum} onChange={e => setSelectedAlbum(e.target.value)}>
          <option value="">Выберите альбом</option>
          {albums.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
        
        <FileUpload type="audio" onUpload={setAudioPath} label="Загрузить MP3"/>
        
        {audioPath && <audio controls src={audioPath} className="w-full" />}
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {loading ? 'Добавление...' : 'Добавить'}
        </button>
      </form>
    </div>
  );
}