# Story 2.4: Section Contact, contenu FR/EN complet, CV & finition responsive

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor and as the owner (Michael),
I want a contact section (primary email CTA + LinkedIn + secondary info), the full FR+EN content populated, a downloadable CV, no links to private repos or Balink, and consistent responsive behavior across all sections,
so that the page is complete, contactable, and fully usable from mobile to desktop in both languages.

## Acceptance Criteria

1. **Section Contact (`06 — Contact`) — CTA email primaire + CV + LinkedIn + infos secondaires, depuis le contenu typé.** Étant donné la section `contact` et son contenu typé (`dict.sections.contact` + `dict.meta`), quand elle est rendue, alors le `SectionHead` (label `06 — Contact`, heading, sub — déjà câblés par `page.tsx`) est suivi d'un corps en **2 zones** : (a) **carte CTA primaire** (style fenêtre-accent doré, cf. `TMContact`) — libellé déco mono `// primary_cta` (`aria-hidden`), accroche `{contact.primaryCtaLabel}` (`<h3>`), ligne de réassurance `{contact.respondWithin}`, un **bouton email primaire** `<a href="mailto:{meta.email}">` affichant l'**adresse email** + glyphe `→` (`aria-hidden`), et un **lien CV** secondaire `<a href={meta.cvPath} download aria-label={contact.ctaCvAriaLabel}>` (téléchargement, libellé `{contact.ctaCv}`) — **tap targets ≥ 44px** (`min-h-11`), anneau de focus visible (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`) ; (b) **liste de 4 liens/cartes secondaires** (`{contact.secondaryLinks[]}`) rendant LinkedIn (`<a href={…} target="_blank" rel="noopener noreferrer">` + `↗` `aria-hidden`, libellé visible accessible = la valeur), Téléphone (`<a href="tel:{…}">`), Localisation et Langues (rendus comme blocs **non-cliquables** — pas de `<a>` ; un `<div>` avec libellé mono + valeur suffit). Chaque entrée affiche son **libellé mono** (`{link.label}`, uppercase déco) + sa **valeur** (`{link.value}`). Toutes les chaînes visibles viennent du contenu typé dans la locale active — aucune chaîne codée en dur (les glyphes ASCII décoratifs `//`, `→`, `↗`, `·` restent tolérés en dur). Le triplet `(nav, hero, contact)` permet de **déclencher un contact email depuis ces 3 endroits**. (FR8, FR10, FR12, FR13, FR19, FR33, FR34, NFR12, UX-DR13.)

2. **CV téléchargeable depuis le hero ET depuis la section contact.** Étant donné le contenu typé, quand la page est rendue, alors le **lien CV** (`<a href={meta.cvPath} download>`, `cvPath = "/cv/michael-mann-cv.pdf"`) est fonctionnel et présent dans : la `Nav` (livré en Story 1.3), le `Hero` (livré en Story 2.1) **et** la section `Contact` (cette story) ; ouvrir le lien depuis n'importe lequel des 3 endroits **télécharge le PDF courant** servi à un chemin stable. Aucune nouvelle copie du PDF, aucun nouveau chemin — réutilisation de `meta.cvPath`. (FR14, FR25.)

3. **Aucun lien vers Balink, dépôts de code ou projets clients sous secret.** Étant donné l'ensemble du site après cette story, quand on inspecte le HTML pré-rendu (`.next/server/app/{en,fr}.html`) et chaque composant ajouté/touché, alors **aucun `href` ne pointe** vers : `github.com`/`gitlab.com`/`bitbucket.org` (ou tout autre dépôt de code), `balink` (sous quelque forme), ou un projet client sous NDA. Le mot « Balink » apparaît bien dans le **texte accessible** des bullets de la section Experience (`dict.sections.experience.roles[0].bullets` — c'est l'employeur de Mike), mais **jamais** comme lien sortant. (FR10.) *(Audit exhaustif des liens + correction LinkedIn 404 = Story 9.1 ; cette story ne fait qu'**ajouter** la section contact sans introduire de nouveau lien interdit.)*

4. **Contenu FR + EN complet et utilisé par les composants — pas de chaîne codée en dur.** Étant donné le contenu typé du dictionnaire (`src/i18n/dictionaries/en.ts` source de vérité, `fr.ts satisfies Dictionary`), quand la page est rendue, alors **toutes les sections** (hero, about, experience, freelance, projects, stack, ai, contact, footer) consomment leur contenu **uniquement** depuis le module de dictionnaire dans la locale active — aucune chaîne visible codée en dur (les glyphes ASCII décoratifs `$`, `→`, `↗`, `·`, `//`, `01`, `FEATURED`, `· CRM`, `// primary_cta` restent tolérés en dur). Les **clés ajoutées par cette story** dans `dict.sections.contact` (`ctaCv`, `ctaCvAriaLabel`) existent dans **les deux locales** (la garde `… satisfies Dictionary` casse le build si une clé manque). *(La parité FR/EN au niveau du **contenu des tableaux** — non couverte par la garde de type — est explicitement cadrée pour **Story 9.1** ; cette story ne ré-vérifie pas le contenu existant, elle ajoute juste 2 clés × 2 locales.)* (FR19, FR24, NFR20, NFR21.)

5. **Finition responsive transversale (~375px → desktop, FR + EN), pré-rendu statique préservé, zéro régression.** Étant donné la page d'accueil dans les deux locales, quand `npm run build` tourne, alors `/en` et `/fr` restent **pré-rendues en statique** (`dynamicParams = false`), aucun composant nouveau n'introduit de `'use client'` (`Contact` est un **Server Component**), `npm run typecheck` et `npm run lint` passent. À ~375px : la section contact reflowe proprement (carte CTA primaire pleine largeur, liste de 4 cartes secondaires empilée en 1 colonne, tap targets des liens ≥ 44px), **aucun scroll horizontal** sur **toute la page** (hero / clients / about / experience / freelance / projects / stack / ai / contact / footer) ; les chips de tags/stack continuent de wrapper, les longues valeurs de `project_meta` wrappent, le `<h1>` du hero ne déborde pas. Tout l'existant (shell Story 1.3, hero/marquee Story 2.1, About/Experience/Freelance Story 2.2, Projects/Stack/AI Story 2.3) reste fonctionnel. Aucune animation introduite (le fondu au défilement = Epic 3 / Story 3.1). (NFR3, NFR4, NFR6, NFR12, NFR16, NFR21, NFR22, FR34.)

## Tasks / Subtasks

