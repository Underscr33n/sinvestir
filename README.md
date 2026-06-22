# Simulateur Crypto — S'investir

Simulateur de DCA (Dollar-Cost Averaging) crypto avec données historiques depuis 2014. Conçu pour être intégré en iframe sur n'importe quel site, avec adaptation automatique aux couleurs de l'hôte.

**Production :** [sinvestir-xi.vercel.app](https://sinvestir-xi.vercel.app/simulateur-crypto)

## Lancer le projet

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Routes

| URL | Rôle |
|-----|------|
| `/simulateur-crypto` | Application principale dans le shell S'investir |
| `/embed/simulateur-crypto` | Version embed, iframe-ready, sans header ni sidebar |

## Intégration iframe

### Basique

```html
<iframe
  src="https://sinvestir-xi.vercel.app/embed/simulateur-crypto"
  width="100%"
  height="800"
  frameborder="0"
/>
```

### Avec thème personnalisé (recommandé)

Le site hôte passe ses couleurs en paramètres URL — le simulateur adapte automatiquement son thème. Tous les paramètres sont optionnels ; le thème sombre S'investir s'applique par défaut.

```html
<iframe
  src="https://sinvestir-xi.vercel.app/embed/simulateur-crypto
    ?bg=ffffff
    &bgCard=f8fafc
    &bgElevated=f1f5f9
    &border=e2e8f0
    &borderLight=cbd5e1
    &primary=2563eb
    &text=0f172a
    &textSecondary=475569
    &textMuted=94a3b8"
  width="100%"
  height="800"
  frameborder="0"
/>
```

#### Paramètres disponibles

| Paramètre | Variable CSS | Rôle |
|-----------|-------------|------|
| `bg` | `--si-bg` | Fond général |
| `bgCard` | `--si-bg-card` | Fond des cartes |
| `bgElevated` | `--si-bg-elevated` | Fond des éléments surélevés |
| `border` | `--si-border` | Bordures principales |
| `borderLight` | `--si-border-light` | Bordures légères |
| `primary` | `--si-primary` | Couleur d'accentuation |
| `text` | `--si-text` | Texte principal |
| `textSecondary` | `--si-text-secondary` | Texte secondaire |
| `textMuted` | `--si-text-muted` | Texte atténué |
| `success` | `--si-success` | Couleur de succès (gains) |
| `danger` | `--si-danger` | Couleur de danger (pertes) |

Les valeurs sont des codes hex sans `#` (le `#` est encodé `%23` dans les URLs et peut causer des erreurs).

#### Thème clair — exemple complet

```
https://sinvestir-xi.vercel.app/embed/simulateur-crypto?bg=ffffff&bgCard=f8fafc&bgElevated=f1f5f9&border=e2e8f0&borderLight=cbd5e1&primary=2563eb&text=0f172a&textSecondary=475569&textMuted=94a3b8
```

### Comment ça fonctionne

Les paramètres URL sont lus côté client par `components/embed/EmbedTheme.tsx` et injectés comme propriétés CSS inline sur `document.documentElement`. Aucun JavaScript n'est requis côté intégrateur — tout se passe dans l'iframe.

Les headers HTTP autorisant l'embedding (`Content-Security-Policy: frame-ancestors *`) sont configurés dans `next.config.ts` et `vercel.json`.

## Architecture

```
hooks/
  useSimulateurCrypto.ts      — logique pure (état, calculs DCA, appels API)
components/
  SimulateurCryptoUI.tsx      — rendu : consomme le hook, applique le design S'investir
  embed/
    EmbedTheme.tsx            — lit les params URL et injecte les CSS variables (thème iframe)
  shell/                      — AppShell, Header, Sidebar, Logo
  ui/                         — StatCard et autres primitives
lib/
  coingecko.ts                — client fetch vers /api/binance (nommage historique)
app/
  api/binance/route.ts        — proxy Yahoo Finance (voir section "Données prix")
  simulateur-crypto/          — route principale
  embed/
    layout.tsx                — layout minimal + EmbedTheme
    simulateur-crypto/        — route embed
middleware.ts                 — auth (routes /embed et /api/ sont publiques)
```

**Principe clé : headless component.** Le hook `useSimulateurCrypto` ne contient aucune dépendance UI. `SimulateurCryptoUI` ne contient aucune logique métier. Changer de design system = écrire un nouveau composant UI qui branche le même hook.

## Partis pris techniques

**Données prix : Yahoo Finance (via proxy Next.js)**

La route `/api/binance` (nommage conservé pour compatibilité) proxifie Yahoo Finance (`query1.finance.yahoo.com`). Historique complet depuis 2014, paires EUR natives, aucune clé API.

Alternatives écartées :
- **Binance** — bloque les IPs Vercel US (erreur 451)
- **CoinGecko Demo** — `/market_chart/range` réservé aux plans payants (401)
- **CryptoCompare** — devenu payant en 2024 (401)
- **Bitstamp / Cloudflare Worker** — Binance et Bitstamp bloquent les IPs Cloudflare (403/404)

**Next.js + Tailwind CSS**
Stack identique à celle de S'investir. App Router utilisé pour la gestion des métadonnées et le layout par route.

**Design tokens via CSS custom properties**
Les couleurs sont définies comme variables CSS (`--si-primary`, `--si-bg`, etc.) plutôt que classes Tailwind figées. C'est ce qui rend le thème iframe par URL params possible sans JavaScript supplémentaire côté hôte.

**Recharts pour le graphique**
Léger, compatible SSR, bien maintenu. Alternative envisagée : Chart.js — écarté car moins bien typé et plus lourd à configurer avec React.

**Pas de Supabase dans ce livrable**
Hors scope pour un simulateur stateless. L'architecture est prête : le hook expose un état serializable, il suffit d'ajouter un `useEffect` pour persister/charger depuis Supabase.

## Déploiement Vercel

```bash
# Depuis le dashboard Vercel : importer le repo, zero-config.
# Ou via CLI :
npx vercel --prod
```

Aucune variable d'environnement requise en production.
