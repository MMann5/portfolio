// En-tête de section réutilisé par toutes les sections (cf. design `Minimal.jsx` → `TMSectionHead`) :
//   - colonne gauche : label numéroté monospace (`idx` en accent doré au-dessus du `label`) ;
//   - colonne droite : titre `<h2>` en Cormorant (`font-display`) + sous-titre optionnel (gris muted).
// Reflow en 1 colonne sous le palier `sm`. Pas de `<h1>` ici (le `<h1>` unique du hero = Epic 2 ;
// l'enforcement « un seul `<h1>` » = Story 4.1). Server Component.

type Props = {
  /** Numéro de section (ex. `01`) — facultatif (la section `AI` n'est pas numérotée). */
  idx?: string;
  /** Libellé de section (ex. `About`). */
  label: string;
  /** Titre de section. */
  heading: string;
  /** Sous-titre optionnel. */
  sub?: string;
};

export function SectionHead({ idx, label, heading, sub }: Props) {
  return (
    <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-[auto_1fr] sm:gap-12">
      <div className="font-mono text-label text-fg-subtle sm:pt-2">
        {idx && <div className="text-accent">{idx}</div>}
        <div className="mt-1.5 tracking-wide">{label}</div>
      </div>
      <div>
        <h2 className="font-display text-display-md leading-heading tracking-tight text-fg-strong sm:text-display-xl">
          {heading}
        </h2>
        {sub && (
          <p className="mt-4 max-w-2xl font-sans text-body-lg text-fg-muted">{sub}</p>
        )}
      </div>
    </div>
  );
}
