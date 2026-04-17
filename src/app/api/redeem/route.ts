import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/data/games';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let filtered = [...games];
  if (category && category !== 'all') {
    filtered = filtered.filter((game) => game.category === category);
  }
  if (search.trim()) {
    const query = search.toLowerCase().trim();
    filtered = filtered.filter(
      (game) =>
        game.name.toLowerCase().includes(query) ||
        game.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        game.description.toLowerCase().includes(query)
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  return NextResponse.json({
    success: true,
    data: paginated,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
