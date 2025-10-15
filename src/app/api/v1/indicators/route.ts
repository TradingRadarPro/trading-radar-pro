export async function GET() {
  return Response.json({
    vix: { value: 13.24, ts: new Date().toISOString() },
    dxy: { value: 103.2, ts: new Date().toISOString() },
    yields: { us2y: 4.38, us10y: 4.15, move: 95, ts: new Date().toISOString() },
  });
}
