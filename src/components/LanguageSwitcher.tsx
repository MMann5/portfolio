"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { locales, type Locale } from "@/i18n/config";

// Sélecteur de langue — UX « bouton globe + dropdown ».
//   • Bouton : icône globe (SVG inline), `aria-label` = libellé du switcher (« Langue »),
//     `aria-haspopup="menu"`, `aria-expanded`.
//   • Au clic, on ouvre un panneau popover sous le bouton qui contient UNE seule option :
//     la langue OPPOSÉE à celle active (FR si on est en EN, EN si on est en FR).
//   • Sélection → navigation + persistance cookie + annonce aria-live + fermeture.
//   • Fermeture aussi sur Escape, focus sortant, ou clic hors du composant.

function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

type Props = {
  /** Locale active (segment d'URL courant). */
  locale: Locale;
  /** Libellé du contrôle (aria-label du bouton globe), p.ex. « Language » / « Langue ». */
  label: string;
  /** Libellé de l'option anglaise. */
  english: string;
  /** Libellé de l'option française. */
  french: string;
  /** Gabarit d'annonce aria-live ; `{lang}` est remplacé par le libellé de la langue choisie. */
  changedTo: string;
};

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

// Icône globe — SVG inline, taille 16×16. Stroke = currentColor pour suivre la couleur
// du bouton (et donc basculer light/dark automatiquement).
function GlobeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function LanguageSwitcher({
  locale,
  label,
  english,
  french,
  changedTo,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const optionLabels: Record<Locale, string> = { en: english, fr: french };
  // La seule autre langue disponible (binaire EN/FR).
  const other: Locale = locale === "en" ? "fr" : "en";

  function switchTo(next: Locale) {
    if (next === locale) {
      setOpen(false);
      return;
    }

    setLocaleCookie(next);

    const segments = pathname.split("/");
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    // On préserve les query params mais on DROP le hash : sinon, le smooth-scroll
    // global emmène la page traduite vers l'ancre (potentiellement périmée si le
    // scroll-spy avait fait avancer la position sans toucher l'URL). UX standard
    // d'un switch de langue = atterrir en haut de la nouvelle locale.
    const nextPath = (segments.join("/") || `/${next}`) + window.location.search;

    setAnnouncement(changedTo.replace("{lang}", optionLabels[next]));
    setOpen(false);
    router.push(nextPath);
  }

  // Fermeture : Escape, clic en dehors, focus qui sort du composant.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus({ preventScroll: true });
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node | null;
      if (
        t &&
        !buttonRef.current?.contains(t) &&
        !panelRef.current?.contains(t)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line bg-surface px-3 text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
      >
        <GlobeIcon />
        <span aria-hidden="true" className="ml-2 font-mono text-ui-sm uppercase">
          {locale}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          id={menuId}
          role="menu"
          aria-label={label}
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[6rem] overflow-hidden rounded-md border border-line bg-surface shadow-lg"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => switchTo(other)}
            className={`flex w-full min-h-11 items-center gap-2 px-3 font-mono text-ui text-fg-subtle transition-colors hover:bg-surface-2 hover:text-fg ${FOCUS_RING}`}
          >
            <span aria-hidden="true" className="uppercase">{other}</span>
            <span className="font-sans text-ui">{optionLabels[other]}</span>
          </button>
        </div>
      )}

      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
