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
        <main className="container mx-auto px-4 py-16">
          {children}
        </main>
      </body>
    </html>
  );
}