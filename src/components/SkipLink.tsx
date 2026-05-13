// Lien d'évitement « Skip to content » — Server Component (aucune interactivité ⇒ pas de
// `'use client'`). Tout premier enfant focusable du `<body>` (cf. `layout.tsx`), il devient
// visible uniquement au focus clavier (pattern WebAIM `sr-only focus:not-sr-only`). Hors
// focus il reste dans l'arbre d'accessibilité — pas de `display:none`/`visibility:hidden`
// (qui le retireraient des lecteurs d'écran). Cliquer/Enter ancre `<main id="main-content">`,
// présent dans `app/[locale]/page.tsx`. `<main>` n'a PAS besoin de `tabindex="-1"` en HTML5.
//
// `z-50` (= Nav) ne suffirait pas : la `Nav` est `sticky top-0` avec `bg-bg/95` ; sans une
// stacking-order supérieure, le lien resterait sous la barre. `z-[100]` reste cohérent avec
// les autres valeurs en dur du repo (Nav `z-50`, curseur custom `z-9999/9998`) ; pas de
// token partagé tant qu'aucun overlay/modal n'est introduit (cf. deferred-work review 3.2).

type Props = {
  /** Libellé visible du lien (depuis `dict.a11y.skipToContent`). */
  label: string;
};

export function SkipLink({ label }: Props) {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-invert-bg focus:px-4 focus:font-sans focus:text-ui focus:font-medium focus:text-invert-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {label}
    </a>
  );
}
