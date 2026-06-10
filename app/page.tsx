import HomeCard from '@/app/components/HomeCard';

export default function HomePage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto py-12 md:py-20 flex flex-col items-center justify-center text-center px-4 bg-black/60 rounded-2xl">
        <h1 className="text-3xl md:text-6xl font-bold mb-4 md:mb-6 text-white">
          Музыкальный каталог
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl">
          Управляйте коллекцией исполнителей, альбомов и треков
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4 mt-8">
        <HomeCard
          href="/artists"
          title="Исполнители"
          description="Просмотр, добавление и редактирование"
          bgImage="/artists-bg.jpg"
          showPlus={true}
          addLabel="исполнителя"
        />
        <HomeCard
          href="/albums"
          title="Альбомы"
          description="С обложками, поиском и фильтрацией"
          bgImage="/albums-bg.jpg"
          showPlus={true}
          addLabel="альбом"
        />
        <HomeCard
          href="/tracks/new"
          title="Добавить трек"
          description="Загрузите новый трек в альбом"
          bgImage="/tracks-bg.jpg"
          addLabel="трек"
        />
      </div>
    </div>
  );
}