// Pied de page du shell (cf. design `Minimal.jsx` → `<footer>` dans `TMContact`) :
//   - ligne de copyright (depuis le module de contenu) + tagline optionnel ;
//   - `mt-auto` ⇒ collé en bas (le `<body>` est `min-h-full flex flex-col` et le `<main>` est `flex-1`).
//   - couleur `text-fg-subtle` (#888) — plancher AA pour le petit texte. Server Component.

type Props = {
  /** Ligne de copyright. */
  copyright: string;
  /** Tagline décoratif optionnel. */
  tagline?: string;
};

export function Footer({ copyright, tagline }: Props) {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line px-section-x-mobile py-8 font-mono text-label text-fg-subtle sm:px-section-x">
      <span>{copyright}</span>
      {tagline && <span>{tagline}</span>}
    </footer>
  );
}
