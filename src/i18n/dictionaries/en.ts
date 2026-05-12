// Dictionnaire EN — SOURCE DE VÉRITÉ de la forme ET du contenu.
// `type Dictionary` est dérivé de ce fichier (cf. ./index.ts) ; `fr.ts` doit le
// satisfaire à la lettre (garde de complétude `satisfies Dictionary`).
//
// Portée Story 1.2b : uniquement les chaînes de la page de démo + du LanguageSwitcher.
// Le modèle de contenu complet de toutes les sections (meta/hero/clients/about/…)
// arrive en Story 1.3 / Epic 2 — il étendra cette structure, sans en changer le pattern.
//
// ⚠️ Pas de `as const` ici : on veut que `typeof en` élargisse les `string` littéraux
// (sinon `fr satisfies Dictionary` exigerait des chaînes FR *identiques* aux chaînes EN).

const en = {
  meta: {
    title: "Michael Mann",
    description:
      "Senior frontend engineer building production SaaS for global brands.",
  },
  demo: {
    label: "00 ↗ design system · technical minimal",
    headline: {
      lead: "Senior frontend engineer building ",
      accent: "production SaaS",
      tail: " for global brands.",
    },
    body: "Design tokens and self-hosted fonts are wired up. Body copy renders in Inter, section labels in JetBrains Mono, display headings in Cormorant Garamond — all served from this origin, no runtime requests to Google Fonts.",
    buildLine: "$ next build → static · ",
  },
  langSwitcher: {
    label: "Language",
    english: "English",
    french: "Français",
    // `{lang}` est remplacé par le libellé de la langue choisie (annonce aria-live).
    changedTo: "Language changed to {lang}",
  },
};

export default en;
