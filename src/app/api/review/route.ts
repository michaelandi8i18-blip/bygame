import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');

  // In production, fetch from database
  const reviews = [
    {
      id: 'rev-seed-1',
      userName: 'GamerKu',
      userAvatar: '🎮',
      gameId: 'mlbb',
      gameName: 'Mobile Legends: Bang Bang',
      rating: 5,
      comment: 'Top up cepat banget! Diamond langsung masuk kurang dari 1 menit.',
      createdAt: '2026-04-10T08:00:00Z',
    },
    {
      id: 'rev-seed-2',
      userName: 'ProPlayer',
      userAvatar: '🎯',
      gameId: 'pubgm',
      gameName: 'PUBG Mobile',
      rating: 5,
      comment: 'Harga termurah! Udah langganan dari dulu.',
      createdAt: '2026-04-09T14:30:00Z',
    },
  ];

  let filtered = reviews;
  if (gameId) {
    filtered = reviews.filter((r) => r.gameId === gameId);
  }

  return NextResponse.json({ success: true, data: filtered });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { purchaseId, rating, comment } = body;

    if (!purchaseId || !rating || rating < 1 || rating > 5 || !comment) {
      return NextResponse.json({ success: false, message: 'Invalid review data' }, { status: 400 });
    }

    // In production: save to database, add Rp 100 balance
    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully',
      data: { bonusBalance: 100 },
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
