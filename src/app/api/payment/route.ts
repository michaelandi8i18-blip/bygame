import { NextRequest, NextResponse } from 'next/server';

const PAK_KASIR_API = 'https://pak-kasir.com/api/v1';
const PAK_KASIR_API_KEY = process.env.PAK_KASIR_API_KEY || '';
const PAK_KASIR_SECRET = process.env.PAK_KASIR_SECRET_KEY || '';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Payment method mapping
const PAYMENT_METHOD_MAP: Record<string, string> = {
  'gopay': 'gopay',
  'ovo': 'ovo',
  'dana': 'dana',
  'bank_transfer': 'bank_transfer',
  'qris': 'qris',
  'shopeepay': 'shopeepay',
  'indomaret': 'indomaret',
  'alfamart': 'alfamart',
};

// POST /api/payment — Create payment via Pak Kasir
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod, amount, customerName, customerEmail } = body;

    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields: orderId, paymentMethod, amount' },
        { status: 400 }
      );
    }

    // Check if Pak Kasir credentials are configured
    if (!PAK_KASIR_API_KEY || !PAK_KASIR_SECRET) {
      console.log('[BYgame] Pak Kasir not configured, using mock payment');
      // Mock fallback for demo/development
      const mockPaymentUrl = `${BASE_URL}/payment/mock?order=${orderId}&method=${paymentMethod}`;
      return NextResponse.json({
        success: true,
        message: 'Payment created (mock mode)',
        data: {
          paymentUrl: mockPaymentUrl,
          qrCode: `QR-${orderId}`,
          expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
          status: 'pending',
          orderId,
          totalPrice: amount,
          paymentMethod,
          paymentProvider: 'mock',
        },
      });
    }

    const apiPaymentMethod = PAYMENT_METHOD_MAP[paymentMethod] || 'qris';

    console.log(`[BYgame] Creating Pak Kasir payment: ${orderId} via ${paymentMethod}`);

    // Pak Kasir API call
    const response = await fetch(`${PAK_KASIR_API}/payment/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAK_KASIR_API_KEY}`,
      },
      body: JSON.stringify({
        order_id: orderId,
        amount: Number(amount),
        payment_method: apiPaymentMethod,
        customer_name: customerName || 'BYgame User',
        customer_email: customerEmail || 'user@bygame.com',
        callback_url: `${BASE_URL}/api/payment/callback`,
        return_url: `${BASE_URL}/payment/success?order=${orderId}`,
        expired_time: 15, // minutes
      }),
    });

    const result = await response.json();

    if (!result.success && result.status !== 'success') {
      console.error('[BYgame] Pak Kasir error:', result);
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to create payment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment created successfully',
      data: {
        paymentUrl: result.data?.payment_url || result.data?.checkout_url || '',
        qrCode: result.data?.qr_string || result.data?.qr_code || '',
        expiryTime: result.data?.expired_at || new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        status: 'pending',
        orderId,
        totalPrice: amount,
        paymentMethod,
        paymentProvider: 'pak-kasir',
        externalId: result.data?.external_id || result.data?.transaction_id || '',
      },
    });
  } catch (error) {
    console.error('[BYgame] Error creating payment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/payment?orderId=xxx — Check payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ success: false, message: 'orderId is required' }, { status: 400 });
  }

  if (!PAK_KASIR_API_KEY || !PAK_KASIR_SECRET) {
    return NextResponse.json({
      success: true,
      data: { orderId, status: 'pending', updatedAt: new Date().toISOString() },
    });
  }

  try {
    const response = await fetch(`${PAK_KASIR_API}/payment/check?order_id=${orderId}`, {
      headers: { 'Authorization': `Bearer ${PAK_KASIR_API_KEY}` },
    });
    const result = await response.json();

    const statusMap: Record<string, string> = {
      'pending': 'pending',
      'processing': 'processing',
      'success': 'success',
      'settlement': 'success',
      'expired': 'expired',
      'cancelled': 'failed',
      'failed': 'failed',
    };

    return NextResponse.json({
      success: true,
      data: {
        orderId,
        status: statusMap[result.data?.status] || 'pending',
        updatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[BYgame] Error checking payment:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/payment/callback — Webhook from Pak Kasir
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[BYgame] Payment callback received:', body);

    const { order_id, status, transaction_id } = body;

    if (!order_id || !status) {
      return NextResponse.json({ success: false, message: 'Missing data' }, { status: 400 });
    }

    // In production, update purchase status in database
    // For now, log the callback
    console.log(`[BYgame] Order ${order_id} payment ${status}`);

    return NextResponse.json({ success: true, message: 'Callback processed' });
  } catch (error) {
    console.error('[BYgame] Error processing callback:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
