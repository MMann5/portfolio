import { Fragment } from "react";

// Bandeau des marques clientes — Server Component, porté du design `Minimal.jsx` → `TMClients`,
// SANS l'animation horizontale ni le respect de `prefers-reduced-motion` (Epic 3 / Story 3.1) :
// ici, bande statique qui reflowe via `flex-wrap` (zéro débordement horizontal sur mobile).
// Rendu à l'intérieur de la `GridSection id="clients"` (`background="alt"`, `padded={false}`) :
// le composant gère donc son propre padding horizontal — `px-section-x*` (20/80px) > `w-gutter`
// (32px), donc le contenu dégage bien les rails latéraux décoratifs.
// Toute la bande de wordmarks est décorative (`aria-hidden`) : les noms de maisons sont en texte
// accessible ailleurs (section Experience). Les libellés mono sont aussi décoratifs.

type ClientsProps = {
  /** Maisons clientes — seul `name` est utilisé ici (`note` = hors périmètre Story 2.1). */
  items: readonly { name: string }[];
  /** Libellé mono décoratif `// clients.shipped_to`. */
  shippedToLabel: string;
  /** Libellé mono décoratif `4 houses · via Balink` / `4 maisons · via Balink`. */
  viaLabel: string;
};

export function Clients({ items, shippedToLabel, viaLabel }: ClientsProps) {
  return (
    <div>
      {/* Barre de libellés (décorative). */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-section-x-mobile pt-8 pb-5 font-mono text-label text-fg-subtle sm:px-section-x">
        <span aria-hidden="true">{shippedToLabel}</span>
        <span aria-hidden="true">{viaLabel}</span>
      </div>

      {/* Bande de wordmarks — entièrement décorative ⇒ `aria-hidden`. `flex-wrap` ⇒ pas de
          scroll horizontal (les wordmarks passent à la ligne) ; l'animation d'Epic 3 remplacera
          ce wrap par un défilement `transform`. */}
      <div aria-hidden="true" className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-section-x-mobile py-5 sm:gap-x-12 sm:px-section-x">
          {items.map((item, i) => (
            <Fragment key={item.name}>
              <span className="font-display text-3xl text-fg-strong italic sm:text-marquee">
                {item.name}
              </span>
              {i < items.length - 1 && (
                <span className="font-mono text-label-sm text-fg-faintest">·</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
