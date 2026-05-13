// Source de vérité unique pour l'URL absolue du site. Utilisée par :
//   - app/[locale]/layout.tsx (`metadataBase`, OG, Twitter)
//   - app/sitemap.ts (URLs absolues)
//   - app/robots.ts (`sitemap` + `host`)
//   - app/[locale]/page.tsx (JSON-LD `url`, `image`)
// Override en prod via `NEXT_PUBLIC_SITE_URL` (Vercel env var) — par défaut, la
// preview Vercel courante (placeholder en attendant le domaine custom Story 9.x).
//
// `||` (pas `??`) : une variable Vercel déclarée vide (`""`) ou seulement
// espaces doit retomber sur le fallback — sinon `new URL("")` jette au build.
// `.trim().replace(/\/+$/, "")` : normalise le trailing slash pour éviter `//`
// dans les concaténations `${siteUrl}/${locale}`.
const FALLBACK_URL = "https://portfolio-three-omega-48ezqd212w.vercel.app";
export const siteUrl: string = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || FALLBACK_URL
).replace(/\/+$/, "");
