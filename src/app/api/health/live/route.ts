import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'LIVE',
      timestamp: new Date().toISOString(),
      service: 'teachersathi-core',
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}
