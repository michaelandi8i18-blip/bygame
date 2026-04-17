import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  // In production, fetch from database
  const messages = [];

  return NextResponse.json({
    success: true,
    data: messages.filter((m: { userId?: string }) => !userId || m.userId === userId),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, from, title, content, type } = body;

    if (!userId || !title || !content) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
    });
  } catch {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
