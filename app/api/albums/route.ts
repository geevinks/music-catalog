import { NextRequest, NextResponse } from 'next/server';
import { albums, findArtist } from '@/lib/store';

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