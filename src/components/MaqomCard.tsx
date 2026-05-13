import type { Dictionary } from "@/i18n/dictionaries";

// Carte « fenêtre-terminal » du projet vedette (Maqom) — section « 04 — Side Projects ».
// Server Component (aucune interactivité ⇒ pas de `'use client'`). Porté du design
// `Minimal.jsx` → `TMProjects` (panneau Maqom) : chrome de fenêtre (3 pastilles « traffic light »
// décoratives + hostname mono + indicateur de statut), puis un corps en 2 colonnes ≥ `lg`
// (panneau gauche : nom `<h3>` + libellé `{url} · CRM` + badge `FEATURED` + tagline + description
// + chips de stack accentués ; panneau droit : `// project_meta` + paires `<dl>` + lien sortant
// `$ open {url} →`). La logo box `48×48` du design est OMISE (asset de marque hors scope —
// pipeline favicon/logo/OG = Epic 4 / AR8 ; pas d'`<img>` 404). `<h3>` pour `name` (le `<h1>`
// est le hero, les `<h2>` les `SectionHead` — pas de saut de niveau). Toutes les chaînes visibles
// viennent du dictionnaire (FR19) ; les glyphes ASCII décoratifs (`$ open`, `→`, `//`, `·`,
// `FEATURED`, `· CRM`, pastilles) sont tolérés en dur. Lien sortant : libellé visible accessible
// = l'URL, `$ open`/`→` `aria-hidden` (même choix délibéré que le lien LinkedIn du hero et les
// liens de mission ; audit a11y exhaustif « nouvel onglet non annoncé à l'AT » → Story 4.1).

// Anneau de focus (jamais d'`outline:none` nu) — même valeur que dans `Hero`/`MissionCard`
// (déjà 2 copies dans le repo ⇒ pas d'extraction d'un module partagé, une 3e copie est OK).
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

type ProjectItem = Dictionary["sections"]["projects"]["items"][number];

type MaqomCardProps = {
  item: ProjectItem;
  /** Suffixe visually-hidden « (opens in a new tab) / (ouvre un nouvel onglet) » — Story 4.1 AC#5. */
  opensInNewTabLabel: string;
};

export function MaqomCard({ item, opensInNewTabLabel }: MaqomCardProps) {
  // Cette carte n'est rendue que pour `item.featured === true` (Maqom) ⇒ `item.url` est non-`null`.
  const url = item.url ?? "";

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-surface">
      {/* Chrome de fenêtre. */}
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-3">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="ml-3 font-mono text-label text-fg-subtle">{url}</span>
        <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-label text-status-available">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-status-available" />
          {item.status}
        </span>
      </div>

      {/* Corps — 1 colonne mobile/tablette → 2 colonnes ≥ `lg` (le panneau méta passe sous le corps). */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr]">
        {/* Panneau gauche. */}
        <div className="p-6 sm:p-8 lg:border-r lg:border-line">
          <div className="mb-6 flex flex-wrap items-center gap-x-3.5 gap-y-2">
            <h3 className="font-sans text-display-sm font-semibold tracking-snug text-fg-strong">
              {item.name}
            </h3>
            <span aria-hidden="true" className="font-mono text-label text-fg-subtle">
              {url} · CRM
            </span>
            <span
              aria-hidden="true"
              className="ml-auto rounded-sm border border-accent-border-strong px-2 py-0.5 font-mono text-label-sm tracking-wide text-accent"
            >
              FEATURED
            </span>
          </div>

          <p className="mb-4 font-sans text-display-sm font-semibold tracking-snug text-fg-strong">
            {item.tagline}
          </p>

          <p className="font-sans text-body-sm text-fg-muted leading-relaxed">
            {item.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-1.5">
            {item.stack.map((s) => (
              <span
                key={s}
                className="rounded-sm border border-accent-border bg-accent-soft px-2.5 py-1 font-mono text-label text-accent"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Panneau droit — méta projet. */}
        <div className="bg-bg-alt p-6 sm:p-8">
          <div aria-hidden="true" className="mb-4 font-mono text-label text-fg-subtle">
            {"// project_meta"}
          </div>

          {item.projectMeta.length > 0 && (
            <dl className="grid gap-3.5">
              {item.projectMeta.map((m) => (
                <div key={m.label} className="flex gap-4 font-sans text-ui">
                  <dt className="w-28 shrink-0 font-mono text-fg-subtle">{m.label}</dt>
                  <dd className="text-fg">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <a
            href={`https://${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-7 inline-flex min-h-11 items-center gap-2 rounded-md border border-accent-border-strong px-3.5 font-mono text-ui text-accent transition-colors hover:bg-accent-soft ${FOCUS_RING}`}
          >
            <span aria-hidden="true">$ open</span> {url} <span aria-hidden="true">→</span>
            {/* Pattern WCAG G201 : libellé visible préservé, suffixe sr-only annoncé à l'AT
                (Story 4.1 AC#5). */}
            <span className="sr-only"> {opensInNewTabLabel}</span>
          </a>
        </div>
      </div>
    </article>
  );
}
