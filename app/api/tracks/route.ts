import { NextRequest, NextResponse } from 'next/server';
import { tracks, addTrack, findAlbum } from '@/lib/store';
import crypto from 'crypto';

export async function GET(req: NextRequest) {
  const albumId = req.nextUrl.searchParams.get('albumId');
  const filtered = albumId ? tracks.filter(t => t.albumId === albumId) : tracks;
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  
  if (!body.title || !body.albumId || !body.audioPath) {
    return NextResponse.json({ error: 'Все поля обязательны' }, { status: 422 });
  }
  
  if (!findAlbum(body.albumId)) {
    return NextResponse.json({ error: 'Альбом не найден' }, { status: 422 });
  }
  
  const newTrack = {
    id: crypto.randomUUID(),
    title: body.title,
    albumId: body.albumId,
    audioPath: body.audioPath,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  addTrack(newTrack);
  return NextResponse.json(newTrack, { status: 201 });
}