import { NextRequest, NextResponse } from "next/server";

/**
 * Route de prix historiques — source : Yahoo Finance
 *
 * Historique des tentatives pour obtenir des données crypto EUR complètes (depuis 2017) :
 *
 * 1. Binance /api/v3/klines        → Bloque les IPs US (Vercel, erreur 451) et Cloudflare (403)
 * 2. CoinGecko Demo /market_chart/range → Bloqué sur plan Demo (erreur 401)
 * 3. CoinGecko Demo days=365       → OK mais uniquement les 365 derniers jours
 * 4. CryptoCompare histoday        → Devenu payant en 2024 (rachat par CoinDesk, clé requise)
 * 5. Bitstamp OHLC                 → Bloque les IPs Cloudflare (erreur 404)
 * 6. Cloudflare Worker + Binance   → Binance bloque aussi les IPs Cloudflare
 *
 * Solution finale : Yahoo Finance v8/finance/chart
 * - API publique non documentée, stable depuis des années
 * - Aucune clé requise
 * - Aucun geo-block (CDN mondial)
 * - Historique complet depuis 2014+
 * - Paires EUR natives (BTC-EUR, ETH-EUR, etc.)
 * - Nécessite un User-Agent navigateur (protection anti-bot basique)
 */

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Tickers Yahoo Finance pour les cryptos non standard
const YF_TICKER_OVERRIDES: Record<string, string> = {
  binancecoin: "BNB-EUR",
  "bitcoin-cash": "BCH-EUR",
  "avalanche-2": "AVAX-EUR",
  ripple: "XRP-EUR",
  dogecoin: "DOGE-EUR",
  cosmos: "ATOM-EUR",
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const coinId = searchParams.get("coinId") ?? "";
  const symbol = (searchParams.get("symbol") ?? "").toUpperCase();
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");

  if (!symbol) return NextResponse.json({ error: "missing symbol" }, { status: 400 });

  const ticker = YF_TICKER_OVERRIDES[coinId] ?? `${symbol}-EUR`;
  const period1 = startTime ? Math.floor(parseInt(startTime) / 1000) : 0;
  const period2 = endTime ? Math.floor(parseInt(endTime) / 1000) : Math.floor(Date.now() / 1000);

  const params = new URLSearchParams({
    interval: "1d",
    period1: String(period1),
    period2: String(period2),
  });

  try {
    const res = await fetch(`${YF_BASE}/${ticker}?${params}`, {
      headers: { "User-Agent": UA },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: `Yahoo Finance ${res.status}`, detail: body }, { status: res.status });
    }

    const json = await res.json();
    const result = json?.chart?.result?.[0];

    if (!result) {
      const err = json?.chart?.error?.description ?? "No data";
      return NextResponse.json({ error: err }, { status: 404 });
    }

    const timestamps: number[] = result.timestamp ?? [];
    const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

    const prices: [number, number][] = timestamps
      .map((ts, i) => [ts * 1000, closes[i]] as [number, number])
      .filter(([, price]) => price != null);

    return NextResponse.json(prices);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 502 });
  }
}
