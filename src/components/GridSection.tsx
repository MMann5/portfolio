import type { ReactNode } from "react";

// Conteneur de section « Technical Minimal » (cf. design `Minimal.jsx` → `GridSection`) :
//   - grille de fond décorative = deux rails latéraux bordés (~32px = `--spacing-gutter`)
//     + bordure inférieure de section ;
//   - label monospace de section pivoté `{idx} ↗ {LABEL}` (décoratif → `aria-hidden`) ;
//   - paddings responsive (tokens `--spacing-section-*` desktop, variantes mobile réduites) ;
//   - variante de fond (`bg-bg` / `bg-bg-alt` pour le bandeau clients / `bg-bg-alt2` pour la section AI).
// Server Component (pas d'interactivité).

type Props = {
  /** Cible d'ancrage (`#about`, …) — l'`id` du `<section>`. */
  id: string;
  /** Numéro de section affiché dans le label pivoté (ex. `01`) — facultatif (hero/clients/AI). */
  idx?: string;
  /** Libellé du label pivoté (ex. `About`) — facultatif. */
  label?: string;
  /** Variante de fond. */
  background?: "default" | "alt" | "alt2";
  /** Si `false`, ne pas appliquer les paddings internes (la section gère son propre espacement). */
  padded?: boolean;
  className?: string;
  children: ReactNode;
};

const BACKGROUND_CLASS: Record<NonNullable<Props["background"]>, string> = {
  default: "bg-bg",
  alt: "bg-bg-alt",
  alt2: "bg-bg-alt2",
};

export function GridSection({
  id,
  idx,
  label,
  background = "default",
  padded = true,
  className = "",
  children,
}: Props) {
  const rotatedLabel = [idx, label].filter(Boolean).join(" ↗ ");

  return (
    <section
      id={id}
      className={`relative scroll-mt-24 border-b border-line ${BACKGROUND_CLASS[background]} ${className}`}
    >
      {/* Rails latéraux décoratifs (masqués en mobile pour libérer la largeur). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-gutter border-r border-line sm:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-gutter border-l border-line sm:block"
      />

      {/* Label monospace pivoté (décoratif). */}
      {rotatedLabel && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-6 left-3 hidden origin-top-left -rotate-90 font-mono text-label-sm tracking-wide whitespace-nowrap text-fg-subtle uppercase sm:block"
        >
          {rotatedLabel}
        </span>
      )}

      <div
        className={
          padded
            ? "relative px-section-x-mobile py-section-y-mobile sm:px-section-x sm:py-section-y"
            : "relative"
        }
      >
        {children}
      </div>
    </section>
  );
}
