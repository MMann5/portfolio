import type { Dictionary } from "@/i18n/dictionaries";

// Carte standard (bordée, sans chrome de fenêtre) du 2ᵉ item de la section « 04 — Side Projects »
// (« AI-Driven Development Methodology ») — Server Component (aucune interactivité). Porté du
// design `Minimal.jsx` → `TMProjects` (2ᵉ `<article>`) : en-tête `// personal_framework · {status}`
// + badge de statut lisible + nom `<h3>` + tagline italique, puis les 2 paragraphes de description
// (`description` + `descriptionTwo`, `descriptionTwo` pouvant être `null` ⇒ on filtre), et les
// chips de stack neutres. Pas de lien sortant (`item.url === null`). `<h3>` pour `name` (pas de
// saut de niveau). Toutes les chaînes visibles viennent du dictionnaire (FR19) ; les glyphes
// décoratifs (`//`, `·`) et la reformulation snake_case du `status` sont tolérés.

type ProjectItem = Dictionary["sections"]["projects"]["items"][number];

export function MethodologyCard({ item }: { item: ProjectItem }) {
  const statusSnake = item.status.toLowerCase().replace(/ /g, "_");
  const descriptions = [item.description, item.descriptionTwo].filter(
    (p): p is string => Boolean(p),
  );

  return (
    <article className="rounded-xl border border-line bg-white/[0.015] p-6 sm:p-8">
      <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
        <span aria-hidden="true" className="font-mono text-label text-accent">
          {`// personal_framework · ${statusSnake}`}
        </span>
        <span className="font-mono text-label text-fg-subtle">{item.status}</span>
      </div>

      <h3 className="font-sans text-display-sm font-semibold tracking-snug text-fg-strong wrap-break-word">
        {item.name}
      </h3>

      <p className="mt-3 font-sans text-body-sm text-fg-muted italic leading-snug sm:max-w-md">
        {item.tagline}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {descriptions.map((p, i) => (
          <p key={i} className="font-sans text-body-sm text-fg-body leading-relaxed">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5">
        {item.stack.map((s) => (
          <span
            key={s}
            className="rounded-sm border border-line bg-surface-3 px-2.5 py-1 font-mono text-label text-fg-muted"
          >
            {s}
          </span>
        ))}
      </div>
    </article>
  );
}
