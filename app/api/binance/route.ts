import { NextRequest, NextResponse } from "next/server";

const BASE = "https://api.binance.com/api/v3";
const MAX_LIMIT = 1000; // Binance max per request

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get("symbol");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");

  if (!symbol) return NextResponse.json({ error: "missing symbol" }, { status: 400 });

  // Fetch all daily candles by paginating if needed
  const allKlines: [number, string][] = [];
  let cursor = startTime ? parseInt(startTime) : undefined;
  const end = endTime ? parseInt(endTime) : Date.now();

  while (true) {
    const params = new URLSearchParams({ symbol, interval: "1d", limit: String(MAX_LIMIT) });
    if (cursor) params.set("startTime", String(cursor));
    params.set("endTime", String(end));

    const res = await fetch(`${BASE}/klines?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: `Binance ${res.status}`, detail: body }, { status: res.status });
    }

    const klines: [number, string, string, string, string][] = await res.json();
    if (!klines.length) break;

    // [openTime, open, high, low, close, ...]
    allKlines.push(...klines.map((k) => [k[0], k[4]] as [number, string]));

    if (klines.length < MAX_LIMIT) break;
    cursor = klines[klines.length - 1][0] + 86400000; // next day
    if (cursor > end) break;
  }

  return NextResponse.json(allKlines);
}
