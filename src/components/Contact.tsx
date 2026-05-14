import type { Dictionary } from "@/i18n/dictionaries";

// Section Contact (`06 — Contact`) — Server Component (aucune interactivité ⇒ pas de `'use client'`).
// Porté du design `Minimal.jsx` → `TMContact` : grille 2 colonnes ≥ `lg` (`1.4fr / 1fr`,
// hauteurs égales) → 1 colonne empilée en mobile/tablette.
//   (a) Carte CTA primaire (panneau gauche) — fond accent doré, libellé déco `// primary_cta`,
//       `<h3>` `primaryCtaLabel`, réassurance `respondWithin`, bouton email + lien CV téléchargeable.
//   (b) Liste de 4 entrées secondaires (panneau droit) — LinkedIn (sortant + `↗`), Téléphone
//       (`tel:`), Localisation et Langues (non-cliquables, rendues comme des `<div>` sémantiques).
// Le `SectionHead` `06 — Contact` est rendu par `page.tsx` au-dessus ; on ne rend QUE le corps.
// Toutes les chaînes visibles viennent du dictionnaire (FR19) ; les glyphes ASCII décoratifs
// (`//`, `→`, `↗`) sont tolérés en dur et `aria-hidden`.
//
// A11y : tap targets ≥ 44px (`min-h-11`) sur tous les `<a>`, anneau de focus visible partout.
// Lien LinkedIn : libellé visible accessible = la valeur (URL), `↗` `aria-hidden` — même choix
// délibéré que le hero et les liens sortants des missions / Maqom (audit a11y exhaustif « ouvre
// un nouvel onglet » déféré à Story 4.1, cf. `deferred-work.md` review 2.1). `target="_blank"`
// ⇒ TOUJOURS `rel="noopener noreferrer"`.

type ContactSection = Dictionary["sections"]["contact"];

type Props = {
  primaryCtaLabel: ContactSection["primaryCtaLabel"];
  respondWithin: ContactSection["respondWithin"];
  ctaCv: ContactSection["ctaCv"];
  ctaCvAriaLabel: ContactSection["ctaCvAriaLabel"];
  secondaryLinks: ContactSection["secondaryLinks"];
  email: Dictionary["meta"]["email"];
  cvPath: Dictionary["meta"]["cvPath"];
  /** Suffixe visually-hidden « (opens in a new tab) / (ouvre un nouvel onglet) » — Story 4.1 AC#5. */
  opensInNewTabLabel: string;
};

