import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

// Polices auto-hébergées via `next/font` (téléchargées au build, servies depuis
// le domaine de l'app — aucune requête runtime vers Google Fonts ; cf. NFR4).
// Inter est la police critique (above-the-fold partout) → `preload` (défaut).
// JetBrains Mono et Cormorant servent plus bas / en décoratif → `preload: false`.
// `display: "swap"` sur les trois → pas de FOIT.

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  preload: false,
});

// Cormorant Garamond n'a pas de version variable sur Google Fonts → poids explicites.
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
  preload: false,
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Michael Mann",
  description: "Senior frontend engineer building production SaaS for global brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
