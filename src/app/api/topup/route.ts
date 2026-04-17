import { NextRequest, NextResponse } from 'next/server';

const APIGAMES_BASE = 'https://v1.apigames.id';
const APIGAMES_MERCHANT = process.env.APIGAMES_MERCHANT_ID || '';
const APIGAMES_KEY = process.env.APIGAMES_API_KEY || '';
const APIGAMES_SECRET = process.env.APIGAMES_SECRET_KEY || '';

// Game ID mapping: BYgame internal ID → apigames game code
const GAME_ID_MAP: Record<string, string> = {
  'mlbb': 'mlbb',
  'freefire': 'freefire',
  'pubgm': 'pubgm',
  'genshin-mobile': 'genshinimpact',
  'genshin-pc': 'genshinimpact',
  'honkai-star-rail': 'honkaistarrail',
  'codm': 'codmobile',
  'coc': 'clashofclans',
  'clash-royale': 'clashroyale',
  'valorant': 'valorant',
  'lol': 'leagueoflegends',
  'roblox-mobile': 'roblox',
  'roblox-console': 'roblox',
  'steam-wallet': 'steamwallet',
  'fortnite-pc': 'fortnite',
  'fortnite-console': 'fortnite',
  'apex': 'apexlegends',
};

function generateSign(body: Record<string, unknown>): string {
  // apigames.id uses MD5(merchantId + secretKey + orderID) for signing
  const crypto = require('crypto');
  return crypto
    .createHash('md5')
    .update(`${APIGAMES_MERCHANT}${APIGAMES_SECRET}${body.merchantTradeNo}`)
    .digest('hex');
}

// POST /api/topup — Create order via apigames.id
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, itemId, userGameId, serverId, paymentMethod, quantity = 1, userId, gameName, itemName, totalPrice } = body;

    if (!gameId || !itemId || !userGameId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: gameId, itemId, userGameId' },
        { status: 400 }
      );
    }

    // Check if apigames credentials are configured
    if (!APIGAMES_MERCHANT || !APIGAMES_KEY || !APIGAMES_SECRET) {
      console.log('[BYgame] apigames.id not configured, using mock mode');
      // Mock fallback for demo/development
      const orderId = `BY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return NextResponse.json({
        success: true,
        message: 'Order created (mock mode)',
        data: {
          orderId,
          gameId,
          gameName: gameName || gameId,
          itemId,
          itemName: itemName || itemId,
          userGameId,
          serverId: serverId || null,
          quantity,
          paymentMethod,
          totalPrice: totalPrice || 0,
          status: 'pending',
          apiOrderId: null,
          estimatedDelivery: '1-5 menit',
          createdAt: new Date().toISOString(),
        },
      });
    }

    // Map game ID to apigames code
    const apiGameCode = GAME_ID_MAP[gameId];
    if (!apiGameCode) {
      return NextResponse.json(
        { success: false, message: `Game ${gameId} not supported by API yet` },
        { status: 400 }
      );
    }

    // Generate order ID
    const merchantTradeNo = `BY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const orderBody = {
      merchantId: APIGAMES_MERCHANT,
      merchantTradeNo,
      gameCode: apiGameCode,
      gameItemId: itemId,
      productQty: quantity,
      customerContact: userGameId,
      customInfo: serverId || '',
      sign: '',
    };
    orderBody.sign = generateSign(orderBody);

    console.log('[BYgame] Creating apigames.id order:', merchantTradeNo);

    const response = await fetch(`${APIGAMES_BASE}/merchant/createOrder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIGAMES_KEY}`,
      },
      body: JSON.stringify(orderBody),
    });

    const result = await response.json();

    if (result.code !== 0 && result.code !== '0') {
      console.error('[BYgame] apigames.id error:', result);
      return NextResponse.json(
        { success: false, message: result.msg || 'Failed to create order via game API' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully',
      data: {
        orderId: merchantTradeNo,
        gameId,
        gameName: gameName || gameId,
        itemId,
        itemName: itemName || itemId,
        userGameId,
        serverId: serverId || null,
        quantity,
        paymentMethod,
        totalPrice: totalPrice || 0,
        status: 'pending',
        apiOrderId: result.data?.tradeNo || merchantTradeNo,
        estimatedDelivery: '1-5 menit',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[BYgame] Error creating topup order:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/topup?orderId=xxx — Check order status from apigames.id
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json(
      { success: false, message: 'orderId is required' },
      { status: 400 }
    );
  }

  // Check if apigames credentials are configured
  if (!APIGAMES_MERCHANT || !APIGAMES_KEY || !APIGAMES_SECRET) {
    return NextResponse.json({
      success: true,
      data: { orderId, status: 'success', updatedAt: new Date().toISOString() },
    });
  }

  try {
    const params = new URLSearchParams({
      merchantId: APIGAMES_MERCHANT,
      merchantTradeNo: orderId,
    });
    // Add sign
    const crypto = require('crypto');
    const sign = crypto.createHash('md5').update(`${APIGAMES_MERCHANT}${APIGAMES_SECRET}${orderId}`).digest('hex');
    params.set('sign', sign);

    const response = await fetch(`${APIGAMES_BASE}/merchant/status?${params.toString()}`, {
      headers: { 'Authorization': `Bearer ${APIGAMES_KEY}` },
    });
    const result = await response.json();

    if (result.code !== 0 && result.code !== '0') {
      return NextResponse.json({ success: false, message: result.msg || 'Failed to check status' }, { status: 500 });
    }

    const statusMap: Record<string, string> = {
      '0': 'pending',
      '1': 'processing',
      '2': 'success',
      '3': 'failed',
      '4': 'expired',
    };

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        status: statusMap[String(result.data?.status)] || 'pending',
        apiStatus: result.data?.status,
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[BYgame] Error checking topup status:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
