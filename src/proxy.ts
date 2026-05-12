import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, isLocale } from "./i18n/config";

// Proxy i18n léger (Next 16 : `middleware.ts` est déprécié → `proxy.ts`).
// Rôle unique : sur `/` (et tout chemin sans préfixe de locale), rediriger (307)
// vers la locale préférée — cookie `NEXT_LOCALE` si présent, sinon `Accept-Language`,
// sinon `defaultLocale`. Ne touche pas aux pages, qui restent 100 % SSG.
// Supporté sur Vercel ; non utilisé en `output:'export'` (qu'on n'active pas).

/** Première locale supportée trouvée dans l'en-tête `Accept-Language`, sinon `defaultLocale`. */
function localeFromAcceptLanguage(header: string | null): string {
  if (!header) return defaultLocale;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase();
    if (!tag) continue;
    const base = tag.split("-")[0];
    if (base && isLocale(base)) return base;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (pathnameHasLocale) return;

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale =
    cookieLocale && isLocale(cookieLocale)
      ? cookieLocale
      : localeFromAcceptLanguage(request.headers.get("accept-language"));

  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Constante littérale (analysable au build). Exclut les internes Next, les
  // fichiers de métadonnées et tout fichier à extension (`.png`, `.pdf`, …).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
