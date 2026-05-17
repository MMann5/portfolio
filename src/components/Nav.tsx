"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import type { Locale } from "@/i18n/config";
import { useActiveSection } from "@/hooks/useActiveSection";
import { MMLogo } from "@/components/MMLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

// Barre de navigation persistante, style « terminal » (cf. design `Minimal.jsx` → `TMNav`).
// Composant client (petit, above-the-fold) : scroll-spy (`aria-current`) + menu mobile.
// Ne reçoit que des libellés/valeurs en props (la page Server Component détient le dictionnaire) —
// aucun import de `getDictionary`/`server-only` ici. Le `LanguageSwitcher` (1.2b) est monté tel quel.

type NavSection = {
  /** `id` de la section / cible d'ancrage (`about`, …). */
  id: string;
  /** Numéro de section (`01`…`06`). */
  num: string;
  /** Libellé court de nav. */
  navLabel: string;
};

type Props = {
  locale: Locale;
  brandName: string;
  /** Libellé du CTA de contact principal (cible WhatsApp). */
  ctaEmail: string;
  /** URL WhatsApp (cible `https://wa.me/...`) — ouvre l'app native ou WhatsApp Web. */
  whatsapp: string;
  /** Suffixe visually-hidden « (opens in a new tab) / (ouvre un nouvel onglet) » — Story 4.1 AC#5. */
  opensInNewTabLabel: string;
  /** Libellé du lien CV. */
  ctaCv: string;
  /** `aria-label` du lien CV (le libellé visible est court). */
  ctaCvAriaLabel: string;
  /** Chemin du PDF de CV (servi depuis `public/`). */
  cvPath: string;
  /** `aria-label` du `<nav>`. */
  ariaLabel: string;
  /** Libellé du bouton d'ouverture du menu mobile. */
  menuLabel: string;
  /** Libellé du bouton de fermeture du menu mobile. */
  menuClose: string;
  /** `aria-label` du bouton bascule du menu mobile. */
  menuAriaLabel: string;
  /** `aria-label` du panneau de navigation mobile (région landmark — pattern ARIA APG disclosure). */
  menuPanelLabel: string;
  /** Sections de nav, dans l'ordre d'affichage. */
  sections: readonly NavSection[];
  // Libellés du LanguageSwitcher (passés tels quels).
  langLabel: string;
  langEnglish: string;
  langFrench: string;
  langChangedTo: string;
  // Libellés du ThemeToggle (passés tels quels).
  themeToDark: string;
  themeToLight: string;
  themeLight: string;
  themeDark: string;
  themeChangedTo: string;
};

