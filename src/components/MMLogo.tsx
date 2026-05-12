// Marque « MM » — SVG inline géométrique (cf. design `Minimal.jsx` → `TMLogo`).
// Composant pur, sans état. Décoratif en soi : `aria-hidden` ici ; le libellé
// accessible est porté par le `<Link>`/`<a>` parent (ex. le lien « accueil » de la `Nav`).
// Couleurs : valeurs des tokens `--color-invert-bg` (#ededed) / `--color-invert-fg` (#0a0a0a).

type Props = {
  /** Côté du carré (px). Défaut 32. */
  size?: number;
};

export function MMLogo({ size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="0" y="0" width="32" height="32" rx="6" fill="var(--color-invert-bg)" />
      <text
        x="50%"
        y="56%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-mono)"
        fontSize="14"
        fontWeight="700"
        letterSpacing="-1"
        fill="var(--color-invert-fg)"
      >
        MM
      </text>
    </svg>
  );
}
