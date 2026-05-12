"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { useActiveSection } from "@/hooks/useActiveSection";
import { MMLogo } from "@/components/MMLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

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
  versionBadge: string;
  availabilityShort: string;
  availabilityLabel: string;
  /** Libellé du CTA email. */
  ctaEmail: string;
  /** Adresse email (cible `mailto:`). */
  email: string;
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
  /** Sections de nav, dans l'ordre d'affichage. */
  sections: readonly NavSection[];
  // Libellés du LanguageSwitcher (passés tels quels).
  langLabel: string;
  langEnglish: string;
  langFrench: string;
  langChangedTo: string;
};

const NAV_SURFACE =
  "bg-bg/95 supports-[backdrop-filter]:bg-bg/85 backdrop-blur-md";
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Nav({
  locale,
  brandName,
  versionBadge,
  availabilityShort,
  availabilityLabel,
  ctaEmail,
  email,
  ctaCv,
  ctaCvAriaLabel,
  cvPath,
  ariaLabel,
  menuLabel,
  menuClose,
  menuAriaLabel,
  sections,
  langLabel,
  langEnglish,
  langFrench,
  langChangedTo,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection(sections.map((s) => s.id));

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
        onClick={variant === "menu" ? () => setMenuOpen(false) : undefined}
        className={`${base} rounded-sm ${FOCUS_RING} ${
          isActive ? "text-fg" : "text-fg-subtle hover:text-fg"
        }`}
      >
        <span className="text-fg-subtle" aria-hidden="true">
          $&nbsp;
        </span>
        cd ./{section.id}
      </a>
    );
  };

  const availabilityBadge = (text: string) => (
    <span className="flex items-center gap-1.5 font-mono text-label text-fg-subtle">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-status-available"
      />
      {text}
    </span>
  );

  const emailCta = (
    <a
      href={`mailto:${email}`}
      className={`inline-flex min-h-11 items-center gap-2 rounded-md bg-invert-bg px-3.5 font-sans text-ui font-medium text-invert-fg transition-opacity hover:opacity-90 ${FOCUS_RING}`}
    >
      {ctaEmail}
      <span aria-hidden="true" className="font-mono">
        →
      </span>
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

  return (
    <nav
      aria-label={ariaLabel}
      className={`sticky top-0 z-50 border-b border-line ${NAV_SURFACE}`}
    >
      <div className="flex items-center justify-between gap-4 px-section-x-mobile py-3 sm:px-section-x">
        {/* Marque + badge de version (lien « accueil »). */}
        <Link
          href={`/${locale}`}
          aria-label={brandName}
          className={`flex items-center gap-2.5 rounded-sm ${FOCUS_RING}`}
        >
          <MMLogo size={28} />
          <span className="font-sans text-ui font-medium text-fg">{brandName}</span>
          <span className="hidden rounded-sm border border-line px-1.5 py-0.5 font-mono text-label-sm text-fg-subtle sm:inline">
            {versionBadge}
          </span>
        </Link>

        {/* Liens de section — barre desktop. */}
        <ul className="hidden items-center gap-6 lg:flex">
          {sections.map((s) => (
            <li key={s.id}>{sectionLink(s, "bar")}</li>
          ))}
        </ul>

        {/* Actions — desktop. */}
        <div className="hidden items-center gap-4 lg:flex">
          {availabilityBadge(availabilityShort)}
          {emailCta}
          {cvLink}
          {langSwitcher}
        </div>

        {/* Bascule du menu — mobile / tablette. */}
        <button
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
          id="nav-mobile-menu"
          className="flex flex-col gap-4 border-t border-line px-section-x-mobile py-4 sm:px-section-x lg:hidden"
        >
          <ul className="flex flex-col">
            {sections.map((s) => (
              <li key={s.id}>{sectionLink(s, "menu")}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            {availabilityBadge(availabilityLabel)}
            {emailCta}
            {cvLink}
          </div>
          {langSwitcher}
        </div>
      )}
    </nav>
  );
}
