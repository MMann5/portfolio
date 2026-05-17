import { BackToTopButton } from "@/components/BackToTopButton";

// Pied de page du shell (cf. design `Minimal.jsx` → `<footer>` dans `TMContact`) :
//   - ligne de copyright (depuis le module de contenu) + tagline optionnel ;
//   - bouton « retour en haut » à droite (client `BackToTopButton`) — le scroll smooth
//     est délégué à `scroll-behavior: smooth` sur <html> (globals.css), donc le bouton
//     n'a aucune logique de preferred-motion à porter.
//   - `mt-auto` ⇒ collé en bas (le `<body>` est `min-h-full flex flex-col` et le `<main>` est `flex-1`).
//   - couleur `text-fg-subtle` (#888) — plancher AA pour le petit texte. Server Component.

type Props = {
  /** Ligne de copyright. */
  copyright: string;
  /** Tagline décoratif optionnel. */
  tagline?: string;
  /** Libellé du bouton « retour en haut ». */
  backToTopLabel: string;
};

export function Footer({ copyright, tagline, backToTopLabel }: Props) {
  return (
    <footer className="mt-auto flex flex-wrap items-center justify-between gap-4 border-t border-line px-section-x-mobile py-8 font-mono text-label text-fg-subtle sm:px-section-x">
      <span>{copyright}</span>
      <div className="flex flex-wrap items-center gap-4">
        {tagline && <span>{tagline}</span>}
        <BackToTopButton label={backToTopLabel} />
      </div>
    </footer>
  );
}
