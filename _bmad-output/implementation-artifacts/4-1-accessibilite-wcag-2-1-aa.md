# Story 4.1: Accessibilité WCAG 2.1 AA

Status: ready-for-dev

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

- [ ] **Tâche 0 — Pré-lecture obligatoire (AGENTS.md / CLAUDE.md)**
  - [ ] **AGENTS.md** impose de **lire les docs Next dans `node_modules/next/dist/docs/`** avant d'écrire du code. Pour cette story, lire :
    - `…/01-app/01-getting-started/05-server-and-client-components.md` — confirmer le pattern Client-in-Server (la `Nav` est Client, le reste majoritairement Server).
    - `…/01-app/02-guides/`** (selon catalogue Next 16) tout doc relatif à `next/link` + scroll anchor behavior, ou à la composition Server/Client (déjà internalisé en Story 3.2 mais re-confirmer absence de breaking change).
  - [ ] Vérifier les avis de dépréciation (deprecation notices) listés en surface des docs Next 16.
  - [ ] Lire `_bmad-output/planning-artifacts/design/Portfolio.html` et `Minimal.jsx` **uniquement pour confirmer qu'aucun pattern visuel d'a11y nouveau** y est requis au-delà de ce qui est déjà en place — le design de référence ne dicte PAS la sémantique HTML.
  - [ ] Lire ce fichier de story de bout en bout **ET** les sections Completion Notes / File List des stories 1.3, 2.1, 2.4, 3.1, 3.2 pour comprendre les patterns déjà appliqués.
  - [ ] Lire intégralement [_bmad-output/implementation-artifacts/deferred-work.md](../implementation-artifacts/deferred-work.md) — cette story résout 4 dettes ; les autres dettes (URL `MaqomCard`, `statusSnake`, LinkedIn 404, etc.) sont **hors périmètre** et resteront en place.

