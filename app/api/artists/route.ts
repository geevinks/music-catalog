import { NextRequest, NextResponse } from 'next/server';
import { artists } from '@/lib/store';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  
  let filtered = artists;
  if (search) {
    filtered = artists.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  }
  
  const items = filtered.slice((page - 1) * limit, page * limit);
  
  return NextResponse.json({
    items,
    total: filtered.length,
    page,
    pages: Math.ceil(filtered.length / limit)
  });
}