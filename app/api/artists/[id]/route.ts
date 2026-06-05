import { NextRequest, NextResponse } from 'next/server';
import { artists, findArtist, deleteArtist } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = findArtist(id);
  if (!artist) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  return NextResponse.json(artist);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = artists.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  deleteArtist(index);
  return NextResponse.json({ message: 'Удалено' });
}