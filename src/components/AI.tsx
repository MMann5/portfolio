import type { Dictionary } from "@/i18n/dictionaries";

// Grille des cartes d'outils de la section « AI & Agentic Engineering » (non numérotée, hors nav)
// — Server Component (aucune interactivité). Porté du design `Minimal.jsx` → `TMAI` (panneau
// droit) : une grille de 4 cartes (1 colonne mobile → 2 ≥ `sm`), chacune avec un libellé
// décoratif `0n ↗` `aria-hidden`, le nom `<h3>` et la description. Le `SectionHead`
// (`label`/`heading`/`body`) est déjà rendu par `page.tsx` au-dessus — on garde ce pattern
// commun à toutes les sections plutôt que le layout 2 colonnes de `TMAI` ; ce composant n'ajoute
// que la grille. Reçoit le tableau d'outils en props. `<h3>` pour `tool.name` (le `<h2>` est le
// `SectionHead`, le `<h1>` le hero — pas de saut de niveau). Toutes les chaînes visibles viennent
// du dictionnaire (FR19) ; les libellés `01 ↗`… sont déco.

type AIProps = {
  tools: Dictionary["ai"]["tools"];
};

export function AI({ tools }: AIProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {tools.map((tool, i) => (
        <div key={i} className="rounded-lg border border-line bg-white/[0.02] p-6">
          <div
            aria-hidden="true"
            className="mb-3.5 font-mono text-label-sm tracking-wide text-accent"
          >
            {String(i + 1).padStart(2, "0")} ↗
          </div>
          <h3 className="font-sans text-body-lg font-semibold tracking-snug text-fg-strong">
            {tool.name}
          </h3>
          <p className="mt-1.5 font-sans text-ui text-fg-muted leading-body">{tool.desc}</p>
        </div>
      ))}
    </div>
  );
}
