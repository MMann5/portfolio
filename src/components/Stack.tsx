import type { Dictionary } from "@/i18n/dictionaries";

// Corps de la section « 05 — Stack » — Server Component (aucune interactivité). Porté du design
// `Minimal.jsx` → `TMStack` : une grille de cartes-groupes (1 colonne ~375px → 2 ≥ `sm` → 3 ≥
// `lg`), chaque groupe affichant son titre `<h3>`, un compteur décoratif `aria-hidden`, et ses
// technologies en chips mono qui wrappent. Le `SectionHead` est déjà rendu par `page.tsx`.
// Reçoit le tableau de groupes en props depuis la page (qui détient le dictionnaire). Toutes les
// chaînes visibles viennent du dictionnaire (FR19) ; le compteur `13` mono est déco.

type StackProps = {
  groups: Dictionary["sections"]["stack"]["groups"];
};

export function Stack({ groups }: StackProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-xl border border-line bg-white/[0.015] p-6"
        >
          <div className="mb-5 flex items-center justify-between">
            <h3 className="font-sans text-body-sm font-semibold text-fg-strong">
              {group.title}
            </h3>
            <span aria-hidden="true" className="font-mono text-label text-fg-subtle">
              {String(group.items.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((it) => (
              <span
                key={it}
                className="rounded-sm border border-line-soft bg-surface-3 px-2.5 py-1 font-mono text-label text-fg-body"
              >
                {it}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
