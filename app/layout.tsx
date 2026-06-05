import './globals.css';
import Navigation from '@/app/components/Navigation';

export const metadata = {
  title: 'Music Catalog',
  description: 'Каталог музыкальных исполнителей и альбомов',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Navigation />
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 40px' }}>
          {children}
        </main>
      </body>
    </html>
  );
}