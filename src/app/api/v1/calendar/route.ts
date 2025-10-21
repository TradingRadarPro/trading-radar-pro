import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    events: [
      { id: 'cpi', title: 'US CPI', date: '2025-10-22', importance: 'high' },
      { id: 'gdp', title: 'US GDP (QoQ)', date: '2025-10-25', importance: 'medium' },
    ],
    ts: new Date().toISOString(),
  });
}
