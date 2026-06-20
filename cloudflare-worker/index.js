/**
 * Cloudflare Worker — Proxy Yahoo Finance OHLC
 *
 * POURQUOI CE WORKER EXISTE
 * ─────────────────────────
 * Binance bloque les IPs US (Vercel, erreur 451) et les IPs Cloudflare (erreur 403).
 * CoinGecko Demo plan bloque /market_chart/range et days=max.
 * CryptoCompare est devenu payant (rachat par CoinDesk, clé requise depuis 2024).
 * Bitstamp bloque les IPs Cloudflare (erreur 404).
 *
 * Solution retenue : Yahoo Finance, API publique non documentée mais stable,
 * sans clé, sans geo-block, historique quotidien depuis 2014+, paires EUR natives.
 * Nécessite un User-Agent navigateur pour ne pas être bloqué (bot protection basique).
 *
 * DÉPLOIEMENT (une seule fois)
 * ────────────────────────────
 * 1. Créer un compte sur https://dash.cloudflare.com (gratuit)
 * 2. Workers & Pages → Create Worker → Hello World → Deploy → Edit code
 * 3. Coller ce fichier, Save and Deploy
 * 4. Noter l'URL (ex: dark-silence-94d3.lotfi-berrahal.workers.dev)
 * 5. Dans Vercel : ajouter BINANCE_WORKER_URL=https://<url-du-worker>
 *
 * LIMITES DU PLAN GRATUIT CLOUDFLARE
 * ────────────────────────────────────
 * - 100 000 requêtes/jour
 * - Timeout 30s par requête
 *
 * INTERFACE
 * ─────────
 * GET /?symbol=BTC&tsym=EUR&startTime=1483228800000&endTime=1735689600000
 * Réponse : [[timestamp_ms, close_price], ...]
 */

const YF_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Content-Type": "application/json",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const symbol = (url.searchParams.get("symbol") ?? "").toUpperCase();
    const tsym = (url.searchParams.get("tsym") ?? "EUR").toUpperCase();
    const startTime = url.searchParams.get("startTime"); // ms
    const endTime = url.searchParams.get("endTime");     // ms

    if (!symbol) {
      return new Response(JSON.stringify({ error: "missing symbol" }), {
        status: 400, headers: corsHeaders,
      });
    }

    // Yahoo Finance ticker format : BTC-EUR, ETH-EUR, etc.
    const ticker = `${symbol}-${tsym}`;
    const period1 = startTime ? Math.floor(parseInt(startTime) / 1000) : 0;
    const period2 = endTime ? Math.floor(parseInt(endTime) / 1000) : Math.floor(Date.now() / 1000);

    try {
      const params = new URLSearchParams({
        interval: "1d",
        period1: String(period1),
        period2: String(period2),
      });

      const res = await fetch(`${YF_BASE}/${ticker}?${params}`, {
        headers: { "User-Agent": UA },
      });

      if (!res.ok) {
        const body = await res.text();
        return new Response(
          JSON.stringify({ error: `Yahoo Finance ${res.status}`, detail: body }),
          { status: res.status, headers: corsHeaders }
        );
      }

      const json = await res.json();
      const result = json?.chart?.result?.[0];

      if (!result) {
        const err = json?.chart?.error?.description ?? "No data";
        return new Response(JSON.stringify({ error: err }), {
          status: 404, headers: corsHeaders,
        });
      }

      const timestamps = result.timestamp ?? [];
      const closes = result.indicators?.quote?.[0]?.close ?? [];

      // Zipper timestamps et closes, ignorer les valeurs nulles (jours sans cotation)
      const prices = timestamps
        .map((ts, i) => [ts * 1000, closes[i]])
        .filter(([, price]) => price != null);

      return new Response(JSON.stringify(prices), { headers: corsHeaders });
    } catch (e) {
      return new Response(JSON.stringify({ error: String(e) }), {
        status: 502, headers: corsHeaders,
      });
    }
  },
};
