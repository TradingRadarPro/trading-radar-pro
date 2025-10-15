type Event = {
  id: string;
  timeUtc: string;
  impact: 'low' | 'medium' | 'high';
  country: string;
  title: string;
};

export async function GET() {
  const now = new Date();
  const mock: Event[] = [
    {
      id: '1',
      timeUtc: new Date(now.getTime() + 60 * 60 * 1000).toISOString(),
      impact: 'high',
      country: 'US',
      title: 'CPI (YoY)',
    },
    {
      id: '2',
      timeUtc: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      impact: 'medium',
      country: 'EU',
      title: 'ECB Presser',
    },
  ];
  return Response.json({ events: mock, ts: now.toISOString() });
}
