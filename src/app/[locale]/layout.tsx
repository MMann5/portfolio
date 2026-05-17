import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { CursorMount } from "@/components/CursorMount";
import { SkipLink } from "@/components/SkipLink";
import { siteUrl } from "@/lib/site-url";

// Root layout, imbriqué sous `app/[locale]/` (autorisé par App Router) : c'est ici
// qu'on rend `<html>` / `<body>`, donc c'est l'ancêtre commun obligatoire des classes
// `*.variable` de `next/font`.
//
// Polices auto-hébergées via `next/font` (téléchargées au build, servies depuis le
// domaine de l'app — aucune requête runtime vers Google Fonts ; cf. NFR4).
// Inter est la police critique (above-the-fold partout) → `preload: true`.
// JetBrains Mono et Cormorant servent plus bas / en décoratif → `preload: false`.
// `display: "swap"` sur les trois → pas de FOIT.

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});

// Cormorant Garamond : pas de version variable sur Google Fonts → on déclare explicitement les
// poids ET les styles utilisés (le `400 italic` sert aux wordmarks du marquee clients — cf. token
// `--text-marquee` ; sans `style: ["italic"]`, le navigateur synthétiserait un faux-italique).
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  preload: false,
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

// Pré-rend `/en` et `/fr` au build ; `dynamicParams = false` → toute autre locale → 404.
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// Script bloquant inline injecté dans <head> AVANT toute peinture.
//
// Contrat (cf. discussion produit) :
//   • Défaut = système : si `localStorage.theme` est absent, on suit `prefers-color-scheme`.
//   • Override = `localStorage.theme = 'light' | 'dark'` (écrit par le ThemeToggle au clic).
//   • Fallback `dark` en cas d'erreur (préserve l'état historique du site).
//
// On enregistre AUSSI un listener `matchMedia('change')` : tant qu'aucun override n'est
// dans `localStorage`, un changement de préférence système (ex. l'utilisateur passe son
// OS de light à dark) se propage en direct à `<html data-theme>`. Le ThemeToggle reste
// la seule source qui ÉCRIT dans `localStorage` ; le listener vérifie l'absence
// d'override à chaque event pour ne jamais écraser un choix explicite.
const THEME_INIT_SCRIPT = `(function(){try{var d=document.documentElement;var s=localStorage.getItem('theme');var t=(s==='light'||s==='dark')?s:(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');d.setAttribute('data-theme',t);if(window.matchMedia){var m=window.matchMedia('(prefers-color-scheme: light)');var h=function(e){try{if(localStorage.getItem('theme'))return;}catch(_){return;}d.setAttribute('data-theme',e.matches?'light':'dark');};if(m.addEventListener){m.addEventListener('change',h);}else if(m.addListener){m.addListener(h);}}}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export const dynamicParams = false;

// `siteUrl` est exporté depuis `@/lib/site-url` — source de vérité unique partagée
// avec `sitemap.ts`, `robots.ts`, `page.tsx` (JSON-LD) et `opengraph-image.tsx`.

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  // Locales au format OG (`en_US` / `fr_FR`). On expose la locale active comme
  // `openGraph.locale` et l'autre comme `alternateLocale` (cohérent avec le hreflang
  // côté `<head>` ci-dessous). Pas de variante régionale fine (`en_GB`, `fr_CA`) :
  // le site n'a pas de positionnement régional.
  const localeOG = locale === "fr" ? "fr_FR" : "en_US";
  const localeAlt = locale === "fr" ? "en_US" : "fr_FR";
  // Titre social enrichi : `"Michael Mann — <jobTitle localisé>"`. Préféré au seul
  // `dict.meta.title` pour Google SERP / partages sociaux (~40 chars, dans la
  // fenêtre confortable de ~60 chars affichés). Le `title.template` reste en place
  // pour les futures pages enfants (case studies Story 7.1) qui définiront leur
  // propre `title`.
  const enrichedTitle = `${dict.meta.title} — ${dict.meta.jobTitle}`;
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: enrichedTitle,
      template: `%s — Michael Mann`,
    },
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { "x-default": "/en", en: "/en", fr: "/fr" },
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: enrichedTitle,
      description: dict.meta.description,
      url: `/${locale}`,
      siteName: "Michael Mann",
      type: "website",
      locale: localeOG,
      alternateLocale: [localeAlt],
      images: [
        {
          // URL relative : Next la résout en absolu via `metadataBase`. La route
          // `/opengraph-image` est servie par `app/opengraph-image.tsx` (root,
          // partagée entre `/en` et `/fr` — cf. Story 4.3 AC#4).
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: dict.meta.ogImageAlt,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: enrichedTitle,
      description: dict.meta.description,
      // Pas de `site`/`creator` : Mike n'a pas de compte X/Twitter public
      // (confirmé Tâche 0 Story 4.3). À ajouter ultérieurement si nécessaire.
      images: [{ url: "/opengraph-image", alt: dict.meta.ogImageAlt }],
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* No-flash theme init — DOIT être inline et synchrone, AVANT toute peinture.
            `suppressHydrationWarning` sur <html> car le script modifie un attribut
            avant que React hydrate l'arbre — sinon React signale une divergence SSR/CSR
            sur `data-theme`. Pas d'autre impact (l'attribut est posé une seule fois). */}
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Tout premier enfant focusable du body → garantit que `Tab` initial révèle
            le skip link AVANT la `Nav` (Story 4.1 AC#2). */}
        <SkipLink label={dict.a11y.skipToContent} />
        {children}
        <CursorMount />
      </body>
    </html>
  );
}
