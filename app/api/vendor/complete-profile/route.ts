import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const data = await req.json();

    // TODO: Add authentication and get vendor user ID from session/JWT
    // For now, assume user_id is available (replace with real auth logic)
    const user_id = null; // <-- Replace with real user ID extraction
    if (!user_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate required fields
    const required = [
      'business_name', 'address', 'phone',
      'cuisine_type', 'price_range', 'opening_time', 'closing_time', 'delivery_fee'
    ];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
      }
    }

    // Call backend API to update vendor profile
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/vendor/update-profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, user_id }),
    });
    const backendData = await backendRes.json();
    if (!backendRes.ok) {
      return NextResponse.json({ error: backendData.error || 'Failed to update profile' }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 