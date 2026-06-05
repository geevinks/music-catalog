import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');
const COVERS_DIR = path.join(UPLOAD_DIR, 'covers');
const AUDIO_DIR = path.join(UPLOAD_DIR, 'audio');

async function ensureDirs() {
  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true });
  if (!existsSync(COVERS_DIR)) await mkdir(COVERS_DIR, { recursive: true });
  if (!existsSync(AUDIO_DIR)) await mkdir(AUDIO_DIR, { recursive: true });
}

export async function POST(request: NextRequest) {
  try {
    await ensureDirs();
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'Нет файла' }, { status: 400 });
    }
    
    const ext = file.name.split('.').pop();
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
    
    let savePath: string;
    let urlPath: string;
    
    if (type === 'cover') {
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Только изображения' }, { status: 400 });
      }
      savePath = path.join(COVERS_DIR, uniqueName);
      urlPath = `/uploads/covers/${uniqueName}`;
    } else if (type === 'audio') {
      if (!file.type.startsWith('audio/')) {
        return NextResponse.json({ error: 'Только аудио' }, { status: 400 });
      }
      savePath = path.join(AUDIO_DIR, uniqueName);
      urlPath = `/uploads/audio/${uniqueName}`;
    } else {
      return NextResponse.json({ error: 'Неверный тип' }, { status: 400 });
    }
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(savePath, buffer);
    
    return NextResponse.json({ success: true, path: urlPath });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Ошибка загрузки' }, { status: 500 });
  }
}