// Anneau de focus (jamais d'`outline:none` nu) — 4e copie locale dans le repo (Hero,
// MissionCard, MaqomCard) ⇒ duplication assumée, pas d'extraction d'un module partagé.
const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function Contact({
  primaryCtaLabel,
  respondWithin,
  ctaCv,
  ctaCvAriaLabel,
  secondaryLinks,
  email,
  cvPath,
  opensInNewTabLabel,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">
      {/* (a) Carte CTA primaire — fond gradient accent (linear-gradient inline arbitraire :
          `bg-accent-soft` solide ≈ 0.06 ne reproduit pas la lumière 135deg du design, et il
          n'existe pas de token `bg-accent-soft-strong` à 0.08 ; on garde donc le gradient via
          classe arbitraire Tailwind aux mêmes valeurs rgba que le design). */}
      <div className="rounded-2xl border border-accent-border bg-[linear-gradient(135deg,_rgba(212,165,116,0.08),_rgba(212,165,116,0.02))] p-6 sm:p-8">
        <div aria-hidden="true" className="font-mono text-label text-accent">
          {"// primary_cta"}
        </div>
        <h3 className="mt-3.5 font-sans text-display-md font-semibold tracking-snug text-fg-strong">
          {primaryCtaLabel}
        </h3>
        <p className="mt-2.5 font-sans text-body-sm leading-relaxed text-fg-muted">
          {respondWithin}
        </p>

        {/* Rangée CTAs — bouton email primaire (`bg-invert-bg`) + lien CV bordé (`border-line`).
            Classes identiques à celles du `Hero` pour la cohérence visuelle. `flex-wrap` pour
            que les 2 CTAs puissent passer à la ligne si l'email est long à ~375px. */}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${email}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-11 items-center gap-2 rounded-md bg-invert-bg px-3.5 font-sans text-ui font-medium text-invert-fg transition-opacity hover:opacity-90 ${FOCUS_RING}`}
          >
            {email}
            <span aria-hidden="true" className="font-mono">
              ↗
            </span>
            {/* WCAG G201 (Story 4.1 AC#5) — `mailto:` ouvert en nouvel onglet (Story 5.1 v1.3) :
                pour les utilisateurs avec Gmail web comme handler, l'onglet vide bascule sur la
                compose Gmail ; les clients mail natifs ignorent `target="_blank"` et ouvrent
                directement l'app, l'onglet vide reste mais inoffensif. */}
            <span className="sr-only"> {opensInNewTabLabel}</span>
          </a>
          <a
            href={cvPath}
            download
            aria-label={ctaCvAriaLabel}
            className={`inline-flex min-h-11 items-center rounded-md border border-line px-3 font-sans text-ui text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}`}
          >
            {ctaCv}
          </a>
        </div>
      </div>

      {/* (b) Liste de 3 entrées secondaires — `<ul>` empilée en `gap-2.5` (≈ 10px du design).
          Dispatch « par index » (l'ordre du dico est l'invariant : LinkedIn / Phone /
          Languages) plutôt que par `link.label` (localisé). Mêmes 3 entrées en EN
          et FR — la garde `satisfies Dictionary` est aveugle au contenu des tableaux mais
          la longueur attendue est connue ; non-régression au niveau du composant.
          (Entrée Location retirée Story 5.1.) */}
      <ul className="flex list-none flex-col gap-2.5 p-0">
        {secondaryLinks.map((link, i) => {
          const isLinkedIn = i === 0;
          const isPhone = i === 1;
          // `tel:` n'accepte pas d'espaces — strip uniquement les espaces (le `+` est valide).
          const href = isLinkedIn
            ? link.value
            : isPhone
              ? `tel:${link.value.replace(/\s+/g, "")}`
              : null;

          const labelBlock = (
            // `min-w-0` autorise ce flex item à se contracter sous sa largeur intrinsèque
            // (sinon l'URL LinkedIn de 47 chars sans espace impose une largeur min qui déborde
            // la carte sur viewport ~320px — résout dette différée review 2.4, Story 4.2 AC#3).
            <div className="min-w-0">
              <div
                aria-hidden="true"
                className="font-mono text-label-sm tracking-wider text-fg-subtle uppercase"
              >
                {link.label}
              </div>
              {/* `wrap-anywhere` (overflow-wrap: anywhere) : casse l'URL au besoin pour éviter
                  tout débordement horizontal sur très petit viewport. */}
              <div className="mt-1 font-sans text-body-sm text-fg wrap-anywhere">
                {link.value}
              </div>
            </div>
          );

          return (
            <li key={i}>
              {href ? (
                <a
                  href={href}
                  {...(isLinkedIn
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`flex min-h-11 items-center justify-between gap-4 rounded-lg border border-line bg-white/[0.015] px-5 py-4 transition-colors hover:bg-white/[0.03] ${FOCUS_RING}`}
                >
                  {labelBlock}
                  {isLinkedIn && (
                    <>
                      <span aria-hidden="true" className="font-mono text-fg-subtle">
                        ↗
                      </span>
                      {/* Pattern WCAG G201 : libellé visible préservé, suffixe sr-only annoncé
                          à l'AT (Story 4.1 AC#5). */}
                      <span className="sr-only"> {opensInNewTabLabel}</span>
                    </>
                  )}
                </a>
              ) : (
                // Story 4.1 AC#6 — entrées non-cliquables (Location, Languages) : pas
                // d'encadré ni de `min-h-11` (n'étant pas interactives, la cible tactile
                // ≥44px n'est pas requise) → signale clairement « info statique » vs
                // l'affordance des `<a>` LinkedIn/Phone bordés. `px-5` (= padding horizontal
                // des `<a>` voisins) préservé pour aligner le label mono verticalement
                // dans la liste (Story 4.1 review patch P12).
                <div className="flex items-center px-5 py-2">{labelBlock}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
