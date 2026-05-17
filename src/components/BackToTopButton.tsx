"use client";

// Bouton « retour en haut » utilisé dans le footer.
// Composant client uniquement pour le gestionnaire `onClick` ; le reste du footer reste
// Server Component. Le scroll smooth/auto est délégué à `scroll-behavior` sur `<html>`
// (cf. globals.css), donc on appelle simplement `window.scrollTo({ top: 0 })` sans
// préciser `behavior` — la valeur dérive automatiquement du media query reduced-motion.

type Props = {
  /** Libellé visible + accessible du bouton (« Retour en haut » / « Back to top »). */
  label: string;
};

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function BackToTopButton({ label }: Props) {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      className={`inline-flex min-h-11 items-center gap-2 rounded-md border border-line px-3 font-mono text-label text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
    >
      <span aria-hidden="true">↑</span>
      {label}
    </button>
  );
}
