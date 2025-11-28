import { NextResponse } from 'next/server';

const SIDESHIFT_API = 'https://sideshift.ai/api/v2';
const SECRET = process.env.SIDESHIFT_SECRET; 

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const res = await fetch(`${SIDESHIFT_API}/shifts/${id}`, {
      headers: {
        'x-sideshift-secret': SECRET || '',
      },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shift' }, { status: 500 });
  }
}
