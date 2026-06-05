import { NextRequest, NextResponse } from 'next/server';
import { tracks, deleteTrack } from '@/lib/store';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = tracks.findIndex(t => t.id === id);
  if (index === -1) return NextResponse.json({ error: 'Не найден' }, { status: 404 });
  deleteTrack(index);
  return NextResponse.json({ message: 'Удалено' });
}