const NAV_SURFACE =
  "bg-bg/95 supports-[backdrop-filter]:bg-bg/85 backdrop-blur-md";
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Nav({
  locale,
  brandName,
  ctaEmail,
  whatsapp,
  opensInNewTabLabel,
  ctaCv,
  ctaCvAriaLabel,
  cvPath,
  ariaLabel,
  menuLabel,
  menuClose,
  menuAriaLabel,
  menuPanelLabel,
  sections,
  langLabel,
  langEnglish,
  langFrench,
  langChangedTo,
  themeToDark,
  themeToLight,
  themeLight,
  themeDark,
  themeChangedTo,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(sections.map((s) => s.id));
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Dès que le viewport atteint le palier `lg` (la barre desktop prend le relais), on ferme le
  // menu mobile — sinon `menuOpen` / `aria-expanded="true"` restent collés sur le bouton bascule
  // désormais masqué (`lg:hidden`), et revenir sous `lg` rouvre le panneau de façon inattendue.
  // Si le focus était dans le panneau au moment du resize, on le rend au bouton bascule AVANT
  // le démontage pour éviter une chute sur `<body>` (Story 4.1 review patch P2).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(min-width: 1024px)");
    const closeIfDesktop = () => {
      if (!mql.matches) return;
      if (panelRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus({ preventScroll: true });
      }
      setMenuOpen(false);
    };
    closeIfDesktop();
    mql.addEventListener("change", closeIfDesktop);
    return () => mql.removeEventListener("change", closeIfDesktop);
  }, []);

  // Mesure dynamique de la hauteur de la `<nav>` sticky → écrit dans `--nav-height` au niveau
  // du `<html>` (Story 4.1 review patch P10). Le token statique `--spacing-nav-height: 72px`
  // (cf. globals.css) reste le fallback CSS-first ; ResizeObserver remplace par la vraie
  // hauteur au runtime, qui s'adapte au zoom 200%, à l'ouverture du menu mobile, et aux
  // changements de viewport. Les sections (`scroll-mt-[var(--nav-height,72px)]` via la classe
  // `scroll-mt-nav-height` dérivée du token spacing) restent toujours alignées sous la barre.
  useEffect(() => {
    if (typeof window === "undefined" || !window.ResizeObserver) return;
    const navEl = navRef.current;
    if (!navEl) return;
    const root = document.documentElement;
    const apply = () => {
      root.style.setProperty("--nav-height", `${navEl.offsetHeight}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(navEl);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--nav-height");
    };
  }, []);

  // Pattern ARIA APG `disclosure` (Story 4.1 AC#4) : à l'ouverture du panneau mobile, déplacer
  // le focus sur le premier élément focusable + intercepter `Escape` pour fermer et rendre
  // le focus au bouton bascule. PAS de focus-trap cyclique : `Tab` depuis le dernier élément
  // doit pouvoir sortir vers le reste de la page (un menu de nav n'est pas une modale).
  // Le listener Escape est scopé au panneau via `panelRef` (et non au `document`) pour ne pas
  // capturer Escape destiné à un futur dropdown/dialog imbriqué (Story 4.1 review patch P4).
  // `focus({ preventScroll: true })` évite de déplacer le scroll de page (Story 4.1 review P1).
  useEffect(() => {
    if (!menuOpen) return;
    const panel = panelRef.current;
    if (!panel) return;

    const firstFocusable = panel.querySelector<HTMLElement>("a, button");
    firstFocusable?.focus({ preventScroll: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus({ preventScroll: true });
      }
    };
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Clic sur un lien depuis le panneau mobile (Story 4.1 review patch P9) : on ferme le panneau
  // AVANT que le scroll natif vers l'ancre s'effectue, sinon le scroll-margin est calculé alors
  // que le panneau gonfle encore la hauteur de la nav, et la section cible atterrit cachée sous
  // la barre. preventDefault + setMenuOpen(false) + requestAnimationFrame avant push du hash.
  const handleMenuLinkClick = (e: ReactMouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setMenuOpen(false);
    requestAnimationFrame(() => {
      // Double rAF : laisse React commit + paint avant que le navigateur calcule l'ancre.
      requestAnimationFrame(() => {
        window.location.hash = `#${sectionId}`;
      });
    });
  };

  const sectionLink = (section: NavSection, variant: "bar" | "menu") => {
    const isActive = activeSection === section.id;
    const base =
      variant === "bar"
        ? "inline-flex min-h-11 items-center font-mono text-ui-sm"
        : "flex min-h-11 items-center font-mono text-ui";
    return (
      <a
        key={section.id}
        href={`#${section.id}`}
        aria-current={isActive ? "true" : undefined}
        onClick={variant === "menu" ? (e) => handleMenuLinkClick(e, section.id) : undefined}
        className={`${base} rounded-sm ${FOCUS_RING} ${isActive ? "text-fg" : "text-fg-subtle hover:text-fg"
          }`}
      >
        <span className="text-fg-subtle" aria-hidden="true">
          $&nbsp;
        </span>
        cd ./{section.id}
      </a>
    );
  };

  const emailCta = (
    <a
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center gap-2 rounded-md bg-invert-bg px-3.5 font-sans text-ui font-medium text-invert-fg transition-opacity hover:opacity-90 ${FOCUS_RING}`}
    >
      {ctaEmail}
      <span aria-hidden="true" className="font-mono">
        ↗
      </span>
      {/* Pattern WCAG G201 (Story 4.1 AC#5) : libellé visible préservé, suffixe sr-only
          annoncé à l'AT. WhatsApp ouvre l'app native / WhatsApp Web ⇒ nouvel onglet. */}
      <span className="sr-only"> {opensInNewTabLabel}</span>
    </a>
  );

  const cvLink = (
    <a
      href={cvPath}
      download
      aria-label={ctaCvAriaLabel}
      className={`inline-flex min-h-11 items-center rounded-md border border-line px-3 font-sans text-ui text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
    >
      {ctaCv}
    </a>
  );

  const langSwitcher = (
    <LanguageSwitcher
      locale={locale}
      label={langLabel}
      english={langEnglish}
      french={langFrench}
      changedTo={langChangedTo}
    />
  );

  const themeToggle = (
    <ThemeToggle
      toDark={themeToDark}
      toLight={themeToLight}
      lightLabel={themeLight}
      darkLabel={themeDark}
      changedTo={themeChangedTo}
    />
  );

  return (
    <nav
      ref={navRef}
      aria-label={ariaLabel}
      className={`sticky top-0 z-50 border-b border-line ${NAV_SURFACE}`}
    >
      <div className="flex items-center justify-between gap-4 px-section-x-mobile py-3 sm:px-section-x">
        {/* Marque (lien « accueil »). */}
        <Link
          href={`/${locale}`}
          aria-label={brandName}
          className={`flex items-center gap-2.5 rounded-sm ${FOCUS_RING}`}
        >
          <MMLogo size={28} />
          <span className="font-sans text-ui font-medium text-fg">{brandName}</span>
        </Link>

        {/* Liens de section — barre desktop. */}
        <ul className="hidden items-center gap-6 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>{sectionLink(s, "bar")}</li>
          ))}
        </ul>

        {/* Actions — desktop. */}
        <div className="hidden items-center gap-4 lg:flex">
          {emailCta}
          {cvLink}
          {themeToggle}
          {langSwitcher}
        </div>

        {/* Bascule du menu — mobile / tablette. */}
        <button
          ref={toggleRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="nav-mobile-menu"
          aria-label={menuAriaLabel}
          onClick={() => setMenuOpen((open) => !open)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 font-mono text-ui-sm text-fg-subtle hover:text-fg lg:hidden ${FOCUS_RING}`}
        >
          <span aria-hidden="true">{menuOpen ? "×" : "≡"}</span>
          {menuOpen ? menuClose : menuLabel}
        </button>
      </div>

      {/* Panneau du menu — mobile / tablette. */}
      {menuOpen && (
        <div
          ref={panelRef}
          id="nav-mobile-menu"
          aria-label={menuPanelLabel}
          className="flex flex-col gap-4 border-t border-line px-section-x-mobile py-4 sm:px-section-x lg:hidden"
        >
          <ul className="flex flex-col">
            {sections.map((s) => (
              <li key={s.id}>{sectionLink(s, "menu")}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            {emailCta}
            {cvLink}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {themeToggle}
            {langSwitcher}
          </div>
        </div>
      )}
    </nav>
  );
}
