type Headline = {
  id: string;
  ts: string;
  title: string;
  url: string;
  source: string;
};

export async function GET() {
  const mock: Headline[] = [
    {
      id: 'n1',
      ts: new Date().toISOString(),
      title: 'Futures edge higher as VIX dips',
      url: 'https://example.com/a',
      source: 'Reuters',
    },
    {
      id: 'n2',
      ts: new Date().toISOString(),
      title: 'Dollar eases, yields steady before CPI',
      url: 'https://example.com/b',
      source: 'Investing',
    },
  ];
  return Response.json({ headlines: mock });
}
