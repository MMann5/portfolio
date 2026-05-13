import type { Dictionary } from "@/i18n/dictionaries";

// Carte d'une mission de la section « 03 — Freelance Engagements » — Server Component.
// Dérivé de `RoleCard` (pas de référence design dédiée — la section Freelance a été ajoutée
// après `Minimal.jsx`) : même squelette `<article>` (en-tête, ligne titre/dates, `<ul>` de
// bullets numérotés, rangée de tags), MOINS la rangée de KPI, PLUS un badge de statut, une
// tagline et un lien sortant vers `url` (style `$ open {url} ↗`, cf. carte Maqom du design).
// `<h3>` pour `name` (pas de saut de niveau). Toutes les chaînes visibles viennent du
// dictionnaire ; les glyphes décoratifs (`$ open`, `↗`, `·`, `/`, numéros) sont tolérés en dur.

// Anneau de focus (jamais d'`outline:none` nu) — même valeur que dans `Hero` (2 usages dans le
// repo ⇒ pas d'extraction d'un module partagé).
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type Mission = Dictionary["sections"]["freelance"]["missions"][number];

type Props = {
  mission: Mission;
  /** Index 0-based de la mission dans la liste (pour le compteur `01 / 02`). */
  idx: number;
  /** Nombre total de missions (pour le compteur `01 / 02`). */
  total: number;
  /** Suffixe visually-hidden « (opens in a new tab) / (ouvre un nouvel onglet) » — Story 4.1 AC#5. */
  opensInNewTabLabel: string;
};

export function MissionCard({ mission, idx, total, opensInNewTabLabel }: Props) {
  return (
    <article className="relative rounded-xl border border-line bg-white/[0.015] p-6 sm:p-8">
      {/* Compteur décoratif. */}
      <div
        aria-hidden="true"
        className="absolute top-4 right-4 font-mono text-label-sm tracking-wide text-fg-subtle"
      >
        {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* En-tête : name · location. */}
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 pr-12">
        <h3 className="font-sans text-display-md font-semibold tracking-snug text-fg-strong">
          {mission.name}
        </h3>
        <span aria-hidden="true" className="font-mono text-ui-sm text-fg-subtle">
          ·
        </span>
        <span className="font-mono text-ui-sm text-fg-subtle">{mission.location}</span>
      </div>

      {/* Ligne titre / dates · durée. */}
      <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="font-sans text-ui text-fg-muted">{mission.title}</span>
        <span className="font-mono text-label text-fg-subtle">
          <span>{mission.dates}</span>{" "}
          <span aria-hidden="true" className="text-fg-faintest">
            ·
          </span>{" "}
          <span className="text-accent">{mission.duration}</span>
        </span>
      </div>

      {/* Badge de statut + lien sortant vers l'URL de la mission. */}
      <div className="mt-1.5 mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="inline-flex items-center rounded-sm border border-accent-border bg-accent-soft px-2.5 py-1 font-mono text-label text-accent">
          {mission.status}
        </span>
        <a
          href={`https://${mission.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-11 items-center gap-1.5 font-mono text-label text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
        >
          <span aria-hidden="true">$ open</span> {mission.url}
          <span aria-hidden="true">↗</span>
          {/* Pattern WCAG G201 : libellé visible préservé, suffixe sr-only annoncé à l'AT
              (Story 4.1 AC#5). Convention uniforme entre Hero/Contact/MissionCard/MaqomCard :
              pas de `{" "}` JSX explicite avant l'icône aria-hidden — le whitespace texte JSX
              entre éléments siblings gère le rendu visuel, et l'AT ne lit qu'un seul espace
              avant le suffixe sr-only (Story 4.1 review patch P8). */}
          <span className="sr-only"> {opensInNewTabLabel}</span>
        </a>
      </div>

      {/* Tagline de la mission. */}
      <p className="mb-7 max-w-2xl font-sans text-body text-fg-muted leading-relaxed">
        {mission.tagline}
      </p>

      {/* Bullets numérotés (numéro mono = pure déco ⇒ `aria-hidden`). */}
      <ul className="flex list-none flex-col gap-3 p-0">
        {mission.bullets.map((b, i) => (
          <li
            key={i}
            className="flex gap-3.5 font-sans text-body-sm text-fg-body leading-snug"
          >
            <span aria-hidden="true" className="shrink-0 pt-0.5 font-mono text-fg-faintest">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Tags technologiques. */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {mission.tags.map((t) => (
          <span
            key={t}
            className="rounded-sm border border-line bg-surface-3 px-2.5 py-1 font-mono text-label text-fg-muted"
          >
            {t}
          </span>
        ))}
      </div>
    </article>
  );
}
