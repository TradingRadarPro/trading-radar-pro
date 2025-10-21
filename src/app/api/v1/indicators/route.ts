import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    indicators: {
      vix: { value: 13.24, changePct: -0.8 },
      fearGreed: { value: 68, label: 'Greed' },
      putCallRatio: { value: 0.92 },
    },
    ts: new Date().toISOString(),
  });
}
