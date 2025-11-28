import { NextResponse } from 'next/server';

const SIDESHIFT_API = 'https://sideshift.ai/api/v2';
const SECRET = process.env.SIDESHIFT_SECRET; 
const AFFILIATE_ID = process.env.NEXT_PUBLIC_SIDESHIFT_AFFILIATE_ID || 'bOepyfVN8'; // Fallback to a known ID

export async function GET() {
  try {
    const res = await fetch(`${SIDESHIFT_API}/coins`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coins' }, { status: 500 });
  }
}
