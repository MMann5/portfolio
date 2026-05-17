"use client";

import { useState, useSyncExternalStore } from "react";

// Toggle dark/light — composant client.
//
// Architecture :
//   • `data-theme="light"` ou `"dark"` sur <html> (script no-flash dans layout.tsx).
//   • `localStorage.theme` persiste le choix utilisateur (clé `theme`).
//   • Par défaut : suit `prefers-color-scheme` (résolu par le script no-flash AVANT peint).
//   • Fallback : `dark` (état historique du site).
//
// Synchronisation React ↔ DOM : `useSyncExternalStore` subscribe à un MutationObserver
// sur l'attribut `data-theme` de <html>. Pas de `useEffect` initialisant le state depuis
// le DOM (ce qui déclencherait la règle lint `react-hooks/set-state-in-effect`).
//
// A11y :
//   • <button> avec `aria-pressed` indiquant l'état (true = dark, false = light).
//   • `aria-label` localisé reflète l'action prévue (« passer en clair / sombre »).
//   • Annonce aria-live polite à chaque changement.
//
// Hydratation : la version rendue côté serveur prend `getServerSnapshot` (= dark, fallback
// historique). Au montage client, `useSyncExternalStore` lit le vrai `data-theme` (déjà
// posé par le script no-flash). Si le client est en light, l'état React diverge du SSR
// jusqu'au prochain render — `suppressHydrationWarning` sur les éléments concernés
// (l'icône + sa position) empêche le warning sans masquer d'autre divergence.

type Theme = "light" | "dark";

type Props = {
  /** `aria-label` du bouton quand le mode courant est `light` (action proposée : aller en dark). */
  toDark: string;
  /** `aria-label` du bouton quand le mode courant est `dark` (action proposée : aller en light). */
  toLight: string;
  /** Gabarit aria-live ; `{mode}` est remplacé par le mode arrivé. */
  changedTo: string;
  /** Libellé localisé du mode light (`light` / `clair`) — visible dans le bouton ET annonce. */
  lightLabel: string;
  /** Libellé localisé du mode dark (`dark` / `sombre`) — visible dans le bouton ET annonce. */
  darkLabel: string;
};

// Anneau de focus — même valeur que dans Nav/Hero/etc. (jamais d'`outline:none` nu).
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function subscribe(callback: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot(): Theme {
  if (typeof document === "undefined") return "dark";
  const v = document.documentElement.getAttribute("data-theme");
  return v === "light" ? "light" : "dark";
}

function getServerSnapshot(): Theme {
  // Aligné sur le fallback du script no-flash (dark = historique du site).
  return "dark";
}

export function ThemeToggle({
  toDark,
  toLight,
  changedTo,
  lightLabel,
  darkLabel,
}: Props) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [announce, setAnnounce] = useState("");

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage indisponible (mode privé strict) — perte de persistance acceptée.
    }
    setAnnounce(changedTo.replace("{mode}", next === "dark" ? darkLabel : lightLabel));
  }

  const isDark = theme === "dark";
  const ariaLabel = isDark ? toLight : toDark;
  const modeLabel = isDark ? darkLabel : lightLabel;
  const icon = isDark ? "☾" : "☀";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={isDark}
        aria-label={ariaLabel}
        suppressHydrationWarning
        className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-line bg-surface px-3 text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
      >
        {/* Icône — soleil en light, lune en dark. `suppressHydrationWarning` car la
            valeur dépend de `data-theme` qui n'est pas connu côté serveur. */}
        <span aria-hidden="true" suppressHydrationWarning className="leading-none">
          {icon}
        </span>
        <span
          aria-hidden="true"
          suppressHydrationWarning
          className="ml-2 font-mono text-ui-sm uppercase"
        >
          {modeLabel}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {announce}
      </span>
    </div>
  );
}