- [ ] **Tâche 1 — Audit de contraste sur fond `#0a0a0a` (AC: #1)**
  - [ ] Installer/activer `axe DevTools` (extension Chrome) en mode local — pas de modification du `package.json` (extension navigateur uniquement).
  - [ ] Lancer `npm run dev` et naviguer sur `http://localhost:3000/en` puis `/fr`.
  - [ ] Exécuter `axe DevTools` scan complet sur chaque locale → filtrer par catégorie `color-contrast`.
  - [ ] **Résultat attendu** : 0 violation `color-contrast` (le commentaire d'audit existant dans [src/app/globals.css:8-16](src/app/globals.css#L8-L16) prédit cela).
  - [ ] Pour **chaque violation** détectée (s'il y en a) :
    1. Identifier le sélecteur / le token incriminé.
    2. Si l'élément est `aria-hidden="true"` (décoratif) → annoter dans le commentaire d'audit de `globals.css` (exemption WCAG 1.4.3 Note 1). PAS de fix.
    3. Sinon → ajuster la valeur du token dans `globals.css` (en remontant d'un cran l'échelle de gris, ex. `#888 → #999`). Re-scanner. Conserver l'esthétique du design (jamais blanc pur sur sombre pour de la méta).
  - [ ] **Documenter** dans les Completion Notes : combien de violations trouvées, combien ignorées (aria-hidden), combien corrigées, et lesquelles.

- [ ] **Tâche 2 — Lien d'évitement « skip to content » (AC: #2)**
  - [ ] **Ajouter une clé `a11y.skipToContent`** au dictionnaire :
    - `src/i18n/dictionaries/en.ts` : créer un nouvel objet de premier niveau `a11y: { skipToContent: "Skip to content", opensInNewTab: "(opens in a new tab)" }` (regrouper les 2 ajouts d'a11y pour cohérence). **NE PAS** rendre `as const` — convention `en.ts` (cf. commentaire ligne 12).
    - `src/i18n/dictionaries/fr.ts` : ajouter `a11y: { skipToContent: "Aller au contenu", opensInNewTab: "(ouvre un nouvel onglet)" } satisfies …` — la garde `satisfies Dictionary` du fichier garantit la complétude.
  - [ ] **Créer `src/components/SkipLink.tsx`** (Server Component pur — pas d'interactivité, pas de `'use client'`) :
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
  - [ ] **Monter `<SkipLink />` dans `src/app/[locale]/layout.tsx`** comme **tout premier enfant de `<body>`**, AVANT `{children}` et AVANT `<CursorMount />`. Charger le libellé depuis le dictionnaire :
    ```tsx
    const dict = await getDictionary(locale);
    // ...
    <body className="min-h-full flex flex-col">
      <SkipLink label={dict.a11y.skipToContent} />
      {children}
      <CursorMount />
    </body>
    ```
  - [ ] **Vérifier** : presser `Tab` une fois après chargement de page → le lien apparaît, presser `Enter` → la page scrolle vers `<main>`.
  - [ ] **Sémantique** : ne **PAS** ajouter `tabindex="-1"` à `<main>` — non requis en HTML5, et introduirait un focus visible non désiré.

- [ ] **Tâche 3 — Token `--nav-height` + `scroll-margin-top` (AC: #3)**
  - [ ] **Ajouter** dans `src/app/globals.css`, à l'intérieur du bloc `@theme` (avec les autres tokens d'espacement, lignes ~63-68) :
    ```css
    /* Hauteur de la `Nav` sticky (utilisée par `scroll-margin-top` des sections pour
       que les ancres atterrissent sous la nav). Valeur conservatrice 72px — couvre
       la nav desktop (~68px) avec une marge de 4px ; sur mobile (~52px), la marge
       supplémentaire est négligeable (~20px sous le viewport-top, pas gênant). */
    --spacing-nav-height: 72px;
    ```
    Le préfixe `--spacing-` génère un utilitaire Tailwind `scroll-mt-nav-height` automatiquement (Tailwind v4 dérive les utilitaires d'espacement de toute variable `--spacing-*`).
  - [ ] **Modifier** [src/components/GridSection.tsx:46](src/components/GridSection.tsx#L46) : remplacer `scroll-mt-24` par `scroll-mt-nav-height`.
  - [ ] **Vérifier** : sur `/en` et `/fr`, à 1440×900 et 375×812, cliquer chaque lien de nav (`#about`, `#experience`, `#freelance`, `#projects`, `#stack`, `#contact`, `#ai`) → le titre `<h2>` est visible directement sous la nav. Refaire le test à zoom 200% (DevTools > Rendering > « Emulate vision deficiencies » non applicable, mais browser zoom OK).
  - [ ] **Note** : si après vérification visuelle 72px paraît un peu juste (le titre touche la nav), passer à `80px`. À **NE PAS** monter au-delà (créerait un trou visible sur mobile).

- [ ] **Tâche 4 — Menu mobile : focus + Échap (AC: #4)**
  - [ ] **Modifier** `src/components/Nav.tsx` (composant Client, déjà `'use client'`) :
    - Ajouter `useRef<HTMLButtonElement>(null)` pour la référence au bouton bascule (`toggleRef`).
    - Ajouter `useRef<HTMLDivElement>(null)` pour la référence au panneau mobile (`panelRef`, attaché au `<div id="nav-mobile-menu">`).
    - Attacher `ref={toggleRef}` au `<button>` bascule ([Nav.tsx:189-199](src/components/Nav.tsx#L189-L199)).
    - Attacher `ref={panelRef}` au `<div id="nav-mobile-menu">` ([Nav.tsx:203-220](src/components/Nav.tsx#L203-L220)).
  - [ ] **Ajouter un `useEffect`** dépendant de `menuOpen` :
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
  - [ ] **NE PAS** implémenter de focus-trap complet — pattern ARIA APG `disclosure` (un menu de navigation n'est PAS une modale) ; `Tab` doit pouvoir sortir vers les éléments suivants de la page.
  - [ ] **Commenter le choix** dans le composant (juste au-dessus du `useEffect`) : « Pattern ARIA APG disclosure : focus initial dans le panneau + Échap pour fermer, PAS de focus-trap cyclique. »
  - [ ] **Vérifier** : sur mobile (375×812 simulé), ouvrir le menu → focus visible sur le premier lien ; presser Échap → menu fermé, focus de retour sur le bouton bascule. Presser `Tab` plusieurs fois → focus circule dans le panneau **et** peut en sortir (vers le footer / le contenu de la page).

- [ ] **Tâche 5 — Liens externes : « opens in new tab » annoncé à l'AT (AC: #5)**
  - [ ] **Le dictionnaire `dict.a11y.opensInNewTab`** est déjà ajouté en Tâche 2 (regroupé).
  - [ ] **Modifier `src/components/Hero.tsx`** ([ligne 96-106](src/components/Hero.tsx#L96-L106)) — lien LinkedIn :
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
  - [ ] **Modifier `src/components/Contact.tsx`** ([ligne 117-131](src/components/Contact.tsx#L117-L131)) — lien LinkedIn de la liste secondaire :
    - Ajouter prop `opensInNewTabLabel: string` au type `Props` et au composant.
    - Dans le `<a>` du LinkedIn (`isLinkedIn` branch), ajouter `<span className="sr-only"> {opensInNewTabLabel}</span>` à la fin (dans le `<a>`, après le glyphe `↗`).
  - [ ] **Modifier `src/components/MissionCard.tsx`** ([ligne 65-73](src/components/MissionCard.tsx#L65-L73)) — lien sortant `$ open {url} ↗` :
    - Ajouter prop `opensInNewTabLabel: string` aux `Props` du composant. (Sera propagée depuis le parent — voir prochaine sous-tâche.)
    - Ajouter `<span className="sr-only"> {opensInNewTabLabel}</span>` à la fin du `<a>`.
  - [ ] **Modifier `src/components/MaqomCard.tsx`** ([ligne 100-107](src/components/MaqomCard.tsx#L100-L107)) — lien sortant `$ open {url} →` :
    - Ajouter prop `opensInNewTabLabel: string` aux props du composant.
    - Ajouter `<span className="sr-only"> {opensInNewTabLabel}</span>` à la fin du `<a>`.
  - [ ] **Propager la prop depuis `src/app/[locale]/page.tsx`** :
    - Récupérer `dict.a11y.opensInNewTab` une fois.
    - Le passer à `<Hero opensInNewTabLabel={…} />`, `<Contact opensInNewTabLabel={…} />`, `<FreelanceEngagements opensInNewTabLabel={…} />` (qui le propage à chaque `<MissionCard>`), `<Projects opensInNewTabLabel={…} />` (qui le propage à chaque `<MaqomCard>`).
    - Lire [src/components/FreelanceEngagements.tsx](src/components/FreelanceEngagements.tsx) et [src/components/Projects.tsx](src/components/Projects.tsx) pour confirmer leur signature et propager la prop fidèlement.
  - [ ] **Vérifier** : avec NVDA / VoiceOver simulé (DevTools axe + manuelle), parcourir chaque lien externe → annonce phonétique « LinkedIn (opens in a new tab) » / « (ouvre un nouvel onglet) ».

- [ ] **Tâche 6 — Contact : entrées non-cliquables visuellement distinctes (AC: #6)**
  - [ ] **Modifier `src/components/Contact.tsx`** ([ligne 132-136](src/components/Contact.tsx#L132-L136)) — branche `else` (non-cliquable) :
    - Retirer `flex min-h-11 items-center justify-between gap-4 rounded-lg border border-line bg-white/[0.015] px-5 py-4`.
    - Remplacer par : `<div className="px-1 py-2">{labelBlock}</div>` (padding minimal pour respiration, pas d'encadré, pas de tap target).
    - Le `labelBlock` interne (label mono + value) reste inchangé.
  - [ ] **Vérification visuelle** : sur `/en` et `/fr`, desktop et mobile, ouvrir la section Contact → les 2 entrées cliquables (LinkedIn, Phone) ont leur encadré + hover, les 2 non-cliquables (Location, Languages) apparaissent en bloc texte simple — distinction visuelle évidente sans casser la lecture.
  - [ ] **Reflow** : vérifier qu'aucun scroll horizontal n'apparaît à ~320px du fait du changement de padding.

- [ ] **Tâche 7 — Curseur custom : décision documentée (AC: #7)**
  - [ ] **Ajouter un commentaire** en tête de [src/components/CustomCursor.tsx](src/components/CustomCursor.tsx), juste après le bloc de commentaire existant (lignes 1-9) :
    ```tsx
    // Focus clavier : non tracké par le curseur custom (décision Story 4.1 AC#7).
    // L'anneau de focus accent (`focus-visible:outline-*-accent` 2px) sert d'indicateur
    // primaire pour la navigation clavier. Doubler avec un déplacement du ring ici
    // créerait un signal redondant et coûteux ; le curseur custom est délibérément
    // orienté souris (`(hover: hover) and (pointer: fine)` requis pour son montage).
    ```
  - [ ] **Marquer la dette comme résolue** dans [_bmad-output/implementation-artifacts/deferred-work.md](../implementation-artifacts/deferred-work.md) :
    - Trouver le bloc « ## Deferred from: code review of story-3.2 » → la ligne « Pas de retour visuel du curseur custom sur navigation clavier ».
    - **Préfixer** la puce par `~~` (strikethrough markdown) et ajouter en fin de ligne : `— **RÉSOLU (Story 4.1 AC#7, 2026-05-13)** : décision documentée — `FOCUS_RING` accent (outline 2px) est l'indicateur clavier primaire ; pas de tracking clavier dans le curseur custom par design.`
  - [ ] **Vérifier** : sur Chrome desktop avec souris, ouvrir `/en`, presser `Tab` répétitivement → l'anneau de focus accent s'affiche distinctement sur chaque élément ; le curseur custom reste là où la souris l'a laissé sans bouger — comportement attendu.

- [ ] **Tâche 8 — Audit final axe + Lighthouse (AC: #8)**
  - [ ] **`npm run build` doit passer** AVANT de commencer l'audit (sinon l'audit porte sur un build cassé). Si échec : corriger, puis re-builder.
  - [ ] **`npm run start`** (serveur en mode production sur `http://localhost:3000`) — l'audit Lighthouse doit porter sur le **build de production**, pas sur `npm run dev`.
  - [ ] **Exécuter axe DevTools** sur `/en` et `/fr` (production), mode « full page scan ». Vérifier : **0 violation** (catégories : critical, serious, moderate, minor). Pour chaque violation résiduelle : corriger, ou justifier en commentaire dans le code.
  - [ ] **Exécuter Lighthouse** sur `/en` et `/fr`, en mode `Accessibility` (uniquement — pas besoin de scorer Performance ici, Story 4.2). Profil **Mobile** ET **Desktop**. Vérifier : **score 100/100** dans les 4 combinaisons.
  - [ ] **Documenter les scores** dans les Completion Notes : `Lighthouse a11y /en mobile: 100 · /en desktop: 100 · /fr mobile: 100 · /fr desktop: 100 · axe: 0 violation`.
  - [ ] **Si un score ≠ 100** : identifier l'issue spécifique remontée par Lighthouse, corriger, re-builder, re-tester. Ne **PAS** marquer la story `review` avec un score < 100.

- [ ] **Tâche 9 — Vérification de non-régression (AC: #9)**
  - [ ] `npm run typecheck` → 0 erreur.
  - [ ] `npm run lint` → 0 erreur, 0 warning.
  - [ ] `npm run build` → succès, `/en` et `/fr` toujours marqués `● (SSG)` dans la sortie Next.
  - [ ] **Smoke browser** sur `/en` ET `/fr` :
    - Hero : `<h1>` + sub + meta strip + CTAs OK.
    - Marquee : animation OK, `aria-hidden` OK.
    - Toutes les sections : rendu correct, FadeIn OK, scroll-spy OK.
    - Menu mobile : ouverture, focus, Échap OK.
    - Skip link : `Tab` initial → visible, `Enter` → scroll vers `<main>`.
    - LanguageSwitcher : FR↔EN OK, annonce `aria-live` OK.
    - CustomCursor : actif sur desktop avec souris ; désactivé sous DevTools `prefers-reduced-motion: reduce`.
  - [ ] **Pas de scroll horizontal** à 320px ↔ 1920px.
  - [ ] **Ne pas committer d'état cassé.**

- [ ] **Tâche 10 — Mise à jour sprint-status + Change Log + Completion Notes + File List**
  - [ ] Cocher toutes les tâches/sous-tâches achevées (`[x]`).
  - [ ] Mettre à jour [`_bmad-output/implementation-artifacts/sprint-status.yaml`](../implementation-artifacts/sprint-status.yaml) :
    - `development_status['4-1-accessibilite-wcag-2-1-aa']` : `ready-for-dev` → `in-progress` (à l'entrée de la story) → `review` (à la sortie, avant code-review).
    - `last_updated` : date du jour.
  - [ ] Compléter **Dev Agent Record / Change Log / Completion Notes / File List** ci-dessous.
  - [ ] Ajouter toute nouvelle dette résiduelle détectée à `deferred-work.md` (avec justification).

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

(À compléter par le dev agent à l'entrée de la story.)

### Debug Log References

(À compléter par le dev agent au fil de l'implémentation — surprises, breaking changes Next 16, ajustements de tokens contraste détectés via axe, etc.)

### Completion Notes List

(À compléter par le dev agent à la sortie de la story, en miroir de la structure des Stories 3.1 / 3.2 : par AC, avec mesures chiffrées — scores axe / Lighthouse, dénombrement violations corrigées, vérifications cross-browser le cas échéant.)

### File List

(À compléter par le dev agent : créés vs modifiés, avec liens [path](path).)
