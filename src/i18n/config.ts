// Configuration i18n — locales supportées et helpers de narrowing.
// Pas de variantes régionales (`en`/`fr`, pas `en-US`/`fr-FR`) : le site n'en a pas besoin.
// L'hébreu (RTL) est une évolution Epic 8 — hors scope ici.

export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const isLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);
