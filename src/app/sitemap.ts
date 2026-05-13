import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import { siteUrl } from "@/lib/site-url";

// Sitemap MVP — uniquement la home en EN et FR (les seules pages indexables
// aujourd'hui). Route Handler caché statiquement par défaut (cf. doc Next 16
// `sitemap.md`) : généré une fois au build, `lastModified` figé au build.
// Les futures case studies (Story 7.1) ajouteront leurs entrées ici.
//
// `changeFrequency: "monthly"` : conservateur — le contenu portfolio évolue
// trimestriellement. `priority: 1.0` : seules pages du site, valeur informative
// (Google ignore largement la priorité).

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // `x-default` aligne le sitemap sur les `<link rel="alternate" hreflang>`
  // émis par `layout.tsx` (Story 4.3 review patch P5). Sans cette clé, Google
  // Search Console signale une incohérence sitemap/HTML et perd le signal de
  // langue par défaut pour les utilisateurs hors EN/FR.
  const languages = {
    "x-default": `${siteUrl}/en`,
    en: `${siteUrl}/en`,
    fr: `${siteUrl}/fr`,
  };
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 1.0,
    alternates: {
      languages,
    },
  }));
}
