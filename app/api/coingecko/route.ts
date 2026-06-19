import { NextRequest, NextResponse } from "next/server";

const BASE = "https://api.coingecko.com/api/v3";
const API_KEY = process.env.COINGECKO_API_KEY ?? "";
const YEAR_S = 365 * 24 * 60 * 60;

function cgUrl(path: string, params: URLSearchParams) {
  const p = new URLSearchParams(params);
  if (API_KEY) p.set("x_cg_demo_api_key", API_KEY);
  return `${BASE}${path}?${p.toString()}`;
}

async function fetchChunk(path: string, params: URLSearchParams) {
  const res = await fetch(cgUrl(path, params), { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  return res.json() as Promise<{ prices: [number, number][]; market_caps: [number, number][]; total_volumes: [number, number][] }>;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const path = searchParams.get("path");
  if (!path) return NextResponse.json({ error: "missing path" }, { status: 400 });

  const params = new URLSearchParams(searchParams);
  params.delete("path");

  const fromStr = params.get("from");
  const toStr = params.get("to");

  // For market_chart/range with a span > 1 year, split into yearly chunks
  if (path.endsWith("/market_chart/range") && fromStr && toStr) {
    const from = parseInt(fromStr);
    const to = parseInt(toStr);

    if (to - from > YEAR_S) {
      try {
        const chunks: [number, number][][] = [[], [], []];
        let cursor = from;
        while (cursor < to) {
          const chunkTo = Math.min(cursor + YEAR_S, to);
          const p = new URLSearchParams(params);
          p.set("from", cursor.toString());
          p.set("to", chunkTo.toString());
          const data = await fetchChunk(path, p);
          chunks[0].push(...(data.prices ?? []));
          chunks[1].push(...(data.market_caps ?? []));
          chunks[2].push(...(data.total_volumes ?? []));
          cursor = chunkTo;
        }
        return NextResponse.json({ prices: chunks[0], market_caps: chunks[1], total_volumes: chunks[2] });
      } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 502 });
      }
    }
  }

  try {
    const res = await fetch(cgUrl(path, params), { next: { revalidate: 300 } });
    if (!res.ok) return NextResponse.json({ error: "CoinGecko error", status: res.status }, { status: res.status });
    return NextResponse.json(await res.json());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
