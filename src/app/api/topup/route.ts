import { NextRequest, NextResponse } from 'next/server';
import { games } from '@/data/games';

// POST /api/topup - Create a topup order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, itemId, userId, serverId, paymentMethod, quantity = 1 } = body;

    // Validation
    if (!gameId || !itemId || !userId || !paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: gameId, itemId, userId, paymentMethod',
        },
        { status: 400 }
      );
    }

    // Find game and item
    const game = games.find((g) => g.id === gameId);
    if (!game) {
      return NextResponse.json(
        { success: false, message: 'Game not found' },
        { status: 404 }
      );
    }

    const item = game.items.find((i) => i.id === itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    // Generate order ID
    const orderId = `BY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const totalPrice = item.price * quantity;

    // In production, you would:
    // 1. Save order to database
    // 2. Validate user ID with game server
    // 3. Queue the order for processing

    const order = {
      orderId,
      gameId: game.id,
      gameName: game.name,
      gameImage: game.image,
      itemId: item.id,
      itemName: item.name,
      userId,
      serverId: serverId || null,
      quantity,
      paymentMethod,
      totalPrice,
      status: 'pending',
      estimatedDelivery: '1-5 menit',
      createdAt: new Date().toISOString(),
    };

    // Simulate saving to database
    console.log('[BYgame] New topup order created:', orderId);

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    console.error('[BYgame] Error creating topup order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
