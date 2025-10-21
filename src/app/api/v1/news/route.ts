import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    headlines: [
      { id: 'h1', title: 'Stocks rise as yields ease', source: 'Bloomberg' },
      { id: 'h2', title: 'Fed speakers signal patience', source: 'Reuters' },
    ],
    ts: new Date().toISOString(),
  });
}
