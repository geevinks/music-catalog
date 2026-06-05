import { Artist } from './types';
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

export let artists: Artist[] = [];

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      artists = data.artists || [];
    }
  } catch (e) {}
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ artists }, null, 2));
}

export function initStore() {
  loadData();
  if (artists.length === 0) {
    const now = new Date().toISOString();
    artists = seedArtists.map(a => ({ ...a, createdAt: now, updatedAt: now }));
    saveData();
  }
}

export const addArtist = (a: Artist) => { artists.push(a); saveData(); };
export const updateArtist = (i: number, a: Artist) => { artists[i] = a; saveData(); };
export const deleteArtist = (i: number) => { artists.splice(i, 1); saveData(); };
export const findArtist = (id: string) => artists.find(a => a.id === id);

initStore();