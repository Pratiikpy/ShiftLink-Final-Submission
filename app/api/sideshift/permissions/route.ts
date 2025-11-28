import { NextResponse } from 'next/server';

const SIDESHIFT_API = 'https://sideshift.ai/api/v2';

export async function GET(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || '127.0.0.1';

    const res = await fetch(`${SIDESHIFT_API}/permissions`, {
      headers: {
        'x-user-ip': ip,
      },
    });
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    // Default to allowing if check fails to avoid blocking legitimate users on error
    return NextResponse.json({ createShift: true });
  }
}