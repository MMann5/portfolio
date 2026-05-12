import { AvailabilityBadge } from "@/components/AvailabilityBadge";

// Hero de la page d'accueil — Server Component (aucune interactivité ⇒ pas de `'use client'`).
// Porté du design `Minimal.jsx` → `TMHero`. Reçoit toutes ses données en props depuis la page
// (qui détient le dictionnaire) ; rend uniquement le contenu intérieur de la `GridSection id="hero"`.
// Les glyphes ASCII décoratifs (`$ whoami`, `→`, `↗`, `01 /`…) sont tolérés en dur ; toute autre
// chaîne visible vient du dictionnaire.

type HeroProps = {
  headline: { lead: string; accent: string; tail: string };
  sub: string;
  meta: readonly { label: string; value: string }[];
  whoami: string;
  /** Libellé du badge de disponibilité — réutilise `nav.availabilityLabel` (cohérence AC#2). */
  availabilityLabel: string;
  email: string;
  linkedin: string;
  cvPath: string;
  ctaContact: string;
  ctaLinkedin: string;
  ctaCv: string;
  ctaCvAriaLabel: string;
};

// Anneau de focus partagé (jamais d'`outline:none` nu) — même valeur que dans `Nav`.
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Hero({
  headline,
  sub,
  meta,
  whoami,
  availabilityLabel,
  email,
  linkedin,
  cvPath,
  ctaContact,
  ctaLinkedin,
  ctaCv,
  ctaCvAriaLabel,
}: HeroProps) {
  return (
    <div>
      {/* Ligne `$ whoami → …` — déco ASCII (`$ whoami →`) + valeur (contenu). */}
      <p className="flex flex-wrap items-center gap-3 font-mono text-label text-fg-subtle">
        <span aria-hidden="true">$ whoami</span>
        <span aria-hidden="true" className="text-fg-faintest">
          →
        </span>
        <span>{whoami}</span>
      </p>

      {/* Indicateur de disponibilité — même composant/rendu que la `Nav` (AC#2). */}
      <AvailabilityBadge text={availabilityLabel} className="mt-6" />

      {/* `<h1>` unique de la page (Inter 600, pas Cormorant). Palier de taille mobile réduit
          pour tenir above the fold à ~375×667 ; le fragment doré reste insécable ≥ sm
          (en mobile on laisse le wrap naturel — la traduction FR « SaaS de production »
          déborderait sinon à ~320px). */}
      <h1 className="mt-6 max-w-5xl font-sans text-display-md font-semibold text-fg-strong sm:text-display-xl lg:text-display-2xl">
        {headline.lead}
        <span className="text-accent sm:whitespace-nowrap">{headline.accent}</span>
        {headline.tail}
      </h1>

      {/* Sous-accroche. */}
      <p className="mt-8 max-w-2xl font-sans text-body-lg text-fg-muted">{sub}</p>

      {/* Meta strip — 2 colonnes ≤ ~375px, 4 colonnes ≥ sm. Conteneur `bg-line` + `gap-px` +
          cellules `bg-bg` ⇒ séparateurs 1px ; `overflow-hidden rounded-lg` clippe les coins. */}
      <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:mt-12 sm:grid-cols-4">
        {meta.map((m, i) => (
          <div key={m.label} className="bg-bg px-4 py-4 sm:px-5">
            <div className="font-mono text-label-sm tracking-wider text-fg-subtle uppercase">
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")} / </span>
              {m.label}
            </div>
            <div className="mt-2 font-sans text-body font-medium text-fg">{m.value}</div>
          </div>
        ))}
      </div>

      {/* CTAs — email (bouton primaire), LinkedIn (lien sortant), CV (téléchargement).
          Tap targets ≥ 44px (`min-h-11`), anneau de focus visible. Classes réutilisées de `Nav`. */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${email}`}
          className={`inline-flex min-h-11 items-center gap-2 rounded-md bg-invert-bg px-3.5 font-sans text-ui font-medium text-invert-fg transition-opacity hover:opacity-90 ${FOCUS_RING}`}
        >
          {ctaContact}
          <span aria-hidden="true" className="font-mono">
            →
          </span>
        </a>
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-11 items-center gap-2 rounded-md px-3 font-sans text-ui text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
        >
          {ctaLinkedin}
          <span aria-hidden="true" className="font-mono">
            ↗
          </span>
        </a>
        <a
          href={cvPath}
          download
          aria-label={ctaCvAriaLabel}
          className={`inline-flex min-h-11 items-center rounded-md border border-line px-3 font-sans text-ui text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
        >
          {ctaCv}
        </a>
      </div>
    </div>
  );
}
