import type { Dictionary } from "@/i18n/dictionaries";

// Carte d'un rôle de la section « 02 — Experience » — Server Component (aucune interactivité).
// Porté du design `Minimal.jsx` → `TMRoleCard` : `<article>` bordé, compteur `01 / 02` décoratif
// en haut à droite, en-tête `company · location`, ligne `title` / `dates · duration`, rangée de
// tuiles KPI, `<ul>` de bullets numérotés, rangée de tags. `<h3>` pour `company` (le `<h1>` est le
// hero, les `<h2>` sont les `SectionHead` — pas de saut de niveau). Toutes les chaînes visibles
// viennent du dictionnaire ; les glyphes décoratifs (`·`, `/`, numéros `01`) sont tolérés en dur.

type Role = Dictionary["sections"]["experience"]["roles"][number];

type Props = {
  role: Role;
  /** Index 0-based du rôle dans la liste (pour le compteur `01 / 02`). */
  idx: number;
  /** Nombre total de rôles (pour le compteur `01 / 02`). */
  total: number;
};

export function RoleCard({ role, idx, total }: Props) {
  return (
    <article className="relative rounded-xl border border-line bg-white/[0.015] p-6 sm:p-8">
      {/* Compteur décoratif. */}
      <div
        aria-hidden="true"
        className="absolute top-4 right-4 font-mono text-label-sm tracking-wide text-fg-subtle"
      >
        {String(idx + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>

      {/* En-tête : company · location. */}
      <div className="flex flex-wrap items-baseline gap-x-3.5 gap-y-1 pr-12">
        <h3 className="font-sans text-display-md font-semibold tracking-snug text-fg-strong">
          {role.company}
        </h3>
        <span aria-hidden="true" className="font-mono text-ui-sm text-fg-subtle">
          ·
        </span>
        <span className="font-mono text-ui-sm text-fg-subtle">{role.location}</span>
      </div>

      {/* Ligne titre / dates · durée. */}
      <div className="mt-1.5 mb-8 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="font-sans text-ui text-fg-muted">{role.title}</span>
        <span className="font-mono text-label text-fg-subtle">
          <span>{role.dates}</span>{" "}
          <span aria-hidden="true" className="text-fg-faintest">
            ·
          </span>{" "}
          <span className="text-accent">{role.duration}</span>
        </span>
      </div>

      {/* Rangée de KPI — 1 colonne ~375px, 3 colonnes ≥ sm. */}
      <div className="mb-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {role.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md border border-line-soft bg-surface-3 p-4"
          >
            <div className="font-sans text-display-sm font-semibold tracking-snug text-accent">
              {kpi.value}
            </div>
            <div className="mt-1 font-mono text-label-sm tracking-wide text-fg-subtle">
              {kpi.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bullets numérotés (numéro mono = pure déco ⇒ `aria-hidden`). */}
      <ul className="flex list-none flex-col gap-3 p-0">
        {role.bullets.map((b, i) => (
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
        {role.tags.map((t) => (
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
