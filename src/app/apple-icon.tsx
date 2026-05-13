import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// `apple-icon.png` 180×180 généré au build via `next/og` (Option B de la Story
// 4.3 Tâche 8 — fallback choisi car aucun outil SVG→PNG (`rsvg-convert`,
// Inkscape, ImageMagick) n'est disponible dans l'env de build local).
//
// Décision technique : composition identique à `icon.svg` (monogramme `MM`
// blanc cassé sur fond clair) avec JetBrains Mono Regular comme police (police
// déjà commitée pour l'OG image — pas de coût de bytes supplémentaire). Le
// rendu reste un asset cacheable au build (cf. doc Next 16 `app-icons.md`).

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const jetbrainsRegular = await readFile(
    join(process.cwd(), "src/assets/og-fonts/JetBrainsMono-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          backgroundColor: "#ededed",
          borderRadius: 32,
          fontFamily: "JetBrains Mono",
          fontSize: 76,
          // Le fichier chargé est JetBrains Mono Regular (400) — déclarer 700
          // ici (avec un fichier 400) produirait un faux-gras Satori. On reste
          // en 400 ; la taille 76px suffit pour la lisibilité du monogramme.
          fontWeight: 400,
          color: "#0a0a0a",
          letterSpacing: -3,
        }}
      >
        MM
      </div>
    ),
    {
      ...size,
      fonts: [
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
