// Bandeau des marques clientes — Server Component, porté du design `Minimal.jsx` → `TMClients`.
// Animation horizontale en boucle via `@keyframes marquee-scroll` (défini dans globals.css) +
// respect de `prefers-reduced-motion` (pause CSS) : Epic 3 / Story 3.1.
// Items triplés (×3) pour un loop seamless ; décalage de -33.333% = 1 jeu de 4 items.
// Aucun `'use client'` — animation purement CSS, `Clients` reste Server Component.

type ClientsProps = {
  /** Maisons clientes — seul `name` est utilisé ici (`note` = hors périmètre Story 2.1). */
  items: readonly { name: string }[];
  /** Libellé mono décoratif `// clients.shipped_to`. */
  shippedToLabel: string;
  /** Libellé mono décoratif `4 houses · via Balink` / `4 maisons · via Balink`. */
  viaLabel: string;
};

export function Clients({ items, shippedToLabel, viaLabel }: ClientsProps) {
  const tripled = [...items, ...items, ...items];

  return (
    <div>
      {/* Barre de libellés (décorative). */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-section-x-mobile pt-8 pb-5 font-mono text-label text-fg-subtle sm:px-section-x">
        <span aria-hidden="true">{shippedToLabel}</span>
        <span aria-hidden="true">{viaLabel}</span>
      </div>

      {/* Bande de wordmarks — entièrement décorative ⇒ `aria-hidden`. */}
      <div aria-hidden="true" className="overflow-hidden">
        <div
          className="animate-marquee flex shrink-0 items-center py-5"
          style={{ width: "max-content" }}
        >
          {tripled.map((item, i) => (
            <span key={i} className="flex items-center">
              <span className="font-display text-marquee text-fg-strong italic">
                {item.name}
              </span>
              <span className="mx-8 font-mono text-label-sm text-fg-faintest sm:mx-12">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
