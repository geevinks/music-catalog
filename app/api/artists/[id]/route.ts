import { NextRequest, NextResponse } from 'next/server';
import { artists, albums, findArtist, updateArtist, deleteArtist } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = findArtist(id);
  if (!artist) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  const artistAlbums = albums.filter(a => a.artistId === id);
  return NextResponse.json({ ...artist, albums: artistAlbums });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const index = artists.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  
  const updated = { ...artists[index], ...body, updatedAt: new Date().toISOString() };
  updateArtist(index, updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = artists.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  deleteArtist(index);
  return NextResponse.json({ message: 'Удалено' });
}