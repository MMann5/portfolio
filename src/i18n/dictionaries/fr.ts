import type { Dictionary } from "./index";

// Dictionnaire FR — traduction de `en.ts`.
// `satisfies Dictionary` = garde de complétude : une clé manquante, en trop ou
// mal typée casse `npm run typecheck` (donc la CI). Conserver ce pattern quand
// 1.3 / Epic 2 ajouteront le vrai modèle de contenu.

const fr = {
  meta: {
    title: "Michael Mann",
    description:
      "Ingénieur frontend senior — applications SaaS de production pour des marques internationales.",
  },
  demo: {
    label: "00 ↗ design system · technical minimal",
    headline: {
      lead: "Ingénieur frontend senior, je construis des applications ",
      accent: "SaaS de production",
      tail: " pour des marques internationales.",
    },
    body: "Les design tokens et les polices auto-hébergées sont en place. Le corps de texte est rendu en Inter, les labels de section en JetBrains Mono, les titres display en Cormorant Garamond — tout est servi depuis cette origine, sans aucune requête runtime vers Google Fonts.",
    buildLine: "$ next build → static · ",
  },
  langSwitcher: {
    label: "Langue",
    english: "English",
    french: "Français",
    changedTo: "Langue changée pour {lang}",
  },
} satisfies Dictionary;

export default fr;
