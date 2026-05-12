# Deferred Work

## Deferred from: code review of story-1.2a (2026-05-12)

- **Italique Cormorant non chargé** — `Cormorant_Garamond` est instancié sans `style: ["italic"]` ; les wordmarks du marquee clients (token `--text-marquee`, commenté « Cormorant italique ») seront synthétisés en faux-italique. Charger/valider l'italique en Epic 2 / Story 2.1 (Section Hero — marquee). Vérifier au passage le commentaire « pas de version variable sur Google Fonts » dans `src/app/layout.tsx` (la famille expose `variable` dans ses poids — le commentaire et le Debug Log sont potentiellement inexacts).
- **`_global-error` hors arbre du root layout** — une page `app/global-error.tsx` (si ajoutée) rend son propre `<html>`/`<body>` et ne reçoit donc pas les classes `*.variable` de `next/font` ; les `var(--font-*)` y retomberaient sur les fallbacks (`-apple-system`, `ui-monospace`, `Georgia`). À garder en tête si une page d'erreur globale stylée est introduite (Epic 4).

## Deferred from: code review of story-1.2b (2026-05-12)

- **`config.matcher` du proxy — exclusion de métadonnées non exhaustive** — `src/proxy.ts` exclut `_next/static`, `_next/image`, `favicon.ico`, `sitemap.xml`, `robots.txt` et tout chemin avec un `.` (`.*\..*`). Les routes de métadonnées App Router **sans extension** (`/opengraph-image`, `/twitter-image`, `/icon`, `/apple-icon`) et toute future route `/api/*` ne sont pas exclues : le proxy les intercepterait et émettrait un 307 vers `/<locale>/...`. Aucune de ces routes n'existe encore. À traiter quand la Story 4.3 (SEO — OG/Twitter images, sitemap, robots) ou une route API sera ajoutée : étendre le `matcher` (ou ajouter un garde `|api/|opengraph-image|...`).
