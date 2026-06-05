import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Music Catalog</h1>
        <p style={{ fontSize: '20px', color: '#666' }}>Каталог музыкальных исполнителей, альбомов и треков</p>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Link href="/artists" style={{ textDecoration: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', textAlign: 'center', display: 'block' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎤</div>
          <h2 style={{ marginBottom: '8px', color: '#333' }}>Исполнители</h2>
          <p style={{ color: '#666' }}>Просмотр, добавление и редактирование исполнителей</p>
        </Link>

        <Link href="/albums" style={{ textDecoration: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', textAlign: 'center', display: 'block' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💿</div>
          <h2 style={{ marginBottom: '8px', color: '#333' }}>Альбомы</h2>
          <p style={{ color: '#666' }}>Поиск, фильтрация и управление альбомами</p>
        </Link>

        <Link href="/tracks/new" style={{ textDecoration: 'none', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', textAlign: 'center', display: 'block' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎵</div>
          <h2 style={{ marginBottom: '8px', color: '#333' }}>Добавить трек</h2>
          <p style={{ color: '#666' }}>Загрузка новых треков в альбомы</p>
        </Link>
      </div>
    </div>
  );
}