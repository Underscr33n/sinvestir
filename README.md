# Simulateur Crypto — S'investir

Transposition du simulateur crypto de `sinvestir.fr` dans le design system de `simulateurs.sinvestir.fr`.

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
| `/embed/simulateur-crypto` | Version embed, iframe-ready |

**Exemple d'intégration iframe :**
```html
<iframe
  src="https://votre-domaine.vercel.app/embed/simulateur-crypto"
  width="100%"
  height="800"
  frameborder="0"
/>
```

## Architecture

```
hooks/
  useSimulateurCrypto.ts   — logique pure (état, calculs DCA, appels CoinGecko)
components/
  SimulateurCryptoUI.tsx   — rendu : consomme le hook, applique le design S'investir
  shell/                   — AppShell, Header, Sidebar, Logo
  ui/                      — StatCard et autres primitives
lib/
  coingecko.ts             — client API CoinGecko
app/
  simulateur-crypto/       — route principale
  embed/simulateur-crypto/ — route embed (headers X-Frame-Options ouverts)
```

**Principe clé : headless component.** Le hook `useSimulateurCrypto` ne contient aucune dépendance UI. `SimulateurCryptoUI` ne contient aucune logique métier. Changer de design system = écrire un nouveau composant UI qui branche le même hook.

## Partis pris techniques

**Next.js + Tailwind CSS**
Stack identique à celle de S'investir. Zéro friction d'intégration dans l'infrastructure existante (Vercel, Supabase si ajout de persistence). App Router utilisé pour la gestion des métadonnées et le layout par route.

**CoinGecko API (gratuite, sans clé)**
L'endpoint `/coins/{id}/market_chart/range` fournit les prix historiques en EUR sur n'importe quelle plage. Suffisant pour du DCA backtesting. Limite : rate-limiting sur l'API publique (~30 req/min). En production, on ajouterait une route API Next.js qui met en cache les réponses (Redis ou ISR).

**Recharts pour le graphique**
Léger, compatible SSR, bien maintenu. Alternative envisagée : Chart.js — écarté car moins bien typé et plus lourd à configurer avec React.

**Pas de Supabase dans ce livrable**
Hors scope pour un simulateur stateless. Mais l'architecture est prête : le hook expose un état serializable, il suffit d'ajouter un `useEffect` pour persister/charger depuis Supabase.

**Design tokens via CSS custom properties**
Les couleurs S'investir sont définies comme variables CSS (`--si-primary`, `--si-bg`, etc.) plutôt que classes Tailwind figées. Avantage : le composant `SimulateurCryptoUI` peut être thémé en surchargeant ces variables dans le CSS de l'hôte — utile pour l'embedding sur `sinvestir.fr` avec son propre design (jaune/blanc).

## Déploiement Vercel

```bash
# Depuis le dashboard Vercel : importer le repo, zero-config.
# Ou via CLI :
npx vercel --prod
```

Aucune variable d'environnement requise.
