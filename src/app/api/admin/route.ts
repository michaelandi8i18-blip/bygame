import { NextRequest, NextResponse } from 'next/server';

// GET /api/admin - Admin dashboard data
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalUsers: 1250,
        totalTransactions: 15800,
        totalRevenue: 450000000,
        pendingRedeems: 0,
      },
    },
  });
}

// POST /api/admin - Admin actions (approve/reject redeem, send message)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, requestId, approved, adminNote, userId, message } = body;

    switch (action) {
      case 'approve_redeem':
        if (!requestId || approved === undefined) {
          return NextResponse.json({ success: false, message: 'Missing requestId or approved status' }, { status: 400 });
        }
        // In production: update database, send notification
        return NextResponse.json({
          success: true,
          message: approved ? 'Redeem request approved' : 'Redeem request rejected',
        });

      case 'send_message':
        if (!userId || !message) {
          return NextResponse.json({ success: false, message: 'Missing userId or message' }, { status: 400 });
        }
        // In production: save message to database
        return NextResponse.json({
          success: true,
          message: 'Message sent to user',
        });

      default:
        return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
