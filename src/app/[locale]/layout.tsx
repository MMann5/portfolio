import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

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

export const dynamicParams = false;

// URL de base pour les URLs absolues (`canonical`, `hreflang`). Finition SEO (domaine
// custom, sitemap, robots, OG, JSON-LD) = Story 4.3.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://portfolio-three-omega-48ezqd212w.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { "x-default": "/en", en: "/en", fr: "/fr" },
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
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
