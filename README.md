# 🎵 Music Catalog

> Каталог музыкальных исполнителей, альбомов и треков

---

## 📌 О проекте

Веб-приложение для управления музыкальной коллекцией.  
Позволяет добавлять, редактировать и удалять **исполнителей**, **альбомы** и **треки**, а также загружать обложки и аудиофайлы.

**Предметная область:** `Исполнитель` → `Альбом` → `Трек` (связь один-ко-многим)

---

## 🧠 Архитектура

**Вариант Б — Fullstack Next.js**

- Фронтенд + бэкенд в одном проекте
- API через Route Handlers (`app/api/`)
- Хранилище: in-memory + JSON-файл

✅ Нет проблем с CORS  
✅ Простой запуск  
✅ Легко расширяется

---

## 🛠 Технологии

| Назначение | Технология |
|------------|------------|
| Фреймворк | Next.js 14+ (App Router) |
| Язык | TypeScript |
| Стили | Tailwind CSS |
| API | Next.js Route Handlers |
| Хранилище | In-memory + JSON |
| Запросы | Fetch API |

---

## 🚀 Запуск

```bash
git clone https://github.com/geevinks/practica
cd music-catalog
npm install
npm run dev
Открой http://localhost:3000
```
---
## 📁 Сущности

Artist (Исполнитель) — id, name, country, birthYear, isActive

Album (Альбом) — id, title, releaseYear, genre, artistId, coverPath, isStudio

Track (Трек) — id, title, albumId, audioPath

Связи: Artist → Album → Track

## 📡 API

### Исполнители
GET /api/artists?page=1&limit=5 — список

GET /api/artists/:id — один исполнитель + его альбомы

POST /api/artists — создать

PATCH /api/artists/:id — обновить

DELETE /api/artists/:id — удалить

### Альбомы
GET /api/albums?page=1&search=&artistId= — список (пагинация, поиск, фильтр)

GET /api/albums/:id — один альбом

POST /api/albums — создать

PATCH /api/albums/:id — обновить

DELETE /api/albums/:id — удалить

### Треки
GET /api/tracks?albumId=:id — треки альбома

POST /api/tracks — создать

DELETE /api/tracks/:id — удалить

### Загрузка файлов
POST /api/upload — обложки (image/) и аудио (audio/)

## 📸 Скриншоты

## ✨ Дополнительно (бонусы)

💾 Сохранение в JSON (данные не теряются)

🖼 Загрузка обложек и аудио

🖱 Drag & Drop для файлов

📱 Адаптивный дизайн (бургер-меню)

## 👤 Автор
Смехов Артём Иванович
Группа ИСП-9.19 | Специальность 09.02.07