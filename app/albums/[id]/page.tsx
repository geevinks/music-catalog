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
  const [hoveredTrackId, setHoveredTrackId] = useState<string | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);

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
    await fetch(`/api/albums/${params.id}`, { method: 'DELETE' });
    router.push('/albums');
  };

  const deleteTrack = async (trackId: string) => {
    setActiveTrackId(trackId);
    setTimeout(async () => {
      if (!confirm('Удалить трек?')) {
        setActiveTrackId(null);
        return;
      }
      await fetch(`/api/tracks/${trackId}`, { method: 'DELETE' });
      setActiveTrackId(null);
      loadData();
    }, 200);
  };

  if (loading) return <div className="text-center py-10">Загрузка...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!album) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{album.title}</h1>
          <div className="flex rounded overflow-hidden">
            <Link href={`/albums/${album.id}/edit`} className="bg-yellow-500 w-10 h-10 flex items-center justify-center">
              ✏️
            </Link>
            <button onClick={handleDeleteAlbum} className="bg-red-600 w-10 h-10 flex items-center justify-center">
              🗑️
            </button>
          </div>
        </div>
        
        {album.coverPath && (
          <img src={album.coverPath} alt={album.title} className="w-48 h-48 object-cover rounded mx-auto mb-4" />
        )}
        
        <div className="space-y-2">
          <p><strong>Исполнитель:</strong> {artistName}</p>
          <p><strong>Год:</strong> {album.releaseYear}</p>
          <p><strong>Жанр:</strong> {album.genre}</p>
          <p><strong>Тип:</strong> {album.isStudio ? 'Студийный' : 'Концертный'}</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Треки</h2>
            <Link href={`/tracks/new?albumId=${album.id}`} className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
              + Добавить трек
            </Link>
          </div>
          
          {tracks.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Нет треков</p>
          ) : (
            <div className="space-y-2">
              {tracks.map((track, idx) => {
                const isHovered = hoveredTrackId === track.id;
                const isActive = activeTrackId === track.id;
                
                return (
                  <div key={track.id} className="relative rounded-xl overflow-hidden bg-gray-200">
                    <div
                      className="absolute top-0 right-0 h-full pointer-events-none transition-all duration-300"
                      style={{
                        width: isActive ? '100%' : (isHovered ? '50%' : '0%'),
                        background: 'linear-gradient(90deg, rgba(0,0,0,0) 0%, rgb(230,30,30) 100%)',
                      }}
                    />
                    <div className="relative z-10 py-3">
                      <div className="flex justify-between items-center px-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-500">{idx + 1}</span>
                          <span className="font-medium text-gray-800">{track.title}</span>
                        </div>
                        <button 
                          onMouseEnter={() => setHoveredTrackId(track.id)}
                          onMouseLeave={() => setHoveredTrackId(null)}
                          onClick={() => deleteTrack(track.id)} 
                          className="w-8 h-8 rounded-lg border border-gray-300 bg-gray-200"
                        >
                          🗑️
                        </button>
                      </div>
                      <audio 
                        controls 
                        className="w-full h-8"
                        src={track.audioPath}
                      >
                        <source src={track.audioPath} type="audio/mpeg" />
                      </audio>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <Link href="/albums" className="text-blue-600 mt-4 inline-block">← Назад к списку</Link>
      </div>
    </div>
  );
}