import { NextRequest, NextResponse } from "next/server";

const BASE = "https://api.kraken.com/0/public/OHLC";

// Kraken uses non-standard names for some pairs
const KRAKEN_SYMBOL_MAP: Record<string, string> = {
  BTC: "XBT",
  DOGE: "XDG",
};

function toKrakenPair(symbol: string): string {
  const s = symbol.toUpperCase();
  const krakenBase = KRAKEN_SYMBOL_MAP[s] ?? s;
  return `${krakenBase}EUR`;
}

type KrakenOHLC = [number, string, string, string, string, string, string, number];

async function fetchChunk(pair: string, since: number): Promise<{ candles: KrakenOHLC[]; last: number }> {
  const url = `${BASE}?pair=${pair}&interval=1440&since=${since}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`Kraken ${res.status}`);
  const json = await res.json() as { error: string[]; result?: Record<string, KrakenOHLC[]> & { last?: number } };
  if (json.error?.length) throw new Error(`Kraken: ${json.error[0]}`);
  const result = json.result!;
  const last: number = result.last as unknown as number;
  const candles = (Object.values(result).find(Array.isArray) as KrakenOHLC[]) ?? [];
  return { candles, last };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get("symbol");
  const from = parseInt(searchParams.get("from") ?? "0");
  const to = parseInt(searchParams.get("to") ?? String(Math.floor(Date.now() / 1000)));

  if (!symbol) return NextResponse.json({ error: "missing symbol" }, { status: 400 });

  const pair = toKrakenPair(symbol);
  const allCandles: KrakenOHLC[] = [];
  let cursor = from;

  try {
    while (true) {
      const { candles, last } = await fetchChunk(pair, cursor);
      const filtered = candles.filter((c) => c[0] <= to);
      allCandles.push(...filtered);
      if (candles.length < 720 || last >= to) break;
      cursor = last;
    }

    // Return [timestamp_ms, close_price]
    const prices = allCandles.map((c) => [c[0] * 1000, parseFloat(c[4])] as [number, number]);
    return NextResponse.json({ prices });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
