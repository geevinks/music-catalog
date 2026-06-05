import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  return NextResponse.json({ items: [], total: 0, page: 1, pages: 0 });
}