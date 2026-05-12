"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { locales, type Locale } from "@/i18n/config";

// Sélecteur de langue — autonome ici (sera monté dans la `Nav` en Story 1.3).
// Ne dépend d'aucun état serveur : reçoit ses libellés en props depuis un Server
// Component qui détient le dictionnaire (pas d'import de `getDictionary`/`server-only` ici).

// Persiste la préférence de langue (cookie ~1 an, lu ensuite par `proxy.ts` sur `/`).
// Défini au niveau module : l'écriture de `document.cookie` se fait hors du corps du
// composant (sinon la règle `react-hooks/immutability` la rejette).
function setLocaleCookie(locale: Locale) {
  document.cookie = `NEXT_LOCALE=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

type Props = {
  /** Locale active (segment d'URL courant). */
  locale: Locale;
  /** Libellé du contrôle (aria-label), p.ex. « Language » / « Langue ». */
  label: string;
  /** Libellé de l'option anglaise. */
  english: string;
  /** Libellé de l'option française. */
  french: string;
  /** Gabarit d'annonce aria-live ; `{lang}` est remplacé par le libellé de la langue choisie. */
  changedTo: string;
};

export function LanguageSwitcher({
  locale,
  label,
  english,
  french,
  changedTo,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [announcement, setAnnouncement] = useState("");

  const optionLabels: Record<Locale, string> = { en: english, fr: french };

  function switchTo(next: Locale) {
    if (next === locale) return;

    // 1. Persister la préférence (cookie ~1 an, lu ensuite par `proxy.ts` sur `/`).
    setLocaleCookie(next);

    // 2. Calculer la nouvelle URL = chemin courant avec le segment de locale remplacé.
    const segments = pathname.split("/");
    if (segments[1] && (locales as readonly string[]).includes(segments[1])) {
      segments[1] = next;
    } else {
      segments.splice(1, 0, next);
    }
    const nextPath = segments.join("/") || `/${next}`;

    // 3. Annoncer le changement aux technologies d'assistance.
    setAnnouncement(changedTo.replace("{lang}", optionLabels[next]));

    // 4. Naviguer : le layout se re-rend → `<html lang>` se met à jour.
    router.push(nextPath);
  }

  return (
    <div className="flex items-center gap-3">
      <span
        id="language-switcher-label"
        className="font-mono text-label-sm tracking-wide text-fg-subtle uppercase"
      >
        {label}
      </span>
      <div
        role="group"
        aria-labelledby="language-switcher-label"
        className="flex gap-1"
      >
        {locales.map((l) => {
          const active = l === locale;
          return (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              aria-current={active ? "true" : undefined}
              aria-label={optionLabels[l]}
              className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border px-3 font-mono text-ui uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                active
                  ? "border-accent-border-strong bg-accent-soft text-accent"
                  : "border-line bg-surface text-fg-subtle hover:text-fg"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  );
}
