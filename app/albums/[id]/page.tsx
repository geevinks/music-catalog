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

type Track = {
  id: string;
  title: string;
  audioPath: string;
};

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const albumRes = await fetch(`/api/albums/${params.id}`);
      if (!albumRes.ok) throw new Error('Не найден');
      const albumData = await albumRes.json();
      setAlbum(albumData);
      
      const artistRes = await fetch(`/api/artists/${albumData.artistId}`);
      const artistData = await artistRes.json();
      setArtistName(artistData.name);
      
      const tracksRes = await fetch(`/api/tracks?albumId=${params.id}`);
      const tracksData = await tracksRes.json();
      setTracks(tracksData);
      
      setLoading(false);
    } catch {
      setError('Альбом не найден');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [params.id]);

  const handleDeleteAlbum = async () => {
    if (!confirm('Удалить альбом?')) return;
    const res = await fetch(`/api/albums/${params.id}`, { method: 'DELETE' });
    if (res.ok) router.push('/albums');
  };

  const handleDeleteTrack = async (trackId: string) => {
    if (!confirm('Удалить трек?')) return;
    await fetch(`/api/tracks/${trackId}`, { method: 'DELETE' });
    loadData();
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
          <button onClick={handleDeleteAlbum}>🗑️</button>
        </div>
      </div>
      
      {album.coverPath && <img src={album.coverPath} alt={album.title} style={{ width: '200px' }} />}
      
      <p>Исполнитель: {artistName}</p>
      <p>Год: {album.releaseYear}</p>
      <p>Жанр: {album.genre}</p>
      <p>Тип: {album.isStudio ? 'Студийный' : 'Концертный'}</p>
      
      <div>
        <h2>Треки</h2>
        <Link href={`/tracks/new?albumId=${album.id}`}>+ Добавить трек</Link>
        
        {tracks.length === 0 ? (
          <p>Нет треков</p>
        ) : (
          <div>
            {tracks.map((track, idx) => (
              <div key={track.id} style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{idx + 1}. {track.title}</span>
                  <button onClick={() => handleDeleteTrack(track.id)}>🗑️</button>
                </div>
                {track.audioPath && (
                  <audio controls src={track.audioPath} style={{ width: '100%', marginTop: '8px' }}>
                    <source src={track.audioPath} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Link href="/albums">← Назад к списку</Link>
    </div>
  );
}