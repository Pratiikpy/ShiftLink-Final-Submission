import { NextResponse } from 'next/server';

const SIDESHIFT_API = 'https://sideshift.ai/api/v2';
const SECRET = process.env.SIDESHIFT_SECRET; 
const AFFILIATE_ID = process.env.NEXT_PUBLIC_SIDESHIFT_AFFILIATE_ID || 'bOepyfVN8';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Get real IP from Vercel/Next.js headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // Inject Affiliate ID if not present
    const payload = {
      ...body,
      affiliateId: AFFILIATE_ID,
    };

    const res = await fetch(`${SIDESHIFT_API}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sideshift-secret': SECRET || '',
        'x-user-ip': ip, // REQUIRED by SideShift
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const errorData = await res.json();
        return NextResponse.json(errorData, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch quote' }, { status: 500 });
  }
}