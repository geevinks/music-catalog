import { Artist, Album } from './types';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

const seedArtists: Omit<Artist, 'createdAt' | 'updatedAt'>[] = [
  { id: '1', name: 'SHAMAN', country: 'Россия', birthYear: 1991, isActive: true },
  { id: '2', name: 'Любэ', country: 'Россия', birthYear: 1989, isActive: true },
  { id: '3', name: 'Олег Газманов', country: 'Россия', birthYear: 1951, isActive: true },
  { id: '4', name: 'Григорий Лепс', country: 'Россия', birthYear: 1962, isActive: true },
  { id: '5', name: 'Полина Гагарина', country: 'Россия', birthYear: 1987, isActive: true },
];

const seedAlbums: Omit<Album, 'createdAt' | 'updatedAt'>[] = [
  { id: '1', title: 'Сделано в России', releaseYear: 2023, genre: 'Pop', artistId: '1', coverPath: null, isStudio: true },
  { id: '2', title: 'Эскадрон', releaseYear: 1991, genre: 'Pop', artistId: '3', coverPath: null, isStudio: true },
  { id: '3', title: 'Комбат', releaseYear: 1995, genre: 'Rock', artistId: '2', coverPath: null, isStudio: true },
  { id: '4', title: 'Давай за...', releaseYear: 1998, genre: 'Rock', artistId: '2', coverPath: null, isStudio: true },
  { id: '5', title: 'Сделай шаг', releaseYear: 2002, genre: 'Pop', artistId: '4', coverPath: null, isStudio: true },
];

export let artists: Artist[] = [];
export let albums: Album[] = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      artists = data.artists || [];
      albums = data.albums || [];
    }
  } catch (e) {}
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ artists, albums }, null, 2));
}

export function initStore() {
  loadData();
  if (artists.length === 0) {
    const now = new Date().toISOString();
    artists = seedArtists.map(a => ({ ...a, createdAt: now, updatedAt: now }));
    albums = seedAlbums.map(a => ({ ...a, createdAt: now, updatedAt: now }));
    saveData();
  }
}

// CRUD для исполнителей
export const addArtist = (a: Artist) => { artists.push(a); saveData(); };
export const updateArtist = (i: number, a: Artist) => { artists[i] = a; saveData(); };
export const deleteArtist = (i: number) => { artists.splice(i, 1); saveData(); };
export const findArtist = (id: string) => artists.find(a => a.id === id);

// CRUD для альбомов
export const addAlbum = (a: Album) => { albums.push(a); saveData(); };
export const updateAlbum = (i: number, a: Album) => { albums[i] = a; saveData(); };
export const deleteAlbum = (i: number) => { albums.splice(i, 1); saveData(); };
export const findAlbum = (id: string) => albums.find(a => a.id === id);

initStore();