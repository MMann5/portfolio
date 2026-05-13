// Lien d'évitement « Skip to content » — Server Component (aucune interactivité ⇒ pas de
// `'use client'`). Tout premier enfant focusable du `<body>` (cf. `layout.tsx`), il devient
// visible uniquement au focus CLAVIER (pattern WebAIM `sr-only focus-visible:not-sr-only`).
// Hors focus il reste dans l'arbre d'accessibilité — pas de `display:none`/`visibility:hidden`
// (qui le retireraient des lecteurs d'écran). Cliquer/Enter ancre `<main id="main-content">`,
// présent dans `app/[locale]/page.tsx`. `<main>` n'a PAS besoin de `tabindex="-1"` en HTML5.
//
// `focus-visible:` (et non `focus:`) — Story 4.1 review patch P7 : seul le focus clavier
// révèle le lien ; un `focus()` programmatique ou un clic souris ne fait pas apparaître
// l'overlay (évite les apparitions fantômes).
//
// `z-[10000]` (Story 4.1 review patch P14) doit dépasser le `CustomCursor` (`z-9999/9998`) —
// sinon le ring/dot du curseur custom superposerait le skip link au coin haut-gauche avec un
// `mix-blend-mode: difference` qui distord la couleur. Cohérent avec les autres valeurs en
// dur du repo ; pas de token partagé tant qu'aucun overlay/modal n'est introduit
// (cf. deferred-work review 3.2).

type Props = {
  /** Libellé visible du lien (depuis `dict.a11y.skipToContent`). */
  label: string;
};

export function SkipLink({ label }: Props) {
  return (
    <a
      href="#main-content"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-2 focus-visible:left-2 focus-visible:z-10000 focus-visible:inline-flex focus-visible:min-h-11 focus-visible:items-center focus-visible:rounded-md focus-visible:bg-invert-bg focus-visible:px-4 focus-visible:font-sans focus-visible:text-ui focus-visible:font-medium focus-visible:text-invert-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
    </a>
  );
}
