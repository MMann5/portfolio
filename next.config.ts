import type { NextConfig } from "next";

/**
 * Configuration Next.js — volontairement minimale.
 *
 * Rendu statique : on n'active PAS `output: 'export'`. Toutes les pages sont
 * pré-rendues en SSG par défaut (aucun `fetch` dynamique, aucun appel à
 * `cookies()` / `headers()` ni `export const dynamic = 'force-dynamic'` dans les
 * routes de pages). Vercel sert ces pages pré-rendues depuis son CDN, tout en
 * conservant l'optimisation `next/image` (qui serait perdue avec `output: 'export'`).
 * Le middleware i18n arrivera en Story 1.2b — hors scope ici.
 */
const nextConfig: NextConfig = {
  // Épingle la racine du workspace sur ce dossier : un autre `package-lock.json`
  // existe plus haut dans l'arborescence ($HOME) et Next, sinon, inférerait à tort
  // ce dossier parent comme racine du projet.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
