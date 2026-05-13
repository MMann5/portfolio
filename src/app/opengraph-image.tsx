import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Route Handler `next/og` (Satori + Resvg) — sert l'image OpenGraph partagée
// entre `/en` et `/fr` à l'URL `/opengraph-image`. Mise en cache statiquement
// au build (cf. doc Next 16 `opengraph-image.md`).
//
// Décision MVP : une seule OG image (au root, hors segment `[locale]`). Le
// visuel principal est le wordmark + meta techniques, identiques EN/FR à
// ~80 %. Une variante FR sera ré-évaluée en Story 9.1 si l'incohérence est
// jugée visible sur les partages FR.
//
// Polices : Satori ne sait PAS réutiliser `next/font` (qui produit des
// classes CSS, pas des `Buffer`). Les fichiers TTF latin-subset sont
// commités sous `src/assets/og-fonts/` (cf. Story 4.3 Tâche 2 — total
// ~140 KB, lus uniquement au build).

export const alt =
  "Michael Mann — Senior Frontend Developer · 5+ years · Ashdod, IL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [cormorantMedium, jetbrainsRegular] = await Promise.all([
    readFile(
      join(process.cwd(), "src/assets/og-fonts/CormorantGaramond-Medium.ttf"),
    ),
    readFile(
      join(process.cwd(), "src/assets/og-fonts/JetBrainsMono-Regular.ttf"),
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: 64,
          backgroundColor: "#0a0a0a",
          border: "2px solid #d4a574",
          boxSizing: "border-box",
          fontFamily: "Cormorant Garamond",
        }}
      >
        {/* Bloc haut-gauche : badge meta + wordmark + sous-titre rôle */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontFamily: "JetBrains Mono",
              color: "#888888",
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            · michael-mann · portfolio · v2026.1 ·
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 128,
              fontWeight: 500,
              color: "#fafafa",
              marginTop: 16,
              fontFamily: "Cormorant Garamond",
              letterSpacing: -2,
              lineHeight: 1,
            }}
          >
            Michael Mann
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 40,
              fontFamily: "JetBrains Mono",
              color: "#d4a574",
              letterSpacing: 4,
              textTransform: "uppercase",
              marginTop: 16,
            }}
          >
            Senior Frontend Developer
          </div>
        </div>

        {/* Bloc bas-gauche : meta techniques + signature CLI */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "JetBrains Mono",
            fontSize: 26,
            color: "#cfcfcf",
            gap: 8,
          }}
        >
          <div style={{ display: "flex" }}>location   → Ashdod, Israel</div>
          <div style={{ display: "flex" }}>experience → 5+ years</div>
          <div style={{ display: "flex" }}>
            focus      → React · TypeScript · Supabase
          </div>
          {/* Signature CLI décorative — Story 4.3 review patch P9 : texte
              neutre (sans domaine custom) car aucun `mann.dev` n'est réservé
              aujourd'hui. À reconsidérer quand un domaine custom sera
              configuré via `NEXT_PUBLIC_SITE_URL` (Story 9.x). */}
          <div style={{ display: "flex", color: "#888888", marginTop: 24 }}>
            $ portfolio · v2026 →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: cormorantMedium,
          style: "normal",
          weight: 500,
        },
        {
          name: "JetBrains Mono",
          data: jetbrainsRegular,
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
