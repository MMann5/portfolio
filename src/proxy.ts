import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, isLocale } from "./i18n/config";

// Proxy i18n léger (Next 16 : `middleware.ts` est déprécié → `proxy.ts`).
// Rôle unique : sur `/` (et tout chemin sans préfixe de locale), rediriger (307)
// vers la locale préférée — cookie `NEXT_LOCALE` si présent, sinon `Accept-Language`,
// sinon `defaultLocale`. Ne touche pas aux pages, qui restent 100 % SSG.
// Supporté sur Vercel ; non utilisé en `output:'export'` (qu'on n'active pas).

/**
 * Locale supportée la mieux pondérée d'après l'en-tête `Accept-Language`
 * (q-values respectées : tri par q décroissant, `q=0` = langue explicitement refusée),
 * sinon `defaultLocale`.
 */
function localeFromAcceptLanguage(header: string | null): string {
  if (!header) return defaultLocale;
  const matched: { locale: string; q: number }[] = [];
  for (const part of header.split(",")) {
    const segments = part.split(";");
    const tag = segments[0]?.trim().toLowerCase();
    if (!tag || tag === "*") continue;
    const base = tag.split("-")[0];
    if (!base || !isLocale(base)) continue;
    const qParam = segments.slice(1).find((p) => p.trim().startsWith("q="));
    const parsed = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "") : 1;
    const q = Number.isFinite(parsed) ? parsed : 1;
    if (q <= 0) continue; // q=0 ⇒ langue explicitement refusée
    matched.push({ locale: base, q });
  }
  const best = matched.sort((a, b) => b.q - a.q)[0];
  return best ? best.locale : defaultLocale;
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

  // `/` → `/${locale}` (et non `/${locale}/`, qui déclencherait une 2e redirection
  // vers `/${locale}` puisque `trailingSlash` est `false`).
  request.nextUrl.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Constante littérale (analysable au build). Exclut les internes Next, les
  // fichiers de métadonnées et tout fichier à extension (`.png`, `.pdf`, …).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
  ],
};
