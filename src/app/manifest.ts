import type { MetadataRoute } from "next";

// Web Manifest MVP — sert principalement à exposer `theme_color`, `name` et
// icônes de manière standardisée. PAS un PWA (`display: "browser"`, pas de
// service worker — cf. PRD AR12 « pas de PWA installable »). `description` non
// localisée (limitation de la spec — un manifest est global au site).

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Michael Mann — Portfolio",
    short_name: "MM",
    description: "Senior Frontend Developer · 5 years · React/TypeScript",
    start_url: "/en",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
