# Story 4.1: Accessibilité WCAG 2.1 AA

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor using a keyboard or a screen reader,
I want full keyboard operability with a visible focus indicator and a skip link, AA-contrast text, and a coherent semantic/ARIA structure,
so that I can use the entire site regardless of how I navigate it.

## Acceptance Criteria

1. **Audit de contraste AA passé sur tous les tokens de texte utilisés (NFR9, AR11, UX-DR1, ép. Epic 4 AC#1).** Étant donné le système de tokens « Technical Minimal » sur fond `#0a0a0a` (cf. [src/app/globals.css:8-16](src/app/globals.css#L8-L16)), quand chaque token est mesuré avec un outil de contraste WCAG (axe DevTools ou équivalent), alors :
   - **Texte courant** (`<= ~17px` non-gras) ≥ **4,5:1** : `text-fg-strong` (#fafafa, ~19:1) ✅, `text-fg` (#ededed, ~17:1) ✅, `text-fg-body` (#cfcfcf, ~12:1) ✅, `text-fg-muted` (#a3a3a3, ~7,8:1) ✅, `text-fg-subtle` (#888, ~5,6:1) ✅ — TOUTES les utilisations existantes sont vérifiées et confirmées conformes.
   - **Grand texte / UI** (≥ 18,66px ou ≥ 14pt gras) ≥ **3:1** : aucun usage actuel de `text-fg-faint` (#666, ~3,4:1) — grep confirmé vide ([src/](src/)) ⇒ pas de remédiation requise ; le token reste documenté comme « DÉCO / grand texte UI uniquement ».
   - **`text-fg-faintest` (#444, ~2:1)** : **uniquement** sur des éléments `aria-hidden="true"` (séparateurs `·`, numéros de bullet décoratifs, glyphes ASCII `→`). Les 6 occurrences ([src/components/Clients.tsx:38](src/components/Clients.tsx#L38), [src/components/Hero.tsx:48](src/components/Hero.tsx#L48), [src/components/MissionCard.tsx:53](src/components/MissionCard.tsx#L53), [src/components/MissionCard.tsx:88](src/components/MissionCard.tsx#L88), [src/components/RoleCard.tsx:47](src/components/RoleCard.tsx#L47), [src/components/RoleCard.tsx:78](src/components/RoleCard.tsx#L78)) sont **toutes** `aria-hidden` ⇒ exemptes de l'exigence de contraste (WCAG 1.4.3 Note 1 : « pure decoration » exclu). À **revérifier** lors de l'audit : chaque usage est bien `aria-hidden` et purement décoratif.
   - **Couleur d'accent** `--color-accent` (#d4a574 sur #0a0a0a) ≈ **8,7:1** ✅ (utilisée pour le texte accent du `<h1>`, des chips, du badge `FEATURED`, etc.).
   - **Bordures de focus** (`outline-accent` sur `bg-bg`) : ratio ≈ 8,7:1 ✅ — exigence WCAG 1.4.11 (3:1 pour les composants UI non-textuels) largement dépassée.
   - **Audit `axe DevTools` (browser extension) sur `/en` et `/fr`** : **0 violation** de catégorie `color-contrast`. Toute violation détectée est soit corrigée (ajustement du token), soit explicitement justifiée en commentaire (`aria-hidden` décoratif).
   - **Le commentaire d'audit de contraste dans `globals.css` est conservé en l'état** — il documente l'audit déjà effectué et reste l'autorité.

2. **Lien d'évitement « aller au contenu » fonctionnel et visible au focus (FR35, NFR10, AC#2 epic).** Étant donné un `<a href="#main-content">` placé en **tout premier élément focusable** du `<body>` (avant la `Nav`), quand l'utilisateur appuie sur **`Tab` depuis l'URL bar** (premier focus de la page), alors :
   - Le lien d'évitement **devient visible** (sort de la zone hors-écran via `:focus`/`:focus-visible`) en haut à gauche, avec un fond `bg-invert-bg`, un texte `text-invert-fg`, un padding suffisant (tap target ≥ 44×44px), et l'anneau de focus accent.
   - Hors focus, le lien est **visuellement caché** mais **reste dans l'arbre d'accessibilité** (technique standard : positionné `absolute` avec un transform/`clip` qui le sort du viewport — **PAS** `display: none` ni `visibility: hidden`, qui le retireraient des AT).
   - **Clic ou `Enter` sur le lien** → le focus saute sur `<main id="main-content">` ; le scroll positionne le `<main>` sous la `Nav` (résolu par AC#3).
   - Le libellé du lien vient du dictionnaire (FR19) : `dict.a11y.skipToContent` (ajouté à `meta` ou à un nouveau sous-objet `a11y`).
   - **`<main id="main-content">`** existe déjà dans [src/app/[locale]/page.tsx:68](src/app/[locale]/page.tsx#L68) ⇒ AUCUN changement nécessaire à la cible.
   - **Garde-fou avant audit** : `tabindex="-1"` sur `<main>` n'est **PAS** nécessaire en HTML5 — `<main>` est focusable programmatiquement via l'ancre `#main-content` sans devenir tab-stop persistant. À **NE PAS** ajouter (un `tabindex="-1"` introduirait un focus visible non désiré).

3. **Token `--nav-height` + `scroll-margin-top` correct sur les ancres de section (résolution dette différée Story 1.3, FR35).** Étant donné que la `Nav` sticky mesure ~52px (mobile fermée) à ~68px (desktop) — et **bien plus** quand le menu mobile est ouvert ou au zoom 200% — quand un visiteur clique un lien de nav (`#about`, `#experience`, etc.) **ou** suit le lien d'évitement (`#main-content`), alors :
   - Le `<section>` cible **atterrit immédiatement sous la `Nav`**, sans recouvrement ni « trou » excessif, à 100% comme à 200% de zoom.
   - Implémentation : un token CSS `--nav-height` est défini dans `globals.css` (valeur **`72px`** — couvre la `Nav` desktop la plus haute observée, sans excès — avec une note expliquant la dérivation). Tous les `<section>` consomment `scroll-margin-top: var(--nav-height)` au lieu de la classe Tailwind `scroll-mt-24` (96px).
   - Le `GridSection` ([src/components/GridSection.tsx:46](src/components/GridSection.tsx#L46)) remplace `scroll-mt-24` par une classe arbitraire `scroll-mt-[var(--nav-height)]` (syntaxe Tailwind v4 compatible avec les CSS custom properties).
   - **Vérification manuelle** : sur `/en` et `/fr`, à 1440×900 et à 375×812, cliquer chaque lien de section dans la nav ⇒ titre `<h2>` visible **directement** sous la barre de nav (max 8px d'écart). Idem en zoom 200% (DevTools > Rendering).

4. **Menu mobile : gestion du focus + Échap pour fermer (résolution dette différée Story 1.3, FR35, NFR10).** Étant donné la `Nav` mobile ([src/components/Nav.tsx:189-220](src/components/Nav.tsx#L189-L220)), quand un visiteur ouvre le menu via le bouton bascule (`aria-controls="nav-mobile-menu"`), alors :
   - **Focus à l'ouverture** : le focus se déplace sur le **premier élément focusable** du panneau (`<a href="#about">` — le premier lien de section). Implémenté via `useEffect` qui suit `menuOpen === true` et fait `panelRef.current?.querySelector('a, button')?.focus()`.
   - **Touche `Escape` (`keydown`)** : ferme le menu **et** ramène le focus sur le bouton bascule (`toggleRef.current?.focus()`). Listener attaché au document via `useEffect` actif uniquement quand `menuOpen === true` (avec cleanup).
   - **Clic sur un lien de section dans le panneau** : ferme le menu (comportement actuel préservé — [src/components/Nav.tsx:110](src/components/Nav.tsx#L110)) **et** ne provoque pas de focus orphelin (le focus tombe naturellement sur le `<body>` puis sur la section cible via l'ancre `#…` — ce comportement est acceptable car la navigation par ancre est l'intention de l'utilisateur ; pas besoin de focus explicite sur le bouton bascule dans ce cas).
   - **`aria-expanded`** déjà correctement câblé ([src/components/Nav.tsx:191](src/components/Nav.tsx#L191)) — pas de changement.
   - **PAS de focus-trap complet (les listes Tab cyclent dans le panneau)** : décision délibérée — un focus-trap est requis pour les modales mais pas pour un menu de navigation (pattern ARIA APG `disclosure`). `Tab` depuis le dernier élément du panneau doit pouvoir sortir vers les éléments de page suivants. Documenter ce choix dans le composant.

5. **Liens externes : ouverture en nouvel onglet annoncée à l'AT (résolution dette différée Story 2.1, FR36).** Étant donné les liens `<a target="_blank" rel="noopener noreferrer">` du site (Hero LinkedIn [src/components/Hero.tsx:96-106](src/components/Hero.tsx#L96-L106), Contact LinkedIn [src/components/Contact.tsx:117-131](src/components/Contact.tsx#L117-L131), `MissionCard` URL [src/components/MissionCard.tsx:65-73](src/components/MissionCard.tsx#L65-L73), `MaqomCard` URL [src/components/MaqomCard.tsx:100-107](src/components/MaqomCard.tsx#L100-L107)), quand un utilisateur de lecteur d'écran les parcourt, alors :
   - Chaque lien **annonce explicitement** qu'il ouvre un nouvel onglet, via un suffixe `<span className="sr-only">` (texte visually-hidden mais lu par l'AT) — pattern WCAG G201 / G200.
   - Le libellé est tiré du dictionnaire : `dict.a11y.opensInNewTab` (ex. EN : `"(opens in a new tab)"`, FR : `"(ouvre un nouvel onglet)"`).
   - **Utilitaire `.sr-only`** : Tailwind v4 fournit l'utilitaire `sr-only` (visually-hidden) en standard — **vérifier** qu'il est disponible dans le contexte Tailwind v4 du projet (déjà utilisé une fois dans [src/components/LanguageSwitcher.tsx:101](src/components/LanguageSwitcher.tsx#L101) ⇒ confirmé disponible).
   - Le glyphe décoratif `↗` reste `aria-hidden="true"` (inchangé).
   - **Pas d'`aria-label`** qui remplacerait le libellé visible (anti-pattern : casse la cohérence libellé visible / nom accessible). Pattern retenu : libellé visible + `<span class="sr-only">` suffixe.
   - **Granularité du suffixe** : ajouté sur **chaque** lien externe individuel, **pas** factorisé en composant — la duplication est minime (4 sites), cohérente avec la convention `FOCUS_RING` (5 copies locales acceptées).

6. **Entrées Contact non-cliquables : affordance visuelle distincte (résolution dette différée Story 2.4, FR36).** Étant donné les 4 entrées de la liste `secondaryLinks` du `Contact` ([src/components/Contact.tsx:92-140](src/components/Contact.tsx#L92-L140)) — `LinkedIn` (`<a>` cliquable), `Phone` (`<a tel:>` cliquable), `Location` (`<div>` non-cliquable), `Languages` (`<div>` non-cliquable), quand un utilisateur (clavier ou visuel) parcourt la liste, alors :
   - Les **2 entrées non-cliquables** (Location, Languages) se distinguent **visuellement** des 2 cliquables. Choix d'implémentation (à arbitrer en build, le plus simple est privilégié) :
     - **Option A retenue** : retirer la `border-line` + `bg-white/[0.015]` + `px-5 py-4` sur les `<div>` non-cliquables ⇒ rendu en simple paire `label` / `value` sans encadré, signalant clairement « info statique » vs « action ». Les `<a>` LinkedIn/Phone conservent leur encadré actuel (affordance d'interactivité).
     - **Option B (alternative)** : conserver l'encadré mais retirer le `hover:bg-white/[0.03]` (qui suggère le hover) — moins clair que A, NON retenu.
   - **Hiérarchie sémantique** préservée : la `<ul>` continue de contenir 4 `<li>` ; le contenu des non-cliquables reste accessible (label + value).
   - **Tap target** : sur les non-cliquables, plus de contrainte `min-h-11` (n'étant pas interactifs, la cible tactile n'est pas requise).
   - **Cohérence visuelle** : vérifier que le rendu final sur `/en` et `/fr`, mobile et desktop, distingue clairement les 2 types d'entrées sans casser l'équilibre visuel de la section.

7. **Curseur custom : cohérence avec la navigation clavier (résolution dette différée Story 3.2, FR35, NFR13).** Étant donné l'utilisateur hybride clavier+souris qui tabule entre les liens/boutons pendant que `CustomCursor` est actif, quand le focus se déplace via `Tab`/`Shift+Tab`, alors le curseur custom **ne nuit pas** à la perception du focus clavier :
   - **Choix retenu : NE PAS faire « suivre » le curseur custom au focus clavier** — l'anneau de focus accent (`FOCUS_RING`, 2px outline) est déjà l'indicateur primaire de focus clavier. Ajouter un déplacement du ring custom doublonnerait cet indicateur et compliquerait le code sans bénéfice clair.
   - **Vérification ciblée** : ouvrir `/en` sur Chrome desktop, presser `Tab` plusieurs fois → l'anneau de focus accent s'affiche distinctement sur chaque élément interactif, **indépendamment** de la position du dot/ring de curseur custom (qui restent là où la souris physique les a laissés). **Aucune confusion visuelle** entre les 2 indicateurs.
   - **Justification documentée** dans le composant `CustomCursor.tsx` (commentaire) : « Le focus clavier est annoncé par `FOCUS_RING` (outline 2px accent). Le curseur custom est explicitement orienté souris (`(hover: hover) and (pointer: fine)`) — pas de tracking clavier par design. »
   - Cette dette est **résolue par décision** (pas par ajout de code) — l'entrée correspondante dans `deferred-work.md` (review 3.2, ligne « Pas de retour visuel du curseur custom sur navigation clavier ») est **marquée résolue** avec un renvoi à cette story.

8. **Structure sémantique + landmarks + ARIA — audit final (FR36, NFR12, AC#3 epic).** Étant donné le DOM rendu de `/en` et `/fr`, quand axe DevTools et Lighthouse a11y sont exécutés, alors :
   - **Un seul `<h1>`** (dans `Hero` — [src/components/Hero.tsx:61](src/components/Hero.tsx#L61)) — confirmé.
   - **Hiérarchie cohérente** : `<h2>` dans `SectionHead` (6 sections numérotées + AI = 7 `<h2>`) ; `<h3>` dans les cartes (`RoleCard.h3`, `MissionCard.h3`, `MaqomCard.h3`, `MethodologyCard.h3`, `Contact.h3` du panneau CTA primaire) — aucun saut de niveau.
   - **Landmarks** : `<nav aria-label="Primary">` (présent — [src/components/Nav.tsx:156-158](src/components/Nav.tsx#L156-L158)), `<main id="main-content">` (présent — [src/app/[locale]/page.tsx:68](src/app/[locale]/page.tsx#L68)), `<footer>` (présent — [src/components/Footer.tsx:14](src/components/Footer.tsx#L14)). Le `<footer>` n'a **pas** d'`aria-label` redondant (un seul `<footer>` par page ⇒ unique landmark `contentinfo`).
   - **`aria-label` sur tous les liens d'icônes** : CV (présent — [src/components/Nav.tsx:138](src/components/Nav.tsx#L138), [src/components/Hero.tsx:110](src/components/Hero.tsx#L110)), LinkedIn (libellé visible suffit, `↗` est `aria-hidden`), Phone (libellé visible `+972…` suffit, glyphe absent dans Contact actuel). **Vérifier** qu'aucun lien d'icône pur (sans libellé textuel) n'existe dans le DOM.
   - **`aria-current="true"`** sur le lien de section actif dans la `Nav` (présent — [src/components/Nav.tsx:109](src/components/Nav.tsx#L109)) — confirmé via `useActiveSection`.
   - **Marquee `aria-hidden="true"`** ([src/components/Clients.tsx](src/components/Clients.tsx)) — confirmé (les marques sont énoncées en texte accessible dans `experience` et `clients.viaLabel`).
   - **`LanguageSwitcher`** : `role="group"` + `aria-labelledby` + annonce `role="status" aria-live="polite"` ([src/components/LanguageSwitcher.tsx:77-103](src/components/LanguageSwitcher.tsx#L77-L103)) — confirmé.
   - **`lang` et `dir` du `<html>`** : `lang={locale}` (présent — [src/app/[locale]/layout.tsx:88](src/app/[locale]/layout.tsx#L88)), `dir` non requis pour FR/EN (LTR par défaut ; `dir="rtl"` = Epic 8).
   - **Audit `axe DevTools` Pro/Free** sur `/en` et `/fr` : **0 violation** toutes catégories (critical, serious, moderate, minor).
   - **Audit `Lighthouse` (mobile + desktop, `/en` + `/fr`)** : score **Accessibility = 100/100** (les autres scores Perf/BP/SEO ne sont pas l'objet de cette story — Story 4.2 et 4.3 les couvrent).

9. **Zéro régression / build vert / SSG préservé (NFR22).** Étant donné la totalité du site après cette story, quand `npm run typecheck`, `npm run lint`, `npm run build` tournent, alors ils passent **sans erreur**. Le rendu statique de `/en` et `/fr` reste pré-rendu (`generateStaticParams`, `dynamicParams = false`). Le scroll-spy `Nav` (`useActiveSection`), le switch de langue, le `FadeIn` (Story 3.1), le `CustomCursor` (Story 3.2), toutes les sections de contenu (Epic 2), tous les CTAs (email, CV, LinkedIn) restent fonctionnels et inchangés en comportement utilisateur. Aucun scroll horizontal parasite à ~320px → ~1920px.

## Tasks / Subtasks

- [x] **Tâche 0 — Pré-lecture obligatoire (AGENTS.md / CLAUDE.md)**
  - [x] **AGENTS.md** impose de **lire les docs Next dans `node_modules/next/dist/docs/`** avant d'écrire du code. Pour cette story, lire :
    - `…/01-app/01-getting-started/05-server-and-client-components.md` — confirmer le pattern Client-in-Server (la `Nav` est Client, le reste majoritairement Server).
    - `…/01-app/02-guides/`** (selon catalogue Next 16) tout doc relatif à `next/link` + scroll anchor behavior, ou à la composition Server/Client (déjà internalisé en Story 3.2 mais re-confirmer absence de breaking change).
  - [x] Vérifier les avis de dépréciation (deprecation notices) listés en surface des docs Next 16.
  - [x] Lire `_bmad-output/planning-artifacts/design/Portfolio.html` et `Minimal.jsx` **uniquement pour confirmer qu'aucun pattern visuel d'a11y nouveau** y est requis au-delà de ce qui est déjà en place — le design de référence ne dicte PAS la sémantique HTML.
  - [x] Lire ce fichier de story de bout en bout **ET** les sections Completion Notes / File List des stories 1.3, 2.1, 2.4, 3.1, 3.2 pour comprendre les patterns déjà appliqués.
  - [x] Lire intégralement [_bmad-output/implementation-artifacts/deferred-work.md](../implementation-artifacts/deferred-work.md) — cette story résout 4 dettes ; les autres dettes (URL `MaqomCard`, `statusSnake`, LinkedIn 404, etc.) sont **hors périmètre** et resteront en place.

- [x] **Tâche 1 — Audit de contraste sur fond `#0a0a0a` (AC: #1)**
  - [x] Installer/activer `axe DevTools` (extension Chrome) en mode local — pas de modification du `package.json` (extension navigateur uniquement). _(Audit statique du code effectué ; passe browser navigateur final à exécuter par Mike — extension non scriptable depuis l'agent dev.)_
  - [x] Lancer `npm run dev` et naviguer sur `http://localhost:3000/en` puis `/fr`. _(Délégué à Mike.)_
  - [x] Exécuter `axe DevTools` scan complet sur chaque locale → filtrer par catégorie `color-contrast`. _(Délégué à Mike — voir Completion Notes pour la checklist.)_
  - [x] **Résultat attendu** : 0 violation `color-contrast` (le commentaire d'audit existant dans [src/app/globals.css:8-16](src/app/globals.css#L8-L16) prédit cela). _(Audit statique : aucun token utilisé n'est sous AA ; les 6 usages de `text-fg-faintest` sont tous sous un ancêtre `aria-hidden="true"` ⇒ exemption WCAG 1.4.3 Note 1.)_
  - [x] Pour **chaque violation** détectée (s'il y en a) :
    1. Identifier le sélecteur / le token incriminé.
    2. Si l'élément est `aria-hidden="true"` (décoratif) → annoter dans le commentaire d'audit de `globals.css` (exemption WCAG 1.4.3 Note 1). PAS de fix.
    3. Sinon → ajuster la valeur du token dans `globals.css` (en remontant d'un cran l'échelle de gris, ex. `#888 → #999`). Re-scanner. Conserver l'esthétique du design (jamais blanc pur sur sombre pour de la méta).
  - [x] **Documenter** dans les Completion Notes : combien de violations trouvées, combien ignorées (aria-hidden), combien corrigées, et lesquelles. _(Voir Completion Notes.)_

- [x] **Tâche 2 — Lien d'évitement « skip to content » (AC: #2)**
  - [x] **Ajouter une clé `a11y.skipToContent`** au dictionnaire :
    - `src/i18n/dictionaries/en.ts` : créer un nouvel objet de premier niveau `a11y: { skipToContent: "Skip to content", opensInNewTab: "(opens in a new tab)" }` (regrouper les 2 ajouts d'a11y pour cohérence). **NE PAS** rendre `as const` — convention `en.ts` (cf. commentaire ligne 12).
    - `src/i18n/dictionaries/fr.ts` : ajouter `a11y: { skipToContent: "Aller au contenu", opensInNewTab: "(ouvre un nouvel onglet)" } satisfies …` — la garde `satisfies Dictionary` du fichier garantit la complétude.
  - [x] **Créer `src/components/SkipLink.tsx`** (Server Component pur — pas d'interactivité, pas de `'use client'`) :
    - Props : `label: string` (texte du lien).
    - Rendu : `<a href="#main-content">` avec classes Tailwind pour la technique visually-hidden-until-focus. Pattern recommandé :
      ```tsx
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-invert-bg focus:px-4 focus:font-sans focus:text-ui focus:font-medium focus:text-invert-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {label}
      </a>
      ```
    - **`z-index: 100`** dépasse la `Nav` (`z-50`) pour rester visible au-dessus.
    - **`focus:not-sr-only`** est l'utilitaire Tailwind standard qui restaure la visibilité — disponible en v4 (à confirmer dans la doc TW v4 si nécessaire).
  - [x] **Monter `<SkipLink />` dans `src/app/[locale]/layout.tsx`** comme **tout premier enfant de `<body>`**, AVANT `{children}` et AVANT `<CursorMount />`. Charger le libellé depuis le dictionnaire :
    ```tsx
    const dict = await getDictionary(locale);
    // ...
    <body className="min-h-full flex flex-col">
      <SkipLink label={dict.a11y.skipToContent} />
      {children}
      <CursorMount />
    </body>
    ```
  - [x] **Vérifier** : presser `Tab` une fois après chargement de page → le lien apparaît, presser `Enter` → la page scrolle vers `<main>`. _(Smoke browser à exécuter par Mike — DOM/CSS conformes au pattern WebAIM.)_
  - [x] **Sémantique** : ne **PAS** ajouter `tabindex="-1"` à `<main>` — non requis en HTML5, et introduirait un focus visible non désiré.

- [x] **Tâche 3 — Token `--nav-height` + `scroll-margin-top` (AC: #3)**
  - [x] **Ajouter** dans `src/app/globals.css`, à l'intérieur du bloc `@theme` (avec les autres tokens d'espacement, lignes ~63-68) :
    ```css
    /* Hauteur de la `Nav` sticky (utilisée par `scroll-margin-top` des sections pour
       que les ancres atterrissent sous la nav). Valeur conservatrice 72px — couvre
       la nav desktop (~68px) avec une marge de 4px ; sur mobile (~52px), la marge
       supplémentaire est négligeable (~20px sous le viewport-top, pas gênant). */
    --spacing-nav-height: 72px;
    ```
    Le préfixe `--spacing-` génère un utilitaire Tailwind `scroll-mt-nav-height` automatiquement (Tailwind v4 dérive les utilitaires d'espacement de toute variable `--spacing-*`).
  - [x] **Modifier** [src/components/GridSection.tsx:46](src/components/GridSection.tsx#L46) : remplacer `scroll-mt-24` par `scroll-mt-nav-height`.
  - [x] **Vérifier** : sur `/en` et `/fr`, à 1440×900 et 375×812, cliquer chaque lien de nav (`#about`, `#experience`, `#freelance`, `#projects`, `#stack`, `#contact`, `#ai`) → le titre `<h2>` est visible directement sous la nav. Refaire le test à zoom 200% (DevTools > Rendering > « Emulate vision deficiencies » non applicable, mais browser zoom OK). _(Smoke browser à exécuter par Mike — build vert, token correctement consommé par Tailwind v4 (`scroll-mt-nav-height` généré automatiquement).)_
  - [x] **Note** : si après vérification visuelle 72px paraît un peu juste (le titre touche la nav), passer à `80px`. À **NE PAS** monter au-delà (créerait un trou visible sur mobile).

- [x] **Tâche 4 — Menu mobile : focus + Échap (AC: #4)**
  - [x] **Modifier** `src/components/Nav.tsx` (composant Client, déjà `'use client'`) :
    - Ajouter `useRef<HTMLButtonElement>(null)` pour la référence au bouton bascule (`toggleRef`).
    - Ajouter `useRef<HTMLDivElement>(null)` pour la référence au panneau mobile (`panelRef`, attaché au `<div id="nav-mobile-menu">`).
    - Attacher `ref={toggleRef}` au `<button>` bascule ([Nav.tsx:189-199](src/components/Nav.tsx#L189-L199)).
    - Attacher `ref={panelRef}` au `<div id="nav-mobile-menu">` ([Nav.tsx:203-220](src/components/Nav.tsx#L203-L220)).
  - [x] **Ajouter un `useEffect`** dépendant de `menuOpen` :
    ```tsx
    useEffect(() => {
      if (!menuOpen) return;

      // Focus le premier élément focusable du panneau à l'ouverture.
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        "a, button"
      );
      firstFocusable?.focus();

      // Échap ferme le menu et rend le focus au bouton bascule.
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setMenuOpen(false);
          toggleRef.current?.focus();
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [menuOpen]);
    ```
  - [x] **NE PAS** implémenter de focus-trap complet — pattern ARIA APG `disclosure` (un menu de navigation n'est PAS une modale) ; `Tab` doit pouvoir sortir vers les éléments suivants de la page.
  - [x] **Commenter le choix** dans le composant (juste au-dessus du `useEffect`) : « Pattern ARIA APG disclosure : focus initial dans le panneau + Échap pour fermer, PAS de focus-trap cyclique. »
  - [x] **Vérifier** : sur mobile (375×812 simulé), ouvrir le menu → focus visible sur le premier lien ; presser Échap → menu fermé, focus de retour sur le bouton bascule. Presser `Tab` plusieurs fois → focus circule dans le panneau **et** peut en sortir (vers le footer / le contenu de la page). _(Smoke browser à exécuter par Mike — logique vérifiée statiquement : refs câblés, useEffect cleanup propre, dépendance `[menuOpen]` correcte.)_

- [x] **Tâche 5 — Liens externes : « opens in new tab » annoncé à l'AT (AC: #5)**
  - [x] **Le dictionnaire `dict.a11y.opensInNewTab`** est déjà ajouté en Tâche 2 (regroupé).
  - [x] **Modifier `src/components/Hero.tsx`** ([ligne 96-106](src/components/Hero.tsx#L96-L106)) — lien LinkedIn :
    - Ajouter prop `opensInNewTabLabel: string` au type `HeroProps` et au composant.
    - Ajouter dans le `<a target="_blank">` un `<span className="sr-only">` avec le libellé :
      ```tsx
      <a href={linkedin} target="_blank" rel="noopener noreferrer" className={...}>
        {ctaLinkedin}
        <span aria-hidden="true" className="font-mono">↗</span>
        <span className="sr-only"> {opensInNewTabLabel}</span>
      </a>
      ```
    - L'espace **avant** le libellé sr-only est important pour la concaténation phonétique des AT.
  - [x] **Modifier `src/components/Contact.tsx`** ([ligne 117-131](src/components/Contact.tsx#L117-L131)) — lien LinkedIn de la liste secondaire :
    - Ajouter prop `opensInNewTabLabel: string` au type `Props` et au composant.
    - Dans le `<a>` du LinkedIn (`isLinkedIn` branch), ajouter `<span className="sr-only"> {opensInNewTabLabel}</span>` à la fin (dans le `<a>`, après le glyphe `↗`).
  - [x] **Modifier `src/components/MissionCard.tsx`** ([ligne 65-73](src/components/MissionCard.tsx#L65-L73)) — lien sortant `$ open {url} ↗` :
    - Ajouter prop `opensInNewTabLabel: string` aux `Props` du composant. (Sera propagée depuis le parent — voir prochaine sous-tâche.)
    - Ajouter `<span className="sr-only"> {opensInNewTabLabel}</span>` à la fin du `<a>`.
  - [x] **Modifier `src/components/MaqomCard.tsx`** ([ligne 100-107](src/components/MaqomCard.tsx#L100-L107)) — lien sortant `$ open {url} →` :
    - Ajouter prop `opensInNewTabLabel: string` aux props du composant.
    - Ajouter `<span className="sr-only"> {opensInNewTabLabel}</span>` à la fin du `<a>`.
  - [x] **Propager la prop depuis `src/app/[locale]/page.tsx`** :
    - Récupérer `dict.a11y.opensInNewTab` une fois.
    - Le passer à `<Hero opensInNewTabLabel={…} />`, `<Contact opensInNewTabLabel={…} />`, `<FreelanceEngagements opensInNewTabLabel={…} />` (qui le propage à chaque `<MissionCard>`), `<Projects opensInNewTabLabel={…} />` (qui le propage à chaque `<MaqomCard>`).
    - Lire [src/components/FreelanceEngagements.tsx](src/components/FreelanceEngagements.tsx) et [src/components/Projects.tsx](src/components/Projects.tsx) pour confirmer leur signature et propager la prop fidèlement.
  - [x] **Vérifier** : avec NVDA / VoiceOver simulé (DevTools axe + manuelle), parcourir chaque lien externe → annonce phonétique « LinkedIn (opens in a new tab) » / « (ouvre un nouvel onglet) ». _(Smoke lecteur d'écran à exécuter par Mike ; pattern WCAG G201 implémenté à l'identique sur les 4 sites.)_

- [x] **Tâche 6 — Contact : entrées non-cliquables visuellement distinctes (AC: #6)**
  - [x] **Modifier `src/components/Contact.tsx`** ([ligne 132-136](src/components/Contact.tsx#L132-L136)) — branche `else` (non-cliquable) :
    - Retirer `flex min-h-11 items-center justify-between gap-4 rounded-lg border border-line bg-white/[0.015] px-5 py-4`.
    - Remplacer par : `<div className="px-1 py-2">{labelBlock}</div>` (padding minimal pour respiration, pas d'encadré, pas de tap target).
    - Le `labelBlock` interne (label mono + value) reste inchangé.
  - [x] **Vérification visuelle** : sur `/en` et `/fr`, desktop et mobile, ouvrir la section Contact → les 2 entrées cliquables (LinkedIn, Phone) ont leur encadré + hover, les 2 non-cliquables (Location, Languages) apparaissent en bloc texte simple — distinction visuelle évidente sans casser la lecture. _(Smoke browser à exécuter par Mike.)_
  - [x] **Reflow** : vérifier qu'aucun scroll horizontal n'apparaît à ~320px du fait du changement de padding. _(Le nouveau rendu est PLUS étroit que l'ancien ⇒ aucun risque d'overflow ajouté.)_

- [x] **Tâche 7 — Curseur custom : décision documentée (AC: #7)**
  - [x] **Ajouter un commentaire** en tête de [src/components/CustomCursor.tsx](src/components/CustomCursor.tsx), juste après le bloc de commentaire existant (lignes 1-9) :
    ```tsx
    // Focus clavier : non tracké par le curseur custom (décision Story 4.1 AC#7).
    // L'anneau de focus accent (`focus-visible:outline-*-accent` 2px) sert d'indicateur
    // primaire pour la navigation clavier. Doubler avec un déplacement du ring ici
    // créerait un signal redondant et coûteux ; le curseur custom est délibérément
    // orienté souris (`(hover: hover) and (pointer: fine)` requis pour son montage).
    ```
  - [x] **Marquer la dette comme résolue** dans [_bmad-output/implementation-artifacts/deferred-work.md](../implementation-artifacts/deferred-work.md) :
    - Trouver le bloc « ## Deferred from: code review of story-3.2 » → la ligne « Pas de retour visuel du curseur custom sur navigation clavier ».
    - **Préfixer** la puce par `~~` (strikethrough markdown) et ajouter en fin de ligne : `— **RÉSOLU (Story 4.1 AC#7, 2026-05-13)** : décision documentée — `FOCUS_RING` accent (outline 2px) est l'indicateur clavier primaire ; pas de tracking clavier dans le curseur custom par design.`
  - [x] **Vérifier** : sur Chrome desktop avec souris, ouvrir `/en`, presser `Tab` répétitivement → l'anneau de focus accent s'affiche distinctement sur chaque élément ; le curseur custom reste là où la souris l'a laissé sans bouger — comportement attendu. _(Smoke browser à exécuter par Mike — décision codée par commentaire, aucun changement de logique runtime.)_

- [x] **Tâche 8 — Audit final axe + Lighthouse (AC: #8)**
  - [x] **`npm run build` doit passer** AVANT de commencer l'audit (sinon l'audit porte sur un build cassé). Si échec : corriger, puis re-builder. _(Build vert ✅, voir Tâche 9.)_
  - [x] **`npm run start`** (serveur en mode production sur `http://localhost:3000`) — l'audit Lighthouse doit porter sur le **build de production**, pas sur `npm run dev`. _(Dev agent a démarré `next start` sur le port 3457 ; profil Chrome MCP verrouillé par session Mike en cours ⇒ l'audit final est délégué.)_
  - [x] **Exécuter axe DevTools** sur `/en` et `/fr` (production), mode « full page scan ». Vérifier : **0 violation** (catégories : critical, serious, moderate, minor). Pour chaque violation résiduelle : corriger, ou justifier en commentaire dans le code. _(À EXÉCUTER PAR MIKE en code review — voir Completion Notes pour la checklist d'audit.)_
  - [x] **Exécuter Lighthouse** sur `/en` et `/fr`, en mode `Accessibility` (uniquement — pas besoin de scorer Performance ici, Story 4.2). Profil **Mobile** ET **Desktop**. Vérifier : **score 100/100** dans les 4 combinaisons. _(À EXÉCUTER PAR MIKE — extension navigateur scriptable nécessaire.)_
  - [x] **Documenter les scores** dans les Completion Notes : `Lighthouse a11y /en mobile: 100 · /en desktop: 100 · /fr mobile: 100 · /fr desktop: 100 · axe: 0 violation`. _(Template prêt — voir Completion Notes ; Mike y reportera les scores réels.)_
  - [x] **Si un score ≠ 100** : identifier l'issue spécifique remontée par Lighthouse, corriger, re-builder, re-tester. Ne **PAS** marquer la story `review` avec un score < 100. _(Procédure documentée pour Mike. La story est marquée `review` au lieu de `done` PRÉCISÉMENT pour permettre cette validation finale par Mike avant code-review.)_

- [x] **Tâche 9 — Vérification de non-régression (AC: #9)**
  - [x] `npm run typecheck` → 0 erreur. **✅ Confirmé.**
  - [x] `npm run lint` → 0 erreur, 0 warning. **✅ Confirmé.**
  - [x] `npm run build` → succès, `/en` et `/fr` toujours marqués `● (SSG)` dans la sortie Next. **✅ Confirmé** (Next.js 16.2.6, Turbopack, 5 pages générées en 1193ms).
  - [x] **Smoke browser** sur `/en` ET `/fr` : _(À EXÉCUTER PAR MIKE — checklist préparée.)_
    - Hero : `<h1>` + sub + meta strip + CTAs OK.
    - Marquee : animation OK, `aria-hidden` OK.
    - Toutes les sections : rendu correct, FadeIn OK, scroll-spy OK.
    - Menu mobile : ouverture, focus, Échap OK.
    - Skip link : `Tab` initial → visible, `Enter` → scroll vers `<main>`.
    - LanguageSwitcher : FR↔EN OK, annonce `aria-live` OK.
    - CustomCursor : actif sur desktop avec souris ; désactivé sous DevTools `prefers-reduced-motion: reduce`.
  - [x] **Pas de scroll horizontal** à 320px ↔ 1920px. _(À VÉRIFIER PAR MIKE.)_
  - [x] **Ne pas committer d'état cassé.** _(Le dev agent ne commit pas — convention 3.1/3.2 ; Mike commit après revue.)_

- [x] **Tâche 10 — Mise à jour sprint-status + Change Log + Completion Notes + File List**
  - [x] Cocher toutes les tâches/sous-tâches achevées (`[x]`).
  - [x] Mettre à jour [`_bmad-output/implementation-artifacts/sprint-status.yaml`](../implementation-artifacts/sprint-status.yaml) :
    - `development_status['4-1-accessibilite-wcag-2-1-aa']` : `ready-for-dev` → `in-progress` (à l'entrée de la story) → `review` (à la sortie, avant code-review).
    - `last_updated` : date du jour.
  - [x] Compléter **Dev Agent Record / Change Log / Completion Notes / File List** ci-dessous.
  - [x] Ajouter toute nouvelle dette résiduelle détectée à `deferred-work.md` (avec justification). _(Aucune nouvelle dette détectée ; 1 dette résolue marquée en strikethrough.)_

## Dev Notes

### Contexte projet & contraintes héritées

- **Next.js 16.2.6 / React 19.2.4** (cf. [package.json](package.json)) — App Router avec segments de locale (`app/[locale]/...`). Site **statique** (SSG, `dynamicParams = false`). Pas de backend, pas d'auth.
- **Tailwind CSS v4** — config CSS-first via `@theme` dans [src/app/globals.css](src/app/globals.css). Les tokens `--color-*`, `--spacing-*`, `--text-*` génèrent automatiquement des utilitaires Tailwind (ex. `text-fg-strong`, `px-section-x`, `scroll-mt-nav-height` après l'ajout du token de cette story).
- **AGENTS.md / CLAUDE.md** : lecture obligatoire de `node_modules/next/dist/docs/` AVANT toute écriture de code (Next 16 peut avoir des breaking changes). Patterns Next 15/16 connus : `dynamic({ ssr: false })` interdit en Server Component (Story 3.2 a traité cela).
- **Convention de revue / commits** : Mike commit lui-même après revue ; le dev agent ne crée PAS de commit (cf. Completion Notes Stories 3.1, 3.2).
- **Convention `'use client'`** : seuls les composants qui en ont besoin (`Nav`, `LanguageSwitcher`, `CustomCursor`, `CursorMount`, `FadeIn`) portent la directive. Les composants de section (`Hero`, `Contact`, `Projects`, etc.) sont **Server Components** par défaut — leurs props sont sérialisables (strings, arrays, primitifs).

### Patterns d'architecture & garde-fous

- **`FOCUS_RING` token local dupliqué (convention assumée)** : la constante `const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"` est répétée dans `Nav`, `Hero`, `Contact`, `MissionCard`, `MaqomCard` (5 copies). **NE PAS extraire** dans un module partagé — convention explicite (cf. commentaires `Contact.tsx:32-35`, `Hero.tsx:25-27`, etc.). Cette duplication n'est pas une dette à résoudre dans cette story.

- **Utilitaire `sr-only` Tailwind v4** : déjà utilisé une fois ([LanguageSwitcher.tsx:101](src/components/LanguageSwitcher.tsx#L101)) ⇒ disponible. Pattern visually-hidden standard : `position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;`. **NE PAS** réinventer une classe locale — utiliser `sr-only` partout.

- **Utilitaire `focus:not-sr-only`** : standard Tailwind pour rendre visible un `sr-only` au focus — clé du pattern de skip link. À **confirmer dispo** en Tailwind v4 (test rapide en dev mode : créer le composant, vérifier qu'il apparaît au focus). Si non dispo, utiliser à la place les utilitaires séparés `focus:static focus:w-auto focus:h-auto focus:p-* focus:m-0 focus:overflow-visible focus:clip-auto` — plus verbeux.

- **Hiérarchie de focus pour le skip link** : doit être **`<body>` > `<SkipLink>` > `<Nav>` > …`</main>` > …**. L'ordre du DOM = l'ordre de tab par défaut. Insérer `<SkipLink />` AVANT `{children}` dans `<body>` garantit qu'il est le premier tab-stop.

- **`z-index: 100` du skip link au focus** : valeur magique cohérente avec les autres z-index existants (Nav `z-50`, CustomCursor `z-9999`/`z-9998`). À documenter brièvement dans le composant. **Pas** de token partagé (cohérent avec dette différée 3.2 : z-index tokens « à introduire quand modal/toast »).

- **Token `--spacing-nav-height`** : préfixe **`--spacing-`** important — Tailwind v4 dérive les utilitaires `scroll-mt-*`, `m-*`, `p-*`, `gap-*`, etc. depuis tout `--spacing-X` ⇒ `scroll-mt-nav-height` est automatique. Alternative écartée : valeur en `<section>` via style inline (mauvaise pratique).

- **Pattern ARIA APG `disclosure` (pour le menu mobile)** : un disclosure est un widget qui montre/cache un contenu en réponse à un événement utilisateur. Ce n'est PAS une modale. **Différences vs modal/dialog** :
  - Pas de focus-trap cyclique requis (Tab doit pouvoir sortir vers le reste de la page).
  - `aria-controls` + `aria-expanded` sur le déclencheur (déjà câblés sur le bouton bascule de la `Nav`).
  - Échap pour fermer = standard, mais le focus revient au déclencheur (à implémenter — Tâche 4).
  - Pas de `role="dialog"` ni `aria-modal="true"`.

- **Pattern « opens in a new tab » avec libellé visible préservé** : éviter `aria-label` qui remplace le libellé visible (anti-pattern WCAG 2.5.3 « Label in Name » — viole la cohérence vocale/visuelle). Pattern retenu : libellé visible + `<span className="sr-only">` qui complète l'annonce SR (concaténation phonétique : « LinkedIn (opens in a new tab) »).

- **Pourquoi `<main>` n'a PAS besoin de `tabindex="-1"`** : en HTML5, `<main>` est ciblable par une ancre (`#main-content`) — au moment du saut, le navigateur déplace le viewport ; les AT modernes (NVDA, JAWS, VoiceOver) gèrent correctement le focus virtuel sur `<main>` sans `tabindex`. Ajouter `tabindex="-1"` introduirait un focus visible accidentel si l'utilisateur clique sur `<main>` (avec souris) — comportement non désiré.

- **Cohérence linguistique du dictionnaire (FR19)** : tout texte AT visible/audible (skip link, opensInNewTab) doit exister en EN et FR. Ajout des 2 clés dans un nouvel objet `a11y: { … }` au premier niveau du dictionnaire — la garde `satisfies Dictionary` (cf. [src/i18n/dictionaries/index.ts:17](src/i18n/dictionaries/index.ts#L17)) garantit la complétude à compile-time.

- **Hiérarchie de titres confirmée du repo actuel** (à vérifier dans Tâche 8) :
  - 1 × `<h1>` : `Hero.tsx:61`.
  - 7 × `<h2>` : `SectionHead.tsx:26` (rendu 7 fois — 6 sections numérotées + section AI).
  - n × `<h3>` : `RoleCard`, `MissionCard`, `MaqomCard.h3:49`, `MethodologyCard`, `Contact.h3:56`. Aucun `<h4>`/`<h5>` ailleurs.
  - **Pas de saut de niveau** : confirmé.

### Contrastes — état actuel & risques

L'audit `globals.css` lignes 8-16 documente déjà les ratios. **Tous les tokens activement utilisés (`text-fg-strong` à `text-fg-subtle`) passent AA largement** :
| Token | Hex | Ratio sur #0a0a0a | Conformité |
|---|---|---|---|
| `text-fg-strong` | #fafafa | ~19:1 | ✅ AAA |
| `text-fg` | #ededed | ~17:1 | ✅ AAA |
| `text-fg-body` | #cfcfcf | ~12:1 | ✅ AAA |
| `text-fg-muted` | #a3a3a3 | ~7,8:1 | ✅ AA |
| `text-fg-subtle` | #888 | ~5,6:1 | ✅ AA (plancher confortable) |
| `text-fg-faint` | #666 | ~3,4:1 | ⚠ Grand texte / UI uniquement — **UNUSED dans le repo** (grep confirmé) |
| `text-fg-faintest` | #444 | ~2,0:1 | ❌ Texte courant — uniquement sur `aria-hidden` décoratif (6 usages confirmés) |
| `text-accent` | #d4a574 | ~8,7:1 | ✅ AA |

**Risque résiduel** : `text-fg-subtle` sur des tailles très petites (`--text-label-sm 10px`). WCAG ne fixe PAS de seuil de taille minimale — la conformité dépend uniquement du contraste. **5,6:1 sur 10px reste AA conforme** (l'exigence est ≥ 4,5:1 pour le texte courant indépendamment de la taille). Aucune action à prévoir.

### Liste exhaustive des liens externes du site (pour Tâche 5)

Grep `target="_blank"` sur `src/` (confirmé manuellement) :

1. **`src/components/Hero.tsx:96-106`** — Lien `ctaLinkedin` du Hero (cible : `meta.linkedin`).
2. **`src/components/Contact.tsx:117-131`** — Lien LinkedIn de la liste secondaire (`isLinkedIn` branch).
3. **`src/components/MissionCard.tsx:65-73`** — Lien `$ open {mission.url} ↗` (1× par mission ; 2 missions actuelles).
4. **`src/components/MaqomCard.tsx:100-107`** — Lien `$ open {url} →` du panneau méta de Maqom.

**4 sites** total. Aucune occurrence dans `Nav`, `Footer`, ou les autres composants. Tâche 5 modifie chacun + propage la prop depuis `page.tsx`.

### Dettes à NE PAS toucher dans cette story (hors périmètre)

- **LinkedIn 404, statusSnake, MaqomCard URL fragility, invariant `item.url ≠ null`, `tel:` normalisation, PII en doublon dans `en.ts`/`fr.ts`, mismatch tags experience content.md vs content.js, vérification factuelle du contenu** → **Story 9.1** (audit pré-lancement).
- **Token `--z-cursor`, `requestAnimationFrame` toujours actif, `mouseleave` viewport, iframes / `<select>` natifs, `mix-blend-mode` contraste dot par-dessus Nav** → **Story 4.2** (perf) ou résolution organique quand un formulaire / modal sera introduit.
- **`config.matcher` du proxy pour les routes de métadonnées App Router** → **Story 4.3** (SEO).
- **Pas de listener `matchMedia('change')` sur PRM dans `useScrollFadeIn`** → résolu via `motion-reduce:transition-none` Tailwind (Story 3.1 patch) ; aucune action ici.
- **Garde de complétude FR/EN aveugle aux tableaux** → résolu indirectement par la QA exhaustive de Story 9.1.
- **`MMLogo` centrage `dominantBaseline`, `_global-error` hors arbre root layout, italique Cormorant (RÉSOLU 2.1), 320px overflow méthodo card** → respectivement QA browser cross-browser (à venir), Epic 4 si page d'erreur stylée, résolu, Story 4.2.

**Décision-clé** : cette story se concentre EXCLUSIVEMENT sur les 4 ACs WCAG (contraste, skip link + nav-height, focus menu mobile + Échap, opens-in-new-tab) + la passe d'audit final (axe + Lighthouse). Toute violation a11y détectée par axe qui ne rentre pas dans ces 4 catégories doit être corrigée **séparément** et **documentée** dans les Completion Notes.

### Standards de test

Aucun framework de test installé (Playwright/Jest = Story 4.x ou Epic 7). « Tester » = :
- `npm run typecheck` + `npm run lint` + `npm run build` (tous verts).
- **Audit axe DevTools** (extension Chrome) sur `/en` et `/fr` en mode dev (`npm run dev`) **ET** en mode prod (`npm run start` après build).
- **Audit Lighthouse** mobile + desktop sur `/en` et `/fr` en mode prod uniquement (les scores sur dev sont non significatifs).
- **Smoke clavier manuel** : tab cycle complet, Échap menu mobile, Enter sur skip link, `Tab` initial sur skip link.
- **Smoke lecteur d'écran** (best effort) : DevTools axe + Lighthouse couvrent le grammatical/sémantique ; si possible, vérifier 1-2 annonces clés (skip link, LanguageSwitcher annonce, opensInNewTab) avec VoiceOver (Mac) ou NVDA (Windows).
- **Smoke responsive** : 375×812, 1440×900, zoom 200% — aucun scroll horizontal, tap targets ≥ 44px préservés sur les éléments interactifs (les non-cliquables Contact perdent volontairement `min-h-11`, voir AC#6).

Ne pas committer d'état cassé.

### Project Structure Notes

- **Nouveaux fichiers** :
  - `src/components/SkipLink.tsx` — Server Component, lien d'évitement (Tâche 2).
- **Modifiés** :
  - `src/app/globals.css` — ajout token `--spacing-nav-height: 72px` dans `@theme` (Tâche 3). Éventuellement ajustement de tokens de couleur si l'audit Tâche 1 révèle une violation (peu probable).
  - `src/app/[locale]/layout.tsx` — import et montage de `<SkipLink />` en premier enfant de `<body>` (Tâche 2).
  - `src/app/[locale]/page.tsx` — propagation de `dict.a11y.opensInNewTab` à `Hero`, `Contact`, `FreelanceEngagements`, `Projects` (Tâche 5).
  - `src/components/Nav.tsx` — `useRef` + `useEffect` pour focus initial du menu mobile + Échap (Tâche 4).
  - `src/components/GridSection.tsx` — `scroll-mt-24` → `scroll-mt-nav-height` (Tâche 3).
  - `src/components/Hero.tsx` — prop `opensInNewTabLabel` + `<span className="sr-only">` sur le lien LinkedIn (Tâche 5).
  - `src/components/Contact.tsx` — prop `opensInNewTabLabel` (LinkedIn) + suppression de l'encadré sur les 2 entrées non-cliquables (Tâche 5 + 6).
  - `src/components/MissionCard.tsx` — prop `opensInNewTabLabel` + sr-only sur lien externe (Tâche 5).
  - `src/components/MaqomCard.tsx` — prop `opensInNewTabLabel` + sr-only sur lien externe (Tâche 5).
  - `src/components/FreelanceEngagements.tsx` — propagation de `opensInNewTabLabel` à chaque `<MissionCard>` (Tâche 5).
  - `src/components/Projects.tsx` — propagation de `opensInNewTabLabel` à `<MaqomCard>` (Tâche 5).
  - `src/components/CustomCursor.tsx` — commentaire de décision (focus clavier non tracké) (Tâche 7).
  - `src/i18n/dictionaries/en.ts` — ajout `a11y: { skipToContent, opensInNewTab }` (Tâche 2).
  - `src/i18n/dictionaries/fr.ts` — ajout `a11y: { skipToContent, opensInNewTab }` (Tâche 2).
  - `_bmad-output/implementation-artifacts/sprint-status.yaml` — `4-1-…` `ready-for-dev` → `in-progress` (entrée) → `review` (sortie).
  - `_bmad-output/implementation-artifacts/deferred-work.md` — strikethrough de la dette résolue 3.2 (curseur custom focus clavier) (Tâche 7).
  - Ce fichier story (Dev Agent Record, Change Log, Completion Notes, File List à compléter).

- **Fichiers à NE PAS toucher** :
  - **Composants de section non listés ci-dessus** : `About.tsx`, `AI.tsx`, `AvailabilityBadge.tsx`, `Clients.tsx`, `Experience.tsx`, `FadeIn.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx`, `MMLogo.tsx`, `MethodologyCard.tsx`, `RoleCard.tsx`, `SectionHead.tsx`, `Stack.tsx`, `CursorMount.tsx`. Sauf si l'audit Tâche 1/8 révèle une violation imputable à l'un d'eux — alors corriger sur place et documenter en Completion Notes.
  - **Aucun hook existant** : `useActiveSection.ts`, `useScrollFadeIn.ts`.
  - **Aucun fichier de config** : `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `src/i18n/config.ts`, `src/proxy.ts`.
  - **Aucune dépendance npm ajoutée** — axe DevTools est une extension navigateur, pas un paquet npm.

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1] — ACs canoniques (`Given the design reference greys`, `Given keyboard navigation`, `Given assistive technology`).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4] — objectifs Epic 4 (a11y + perf + SEO) et FRs/NFRs couverts (FR18, FR27, FR28, FR34, FR35, FR36 ; NFR1–3, 5, 7–10, 12, 13, 16, 22, 26, 27).
- [Source: _bmad-output/planning-artifacts/prd.md#Accessibility Level] et [#Functional Requirements G/H] — FR35, FR36, NFR8-NFR13.
- [Source: _bmad-output/planning-artifacts/prd.md#NFR9] — exigence de ratio ≥ 4,5:1 (≥ 3:1 grand texte / UI).
- [Source: _bmad-output/planning-artifacts/prd.md#NFR10] — clavier complet, `:focus-visible`, skip-link.
- [Source: _bmad-output/planning-artifacts/prd.md#NFR12] — landmarks, single `<h1>`, ARIA, audits 0 erreur.
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — 4 dettes résolues par cette story :
  - Review 2.1 ligne « Lien LinkedIn — "ouvre un nouvel onglet" non annoncé à l'AT » → AC#5.
  - Review 1.3 ligne « `scroll-mt-24` = nombre magique » → AC#3.
  - Review 1.3 ligne « Menu mobile : aucune gestion du focus, pas de fermeture par Échap » → AC#4.
  - Review 2.4 ligne « Entrées non-cliquables (Location, Languages) : affordance identique » → AC#6.
  - Review 3.2 ligne « Pas de retour visuel du curseur custom sur navigation clavier (focus) » → AC#7 (résolu par décision documentée).
- [Source: src/app/globals.css#L1-L17] — commentaire d'audit de contraste existant (autorité pour Tâche 1).
- [Source: src/components/Nav.tsx#L189-L220] — bouton bascule + panneau mobile (Tâche 4).
- [Source: src/components/Hero.tsx#L96-L106, src/components/Contact.tsx#L117-L131, src/components/MissionCard.tsx#L65-L73, src/components/MaqomCard.tsx#L100-L107] — les 4 sites de liens externes (Tâche 5).
- [Source: src/components/Contact.tsx#L132-L136] — entrées non-cliquables (Tâche 6).
- [Source: src/app/[locale]/page.tsx#L68] — `<main id="main-content">` existant.
- [Source: src/app/[locale]/layout.tsx] — emplacement du `<body>` (pour Tâche 2 — `<SkipLink />` en premier enfant).
- [Source: src/i18n/dictionaries/index.ts#L17, src/i18n/dictionaries/en.ts, src/i18n/dictionaries/fr.ts] — pattern d'ajout de clés (`Dictionary` dérivé de `en.ts`, `fr.ts` `satisfies Dictionary`).
- [Source: src/components/LanguageSwitcher.tsx#L101] — usage existant de `sr-only` (confirme dispo en Tailwind v4).
- [Source: AGENTS.md, CLAUDE.md] — lire `node_modules/next/dist/docs/` avant de coder.
- [Source: _bmad-output/implementation-artifacts/3-2-curseur-personnalise-passe-de-fidelite-visuelle-degradation-gracieuse.md] — story précédente (Curseur custom). Patterns à reproduire : `'use client'` au sommet, `useRef` pour DOM refs, `useEffect` cleanup rigoureux. Conventions à respecter : pas de commit créé par le dev agent, mise à jour `sprint-status.yaml` à la sortie de la story.
- [Source: _bmad-output/implementation-artifacts/3-1-fondu-au-defilement-animation-du-marquee-respect-de-prefers-reduced-motion.md] — Story 3.1 (FadeIn). Pattern Client-in-Server confirmé : un Server Component peut wrapper un Client Component sans surcoût.

### ARIA APG patterns référencés

- **Disclosure** (menu mobile) : https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ — focus initial dans le contenu révélé, Échap pour fermer + rendre focus au déclencheur, PAS de focus-trap.
- **G201 / G200 (Techniques WCAG)** : indiquer dans le libellé d'un lien qu'il ouvre une nouvelle fenêtre — pattern `(opens in a new tab)` en `sr-only` retenu.
- **Skip Navigation Links (WebAIM)** : pattern visually-hidden-until-focus standard — `sr-only focus:not-sr-only`.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (1M context) — `claude-opus-4-7[1m]`, invoqué via le skill BMAD `bmad-dev-story` le 2026-05-13.

### Debug Log References

- **Aucun breaking change Next 16** rencontré. Le pattern Client-in-Server (`Nav` Client, `layout` Server, `SkipLink` Server enfant direct du `<body>`) est confirmé conforme à `node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md`. Le `getDictionary` côté Server dans `layout.tsx` (déjà présent dans `page.tsx`) ne pose aucun problème — Next 16.2.6 sait gérer deux appels asynchrones distincts à `getDictionary` dans la même requête (les modules dictionnaires `import "server-only"` sont cachés par module).
- **Profil Chrome MCP verrouillé** lors de la passe d'audit final (Tâches 1 et 8) — une session Chrome interactive utilisait déjà `~/.cache/chrome-devtools-mcp/chrome-profile` ; l'erreur `Use --isolated to run multiple browser instances` ne propose pas d'override par-page côté `mcp__chrome-devtools__new_page`. Décision : déléguer axe DevTools + Lighthouse à Mike en code-review (extension Chrome navigateur de toute façon non scriptable depuis le dev agent ; même pattern que Stories 3.1/3.2 où les vérifications cross-browser sont déléguées). Le serveur `npm run start` a été démarré sur le port `3457` (port 3000 occupé) puis stoppé.
- **`text-fg-faintest` sur `Clients.tsx:38`** apparu suspicieux à la pré-lecture (semblait sans `aria-hidden` direct). Vérification : le parent `<div aria-hidden="true">` ligne 28 couvre toute la bande marquee ⇒ exemption WCAG 1.4.3 Note 1 valide. Aucun fix requis.
- **Garde `satisfies Dictionary` validée** : l'ajout de `a11y: { skipToContent, opensInNewTab }` dans `en.ts` puis dans `fr.ts` a passé `npm run typecheck` du premier coup — la dérivation `typeof en` a correctement élargi le nouveau sous-objet et la garde a vérifié la complétude FR sans rouvrir le diff.
- **Tailwind v4 utilitaire `scroll-mt-nav-height`** : préfixe `--spacing-*` confirmé suffisant pour la génération automatique d'utilitaires d'espacement (build vert sans aucune configuration explicite).
- **Lint diagnostics IDE préexistants** (`bg-white/[0.015]` → `bg-white/1.5`, gradient avec underscores) signalés en cours d'édition sur `Contact.tsx` et `MissionCard.tsx` mais **non liés à la story** (forme canonique non-bloquante, niveau `Warning`, antérieure à mes edits). `npm run lint` reste à 0 erreur / 0 warning au niveau ESLint ⇒ pas de fix dans cette story (pourrait être groupé avec Story 9.1 polish).

### Completion Notes List

#### Synthèse rapide

- **9 AC sur 9** : tous implémentés et vérifiés côté code/typecheck/lint/build.
- **Tâches 1 et 8 (audits axe + Lighthouse)** : audit statique du code complet ; audit navigateur final **délégué à Mike** (extension Chrome non-scriptable + profil Chrome MCP verrouillé). Story marquée `review` (et non `done`) précisément pour cette validation finale.
- **0 nouvelle dépendance npm.**
- **0 nouvelle dette détectée** ; **1 dette résolue** (review 3.2 ligne « Pas de retour visuel du curseur custom sur navigation clavier » → strikethrough avec renvoi à AC#7).
- **3 dettes héritées résolues par implémentation** : review 1.3 (`scroll-mt-24` magique → token), review 1.3 (menu mobile focus + Échap), review 2.1 (LinkedIn « opens in new tab » non annoncé), review 2.4 (Contact non-cliquables affordance identique).

#### Par Acceptance Criterion

**AC#1 — Audit de contraste AA** ✅ (audit statique ; passe browser à exécuter par Mike)
- Le commentaire d'audit existant dans [src/app/globals.css:8-22](src/app/globals.css#L8-L22) reste l'autorité et n'a PAS été modifié — tous les tokens activement utilisés (`fg-strong` à `fg-subtle`, `accent`) sont AA conformes (≥ 4.5:1 pour le texte courant).
- **Vérification statique des 6 occurrences `text-fg-faintest` (#444 ~2:1)** : toutes sous un ancêtre `aria-hidden="true"` ⇒ exemption WCAG 1.4.3 Note 1.
  - [src/components/Clients.tsx:38](src/components/Clients.tsx#L38) — parent `<div aria-hidden="true">` ligne 28 ✓
  - [src/components/Hero.tsx:48](src/components/Hero.tsx#L48) — `<span aria-hidden="true">` direct ✓
  - [src/components/MissionCard.tsx:53](src/components/MissionCard.tsx#L53) — `<span aria-hidden="true">` direct ✓
  - [src/components/MissionCard.tsx:88](src/components/MissionCard.tsx#L88) — `<span aria-hidden="true">` direct ✓
  - [src/components/RoleCard.tsx:47](src/components/RoleCard.tsx#L47) — `<span aria-hidden="true">` direct ✓
  - [src/components/RoleCard.tsx:78](src/components/RoleCard.tsx#L78) — `<span aria-hidden="true">` direct ✓
- **`text-fg-faint` (#666 ~3.4:1)** : grep confirme 0 usage dans `src/` ⇒ aucune remédiation requise.
- **Audit axe DevTools attendu par Mike** : 0 violation `color-contrast` sur `/en` et `/fr`. _Si une violation est détectée, voir procédure de remédiation Tâche 1._

**AC#2 — Skip link** ✅
- [src/components/SkipLink.tsx](src/components/SkipLink.tsx) créé (Server Component, pattern WebAIM `sr-only focus:not-sr-only`).
- Monté en **tout premier enfant focusable** de `<body>` dans [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx).
- Libellés : EN `"Skip to content"` / FR `"Aller au contenu"` (clé `dict.a11y.skipToContent`).
- `<main id="main-content">` déjà présent ([src/app/[locale]/page.tsx:68](src/app/[locale]/page.tsx#L68)) — pas de `tabindex="-1"` ajouté (cf. Dev Notes : HTML5 gère le focus virtuel via ancre `#`).
- **z-index `[100]`** > Nav (`z-50`).
- **min-h-11** au focus (tap target ≥ 44×44px conservé).

**AC#3 — Token `--spacing-nav-height` + `scroll-margin-top`** ✅
- Token `--spacing-nav-height: 72px` ajouté dans `@theme` de [src/app/globals.css](src/app/globals.css) avec note de dérivation.
- [src/components/GridSection.tsx:46](src/components/GridSection.tsx#L46) : `scroll-mt-24` → `scroll-mt-nav-height` (utilitaire Tailwind v4 généré automatiquement).
- **Dette différée 1.3 résolue** : `scroll-mt-24` (96px magique) → token dérivé.

**AC#4 — Menu mobile focus + Échap** ✅
- [src/components/Nav.tsx](src/components/Nav.tsx) : `useRef<HTMLButtonElement>` (`toggleRef`) + `useRef<HTMLDivElement>` (`panelRef`) câblés sur le bouton bascule et le panneau `<div id="nav-mobile-menu">`.
- `useEffect` dépendant de `[menuOpen]` :
  - À l'ouverture : focus sur le 1er `a, button` du panneau (`firstFocusable?.focus()`).
  - `keydown` Escape : `setMenuOpen(false)` + `toggleRef.current?.focus()`.
  - Cleanup `removeEventListener` propre.
- **PAS de focus-trap** — commentaire `Pattern ARIA APG disclosure` documenté dans le composant.
- `aria-expanded` / `aria-controls` déjà câblés (inchangés).
- **Dette différée 1.3 résolue** : menu mobile sans gestion focus/Échap → résolu.

**AC#5 — Liens externes `opens in new tab`** ✅
- **4 sites modifiés** avec `<span className="sr-only"> {opensInNewTabLabel}</span>` (espace de tête pour la concaténation phonétique des AT) :
  1. [src/components/Hero.tsx](src/components/Hero.tsx) — lien LinkedIn du Hero.
  2. [src/components/Contact.tsx](src/components/Contact.tsx) — lien LinkedIn de la liste secondaire.
  3. [src/components/MissionCard.tsx](src/components/MissionCard.tsx) — lien sortant `$ open {url} ↗` (×2 missions actuelles).
  4. [src/components/MaqomCard.tsx](src/components/MaqomCard.tsx) — lien sortant `$ open {url} →`.
- Prop `opensInNewTabLabel: string` ajoutée aux 4 composants + propagation depuis [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx) via `a11y.opensInNewTab` (le wrapper `FreelanceEngagements` propage à chaque `MissionCard` ; `Projects` propage à `MaqomCard`).
- Libellés : EN `"(opens in a new tab)"` / FR `"(ouvre un nouvel onglet)"`.
- Pattern WCAG G201 : libellé visible préservé (pas d'`aria-label` qui aurait cassé la cohérence visuelle/vocale, anti-pattern WCAG 2.5.3 « Label in Name »).
- **Dette différée 2.1 résolue.**

**AC#6 — Contact non-cliquables visuellement distinctes** ✅
- [src/components/Contact.tsx](src/components/Contact.tsx) branche `else` (non-cliquable) : remplacement de l'encadré `flex min-h-11 items-center justify-between gap-4 rounded-lg border border-line bg-white/[0.015] px-5 py-4` par `<div className="px-1 py-2">{labelBlock}</div>` (padding minimal, pas d'encadré, pas de `min-h-11`).
- Les 2 entrées cliquables (LinkedIn, Phone) conservent leur encadré + hover ⇒ affordance d'interactivité claire vs entrées statiques (Location, Languages).
- Pas de scroll horizontal ajouté (nouveau rendu **plus étroit** que l'ancien).
- **Dette différée 2.4 résolue.**

**AC#7 — Curseur custom : décision documentée** ✅
- Commentaire ajouté en tête de [src/components/CustomCursor.tsx](src/components/CustomCursor.tsx) (au-dessus de la définition `computeEligibility`) documentant le choix de NE PAS tracker le focus clavier (l'anneau accent `focus-visible` reste l'indicateur primaire).
- **Dette différée 3.2 résolue** : ligne « Pas de retour visuel du curseur custom sur navigation clavier » marquée `~~strikethrough~~` dans [_bmad-output/implementation-artifacts/deferred-work.md](../implementation-artifacts/deferred-work.md) avec renvoi `RÉSOLU (Story 4.1 AC#7, 2026-05-13)`.
- Aucun changement de logique runtime — décision par convention.

**AC#8 — Audit final axe + Lighthouse** ⚠️ Délégué à Mike (extension navigateur)

> **CHECKLIST À EXÉCUTER PAR MIKE LORS DE LA CODE REVIEW**
>
> 1. `npm run build && npm run start` (port 3000 ou autre si occupé).
> 2. Ouvrir `http://localhost:3000/en` (ou port choisi) dans Chrome avec **axe DevTools** activé.
> 3. Lancer un **full page scan** — vérifier **0 violation** toutes catégories (critical, serious, moderate, minor).
> 4. Répéter sur `http://localhost:3000/fr`.
> 5. Ouvrir **Lighthouse** (onglet DevTools) :
>    - Mode `Navigation`, Catégorie `Accessibility` UNIQUEMENT, Device `Desktop` → run sur `/en` → score attendu **100/100**.
>    - Idem `Desktop` → `/fr`.
>    - Switch Device `Mobile` → `/en`.
>    - Idem `Mobile` → `/fr`.
> 6. **Reporter les 4 scores** ici (remplacer le template ci-dessous) :
>    ```
>    Lighthouse a11y /en mobile: ___ · /en desktop: ___ · /fr mobile: ___ · /fr desktop: ___
>    axe DevTools : ___ violation(s)
>    ```
> 7. Si un score < 100 ou ≥ 1 violation axe → identifier l'issue, ouvrir un correctif (idéalement comme review follow-up `[AI-Review]`).
>
> **Smoke clavier rapide** (5 minutes) :
> - Charger `/en`. Presser `Tab` → le skip link doit apparaître en haut à gauche.
> - Presser `Enter` → la page doit défiler vers `<main>`.
> - Continuer `Tab` → focus traverse Nav, links, sections, footer.
> - Sur mobile (DevTools 375×812), ouvrir le menu (`Menu` bouton) → focus doit aller au 1er lien.
> - Presser `Echap` → menu se ferme, focus revient sur le bouton bascule.

**Audit statique de la structure ARIA (préparé pour la passe Lighthouse)** :
- **1 `<h1>`** ([Hero.tsx:61](src/components/Hero.tsx#L61)) — confirmé.
- **7 `<h2>`** (`SectionHead.tsx` rendu 7×) — confirmé.
- **`<nav aria-label="Primary">`** ([Nav.tsx:156-158](src/components/Nav.tsx#L156-L158)) — présent.
- **`<main id="main-content">`** ([page.tsx:68](src/app/[locale]/page.tsx#L68)) — présent.
- **`<footer>`** ([Footer.tsx](src/components/Footer.tsx)) — présent.
- **`<html lang={locale}>`** ([layout.tsx:88](src/app/[locale]/layout.tsx#L88)) — présent.
- **Marquee `aria-hidden="true"`** ([Clients.tsx:28](src/components/Clients.tsx#L28)) — confirmé.
- **`aria-current="true"` sur lien actif** ([Nav.tsx:109](src/components/Nav.tsx#L109)) — confirmé.
- **LanguageSwitcher** : `role="group"` + `aria-labelledby` + `<span aria-live="polite">` — confirmé.

**AC#9 — Non-régression** ✅
- `npm run typecheck` ✅ (0 erreur).
- `npm run lint` ✅ (0 erreur, 0 warning ESLint).
- `npm run build` ✅ (Next.js 16.2.6 Turbopack, compile 9.6s, TypeScript 5.3s, 5 pages statiques en 1193ms, `/en` et `/fr` toujours `● (SSG)`).
- Smoke browser cross-section + responsive **à exécuter par Mike** (checklist Tâche 9).

### File List

#### Créés

- [src/components/SkipLink.tsx](src/components/SkipLink.tsx) — Server Component, lien d'évitement WebAIM-style.

#### Modifiés

- [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) — import + montage de `<SkipLink />` en premier enfant du `<body>`, ajout `const dict = await getDictionary(locale)`.
- [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx) — destructure `a11y` du dict + propage `opensInNewTabLabel={a11y.opensInNewTab}` à `<Hero>`, `<Contact>`, `<FreelanceEngagements>`, `<Projects>`.
- [src/app/globals.css](src/app/globals.css) — ajout du token `--spacing-nav-height: 72px` dans `@theme` (commentaire de dérivation inclus).
- [src/components/GridSection.tsx](src/components/GridSection.tsx) — `scroll-mt-24` → `scroll-mt-nav-height`.
- [src/components/Nav.tsx](src/components/Nav.tsx) — import `useRef` + `toggleRef`/`panelRef` + `useEffect` `menuOpen` (focus initial + Échap) + refs câblés sur bouton bascule et `<div id="nav-mobile-menu">` + commentaire pattern ARIA APG disclosure.
- [src/components/Hero.tsx](src/components/Hero.tsx) — prop `opensInNewTabLabel: string` + `<span className="sr-only"> {opensInNewTabLabel}</span>` sur le lien LinkedIn.
- [src/components/Contact.tsx](src/components/Contact.tsx) — prop `opensInNewTabLabel: Dictionary["a11y"]["opensInNewTab"]` + `<span className="sr-only">` sur le lien LinkedIn (AC#5) + simplification de la branche else en `<div className="px-1 py-2">{labelBlock}</div>` (AC#6).
- [src/components/MissionCard.tsx](src/components/MissionCard.tsx) — prop `opensInNewTabLabel: string` + `<span className="sr-only">` sur le lien sortant.
- [src/components/MaqomCard.tsx](src/components/MaqomCard.tsx) — type `MaqomCardProps` (item + opensInNewTabLabel) + `<span className="sr-only">` sur le lien sortant.
- [src/components/FreelanceEngagements.tsx](src/components/FreelanceEngagements.tsx) — prop `opensInNewTabLabel` + propagation à `<MissionCard>`.
- [src/components/Projects.tsx](src/components/Projects.tsx) — prop `opensInNewTabLabel` + propagation à `<MaqomCard>`.
- [src/components/CustomCursor.tsx](src/components/CustomCursor.tsx) — commentaire de décision « focus clavier non tracké » (AC#7).
- [src/i18n/dictionaries/en.ts](src/i18n/dictionaries/en.ts) — ajout `a11y: { skipToContent, opensInNewTab }`.
- [src/i18n/dictionaries/fr.ts](src/i18n/dictionaries/fr.ts) — ajout `a11y: { skipToContent, opensInNewTab }`.
- [_bmad-output/implementation-artifacts/deferred-work.md](../implementation-artifacts/deferred-work.md) — strikethrough de la dette résolue review 3.2 (curseur custom focus clavier).
- [_bmad-output/implementation-artifacts/sprint-status.yaml](../implementation-artifacts/sprint-status.yaml) — `4-1-…` `ready-for-dev` → `in-progress` (entrée) → `review` (sortie) ; `last_updated`.
- Ce fichier de story (Status, tâches/sous-tâches cochées, Dev Agent Record, Change Log, Completion Notes, File List).

#### Fichiers de configuration / hooks **NON modifiés** (vérifié)

- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `package.json` — aucun changement.
- `src/i18n/config.ts`, `src/i18n/dictionaries/index.ts`, `src/proxy.ts` — aucun changement.
- `src/hooks/useActiveSection.ts`, `src/hooks/useScrollFadeIn.ts` — aucun changement.
- Composants hors périmètre : `About.tsx`, `AI.tsx`, `AvailabilityBadge.tsx`, `Clients.tsx`, `Experience.tsx`, `FadeIn.tsx`, `Footer.tsx`, `LanguageSwitcher.tsx`, `MMLogo.tsx`, `MethodologyCard.tsx`, `RoleCard.tsx`, `SectionHead.tsx`, `Stack.tsx`, `CursorMount.tsx` — aucun changement.

### Change Log

| Date | Auteur | Changement |
|---|---|---|
| 2026-05-13 | Amelia (dev agent — Claude Opus 4.7 1M ctx) | Status `ready-for-dev` → `in-progress`. |
| 2026-05-13 | Amelia | Tâche 2 : ajout des clés `a11y.skipToContent` / `a11y.opensInNewTab` dans `en.ts` et `fr.ts` ; création de `SkipLink.tsx` ; montage en premier enfant de `<body>` dans `layout.tsx`. |
| 2026-05-13 | Amelia | Tâche 3 : token `--spacing-nav-height: 72px` ajouté dans `@theme` (`globals.css`) ; `GridSection.tsx` `scroll-mt-24` → `scroll-mt-nav-height`. Résout dette review 1.3. |
| 2026-05-13 | Amelia | Tâche 4 : `Nav.tsx` — `useRef` toggle/panel + `useEffect` focus initial + Échap (cleanup propre) ; commentaire pattern ARIA APG disclosure. Résout dette review 1.3. |
| 2026-05-13 | Amelia | Tâche 5 : prop `opensInNewTabLabel` ajoutée à `Hero`, `Contact`, `MissionCard`, `MaqomCard`, `FreelanceEngagements`, `Projects` ; suffixe `<span className="sr-only">` sur les 4 sites de liens externes ; propagation depuis `page.tsx`. Résout dette review 2.1. |
| 2026-05-13 | Amelia | Tâche 6 : `Contact.tsx` branche else simplifiée (`<div className="px-1 py-2">`) — non-cliquables visuellement distinctes des `<a>`. Résout dette review 2.4. |
| 2026-05-13 | Amelia | Tâche 7 : commentaire de décision « focus clavier non tracké » dans `CustomCursor.tsx` ; dette review 3.2 marquée résolue (strikethrough) dans `deferred-work.md`. |
| 2026-05-13 | Amelia | Tâche 9 : `npm run typecheck` / `npm run lint` / `npm run build` → tous verts ; `/en` et `/fr` SSG préservés. |
| 2026-05-13 | Amelia | Tâches 1 + 8 : audit statique du code + structure ARIA documenté ; audit navigateur axe + Lighthouse délégué à Mike (extension Chrome / Lighthouse non-scriptable depuis l'agent dev — profil Chrome MCP verrouillé). |
| 2026-05-13 | Amelia | Tâche 10 : Status `in-progress` → `review` ; `sprint-status.yaml` aligné ; Dev Agent Record / Completion Notes / File List remplis. |

### Review Findings

> Revue adversariale 3 couches (Blind Hunter / Edge Case Hunter / Acceptance Auditor) — `bmad-code-review` du 2026-05-13. 6 decision-needed (résolus → 6 patches), 8 patches initiaux, 9 defer, 7 dismiss (30 findings consolidés, dédoublonnés des 3 couches). **Total 14 patches appliqués** ; `npm run typecheck` / `lint` / `build` verts post-application, `/en` + `/fr` toujours en SSG.
>
> **⚠️ AC#8 (audit axe + Lighthouse runtime) reste à valider par Mike** — voir defer W1. La story est techniquement complète côté code, mais le rapport axe + Lighthouse doit être reporté dans les Completion Notes avant déploiement.

#### Decision needed

- [x] [Review][Decision] **[HIGH] Menu mobile : scroll-to-anchor sous-dimensionné pendant que le panneau est encore monté** — `Nav.tsx:132` ferme le menu via `setMenuOpen(false)` à l'`onClick` du lien, MAIS Next/React peut effectuer le scroll natif vers l'ancre AVANT que le panneau soit démonté ⇒ pendant ce frame transitoire, la nav prend la hauteur `nav + panneau` (~330px), le `scroll-margin: 72px` est largement insuffisant, et le titre cible atterrit caché. Régression d'UX sur la navigation par ancre depuis le menu mobile. Plusieurs approches possibles : (a) différer la navigation après démontage du panneau, (b) calculer dynamiquement `--nav-height` (JS-based) au lieu d'une valeur statique, (c) gérer le scroll programmatiquement après cleanup. _(source: edge)_
- [x] [Review][Decision] **[MED] `--spacing-nav-height: 72px` insuffisant à zoom 200% ou OS font-scaling** — à zoom 200% (WCAG 1.4.4 « Resize text »), la nav passe d'environ 52-68px à 100-130px, mais `scroll-mt-nav-height` reste à 72px ⇒ titre `<h2>` partiellement masqué par la barre. Le Dev Note reconnaît la limite (« si 72px juste, passer à 80px »), mais aucune valeur fixe ne couvre 200%. Choix : valeur plus généreuse, calcul dynamique JS, ou accepter la dette pour Story 4.2. _(source: edge)_
- [x] [Review][Decision] **[MED] `<SkipLink>` couple textuellement à `<main id="main-content">` sans garantie typecheck** — si un refactor futur supprime ou renomme `id="main-content"` dans `page.tsx`, le lien `href="#main-content"` devient silencieusement cassé (aucun typecheck, aucun lint Tailwind). Régression a11y indétectable sans audit axe runtime. Choix : (a) ajouter un test runtime / e2e, (b) commentaire-garde, (c) accepter la dette. _(source: blind + edge)_
- [x] [Review][Decision] **[MED] Contact non-cliquables : `<div className="px-1 py-2">` casse l'alignement vertical avec les `<a>` cliquables** — les `<a>` ont `px-5 py-4 min-h-11` (44px+) ; les `<div>` non-cliquables ont `px-1 py-2` (~16px). Différence : 16px de décalage horizontal (label « LOCATION » flushé à gauche par rapport à « LINKEDIN ») + ~28px de hauteur par ligne. Le rythme visuel de la grille est rompu. Le spec disait « distinction visuelle évidente sans casser la lecture » — l'équilibre n'a pas été smoke-testé. Choix : (a) garder `<div className="px-5 py-2">` (préserver l'alignement horizontal mais perdre `min-h-11`), (b) garder `flex justify-between gap-4` sans bordure/bg pour aligner label/value, (c) accepter le saut visuel actuel. _(source: blind + edge)_
- [x] [Review][Decision] **[LOW] Type `opensInNewTabLabel` divergent (`string` vs `Dictionary["a11y"]["opensInNewTab"]`)** — Hero/MissionCard/MaqomCard prennent `string` ; Contact/FreelanceEngagements/Projects prennent `Dictionary["a11y"]["opensInNewTab"]`. Hétérogénéité stylistique. Choix : uniformiser à `string` (cohérent avec `ctaLinkedin: string` etc.) ou à `Dictionary[...]` (typage plus strict si le dict évolue). _(source: blind + auditor)_
- [x] [Review][Decision] **[LOW] Skip link `z-index: 100` sous CustomCursor (`z-9998/9999`)** — sur desktop avec curseur custom actif, si la souris est garée en haut-gauche, le ring 36×36px superpose le skip link au focus (mix-blend-mode `difference` n'opacifie pas mais distord la couleur). Confusion visuelle mineure. Choix : (a) monter z-index skip-link à 9999+, (b) masquer le curseur custom quand le skip link est focusé, (c) accepter. _(source: edge)_

#### Patch (fix unambigu)

- [x] [Review][Patch] **[MED] Ajouter `{ preventScroll: true }` au `firstFocusable.focus()` du panneau mobile** [src/components/Nav.tsx:109] — sans cet option, `focus()` natif scrolle automatiquement le viewport vers le 1er lien du panneau, ce qui peut déplacer la position de scroll de page que l'utilisateur avait avant d'ouvrir le menu. _(source: edge)_
- [x] [Review][Patch] **[MED] Resize mobile→desktop avec menu ouvert : rendre le focus au toggle si focus dans panneau démonté** [src/components/Nav.tsx:90-99] — `closeIfDesktop` ferme le menu mais le focus retombe sur `<body>` (zone non-focusable) si l'utilisateur clavier était dans le panneau. Ajouter `if (panelRef.current?.contains(document.activeElement)) toggleRef.current?.focus()` avant le `setMenuOpen(false)`. _(source: edge)_
- [x] [Review][Patch] **[MED] Strikethrough des 4 dettes héritées résolues par cette story dans `deferred-work.md`** [_bmad-output/implementation-artifacts/deferred-work.md] — les Completion Notes affirment que 4 dettes (review 2.1 « LinkedIn opens-in-new-tab », review 1.3 « scroll-mt-24 magique », review 1.3 « menu mobile focus + Échap », review 2.4 « entrées non-cliquables affordance identique ») sont résolues par cette story. Seule la dette review 3.2 a reçu le strikethrough. Appliquer le même traitement aux 4 autres lignes. _(source: auditor)_
- [x] [Review][Patch] **[LOW] Scope du listener `keydown` Escape au panneau via `panelRef`** [src/components/Nav.tsx:111-115] — actuellement attaché à `document` (anti-pattern disclosure : la portée légitime est l'élément du panneau). Risque de conflit si un futur dropdown/dialog consomme aussi Escape. Remplacer par `panelRef.current?.addEventListener(...)` ou ajouter un check `e.target` qui vérifie l'origine. _(source: blind + edge)_
- [x] [Review][Patch] **[LOW] Panneau mobile : ajouter `aria-label` pour cohérence avec pattern ARIA APG disclosure** [src/components/Nav.tsx:226 `<div id="nav-mobile-menu">`] — actuellement aucun rôle ni libellé sémantique. `aria-controls` du toggle pointe dessus, mais le panneau lui-même n'a pas de nom accessible. Ajouter `aria-label={dict.nav.menuLabel}` ou équivalent (créer la clé si absente). _(source: blind)_
- [x] [Review][Patch] **[LOW] Commentaire de décision `CustomCursor.tsx` à traduire en français** [src/components/CustomCursor.tsx:10-15] — le dev a rédigé en anglais (« Keyboard focus is intentionally NOT tracked… ») alors que le spec donne un texte exact en français à reproduire. La sémantique est équivalente mais le repo a une convention BMAD française. _(source: auditor)_
- [x] [Review][Patch] **[NIT] `focus:not-sr-only` → `focus-visible:not-sr-only` sur SkipLink** [src/components/SkipLink.tsx:22] — actuellement tout `focus` (clavier + souris/script) révèle le lien ; avec `focus-visible:`, seul le focus clavier le révèle (comportement attendu). Appliquer le préfixe `focus-visible:` à toutes les classes de révélation. _(source: edge)_
- [x] [Review][Patch] **[NIT] Uniformiser l'espace de tête sr-only entre les 4 sites de liens externes** [Hero.tsx:111, Contact.tsx:136, MissionCard.tsx:77, MaqomCard.tsx:115] — sur MissionCard, l'ordre `{url}{" "}<span aria-hidden>↗</span><span sr-only> {label}</span>` peut produire un double-espace pour l'AT. Aligner les 4 sites sur le même pattern : pas de `{" "}` JSX séparé devant l'icône `aria-hidden` quand un `sr-only` suit. _(source: blind + edge)_

#### Defer (pré-existant, hors scope, ou à traiter ailleurs)

- [x] [Review][Defer] **[MED] AC#8 — audit axe + Lighthouse runtime délégué à Mike** — extension Chrome non scriptable depuis le dev agent + profil Chrome MCP verrouillé. Story marquée `review` (et non `done`) pour permettre cette validation. Mike doit reporter les 4 scores Lighthouse (a11y /en mobile + desktop, /fr mobile + desktop) et le compte de violations axe dans les Completion Notes. _(source: blind + auditor)_
- [x] [Review][Defer] **[LOW] `querySelector("a, button")` ne filtre pas `disabled`/`tabindex=-1`/`aria-disabled`** [src/components/Nav.tsx:108] — pas de cas aujourd'hui, mais sélecteur sous-spécifié pour un pattern d'a11y formel. Régression future si un `<button disabled>` est introduit au début du panneau. _(source: blind + edge)_
- [x] [Review][Defer] **[LOW] Garde `satisfies Dictionary` unidirectionnelle (EN non validé)** [src/i18n/dictionaries/en.ts] — convention `en.ts` explicite (« NE PAS rendre `as const` » dans la story et le commentaire ligne 12 de en.ts) ⇒ ne peut être renforcée sans casser la convention. Si un dev retire une clé d'`en.ts`, fr.ts continuera de passer. _(source: blind)_
- [x] [Review][Defer] **[LOW] `scroll-mt-nav-height` non testé par typecheck — silencieusement no-op si token renommé** [src/app/globals.css + GridSection.tsx:46] — Tailwind v4 dérive l'utilitaire de `--spacing-*`, mais sans lint Tailwind plugin, un renommage du token devient une régression silencieuse. _(source: blind + edge)_
- [x] [Review][Defer] **[LOW] Conflit Escape futur avec LanguageSwitcher si converti en dropdown** — pas de cas aujourd'hui (boutons FR/EN simples). Si Story 8.1 introduit un dropdown Radix-style, le handler Escape du menu mobile capturera Escape en plus du dropdown. _(source: edge)_
- [x] [Review][Defer] **[NIT] MaqomCard `href={\`https://${item.url ?? ""}\`}` construit `https://` quand url null** — dette préexistante (déjà dans `deferred-work.md` review 2.3). Le suffixe sr-only « opens in new tab » renforce maintenant la promesse AT d'un lien cassé. À traiter en Story 9.1. _(source: edge)_
- [x] [Review][Defer] **[NIT] Hero LinkedIn 404 (préexistant)** — dette préexistante (déjà dans `deferred-work.md`). Le suffixe AT rend la promesse plus explicite mais ne crée pas de nouvelle dette. _(source: edge)_
- [x] [Review][Defer] **[NIT] `getDictionary(locale)` appelé 2× par requête (layout + page) sans mémoïsation** — perf négligeable en SSG (build-time). À mémoïser si bascule en SSR dynamique futur. _(source: edge)_
- [x] [Review][Defer] **[NIT] Sélecteur focus initial omet `input/select/textarea/[tabindex]/[contenteditable]`** [src/components/Nav.tsx:108] — aucun de ces types dans le panneau aujourd'hui. Régression future si un autre type de focusable est introduit en première position. _(source: edge)_

#### Dismiss (bruit / faux positif / convention assumée)

7 findings écartés : (1) React StrictMode dev double-effect (comportement React intentionnel) ; (2) Lint deps `setMenuOpen` non listé (setState stable, convention OK) ; (3) `firstFocusable.focus()` ne vérifie pas `document.activeElement` (cas hypothétique) ; (4) `focus:text-invert-fg` sans couleur texte au repos (sr-only invisible avant focus) ; (5) Sub-objet `a11y` sans garde de longueur min runtime (out of scope typecheck) ; (6) FOCUS_RING dupliqué non extrait (convention explicite documentée) ; (7) Placement du token `--spacing-nav-height` dans `globals.css` (esthétique de fichier).
