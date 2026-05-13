<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Images

Toute image raster utilisée dans `src/` **DOIT** passer par `next/image` (formats AVIF/WebP servis automatiquement, pas de `unoptimized={true}`). `width` et `height` explicites obligatoires, sauf usage `fill` (le parent doit alors être `position: relative`). `loading="lazy"` pour tout asset sous le fold ; `priority` réservé au LCP. Prop `sizes` adaptée à la grille responsive du site. Pas de `<img>` natif. Pas de `background-image: url(/file.png)` (exception : SVG inline en data URI texte brut UTF-8 escapé, ≤ 1 KB — `url("data:image/svg+xml,...")` ; éviter le base64 qui gonfle ~30 % et se compresse moins bien). Les marques (logo MM) et wordmarks clients restent en SVG inline ou en texte Cormorant italique — pas d'image raster pour ces usages. Établie en Story 4.2. **Multi-image (carrousels, galeries) :** un seul asset peut porter `priority` (le candidat LCP visible above-the-fold) ; les autres restent `loading="lazy"`. En doute, aucun n'est `priority`.
