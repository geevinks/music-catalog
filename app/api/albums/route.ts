import { NextRequest, NextResponse } from 'next/server';
import { albums, addAlbum, findArtist } from '@/lib/store';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';
  const artistId = searchParams.get('artistId') || '';
  
  let filtered = albums.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    const matchArtist = !artistId || a.artistId === artistId;
    return matchSearch && matchArtist;
  });
  
  const itemsWithArtist = filtered.map(a => ({
    ...a,
    artistName: findArtist(a.artistId)?.name || 'Unknown'
  }));
  
  const items = itemsWithArtist.slice((page - 1) * limit, page * limit);
  
  return NextResponse.json({
    items,
    total: filtered.length,
    page,
    pages: Math.ceil(filtered.length / limit)
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (!body.title || !body.releaseYear || !body.genre || !body.artistId) {
    return NextResponse.json({ error: 'Все поля обязательны' }, { status: 422 });
  }
  
  if (!findArtist(body.artistId)) {
    return NextResponse.json({ error: 'Исполнитель не найден' }, { status: 422 });
  }
  
  const newAlbum = {
    id: crypto.randomUUID(),
    title: body.title,
    releaseYear: body.releaseYear,
    genre: body.genre,
    artistId: body.artistId,
    coverPath: body.coverPath || null,
    isStudio: body.isStudio ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  addAlbum(newAlbum);
  return NextResponse.json(newAlbum, { status: 201 });
}