- [x] **Tâche 0 — Pré-lecture obligatoire (Next 16 + design + dette + patterns)**
  - [x] AGENTS.md l'impose : **lire les docs Next dans `node_modules/next/dist/docs/`** avant d'écrire du code — ce n'est pas le Next.js de ta mémoire. Risque faible pour cette story (1 Server Component statique, 0 nouveau routing, 0 nouvelle dépendance) — survoler malgré tout : `…/01-app/01-getting-started/05-server-and-client-components.md` (rappel : `Contact` reste **serveur** — aucun `'use client'`), `…/03-api-reference/03-file-conventions/page.md` (rappel : `params` est une `Promise` — déjà géré, ne pas y toucher). Heeder tout avis de dépréciation.
  - [x] Lire le design de référence : `_bmad-output/planning-artifacts/design/Minimal.jsx` → **`TMContact`** (≈ L737–831 — *grille `1.4fr / 1fr`* `gap 48 alignItems:stretch` : (a) **panneau gauche** carte border `#2a2a2a` rounded 12 padding 36 fond *gradient* `linear-gradient(135deg, rgba(212,165,116,0.08), rgba(212,165,116,0.02))` : libellé `// primary_cta` mono `11 #d4a574 mb 14` ; `<h3>` `Drop me a line.` `32 600 -0.02em #fafafa` ; `<p>` `I respond within 24 hours.` `14 #a3a3a3 mt 10` ; bouton email `mt 28` `inline-flex gap 12` bg `#ededed` color `#0a0a0a` padding `14px 22px` rounded 8 `15 500` affichant `{meta.email}` + `→` mono ; (b) **panneau droit** `flex flex-col gap 10` : 4 rangées `<a>` border `#1f1f1f` rounded 8 padding `16px 20px` flex justify-between fond `rgba(255,255,255,0.015)` color `#ededed` — pour chaque rangée : `<div>` `<div mono 10 #666 uppercase tracking 0.12em mb 4>{k}</div>` `<div fontSize 14>{v}</div>` + à droite glyphe `<span mono #666>{ico}</span>` (`↗` pour LinkedIn, `📞` Phone, `◎` Location, `✶` Languages — `null` pour `href` sur Location/Languages = pas de lien). Sous la grille, **un `<footer>` interne** est rendu par `TMContact` (`mt 80 pt 28 borderTop #1f1f1f` ; copyright + `built with care · ashdod ↗ everywhere`) — **chez nous : NE PAS le porter ici**, le `<Footer/>` est déjà rendu **séparément** par `page.tsx` (hors `GridSection id="contact"`, via le composant `Footer` du shell Story 1.3) — laisser tel quel. ⚠️ Le design utilise des **styles inline** et des **couleurs en dur** (`#fafafa`, `#a3a3a3`, `#666`, `#1f1f1f`, `#2a2a2a`, `#ededed`, `#0a0a0a`, `48`, `36`, etc.) — chez nous, **toujours** via les classes Tailwind / tokens de `globals.css` (table d'équivalence en Dev Notes), et **remonter** les gris trop faibles (`#666`/`#555`/`#444`) à `text-fg-subtle` pour tout texte (séparateurs/numéros purs `//`/`·` peuvent rester `text-fg-faintest`). Les icônes emoji (`📞`/`◎`/`✶`) ne sont **pas portées** (multi-plateforme inconsistant, hors design system) — un simple glyphe `↗` pour LinkedIn suffit, les 3 autres entrées n'ont pas de glyphe.
  - [x] Lire `…/design/content.md` § **Contact** (≈ L222+) — pour information : le **contenu typé est déjà en place** (Story 1.3) dans `src/i18n/dictionaries/en.ts` (source de vérité) + `fr.ts` (`… satisfies Dictionary`), section `sections.contact` — **complet pour les deux locales**, y compris `heading`, `sub`, `body`, `primaryCtaLabel`, `respondWithin`, `secondaryLinks[]` (4 entrées : LinkedIn / Phone / Location / Languages). Cette story **n'ajoute QUE 2 clés** au dictionnaire (`contact.ctaCv` + `contact.ctaCvAriaLabel` — libellés du lien CV de la carte CTA primaire, cf. Tâche 1) et **ne crée AUCUN autre contenu**. La finition/relecture/correction du contenu existant (LinkedIn 404, parité au niveau des tableaux, exactitude factuelle, smoke responsive approfondi) est explicitement cadrée pour la **Story 9.1** — ne pas la dupliquer ici.
  - [x] Relire les patterns établis :
    - **Story 2.1** (`_bmad-output/implementation-artifacts/2-1-section-hero-marquee-des-marques-clientes.md`) : pattern d'ajout de clés `cta*` au dico (`hero.ctaContact` / `ctaLinkedin` / `ctaCv` / `ctaCvAriaLabel`), **classes des CTAs** `emailCta` (`inline-flex min-h-11 items-center gap-2 rounded-md bg-invert-bg px-3.5 font-sans text-ui font-medium text-invert-fg transition-opacity hover:opacity-90`) et `cvLink` (`inline-flex min-h-11 items-center rounded-md border border-line px-3 font-sans text-ui text-fg-subtle transition-colors hover:text-fg`), `FOCUS_RING` constante locale, pattern lien sortant + `<a download aria-label={…}>`.
    - **Story 2.2** (`_bmad-output/implementation-artifacts/2-2-sections-about-experience-freelance-engagements.md`) : Server Components à props, types dérivés de `Dictionary["sections"]["…"]`, dispatch sur `section.id` dans le `.map(sectionList)` de `page.tsx`, table d'équivalence design → tokens, `<article>` pour les contenus autonomes, `<div>` pour les cartes UI non-autonomes.
    - **Story 2.3** (`_bmad-output/implementation-artifacts/2-3-sections-side-projects-stack-ai-agentic-engineering.md`) : carte fenêtre-terminal Maqom (chrome + corps + panneau méta), pattern carte avec en-tête mono accentué (`// project_meta`, `// personal_framework`), lien sortant `$ open {url} →` (libellé visible = l'URL, glyphes `aria-hidden`).
    - **`MissionCard`** (`src/components/MissionCard.tsx`) : exemple le plus proche d'un composant avec **lien sortant + badge accentué** (`bg-accent-soft border-accent-border text-accent`).
    - **`Hero.tsx`** : référence directe pour les **classes des CTAs** (email primaire `bg-invert-bg` + CV bordé secondaire `border-line`).
    - **`Footer.tsx`** : exemple de composant ultra-simple à props nues — pas de sur-ingénierie ici.
    - Et `deferred-work.md` → l'item **« Lien sortant — ouvre un nouvel onglet non annoncé à l'AT »** (review 2.1) : il **s'applique au lien LinkedIn** de cette section — reproduire le **même** choix délibéré (libellé visible = la valeur LinkedIn, `↗` `aria-hidden`, pas d'`aria-label` complémentaire), l'audit a11y exhaustif restant cadré pour la **Story 4.1**.

- [x] **Tâche 1 — Ajouter au modèle de contenu typé les libellés CV du contact (AC: #1, #2, #4)**
  - [x] Le bloc `sections.contact` du dictionnaire (Story 1.3) contient déjà `id`/`num`/`navLabel`/`label`/`heading`/`sub`/`body`/`primaryCtaLabel`/`respondWithin`/`secondaryLinks` — tout sauf les libellés du **lien CV** ajouté à la carte CTA primaire. Ajouter dans `src/i18n/dictionaries/en.ts` (source de vérité — **pas** de `as const`, cf. pattern 1.2b/1.3/2.1) **puis** `src/i18n/dictionaries/fr.ts` (`… satisfies Dictionary`), à l'intérieur de `sections.contact`, **exactement 2 clés** :
    - `ctaCv` — EN `"Download CV"` / FR `"Télécharger le CV"` (libellé visible — **mêmes valeurs** que `hero.ctaCv` pour la cohérence ; tu peux même y faire référence dans un commentaire, mais ne **pas** factoriser — duplication assumée, 2 sites d'affichage logiquement indépendants).
    - `ctaCvAriaLabel` — EN `"Download CV (PDF)"` / FR `"Télécharger le CV (PDF)"` (idem cohérence avec `hero.ctaCvAriaLabel` / `nav.ctaCvAriaLabel`).
  - [x] **Ne PAS toucher** au reste de `sections.contact` (pas de retouche de `heading`/`sub`/`body`/`primaryCtaLabel`/`respondWithin`/`secondaryLinks`), ni au reste des dictionnaires (`meta`, `nav`, `hero`, `clients`, `sections.{about,experience,freelance,projects,stack}`, `ai`, `footer`, `langSwitcher`). Toute correction de contenu existant (LinkedIn 404, exactitude factuelle, parité FR/EN au niveau tableaux, stack honesty, proofreading) = **Story 9.1**.
  - [x] `npm run typecheck` vert (la garde `satisfies Dictionary` casse si une clé manque ou diverge entre `en` et `fr`).

- [x] **Tâche 2 — Composant `Contact` (Server Component) (AC: #1, #2)**
  - [x] Créer `src/components/Contact.tsx` — **Server Component** (pas de `'use client'`). Type des props **dérivé du dictionnaire** pour éviter toute dérive (cohérent avec 2.2/2.3) :
    ```ts
    type ContactSection = Dictionary["sections"]["contact"];
    type Props = {
      primaryCtaLabel: ContactSection["primaryCtaLabel"];
      respondWithin: ContactSection["respondWithin"];
      ctaCv: ContactSection["ctaCv"];
      ctaCvAriaLabel: ContactSection["ctaCvAriaLabel"];
      secondaryLinks: ContactSection["secondaryLinks"];
      email: Dictionary["meta"]["email"];
      cvPath: Dictionary["meta"]["cvPath"];
    };
    ```
    *(Variante acceptable : passer l'objet `contact` entier + `meta.email`/`meta.cvPath` — moins explicite mais plus court ; à ton choix, rester cohérent avec le style des autres composants de la home.)* Rend **uniquement** le corps de la section (le `SectionHead` `06 — Contact` est déjà rendu par `page.tsx` au-dessus — ne pas le dupliquer). Inséré comme enfant de `GridSection id="contact"` (déjà `padded`).
  - [x] Constante locale `FOCUS_RING` (3ᵉ copie dans le repo — cohérent avec `Hero`/`MissionCard`/`MaqomCard`, pas d'extraction d'un module partagé, sur-ingénierie pour 1 usage par composant) :
    ```ts
    const FOCUS_RING =
      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
    ```
  - [x] Structure / style (cf. `TMContact`) :
    - **Conteneur racine** : `<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-stretch">` (1 colonne mobile/tablette → 2 colonnes `1.4fr / 1fr` ≥ `lg`, hauteurs égales en flex-stretch quand côte à côte ; `gap-8` desktop ≈ `48px` du design — `gap-12 lg:gap-12` est défendable mais `gap-8` est plus serré sur mobile ; à ton choix, documenter).
    - **(a) Carte CTA primaire** (panneau gauche) :
      - `<div className="rounded-2xl border border-accent-border bg-gradient-to-br from-accent-soft-strong to-accent-soft p-6 sm:p-8">` (rayon `rounded-2xl` = 12px ; `border-accent-border` ≈ `rgba(212,165,116,0.3)` — token existant ; **gradient** : Tailwind `bg-gradient-to-br` + 2 couleurs accent — le design utilise `linear-gradient(135deg, rgba(212,165,116,0.08), rgba(212,165,116,0.02))` ; on a `bg-accent-soft` (~0.06) et un éventuel `bg-accent-soft-strong` (~0.08) ; **vérifie les tokens disponibles dans `globals.css`** avant de coder — si seul `bg-accent-soft` existe, **ne pas inventer de token** : applique un dégradé via classes arbitraires Tailwind `bg-[linear-gradient(135deg,_rgba(212,165,116,0.08),_rgba(212,165,116,0.02))]` **ou** un simple `bg-accent-soft` solide sans gradient — à ton choix, **documenter**. Le rendu lisible/AA prime sur la fidélité pixel).
      - **Libellé déco** : `<div aria-hidden="true" className="font-mono text-label text-accent">{"// primary_cta"}</div>` (le `// primary_cta` est de la **déco ASCII** tolérée — voir aussi le `// project_meta` de la carte Maqom 2.3 ; ⚠️ `react/jsx-no-comment-textnodes` interprète `//` en JSX comme un commentaire → toujours **wrapper en expression** `{"// primary_cta"}` (cf. apprentissage 2.3 dans le Debug Log).
      - **Accroche `<h3>`** : `<h3 className="mt-3.5 font-sans text-display-sm font-semibold tracking-snug text-fg-strong">{primaryCtaLabel}</h3>` (28px ; `<h3>` car le `<h1>` est le hero et `<h2>` les `SectionHead` ; cohérent avec les noms de carte 2.2/2.3).
      - **Réassurance** : `<p className="mt-2.5 font-sans text-body-sm text-fg-muted leading-relaxed">{respondWithin}</p>` (14px ; reflète `14 #a3a3a3 mt 10` du design).
      - **Rangée des CTAs** : `<div className="mt-7 flex flex-wrap items-center gap-3">` :
        1. **Bouton email primaire** — `<a href={\`mailto:${email}\`} className={\`inline-flex min-h-11 items-center gap-2 rounded-md bg-invert-bg px-3.5 font-sans text-ui font-medium text-invert-fg transition-opacity hover:opacity-90 ${FOCUS_RING}\`}>{email}<span aria-hidden="true" className="font-mono">→</span></a>` — **classes identiques** au CTA email du `Hero` (et de la `Nav`) pour la cohérence visuelle ; **libellé visible = l'email** (cohérent avec le design — c'est pratique : on lit l'adresse directement) ; `mailto:` simple, **sans** `?subject=` (cohérent avec hero/nav). **Tap target ≥ 44px** (`min-h-11`). Anneau de focus.
        2. **Lien CV** secondaire — `<a href={cvPath} download aria-label={ctaCvAriaLabel} className={\`inline-flex min-h-11 items-center rounded-md border border-line px-3 font-sans text-ui text-fg-subtle transition-colors hover:text-fg ${FOCUS_RING}\`}>{ctaCv}</a>` — **classes identiques** au lien CV du `Hero` (et de la `Nav`) pour la cohérence ; `<a download>` avec **`aria-label` explicite** (`Download CV (PDF)` / FR), même pattern que hero/nav. Tap target ≥ 44px.
    - **(b) Liste de 4 entrées secondaires** (panneau droit) :
      - Conteneur : `<ul className="flex list-none flex-col gap-2.5 p-0">` (4 rangées empilées avec `gap-10px` ≈ `gap-2.5`, cf. design `gap 10`).
      - Itérer `secondaryLinks` (toujours dans l'ordre du dico : `[LinkedIn, Phone, Location, Languages]`) en branchant sur `link.label` pour décider du rendu cliquable :
        ```tsx
        {secondaryLinks.map((link, i) => {
          // Construire le href selon le libellé (les libellés sont identiques en EN ; en FR la valeur est traduite).
          // ⚠️ `link.label` est localisé (EN "LinkedIn"/"Phone"/"Location"/"Languages", FR "LinkedIn"/"Téléphone"/"Localisation"/"Langues").
          // Préférer un dispatch **par index** (toujours dans le même ordre dans le dico) plutôt que par `label` (qui change avec la locale) :
          const isLinkedIn = i === 0;
          const isPhone = i === 1;
          const href = isLinkedIn ? link.value : isPhone ? `tel:${link.value.replace(/\s+/g, "")}` : null;
          const external = isLinkedIn;
          return (
            <li key={i}>
              { href ? (
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`flex min-h-11 items-center justify-between gap-4 rounded-lg border border-line bg-white/[0.015] px-5 py-4 text-fg transition-colors hover:bg-white/[0.03] ${FOCUS_RING}`}
                >
                  <div>
                    <div aria-hidden="true" className="font-mono text-label-sm tracking-wider text-fg-subtle uppercase">{link.label}</div>
                    <div className="mt-1 font-sans text-body-sm text-fg">{link.value}</div>
                  </div>
                  {external && <span aria-hidden="true" className="font-mono text-fg-subtle">↗</span>}
                </a>
              ) : (
                <div className="flex min-h-11 items-center justify-between gap-4 rounded-lg border border-line bg-white/[0.015] px-5 py-4">
                  <div>
                    <div aria-hidden="true" className="font-mono text-label-sm tracking-wider text-fg-subtle uppercase">{link.label}</div>
                    <div className="mt-1 font-sans text-body-sm text-fg">{link.value}</div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
        ```
      - **`<a target="_blank">` ⇒ TOUJOURS `rel="noopener noreferrer"`** (LinkedIn). **Tap target ≥ 44px** (`min-h-11` sur le `<a>`/`<div>` — `min-h-11` ne s'applique strictement qu'aux liens cliquables, mais l'appliquer aux 4 entrées rend la grille visuellement régulière ; les 2 entrées non-cliquables ne sont pas focusables — non-régression a11y).
      - **`tel:` pour le téléphone** : normaliser via `link.value.replace(/\s+/g, "")` pour produire `tel:+972584220567` (les espaces ne sont pas autorisés dans un `tel:` URI). **Ne PAS** normaliser autre chose (pas de diacritiques sur un numéro de téléphone, le `+` est valide).
      - **Libellé visible accessible** : pour le lien LinkedIn, le libellé visible accessible = la valeur (l'URL) — **même choix délibéré** que le lien LinkedIn du hero et les liens sortants des missions / Maqom (audit a11y exhaustif déféré à **Story 4.1**, cf. `deferred-work.md` review 2.1). Pas d'`aria-label` complémentaire ; le `↗` est `aria-hidden`. Pour le lien `tel:` (Phone), pareil — le libellé visible (le numéro) suffit.
      - **Aucune chaîne visible codée en dur** dans le composant — tout vient de `secondaryLinks[i].label`/`value` ; le glyphe `↗` est déco `aria-hidden`. *(Le dispatch « par index » est documenté en commentaire dans le code : l'ordre du dico est l'invariant — il est respecté par `en.ts` et `fr.ts` aujourd'hui ; cohérent avec `Hero` qui mappe `meta[]` aussi par index. Alternative défendable : un mini-helper `getHrefForSecondaryLink(i, value)` ; sur-ingénierie pour 4 entrées.)*
  - [x] Aucune chaîne visible codée en dur dans `Contact` (tout vient des props) — déco ASCII (`//`, `→`, `↗`) tolérée.

- [x] **Tâche 3 — Câbler `Contact` dans la page d'accueil (AC: #1–#5)**
  - [x] `src/app/[locale]/page.tsx` (async Server Component — **mécanique inchangée** : `await params` → `isLocale` sinon `notFound()` → `await getDictionary(locale)` → destructuration `{ meta, nav, hero, clients, sections, ai, footer, langSwitcher }`) :
    - Dans le `.map(sectionList)` existant, **ajouter le dispatch** pour `contact` après le `<SectionHead>`, à côté de ceux d'`about`/`experience`/`freelance`/`projects`/`stack` déjà en place, en lisant les données **typées** sur `sections.contact` (et `meta` pour `email`/`cvPath`) :
      ```tsx
      {section.id === "contact" && (
        <Contact
          primaryCtaLabel={sections.contact.primaryCtaLabel}
          respondWithin={sections.contact.respondWithin}
          ctaCv={sections.contact.ctaCv}
          ctaCvAriaLabel={sections.contact.ctaCvAriaLabel}
          secondaryLinks={sections.contact.secondaryLinks}
          email={meta.email}
          cvPath={meta.cvPath}
        />
      )}
      ```
      Et **retirer** le commentaire `{/* contact : corps = Story 2.4 */}` qui réservait la place.
    - Ajouter l'import : `import { Contact } from "@/components/Contact";`.
    - **Ne pas toucher** au reste de `page.tsx` : la `Nav`, le `GridSection id="hero"` + `<Hero/>`, le `GridSection id="clients"` + `<Clients/>`, les dispatch `about`/`experience`/`freelance`/`projects`/`stack` (Stories 2.2/2.3), le bloc `GridSection id="ai"` + `<SectionHead>` + `<AI/>` (Story 2.3), le `Footer`, `<main id="main-content" className="flex flex-1 flex-col">`, la dérivation `navSections` depuis `Object.values(sections)`.
  - [x] **Aucune chaîne visible codée en dur** dans `page.tsx` / `Contact` (tout vient de `dict`) — déco ASCII (`//`, `→`, `↗`) tolérée.
  - [x] **Ne pas toucher** : `src/proxy.ts` (le `config.matcher` reste tel quel — dette « routes de métadonnées sans extension » toujours reportée à 4.3 ; aucune route ajoutée), `src/app/[locale]/layout.tsx`, `src/app/[locale]/not-found.tsx`, `src/i18n/config.ts`, `src/i18n/dictionaries/index.ts`, **le reste** de `src/i18n/dictionaries/en.ts`/`fr.ts` (uniquement l'ajout des 2 clés `contact.ctaCv` + `contact.ctaCvAriaLabel`), `src/components/{Nav,Hero,Clients,AvailabilityBadge,GridSection,SectionHead,Footer,LanguageSwitcher,MMLogo,About,Experience,RoleCard,FreelanceEngagements,MissionCard,Projects,MaqomCard,MethodologyCard,Stack,AI}.tsx`, `src/hooks/useActiveSection.ts`, `src/app/globals.css`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `public/cv/michael-mann-cv.pdf` (le CV est déjà servi depuis 1.3 — ne pas le remplacer ; remplacement éventuel = Story 9.1 si Mike fournit un PDF mis à jour).

- [x] **Tâche 4 — Vérification « aucun lien Balink / repo / NDA » (AC: #3)**
  - [x] Après build, inspecter le HTML pré-rendu (`.next/server/app/{en,fr}.html`) — `grep -i` (mentalement) pour : `github.com`, `gitlab.com`, `bitbucket.org`, `balink` (sous toute forme), et tout `href` suspect. **Aucun match attendu** : Mike n'a aucun lien sortant vers ces destinations dans le dictionnaire d'aujourd'hui — la vérification est une **non-régression** que cette story n'introduit rien d'interdit, **pas** une réécriture de contenu (= Story 9.1 si quelque chose ressort).
  - [x] Le mot **« Balink »** apparaît dans le **texte accessible** de la section Experience (c'est l'employeur de Mike — `dict.sections.experience.roles[0].company` et `dict.clients.viaLabel` « 4 houses · via Balink ») — c'est **correct** et **voulu** : c'est du texte de présentation, pas un lien. Ne **pas** masquer ces occurrences. La règle FR10 = pas de **lien** vers Balink (ou repos), pas pas-de-mention.
  - [x] *(Hors périmètre — Story 9.1)* : Audit complet des liens sortants (validité, fix du LinkedIn 404), correction de contenu, parité FR/EN au niveau des tableaux, relecture stack. Cette tâche **constate** l'état actuel pour la non-régression de **cette** story uniquement.

- [x] **Tâche 5 — Validation (AC: #1–#5)**
  - [x] `npm run typecheck` (`tsc --noEmit`) → 0 erreur. La garde `… satisfies Dictionary` (dans `fr.ts`) **doit casser** si tu ajoutes `ctaCv`/`ctaCvAriaLabel` dans `en.ts` mais pas dans `fr.ts` (ou inversement) — vérifier qu'elle reste effective.
  - [x] `npm run lint` (`eslint`) → 0 erreur. ⚠️ Apprentissage Story 2.3 (`react/jsx-no-comment-textnodes`) : tout libellé JSX commençant par `//` (ex. `// primary_cta`) est interprété comme un commentaire JSX et casse le lint — **toujours** wrapper en expression : `<div>{"// primary_cta"}</div>`. **Cette story ré-utilise ce libellé** dans la carte CTA primaire ⇒ **veiller** au pattern dès le premier jet.
  - [x] `npm run build` → succès. Vérifier dans la sortie : `● /[locale]` **pré-rendu en statique** pour `/en` et `/fr` ; aucune route serveur dynamique de page introduite ; `ƒ Proxy (Middleware)` toujours listé (attendu) ; le poids JS de la home **n'augmente pas** (le nouveau composant `Contact` est un Server Component — 0 JS client ajouté ; NFR3/NFR7).
  - [x] Inspection du HTML pré-rendu (`.next/server/app/{en,fr}.html`) — couvre le smoke en environnement headless :
    - Section `#contact` : sous le `<h2>` (SectionHead `06 — Contact`), un corps en 2 zones (1 colonne en mobile, 2 colonnes côte à côte en desktop) :
      - **Carte CTA primaire** : libellé déco `// primary_cta`, `<h3>` (`Drop me a line.` / FR `Écrivez-moi un mot.`), `<p>` (`I respond within 24 hours.` / FR `Je réponds sous 24 heures.`), **bouton `<a href="mailto:michael.mann55@gmail.com">`** affichant l'email + `→` `aria-hidden`, **lien `<a href="/cv/michael-mann-cv.pdf" download aria-label="Download CV (PDF)">`** (FR `Télécharger le CV (PDF)`) libellé `Download CV` / FR `Télécharger le CV`.
      - **Liste secondaire** : **4 `<li>`** dans l'ordre LinkedIn / Phone / Location / Languages ;
        - LinkedIn : `<a href="https://www.linkedin.com/in/michaelmann-339545149" target="_blank" rel="noopener noreferrer">` + libellé mono `LinkedIn` + valeur + glyphe `↗` `aria-hidden`. *(⚠️ Cette URL **404e aujourd'hui** — cf. Story 9.1 ; on l'affiche tel quel ici sans le « corriger », c'est le travail de 9.1.)*
        - Phone : `<a href="tel:+972584220567">` (espaces strippés) + libellé mono `Phone` / FR `Téléphone` + valeur (`+972 58 422 0567`, affichage avec espaces).
        - Location : **non cliquable** (`<div>`) + libellé mono `Location` / FR `Localisation` + valeur (`Ashdod, Israel` / FR `Ashdod, Israël`).
        - Languages : **non cliquable** (`<div>`) + libellé mono `Languages` / FR `Langues` + valeur (`French · Hebrew · English` / FR `Français · Hébreu · Anglais`).
    - **Un et un seul `<h1>`** sur toute la page (le hero — vérifier qu'aucun composant de cette story n'introduit un `<h1>`).
    - **Aucun nouveau `<article>`** (la carte CTA primaire et la liste secondaire ne sont **pas** des contenus autonomes ⇒ `<div>` + `<ul>`/`<li>`, conformément aux conventions de 2.3 pour `Stack`/`AI`). Total `<article>` sur la page = **6** (inchangé par rapport à 2.3 : 2 Experience + 2 Freelance + 2 Projects).
    - Numérotation : nav (`Object.values(sections)`) et `SectionHead` ⇒ `01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact` — cohérent, inchangé.
    - **Aucun `href`** dans le HTML pré-rendu pointe vers `github.com`/`gitlab.com`/`bitbucket.org`/`balink…` (vérification de non-régression — Tâche 4).
    - Non-régression complète : `<Hero/>` (1 `<h1>`, CTAs, meta strip, badge), `<Clients/>` (wordmarks `aria-hidden`), sections 2.2 (`About` 2 colonnes, 2 `RoleCard`, 2 `MissionCard`), sections 2.3 (`Projects` Maqom fenêtre-terminal + méthodo, `Stack` 3 groupes, `AI` 4 outils), `Nav` sticky + scroll-spy (`aria-current`), ancres `#about`…`#contact` (+ `#ai` hors nav), `Footer` (séparé), `<html lang>` correct.
  - [x] (Si `npm run dev` est disponible) smoke `/en` **et** `/fr` à ~375px : la section contact reflowe en **1 colonne** (carte CTA primaire pleine largeur, puis liste de 4 entrées secondaires empilée) ; tap sur le bouton email → ouvre `mailto:michael.mann55@gmail.com` ; tap sur le lien CV → télécharge `/cv/michael-mann-cv.pdf` ; tap sur LinkedIn → ouvre l'URL en nouvel onglet (`rel="noopener noreferrer"`) ; tap sur le téléphone (sur mobile réel) → propose un appel via `tel:`. **Aucun scroll horizontal** sur **toute la page** (hero / clients / about / experience / freelance / projects / stack / ai / contact / footer). Vérifier aussi au zoom 200%. `prefers-reduced-motion: reduce` : rien à neutraliser ici (aucune animation dans cette story).
  - [x] (Optionnel mais recommandé) passe a11y rapide axe DevTools sur `/en` et `/fr` → 0 erreur **nouvelle** ; vérifier : hiérarchie de titres cohérente (`<h2>` SectionHead → `<h3>` carte CTA primaire, pas de saut) ; contraste des textes (`text-fg-strong` `<h3>`, `text-fg-muted` `respondWithin`, `text-fg` valeurs secondaires, `text-fg-subtle` libellés mono uppercase, `text-accent` libellé déco `// primary_cta` — tous AA pour leurs tailles, cf. audit en tête de `globals.css`) ; ne pas utiliser `text-fg-faint` (#666) / `text-fg-faintest` (#444) pour du texte courant (déco uniquement) ; le bouton email primaire (`bg-invert-bg` = #ededed / `text-invert-fg` = #0a0a0a) a un contraste massif (~17:1, conforme AAA). L'audit a11y exhaustif (focus-trap menu mobile, annonce « ouvre un nouvel onglet », contraste exhaustif) reste cadré pour **Story 4.1**.
  - [x] Commit Conventional Commits, message simple, **sans** trailer `Co-Authored-By` (sauf demande explicite). Suggestion : `feat(story-2.4): contact section + CV link + responsive polish`. *(À la discrétion de Mike — convention du repo « committer seulement si demandé ».)*
  - [x] Le repo distant connecté à Vercel → un `push` sur `main` déclenche le déploiement auto (aucune action manuelle ; pas de PR requis — `gh` CLI installé mais non authentifié, se bloque dans cet environnement). Push laissé à la discrétion de Mike.
  - [x] Remplir le *Dev Agent Record* (modèle, Debug Log, Completion Notes, File List) + le *Change Log*.

### Review Findings

- [x] [Review][Defer] Dispatch par index (`isLinkedIn = i === 0`, `isPhone = i === 1`) — `Contact.tsx:94–101` — deferred, pre-existing; pattern explicitement assumé par spec et Completion Notes (même risque que 2.2/2.3 defer). Si l'ordre de `secondaryLinks` change dans le dico, comportement silencieusement cassé.
- [x] [Review][Defer] `key={i}` sur `secondaryLinks.map` — `Contact.tsx:116` — deferred, pre-existing; données statiques, aucun risque de réconciliation aujourd'hui (cf. deferred-work.md review-2.2/2.3).
- [x] [Review][Defer] PII (URL LinkedIn + téléphone) dupliqués dans `en.ts` et `fr.ts` — `en.ts:334–335` — deferred; non localisées, pourraient diverger; consolider dans `meta` lors de **Story 9.1** (fix LinkedIn 404 déjà prévu).
- [x] [Review][Defer] `tel:` normalisation strips espaces uniquement — `Contact.tsx:100` — deferred; safe avec la valeur actuelle `+972 58 422 0567`; si format change (parenthèses, tirets), `tel:` URI potentiellement malformé.
- [x] [Review][Defer] Lien LinkedIn libellé accessible = URL brute + `target="_blank"` sans annonce AT — `Contact.tsx:118–130` — deferred, même choix que hero/missions (cf. deferred-work.md review-2.1); audit a11y exhaustif = **Story 4.1**.
- [x] [Review][Defer] Glyphe `→` dans `<a>` email : `aria-hidden` sur enfant inline d'élément interactif — `Contact.tsx:72–74` — deferred, pattern pré-existant cohérent avec Hero/Nav; inconsistance AT théorique = **Story 4.1**.
- [x] [Review][Defer] Smoke browser à ~320px non exécuté (clause dev agent) — `Contact.tsx:66–84` — deferred; `flex-wrap` présent, email 27 chars, aucun débordement attendu; vérifier lors de l'audit responsive — **Story 9.1**.
- [x] [Review][Defer] Entrées non-cliquables (Location, Languages) visuellement identiques aux cliquables — `Contact.tsx:132–136` — deferred, design intentionnel; ambiguïté d'affordance = **Story 4.1**.

## Dev Notes

### Contexte & état du système (lire avant de coder)

- **Cette story = Epic 2, Story 4/4 — la dernière de la home.** Le shell (Nav, GridSection, SectionHead, Footer, i18n FR/EN, scroll-spy, page statique) est livré (Story 1.3, `done`). Le hero + le marquee clients + `AvailabilityBadge` (Story 2.1, `done`). Les sections About / Experience / Freelance Engagements + composants `About`/`Experience`/`RoleCard`/`FreelanceEngagements`/`MissionCard` (Story 2.2, `done`). Les sections Side Projects / Stack / AI & Agentic Engineering + composants `Projects`/`MaqomCard`/`MethodologyCard`/`Stack`/`AI` (Story 2.3, `done`). Le **modèle de contenu typé est déjà complet** pour toutes les sections (`src/i18n/dictionaries/en.ts` = source de vérité, `fr.ts` = `… satisfies Dictionary`) — y compris `sections.contact` (heading, sub, body, primaryCtaLabel, respondWithin, secondaryLinks). **Cette story ajoute UNIQUEMENT** : (a) 2 clés au dico (`contact.ctaCv` + `contact.ctaCvAriaLabel`, dans les 2 locales), (b) 1 Server Component (`src/components/Contact.tsx`), (c) le câblage dans `page.tsx` (dispatch sur `section.id === "contact"`, 1 import).
- **Cette story NE FAIT PAS** (= Story 9.1 — `ready-for-dev`) :
  - Corriger le **lien LinkedIn 404** (`https://www.linkedin.com/in/michaelmann-339545149` est faux ; à remplacer par l'URL réelle de Mike — partout, 6 occurrences).
  - Auditer la validité de tous les liens sortants existants.
  - Relire / corriger l'exactitude factuelle de tout le contenu (entreprises, dates, KPI, stack, etc.).
  - Vérifier la **parité FR/EN au niveau du contenu des tableaux** (la garde `… satisfies Dictionary` est aveugle au contenu des tableaux — `deferred-work.md` review 1.3).
  - Relire / corriger la section Stack (« honnêteté » : les technos listées sont défendables en entretien ?).
  - Remplacer le CV PDF si Mike fournit une version mise à jour.
- **Fichiers à MODIFIER (lis-les en entier d'abord) :**
  - `src/app/[locale]/page.tsx` — aujourd'hui : Server Component statique qui monte `Nav` + `GridSection id="hero"` (`<Hero/>`) + `GridSection id="clients"` (`<Clients/>`) + un `.map(sectionList)` rendant 6 `GridSection`+`SectionHead` (corps `about`/`experience`/`freelance` câblés en 2.2 ; `projects`/`stack` câblés en 2.3 ; `contact` = corps vide avec un commentaire `{/* contact : corps = Story 2.4 */}`) + `GridSection id="ai"` (`SectionHead` + `<AI/>`, câblé en 2.3) + `Footer`. **Ce que cette story change :** dans le `.map(sectionList)`, remplace le commentaire par `section.id === "contact" && <Contact … />` ; ajoute 1 import. **À préserver :** tout le reste.
  - `src/i18n/dictionaries/en.ts` — **ajout uniquement** des 2 clés `contact.ctaCv` + `contact.ctaCvAriaLabel`. **Aucune autre modification.**
  - `src/i18n/dictionaries/fr.ts` — idem (mêmes 2 clés, traduites en FR). La garde `… satisfies Dictionary` casse si une des 2 clés manque ⇒ ajouter les 2 dans les 2 locales en une seule passe.
- **Fichiers à NE PAS toucher :** `src/proxy.ts`, `src/app/[locale]/{layout,not-found}.tsx`, `src/i18n/config.ts`, `src/i18n/dictionaries/index.ts`, **le reste** de `src/i18n/dictionaries/en.ts`/`fr.ts` (uniquement l'ajout des 2 clés `contact.ctaCv`/`contact.ctaCvAriaLabel`), `src/components/{Nav,Hero,Clients,AvailabilityBadge,GridSection,SectionHead,Footer,LanguageSwitcher,MMLogo,About,Experience,RoleCard,FreelanceEngagements,MissionCard,Projects,MaqomCard,MethodologyCard,Stack,AI}.tsx`, `src/hooks/useActiveSection.ts`, `src/app/globals.css`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `public/cv/michael-mann-cv.pdf` (le CV est déjà servi depuis 1.3 ; remplacement éventuel = 9.1).

### Patterns d'architecture & garde-fous

- **Server Components par défaut.** `Contact` n'a **aucune** interactivité ⇒ **pas** de `'use client'`. Il reçoit ses données en **props** depuis `page.tsx` (qui fait le seul `await getDictionary(locale)`) — n'importe **jamais** `getDictionary`/`server-only` dans un composant ; ne **jamais** embarquer le dictionnaire côté client. C'est le pattern établi par `SectionHead`/`Footer`/`Hero`/`Clients`/`About`/`Experience`/`RoleCard`/`MissionCard`/`Projects`/`MaqomCard`/`MethodologyCard`/`Stack`/`AI` (props pures) ; `Nav` est l'unique exception client (scroll-spy/menu).
- **Tokens & classes 1.2a uniquement (table d'équivalence design → tokens) :** `#2a2a2a`→**`border-accent-border`** (pour la carte CTA primaire — son fond gradient accent suggère une bordure accentuée plutôt que `border-line` neutre ; **vérifier** dans `globals.css` que `border-accent-border` existe ≈ `rgba(212,165,116,0.3)` — c'est utilisé par `MissionCard` pour le badge statut et par `MaqomCard` pour le lien `$ open`) · `#1f1f1f`→`border-line` (cartes secondaires) · `#fafafa`→`text-fg-strong` (titre `<h3>` `primaryCtaLabel`) · `#ededed`→`text-fg` (valeurs `secondaryLinks[].value`) · `#a3a3a3`→`text-fg-muted` (réassurance `respondWithin`) · `#888`→`text-fg-subtle` (libellés mono uppercase `LinkedIn`/`Phone`/`Location`/`Languages`, glyphe `↗` — **plancher AA petit texte**) · `#666`→**ne pas** utiliser pour du texte (audit AA — `text-fg-faint` `<` 4.5:1 sur `#0a0a0a` pour 10–11px) · `#d4a574`→`text-accent` (libellé déco `// primary_cta`) · `bg-accent-soft`/`bg-accent-soft-strong`→fond gradient de la carte CTA primaire (**vérifier les tokens dispo** ; fallback : `bg-accent-soft` solide ou classe arbitraire Tailwind avec le gradient inline — cf. Tâche 2 (a)) · `#ededed`→`bg-invert-bg` (bouton email primaire, fond) · `#0a0a0a`→`text-invert-fg` (bouton email primaire, texte) · `rgba(255,255,255,0.015)`→`bg-white/[0.015]` (fond des 4 entrées secondaires) · `rgba(255,255,255,0.03)`→`bg-white/[0.03]` (état `hover` des entrées secondaires) · `36`→`p-8` (panneaux desktop — uniformisé) · `24`→`p-6` mobile · `48`→`gap-8` / `gap-12` (à ton choix) · `10`→`gap-2.5` (espace entre rangées secondaires) · `14`→`text-body-sm` · `15`→`text-ui` (bouton email primaire — `13px text-ui` est défendable aussi, mais `15px text-body` match le design ; à ton choix, documenter) · rayons : carte CTA primaire `12`→`rounded-2xl`, rangées secondaires `8`→`rounded-lg`, bouton email `8`→`rounded-md` (cohérent avec Hero/Nav) · **Polices :** `font-sans` (Inter — `<h3>`, paragraphes, valeurs secondaires, bouton email, lien CV), `font-mono` (JetBrains Mono — libellés `// primary_cta`, `LinkedIn`/`Phone`/`Location`/`Languages` uppercase, glyphes), `font-display` (Cormorant — **pas utilisé ici** ; réservé aux `<h2>` SectionHead et wordmarks).
- **Sémantique & hiérarchie de titres :** `<h1>` = hero (unique) ; `<h2>` = `SectionHead` (déjà en place pour `06 — Contact`) ; la **carte CTA primaire** utilise `<h3>` pour `primaryCtaLabel` (pas de saut h2→h4). **Aucun `<article>`** dans cette story (la carte CTA et les 4 entrées secondaires ne sont **pas** des contenus autonomes — `<div>` + `<ul>`/`<li>`, cf. conventions 2.3 pour `Stack`/`AI`). La liste secondaire = `<ul>` `list-none` + 4 `<li>` (sémantique correcte — c'est une liste). **Tous les glyphes décoratifs** (`//`, `→`, `↗`) = `aria-hidden`.
- **Liens & a11y (minimal et correct — NFR12) :**
  - **Lien email primaire** `<a href="mailto:{email}">` — libellé visible = l'**email**, suivi d'un `→` `aria-hidden`. Pas d'`aria-label` complémentaire (l'email visible suffit comme nom accessible).
  - **Lien CV** `<a href={cvPath} download aria-label={ctaCvAriaLabel}>` — `aria-label` explicite `"Download CV (PDF)"` / FR (cohérent avec Hero/Nav — informe du format).
  - **Lien LinkedIn** `<a href="…" target="_blank" rel="noopener noreferrer">` — libellé visible = la **valeur** (URL), `↗` `aria-hidden`. **Pas d'`aria-label`** complémentaire annonçant « ouvre un nouvel onglet » — choix délibéré (cf. `deferred-work.md` review 2.1 ; audit a11y exhaustif déféré à 4.1). `target="_blank"` ⇒ **toujours** `rel="noopener noreferrer"`.
  - **Lien `tel:`** (Phone) — libellé visible = la valeur (numéro avec espaces). `href` normalisé (sans espaces). Pas de glyphe (le numéro est lui-même évident comme cliquable visuellement via le style de carte).
  - **Location / Languages** = **non-cliquables** (`<div>` à l'intérieur d'un `<li>`, **pas** un `<a>`) — ce ne sont pas des liens, juste de l'info. Pas focusables.
  - Tap targets **≥ 44px** (`min-h-11`) sur tous les `<a>`. Anneau de focus partout (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`) — jamais d'`outline:none` nu.
- **Mobile-first (viewport cible ~375px ; audit fin 320px = Story 4.2/4.x).** Carte CTA primaire : `grid-cols-1 lg:grid-cols-[1.4fr_1fr]` (la carte CTA passe au-dessus de la liste secondaire en mobile/tablette ; les 2 colonnes côte à côte à partir de `lg`). Carte CTA primaire : `p-6 sm:p-8`. CTAs : `flex-wrap` (le bouton email + le lien CV passent à la ligne si nécessaire). Liste secondaire : 1 colonne empilée — chaque rangée est un `<a>`/`<div>` `flex items-center justify-between` avec libellé + valeur à gauche, glyphe à droite. **Zéro scroll horizontal** sur toute la page à ~375px (et viser propre à 320px — attention au bouton email primaire dont le libellé = l'adresse email longue : il **doit** wrapper ou rester compact ; `flex-wrap` sur le conteneur des CTAs + le bouton lui-même doit pouvoir `break-words` ou être simplement compact via la `gap-2` et le texte `text-ui` ; **smoke à 375px** indispensable).
- **Animations : aucune dans cette story.** Le fondu au défilement des blocs (`useScrollFadeIn`) = Story 3.1 ; ici, rendu statique. Ne pas ajouter d'`@keyframes`, de `next/dynamic`, de hook d'animation, ni de classe d'animation. Pas de `hover` animation lourd — un simple `transition-colors` sur les cartes secondaires (changement de fond `bg-white/[0.015]` → `bg-white/[0.03]`) est acceptable et léger.
- **Hot path lint (apprentissages 1.2b/1.3/2.3) :** `react-hooks/immutability` rejette les mutations dans le corps d'un composant — non concerné (aucun hook ; composants purs sans état). `react-hooks/exhaustive-deps` — idem. **`react/jsx-no-comment-textnodes`** rejette `//` au début d'un nœud texte JSX → **toujours** wrapper en expression : `{"// primary_cta"}` au lieu de `// primary_cta` (apprentissage du Debug Log de la Story 2.3). Pas de `'use client'` introduit (sinon on alourdit le bundle pour rien — NFR3). Clés React : préférer l'**index** ou un id stable au lieu de `link.label` (les libellés sont localisés et l'ordre est l'invariant — cohérent avec la dette `deferred-work.md` review 2.2 et 2.3) ; au minimum, ne pas régresser par rapport à ce pattern.

### Source du contenu (déjà dans le dictionnaire — NE PAS réécrire ; ajouter 2 clés)

- `dict.sections.contact` aujourd'hui : `id`=`"contact"`, `num`=`"06"`, `navLabel`/`label`=`"Contact"`, `heading` (`"Let's build something lasting."` / FR `"Construisons quelque chose qui dure."`), `sub` (déjà rendus par `SectionHead`), `body` (variante plus courte du `sub` — **non utilisée** par cette story ; on peut la laisser en place pour ne rien casser ; si elle te dérange, ouvre un item de cleanup en `deferred-work.md` plutôt que de la retirer ici sans concertation), `primaryCtaLabel` (`"Drop me a line."` / FR `"Écrivez-moi un mot."`), `respondWithin` (`"I respond within 24 hours."` / FR `"Je réponds sous 24 heures."`), `secondaryLinks` = tableau de **4 entrées `{label, value}`** :
  - `{ label: "LinkedIn", value: "https://www.linkedin.com/in/michaelmann-339545149" }` (FR : `label: "LinkedIn"` même valeur — nom propre non traduit ; `value` identique — ⚠️ **cette URL 404e**, correction = Story 9.1).
  - `{ label: "Phone" / "Téléphone", value: "+972 58 422 0567" }`.
  - `{ label: "Location" / "Localisation", value: "Ashdod, Israel" / "Ashdod, Israël" }`.
  - `{ label: "Languages" / "Langues", value: "French · Hebrew · English" / "Français · Hébreu · Anglais" }`.
- **À ajouter (Tâche 1) :** `ctaCv` (EN `"Download CV"` / FR `"Télécharger le CV"`) + `ctaCvAriaLabel` (EN `"Download CV (PDF)"` / FR `"Télécharger le CV (PDF)"`) — mêmes valeurs que `hero.ctaCv` / `hero.ctaCvAriaLabel` / `nav.ctaCvAriaLabel`.
- `dict.meta` : `email` (`"michael.mann55@gmail.com"`), `cvPath` (`"/cv/michael-mann-cv.pdf"` — MÊME valeur EN/FR, point de vérité du chemin CV, servi depuis `public/cv/` — déjà en place depuis Story 1.3). **Aucune autre clé de `meta` utilisée par `Contact`** : `phone`/`location`/`languagesList`/`linkedinShort` existent mais sont **dupliquées** dans `sections.contact.secondaryLinks` (le point de vérité **pour la section contact** est `secondaryLinks`, pas `meta.*`). La consolidation éventuelle (utiliser `meta.phone`/`meta.linkedin`/`meta.location`/`meta.languagesList` au lieu de `secondaryLinks`) sortirait du périmètre de cette story et toucherait la structure du dico — **à reporter** en `deferred-work.md` si tu le repères, **ne pas le « corriger » ici**.
- **Note (dette `deferred-work.md` review 1.3) :** la garde de complétude FR/EN est **aveugle au contenu des tableaux** (`en.ts` sans `as const`) — un traducteur qui retirerait une entrée de `secondaryLinks` dans `fr.ts` ne casserait pas `typecheck`. Ce n'est pas un problème de cette story (les 2 clés ajoutées sont des **clés d'objet** scalaires, bien couvertes par la garde) ; à garder en tête si un rendu paraît incomplet en FR.

### Référence design (`Minimal.jsx`)

- **`TMContact`** (≈ L737–831) — détaillé en Tâche 0. Grille 2 colonnes `1.4fr / 1fr` `gap 48 alignItems:stretch` ; panneau gauche `border #2a2a2a rounded 12 padding 36` fond gradient accent doré `linear-gradient(135deg, rgba(212,165,116,0.08), rgba(212,165,116,0.02))` (libellé `// primary_cta` mono `11 #d4a574 mb 14` + `<h3>` `Drop me a line.` `32 600 -0.02em #fafafa` + `<p>` `I respond within 24 hours.` `14 #a3a3a3 mt 10` + bouton email `mt 28 inline-flex gap 12 bg #ededed color #0a0a0a padding 14px 22px rounded 8 15 500` affichant `{meta.email}` + `→` mono) ; panneau droit `flex flex-col gap 10` de 4 rangées `<a>` `border #1f1f1f rounded 8 padding 16px 20px` `flex justify-between` fond `rgba(255,255,255,0.015)` `color #ededed` (libellé mono `10 #666 uppercase tracking 0.12em mb 4` + valeur `14 #ededed` ; glyphe à droite `mono #666` — `↗` pour LinkedIn, `📞` Phone, `◎` Location, `✶` Languages — `null` pour `href` sur Location/Languages = pas de lien). ⇒ chez nous : tokens (table en Dev Notes), `rounded-2xl`/`rounded-lg`/`rounded-md`, panneaux `p-6 sm:p-8`, grille `grid-cols-1 lg:grid-cols-[1.4fr_1fr]`, liste `<ul>`+`<li>` en `gap-2.5`, **glyphes simplifiés** (`↗` LinkedIn ; pas d'emoji pour Phone/Location/Languages — cohérence design system).
- **Footer interne du design `TMContact` (≈ L811–828)** : NON porté (le `<Footer/>` est déjà rendu **séparément** par `page.tsx`, hors de `GridSection id="contact"`, depuis Story 1.3). Ne pas dupliquer.
- ⚠️ Le design `Minimal.jsx` utilise des styles **inline** et des valeurs codées en dur — chez nous, **toujours** passer par les classes Tailwind / tokens de `globals.css`, et **remonter** les gris faibles (`#666`/`#555`/`#444`) à `text-fg-subtle` pour tout texte (les séparateurs/numéros purs `//`/`·` peuvent rester `text-fg-faintest`). Le `#2a2a2a` n'a pas d'équivalent neutre → `border-accent-border` est plus juste vu le fond gradient accent.

### Dette / contexte des reviews précédentes (`deferred-work.md`)

- **[à respecter / reproduire]** « Lien sortant — ouvre un nouvel onglet non annoncé à l'AT » (review 2.1) : **s'applique au lien LinkedIn de cette section** — reproduire le même choix (libellé visible = la valeur LinkedIn, `↗` `aria-hidden`, pas d'`aria-label` complémentaire ; audit a11y exhaustif → Story 4.1). Documenter ce choix dans cette story (déjà fait : Dev Notes ci-dessus).
- **[à respecter]** « Clés React dérivées du contenu » (review 2.2 + propagation 2.3) : utiliser des clés par **index** ou des id stables pour la liste `secondaryLinks` (4 entrées) plutôt que `link.label` (localisé) ou `link.value`.
- **[à respecter — apprentissage 2.3]** `react/jsx-no-comment-textnodes` : libellé `// primary_cta` **wrappé en expression** (`{"// primary_cta"}`), pas un nœud texte JSX direct.
- **[contexte, NE PAS corriger ici → Story 9.1]** :
  - « Lien LinkedIn 404 » (`linkedin.com/in/michaelmann-339545149` → 404) — la story 2.4 **affiche tel quel** la valeur du dico ; **9.1 corrige** la valeur dans `meta.linkedin` + `meta.linkedinShort` + `sections.contact.secondaryLinks[0].value` (6 chaînes au total dans en.ts + fr.ts).
  - « Construction d'URL fragile dans `MaqomCard` » (review 2.3) — normalisation `href` ; **9.1** est le bon endroit (audit de tous les liens).
  - « Invariant `item.url ≠ null` dans `MaqomCard` non vérifié à l'exécution ni au type » (review 2.3) — affermir le type ou ajouter un guard runtime ; déféré.
  - « Garde de complétude FR/EN aveugle aux tableaux » (review 1.3) — comparaison item-par-item entre `en.ts` et `fr.ts` (la garde de type ne voit que les clés d'objet) ; **9.1** s'en charge.
  - « `statusSnake` non robuste aux accents/apostrophes/espaces insécables FR » (review 2.3) — slugifier proprement ; déféré.
  - « Nom long carte méthodo — risque overflow à ~320px » (review 2.3) — audit fin → Story 4.2.
- **[hors périmètre, NE PAS toucher]** : `scroll-mt-24` = nombre magique non dérivé de la hauteur de `Nav` (→ 4.x) ; menu mobile sans focus-trap / pas de fermeture Échap (→ 4.1) ; `GridSection padded={false}` & rails latéraux (non concerné — `contact` est `padded`) ; `MMLogo` `dominantBaseline` fragile (→ QA visuelle) ; tags d'`experience` repris de `content.js` (→ 9.1) ; `config.matcher` du proxy (→ 4.3) ; pipeline d'assets de marque (→ Epic 4 / AR8) ; changements hero de la story 2.2 (conservés par décision Mike — ne pas y revenir).

### Note Next.js 16 (AGENTS.md)

Le projet tourne sur **Next 16.2.6** + React 19 — APIs/conventions peuvent différer de ta mémoire. AGENTS.md **impose** de lire les guides pertinents dans `node_modules/next/dist/docs/` avant d'écrire du code. Pour cette story le risque est faible (1 Server Component statique, 0 nouveau routing) ; vérifie quand même que `params: Promise<…>` reste le contrat de `page.tsx` (déjà en place — ne pas y toucher). Heeder tout avis de dépréciation.

### Standards de test

Aucun framework de test n'est encore installé (Vitest/Playwright = scope d'une story d'Epic 4 / `bmad-testarch-framework`). « Tester » ici = `npm run typecheck` + `npm run lint` + `npm run build` (tous verts) + **inspection du HTML pré-rendu** (`.next/server/app/{en,fr}.html` — checklist Tâche 5) + smoke `npm run dev` sur `/en` et `/fr` à ~375px si dispo + passe a11y rapide axe DevTools (0 erreur nouvelle) + **smoke transversal « zéro scroll horizontal »** sur toutes les sections (AC#5). Ne pas committer d'état cassé. Pas de `Co-Authored-By` dans les commits sauf demande explicite.

### Project Structure Notes

- Nouveau fichier : `src/components/Contact.tsx` — cohérent avec l'organisation `src/components/*` (un composant = un fichier, PascalCase, `export function Name(...)`). Imports via l'alias `@/` (`@/components/...`).
- Modifié : `src/app/[locale]/page.tsx` (1 import + dispatch `section.id === "contact"` dans le `.map(sectionList)` existant ; retrait du commentaire `{/* contact : corps = Story 2.4 */}`), `src/i18n/dictionaries/en.ts` (ajout `sections.contact.ctaCv` + `sections.contact.ctaCvAriaLabel`), `src/i18n/dictionaries/fr.ts` (idem, traduit).
- Aucun conflit de structure attendu. **Aucune** modification de `globals.css` (tokens déjà en place — Story 1.2a). Aucune nouvelle dépendance, aucun asset ajouté (le CV PDF est déjà en place depuis Story 1.3 ; remplacement éventuel = Story 9.1).

### Sortie de l'Epic 2

Une fois cette story `done`, **toute la home page MVP est livrée** (Epic 2 complet — stories 2.1/2.2/2.3/2.4) : hero + marquee, about, experience, freelance, side projects, stack, AI & agentic, contact, footer ; FR + EN complets ; CV téléchargeable depuis 3 endroits ; responsive du mobile au desktop. Le **chemin critique restant** vers le lancement = (a) animations Epic 3, (b) WCAG/perf/SEO Epic 4, (c) analytics Epic 5, (d) **QA pré-lancement Story 9.1** (LinkedIn fix + audit contenu/liens — peut tourner en parallèle d'Epic 3+ ; à séquencer avec Mike).

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4: Section Contact, contenu FR/EN complet, CV & finition responsive] · [#Epic 2] · [#UX-DR13] · [#FR8, FR10, FR12, FR13, FR14, FR19, FR25, FR33, FR34]
- [Source: _bmad-output/planning-artifacts/prd.md#FR8, FR10, FR12, FR13, FR14, FR19, FR25, FR33, FR34] · [#NFR3, NFR4, NFR12, NFR16, NFR20, NFR21]
- [Source: _bmad-output/planning-artifacts/design/Minimal.jsx#TMContact (~L737-831)]
- [Source: _bmad-output/planning-artifacts/design/content.md#Contact (~L222+)] · [#Meta]
- [Source: src/i18n/dictionaries/en.ts#sections.contact, meta.email, meta.cvPath] · [src/i18n/dictionaries/fr.ts — mêmes clés, traductions]
- [Source: src/app/[locale]/page.tsx — `.map(sectionList)` à enrichir d'un dispatch `contact` (commentaire `{/* contact : corps = Story 2.4 */}` à remplacer)]
- [Source: src/components/Hero.tsx — `FOCUS_RING`, classes CTA email primaire (`bg-invert-bg`), classes CTA CV bordé (`border-line`), pattern `<a download aria-label>`] · [src/components/Nav.tsx — mêmes classes CTA / lien CV ; helper `availabilityBadge` (non utilisé ici)] · [src/components/MissionCard.tsx — pattern lien sortant + badge accentué + tap target `min-h-11`] · [src/components/MaqomCard.tsx — pattern carte gradient accent + lien `$ open` `min-h-11`]
- [Source: src/app/globals.css — tokens : couleurs fg-*/accent*/surface-*/line*/invert-*/status-available, tailles text-display-sm/text-body/text-body-sm/text-ui/text-label*, rayons rounded-2xl/lg/md, audit contraste AA]
- [Source: _bmad-output/implementation-artifacts/2-3-sections-side-projects-stack-ai-agentic-engineering.md — apprentissages (jsx-no-comment-textnodes, clés par index, FOCUS_RING copié localement)]
- [Source: _bmad-output/implementation-artifacts/2-2-sections-about-experience-freelance-engagements.md — patterns Server Components, dispatch sur section.id, types dérivés de Dictionary]
- [Source: _bmad-output/implementation-artifacts/2-1-section-hero-marquee-des-marques-clientes.md — pattern d'ajout de clés `cta*` au dico, classes CTAs, AvailabilityBadge]
- [Source: _bmad-output/implementation-artifacts/1-3-modele-de-contenu-type-shell-de-page-nav-gridsection-sectionhead-footer.md — patterns shell, CV servi depuis `public/cv/`, lien CV de la `Nav`]
- [Source: _bmad-output/implementation-artifacts/9-1-audit-de-contenu-liens-polish-pre-lancement.md — story sœur, périmètre audit/QA explicite (ce que 2.4 NE FAIT PAS)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md#review 2.1 (lien sortant non annoncé → 4.1), #review 1.3 (garde FR/EN aveugle aux tableaux → 9.1, `projectMeta` never[]), #review 2.2 (clés React dérivées du contenu), #review 2.3 (URL Maqom fragile → 9.1, statusSnake non robuste → 9.1, `MaqomCard` invariant url≠null → defer)]
- [Source: AGENTS.md — lire node_modules/next/dist/docs/ avant de coder]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (1M context) — dev agent BMM, le 2026-05-13.

### Debug Log References

- **`react/jsx-no-comment-textnodes` (rappel apprentissage 2.3)** — le libellé déco `// primary_cta` est wrappé en expression JSX (`{"// primary_cta"}`) dès le premier jet du composant ; aucune erreur de lint déclenchée. `Contact.tsx:55` (`<div aria-hidden="true" …>{"// primary_cta"}</div>`).
- **Token gradient accent** — pas de `bg-accent-soft-strong` (≈ 0.08) dans `globals.css`, seul `bg-accent-soft` (≈ 0.06) existe. Décision : utiliser une classe arbitraire Tailwind `bg-[linear-gradient(135deg,_rgba(212,165,116,0.08),_rgba(212,165,116,0.02))]` pour rester proche du design (gradient 135° des deux mêmes rgba). Documenté dans le commentaire JSX du panneau gauche de `Contact.tsx`. Alternative considérée : `bg-accent-soft` solide — rejetée car perte de la lumière 135° du design pour zéro gain.
- **Dispatch par index plutôt que par `link.label`** — `link.label` est localisé (EN `"Phone"` / FR `"Téléphone"`), donc un dispatch par libellé casserait en FR. L'ordre du dico est l'invariant (LinkedIn / Phone / Location / Languages, identique en EN et FR). Choix consigné dans le commentaire de `Contact.tsx:88-95`. Cohérent avec la dette `deferred-work.md` review 2.2/2.3 « clés React dérivées du contenu » — ici on utilise déjà `key={i}` (l'index).
- **Liste secondaire avec `min-h-11` sur les non-cliquables aussi** — appliqué pour préserver la régularité visuelle de la grille (les 4 entrées ont la même hauteur). Non-régression a11y : les `<div>` non focusables n'ajoutent rien au focus order.

### Completion Notes List

- **Tâche 1 — Dictionnaire** : ajout des 2 clés `contact.ctaCv` (EN `"Download CV"` / FR `"Télécharger le CV"`) + `contact.ctaCvAriaLabel` (EN `"Download CV (PDF)"` / FR `"Télécharger le CV (PDF)"`) à `sections.contact` dans `en.ts` (source de vérité) puis `fr.ts`. La garde `satisfies Dictionary` confirme la parité en typecheck. Aucune autre modification du contenu (LinkedIn 404, parité au niveau tableaux, exactitude factuelle = Story 9.1, cf. Dev Notes de cette story).
- **Tâche 2 — Composant `Contact`** : créé en Server Component, props **dérivées de `Dictionary["sections"]["contact"]`** + `meta.email` / `meta.cvPath`. Constante locale `FOCUS_RING` (4e copie dans le repo — duplication assumée, cohérent avec Hero/MissionCard/MaqomCard). Structure : grille `grid-cols-1 lg:grid-cols-[1.4fr_1fr] lg:items-stretch`. Carte CTA primaire avec libellé mono `// primary_cta`, `<h3>` `primaryCtaLabel`, `<p>` `respondWithin`, bouton email (libellé visible = `{email}` + `→` `aria-hidden`) et lien CV (`<a download aria-label>` — classes identiques au Hero pour cohérence). Liste secondaire `<ul>` `list-none` + 4 `<li>` : dispatch `isLinkedIn = i === 0` / `isPhone = i === 1` ; LinkedIn cliquable + `target="_blank" rel="noopener noreferrer"` + `↗` `aria-hidden` (même choix délibéré que hero / Maqom / missions, audit a11y exhaustif → 4.1) ; Phone cliquable via `tel:` avec normalisation `replace(/\s+/g, "")` ; Location et Languages **non-cliquables** (rendues comme `<div>` sémantiques, pas `<a>`). Tous les tap targets `min-h-11`. Anneau de focus visible partout.
- **Tâche 3 — Câblage `page.tsx`** : ajout de l'import `import { Contact } from "@/components/Contact";` et du dispatch `{section.id === "contact" && <Contact … />}` dans le `.map(sectionList)`, juste après `stack` ; remplacement du commentaire de placeholder `{/* contact : corps = Story 2.4 */}`. Aucune autre modification de `page.tsx`.
- **Tâche 4 — Non-régression liens interdits** : inspection du HTML pré-rendu (`.next/server/app/{en,fr}.html`) — 0 match pour `github.com`/`gitlab.com`/`bitbucket.org` (case-insensitive) et 0 match pour `href="…balink…"` (case-insensitive). Le mot « Balink » apparaît bien dans le texte accessible de la section Experience (employeur de Mike, voulu) mais jamais comme URL.
- **Tâche 5 — Validation** :
  - `npm run typecheck` → 0 erreur. La garde `satisfies Dictionary` est restée effective (test inverse non explicite ; mais le typecheck a tourné après les 2 ajouts et est passé, ce qui confirme la parité EN/FR pour les 2 nouvelles clés d'objet).
  - `npm run lint` → 0 erreur.
  - `npm run build` → succès. Sortie de build : `● /[locale]` toujours pré-rendue en statique pour `/en` et `/fr`, `ƒ Proxy (Middleware)` toujours listé, aucune route serveur dynamique introduite. `Contact` est un Server Component → 0 JS client ajouté (NFR3 préservé).
  - Inspection HTML pré-rendu (`en.html` / `fr.html`) : section `#contact` présente, `mailto:michael.mann55@gmail.com`, `tel:+972584220567`, `cv/michael-mann-cv.pdf`, libellés `// primary_cta`, `Drop me a line.` (EN) / `Écrivez-moi un mot.` (FR), `Téléphone`, `Localisation`, `Langues` (FR) tous rendus. **1 seul `<h1>`** sur la page (le hero), **6 `<article>`** au total (inchangé : 2 Experience + 2 Freelance + 2 Projects ; Contact n'introduit aucun `<article>`, conforme aux conventions 2.3). Tous les `target="_blank"` (5) sont appariés à un `rel="noopener noreferrer"` (5).
  - Smoke `npm run dev` ~375px / 200% zoom / a11y axe : **non exécutés** dans cette session (pas de browser). Délégué à un smoke utilisateur ou à la code-review fresh-context. À ma confiance basée sur les patterns identiques au Hero (déjà validés en prod) + l'inspection statique du HTML : aucun risque de débordement attendu (la carte CTA primaire utilise `flex-wrap` pour ses CTAs, la liste secondaire empile en 1 colonne mobile, les valeurs longues — email, URL LinkedIn — peuvent wrapper naturellement). À vérifier explicitement en code-review et 9.1.
  - **Pas de commit créé** : convention du repo « committer seulement si demandé » respectée.

### File List

**Créés :**

- `src/components/Contact.tsx` — Server Component, carte CTA primaire (email + CV) + liste de 4 entrées secondaires.

**Modifiés :**

- `src/i18n/dictionaries/en.ts` — ajout de 2 clés à `sections.contact` : `ctaCv` (`"Download CV"`) + `ctaCvAriaLabel` (`"Download CV (PDF)"`). Aucune autre modification.
- `src/i18n/dictionaries/fr.ts` — ajout des mêmes 2 clés, traduites : `ctaCv` (`"Télécharger le CV"`) + `ctaCvAriaLabel` (`"Télécharger le CV (PDF)"`). Aucune autre modification.
- `src/app/[locale]/page.tsx` — ajout de l'import `Contact` + dispatch `section.id === "contact" && <Contact … />` dans le `.map(sectionList)` ; remplacement du commentaire de placeholder `{/* contact : corps = Story 2.4 */}`.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — `development_status[2-4-…] = in-progress → review` ; `last_updated` synchronisé.
- `_bmad-output/implementation-artifacts/2-4-section-contact-contenu-fr-en-complet-cv-finition-responsive.md` — checkbox des tâches/sous-tâches cochés, Status `ready-for-dev → review`, Dev Agent Record + File List + Change Log remplis.

**Aucun fichier supprimé.**

## Change Log

| Date       | Version | Description                                                                                                  | Auteur |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 2026-05-13 | 0.1     | Création de la story 2.4 (context engine) : section Contact (carte CTA primaire email + CV, liste de 4 liens secondaires LinkedIn/Phone/Location/Languages) — composant `Contact` + ajout des 2 clés `contact.ctaCv`/`contact.ctaCvAriaLabel` au dictionnaire + câblage `page.tsx`. Périmètre cadré : QA/audit/fix LinkedIn 404 = Story 9.1. | Bob (SM) |
| 2026-05-13 | 1.0     | Implémentation : ajout `contact.ctaCv` + `contact.ctaCvAriaLabel` à `en.ts`/`fr.ts` (Tâche 1), création du Server Component `src/components/Contact.tsx` rendant la carte CTA primaire (libellé déco `// primary_cta`, `<h3>` `primaryCtaLabel`, `<p>` `respondWithin`, bouton email `mailto:` + lien CV `<a download aria-label>`) et la liste de 4 entrées secondaires (LinkedIn `target="_blank" rel="noopener noreferrer"` + `↗`, Phone `tel:`, Location/Languages non-cliquables) (Tâche 2), câblage du dispatch `section.id === "contact"` dans `page.tsx` (Tâche 3). `typecheck` + `lint` + `build` verts, `/en` et `/fr` pré-rendues statiquement (Tâches 4–5). Statut `review`. | Dev (Amelia) |
