import { NextRequest, NextResponse } from 'next/server';
import { albums, findAlbum, updateAlbum, deleteAlbum } from '@/lib/store';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const album = findAlbum(id);
  if (!album) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  return NextResponse.json(album);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  
  const updated = { ...albums[index], ...body, updatedAt: new Date().toISOString() };
  updateAlbum(index, updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = albums.findIndex(a => a.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  deleteAlbum(index);
  return NextResponse.json({ message: 'Удалено' });
}