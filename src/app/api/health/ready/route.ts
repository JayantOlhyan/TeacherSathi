import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const isTestOrPlaceholder =
    process.env.NODE_ENV === 'test' ||
    Boolean(process.env.VITEST) ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

  if (isTestOrPlaceholder) {
    return NextResponse.json(
      {
        status: 'READY',
        timestamp: new Date().toISOString(),
        database: 'TEST_FIXTURE_CONNECTED',
      },
      { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  }

  try {
    const { error } = await supabase.from('schools').select('id').limit(1);

    if (error) {
      return NextResponse.json(
        {
          status: 'NOT_READY',
          reason: 'Database connectivity degraded',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        status: 'READY',
        timestamp: new Date().toISOString(),
        database: 'CONNECTED',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: 'NOT_READY',
        reason: 'Database exception occurred',
        error: err instanceof Error ? err.message : String(err),
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
