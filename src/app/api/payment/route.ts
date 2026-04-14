import { NextRequest, NextResponse } from 'next/server';

// POST /api/payment - Process payment via gateway
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, paymentMethod, amount } = body;

    // Validation
    if (!orderId || !paymentMethod || !amount) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: orderId, paymentMethod, amount',
        },
        { status: 400 }
      );
    }

    // Valid payment methods
    const validMethods = ['gopay', 'ovo', 'dana', 'bank_transfer', 'qris'];
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // In production, you would integrate with:
    //
    // === MIDTRANS INTEGRATION ===
    // const midtrans = require('midtrans-client');
    // const snap = new midtrans.Snap({
    //   isProduction: false,
    //   serverKey: process.env.MIDTRANS_SERVER_KEY,
    //   clientKey: process.env.MIDTRANS_CLIENT_KEY,
    // });
    //
    // const transaction = await snap.createTransaction({
    //   transaction_details: {
    //     order_id: orderId,
    //     gross_amount: amount,
    //   },
    //   customer_details: {
    //     first_name: 'BYgame User',
    //   },
    //   callbacks: {
    //     finish: `${process.env.BASE_URL}/payment/callback`,
    //     error: `${process.env.BASE_URL}/payment/callback`,
    //     pending: `${process.env.BASE_URL}/payment/callback`,
    //   },
    // });
    //
    // === XENDIT INTEGRATION ===
    // const xendit = require('xendit-node');
    // const { Invoice } = xendit;
    // const invoice = new Invoice({ secretKey: process.env.XENDIT_API_KEY });
    //
    // const response = await invoice.createInvoice({
    //   external_id: orderId,
    //   amount: amount,
    //   payer_email: 'user@bygame.com',
    //   description: `Top Up Game - ${orderId}`,
    //   success_redirect_url: `${process.env.BASE_URL}/payment/success`,
    //   failure_redirect_url: `${process.env.BASE_URL}/payment/failed`,
    // });

    // Simulate payment gateway response
    const paymentUrl = `https://payment-sandbox.bygame.id/pay/${orderId}`;
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const paymentResult = {
      paymentUrl,
      qrCode: `QR-${orderId}-${Math.random().toString(36).substring(2, 8)}`,
      expiryTime,
      status: 'pending',
      orderId,
      totalPrice: amount,
      paymentMethod,
      paymentProvider: 'bygame-sandbox', // Would be 'midtrans' or 'xendit' in production
    };

    console.log(`[BYgame] Payment initiated: ${orderId} via ${paymentMethod}`);

    return NextResponse.json({
      success: true,
      message: 'Payment created successfully',
      data: paymentResult,
    });
  } catch (error) {
    console.error('[BYgame] Error processing payment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/payment - Check payment status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json(
      { success: false, message: 'orderId is required' },
      { status: 400 }
    );
  }

  // In production, check with Midtrans/Xendit API:
  // const status = await snap.transaction.status(orderId);

  // Simulated status check
  return NextResponse.json({
    success: true,
    data: {
      orderId,
      status: 'pending', // pending, settlement, expired, cancelled
      updatedAt: new Date().toISOString(),
    },
  });
}
