# Story 1.2a: Design system « Technical Minimal » (tokens & polices)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want the site to render with the "Technical Minimal" visual identity (palette, spacing, typography),
so that everything looks consistent and polished from the first paint.

## Acceptance Criteria

1. **Design tokens disponibles comme utilitaires Tailwind.** Étant donné le design de référence (`Minimal.jsx` / `Portfolio.html`), quand les design tokens sont configurés dans Tailwind (config CSS-first v4 via `@theme` dans `globals.css`), alors sont disponibles comme utilitaires : la **palette sombre** (fond `#0a0a0a`, surfaces alternées `#080808`/`#070707`, surfaces de cartes `#0c0c0c`/`#0f0f0f`/`#101010`, lignes `#1f1f1f`/`#1a1a1a`), l'**accent doré** `#d4a574` (+ ses variantes alpha), les **tokens de texte** (`#fafafa` titres, `#ededed` corps fort, `#cfcfcf`/`#a3a3a3` corps, `#888` muted) avec les **gris audités contraste AA** (cf. AR11 — voir Dev Notes), l'**échelle d'espacement** (section ~`96px` vertical / `80px` horizontal en desktop, gouttière `32px`, réduits sur mobile), et les **tokens typographiques** des 3 familles : Inter (UI/corps), JetBrains Mono (labels de section, nav terminal, cartes terminal), Cormorant Garamond (titres display) — avec échelles de tailles, `letter-spacing` et `line-height` issues du design.

2. **Polices auto-hébergées via `next/font`.** Étant donné les trois familles de polices, quand l'app build, alors Inter, JetBrains Mono et Cormorant Garamond sont **auto-hébergées via `next/font`** (aucune requête runtime vers `fonts.gstatic.com` / Google Fonts), sous-ensemble `latin`, `display: swap`, avec **Inter préchargée** (`preload: true`) et les deux autres en `preload: false` — aucun FOIT visible ; les variables CSS des polices sont posées sur `<html>` et câblées aux tokens `--font-*` de Tailwind.

> **Note de portée :** cette story livre **uniquement** le système de tokens + l'intégration des polices + l'application de l'identité de base (fond sombre, police de corps, couleur de texte) sur le `layout`/`globals.css`. **Hors scope :** aucun composant de shell (`Nav`, `GridSection`, `SectionHead`, `Footer` — Story 1.3), aucune i18n / routing par locale (Story 1.2b), aucun contenu typé, aucune section de page (Epic 2), aucune animation/curseur (Epic 3), aucun audit de contraste exhaustif avec correction des composants (Epic 4 / Story 4.1 — ici on **nomme** les tokens correctement et on **documente** lesquels sont « text-safe » vs « décoratifs »). La page servie peut rester un placeholder minimal — ne pas sur-construire. Remplacer la page d'accueil par défaut de `create-next-app` par un **placeholder minimal de démonstration** des tokens/polices est autorisé et même souhaitable (cf. Tâche 5), mais sans recréer les composants de shell.

## Tasks / Subtasks

- [x] **Tâche 1 — Lire la doc Next 16 + Tailwind v4 avant tout code (impératif)**
  - [x] Lire `node_modules/next/dist/docs/` — en particulier les pages **`next/font`** (`app-getting-started-fonts*`, `app-api-reference-components-font*` ou équivalent) : confirmer l'API `next/font/google` en Next 16 (signature `{ subsets, display, variable, preload, weight, style }`), le comportement d'auto-hébergement (téléchargement au build, service depuis le domaine de l'app, **zéro requête runtime Google**), et le placement des classes `variable` (sur `<html>`). Heeder tout avis de dépréciation.
  - [x] Confirmer la config Tailwind **v4 CSS-first** : pas de `tailwind.config.js`, tout via `@import "tailwindcss"` + directive `@theme` (et `@theme inline` quand la valeur du token est elle-même un `var()` — ex. familles de polices pointant vers les variables `next/font`). Vérifier les **namespaces de tokens → utilitaires** : `--color-*` → `bg-*`/`text-*`/`border-*`/`ring-*` ; `--font-*` → `font-*` ; `--text-*` → tailles de police (`text-*`, peut embarquer `line-height` et `letter-spacing`) ; `--tracking-*` → `tracking-*` ; `--leading-*` → `leading-*` ; `--spacing-*` → `p-*`/`m-*`/`gap-*`/`w-*`/`h-*` ; `--radius-*` → `rounded-*`. Réf. : Tailwind v4 docs (theme variables / functions and directives).

- [x] **Tâche 2 — Intégrer les 3 polices via `next/font/google` dans `src/app/layout.tsx` (AC: #2)**
  - [x] Remplacer les imports `Geist` / `Geist_Mono` du scaffold par :
    - `Inter` → `{ subsets: ["latin"], display: "swap", variable: "--font-inter", preload: true }`
    - `JetBrains_Mono` → `{ subsets: ["latin"], display: "swap", variable: "--font-jetbrains-mono", preload: false }`
    - `Cormorant_Garamond` → `{ subsets: ["latin"], display: "swap", variable: "--font-cormorant", preload: false, weight: ["400","500","600"] }` (Cormorant Garamond n'a pas d'axe variable sur Google Fonts → indiquer les poids explicitement ; 400/500/600 couvrent le design ; ajuster si le build se plaint d'un poids indisponible).
  - [x] Appliquer les trois classes `*.variable` sur `<html>` (en plus de `antialiased` / `h-full`), retirer toute référence à `--font-geist-*`.
  - [x] Garder `lang="en"` pour l'instant (le routing par locale + `lang` dynamique arrive en Story 1.2b — ne pas anticiper).
  - [x] Après build : vérifier qu'aucune requête vers `fonts.googleapis.com` / `fonts.gstatic.com` n'apparaît (les fichiers `.woff2` sont émis sous `/_next/static/media/`). `npm run build` doit réussir sans warning de police.

- [x] **Tâche 3 — Définir les design tokens dans `src/app/globals.css` (AC: #1)**
  - [x] Repartir du `globals.css` du scaffold (`@import "tailwindcss";` + bloc `@theme inline { ... }` + `:root` + `body`). **Ne PAS** supprimer la palette Tailwind par défaut (`--color-*: initial;`) — on ajoute des tokens sémantiques **à côté** (la page placeholder et d'éventuels utilitaires standard restent utilisables ; nuker la palette n'apporte rien et casserait du markup existant).
  - [x] **Couleurs** (dans `@theme`, ou `@theme inline` pour celles dérivées d'un `var()`) — noms sémantiques, pas de noms de teintes brutes :
    - Surfaces : `--color-bg: #0a0a0a;` (fond global), `--color-bg-alt: #080808;`, `--color-bg-alt2: #070707;`, `--color-surface: #0c0c0c;`, `--color-surface-2: #0f0f0f;`, `--color-surface-3: #101010;`.
    - Lignes/bordures : `--color-line: #1f1f1f;`, `--color-line-soft: #1a1a1a;`.
    - Texte : `--color-text: #ededed;` (corps fort — défaut du `body`), `--color-text-strong: #fafafa;` (titres display), `--color-text-body: #cfcfcf;`, `--color-text-muted: #a3a3a3;`, `--color-text-subtle: #888888;` (**plancher AA** pour du petit texte sur `#0a0a0a` — voir audit), `--color-text-faint: #666666;`, `--color-text-faintest: #444444;` (`faint`/`faintest` = **décoratif uniquement** : labels mono « 01 ↗ », numéros de bullet, séparateurs, bordures de texte — JAMAIS pour du corps de texte ; échouent AA).
    - Accent : `--color-accent: #d4a574;`, plus variantes alpha utiles repérées dans `Minimal.jsx` : `--color-accent-soft: rgba(212,165,116,0.06);`, `--color-accent-border: rgba(212,165,116,0.2);`, `--color-accent-border-strong: rgba(212,165,116,0.3);`.
    - Statut/divers : `--color-status-available: #7eb389;` (point « available » + dot du terminal Maqom), `--color-invert-bg: #ededed;` / `--color-invert-fg: #0a0a0a;` (boutons primaires « clair sur sombre »). Boutons de fenêtre macOS (`#ff5f57`/`#febc2e`/`#28c840`) : **pas besoin de tokens** — purement décoratifs, à inliner dans le composant `Projects` (Epic 2).
  - [x] **Familles de polices** (`@theme inline` car valeurs en `var()`) :
    - `--font-sans: var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;`
    - `--font-mono: var(--font-jetbrains-mono), ui-monospace, Menlo, Monaco, "Cascadia Code", monospace;`
    - `--font-display: var(--font-cormorant), Georgia, "Times New Roman", serif;`
  - [x] **Échelle de tailles** `--text-*` (valeurs issues du design ; on peut embarquer `line-height`/`letter-spacing` dans la déclaration `--text-*` à la Tailwind v4) :
    - `--text-display-2xl: 84px;` (h1 hero — `line-height: 0.98; letter-spacing: -0.04em`)
    - `--text-display-xl: 48px;` (h2 section — `1.05` / `-0.03em`)
    - `--text-display-lg: 40px;` (h2 « AI » — `1.1` / `-0.03em`)
    - `--text-display-md: 32px;` (h3 RoleCard / titre carte contact — `~1.1` / `-0.02em`)
    - `--text-display-sm: 28px;` (h4 carte Maqom / titre méthodo `26px` ≈ — `1.15` / `-0.02em`)
    - `--text-marquee: 44px;` (wordmarks clients, Cormorant italique — `+0.04em`)
    - `--text-body-lg: 17px;` (sous-accroche hero — `1.55`)
    - `--text-body: 15px;` (corps about/cartes — `1.65`)
    - `--text-body-sm: 14px;` (corps dense / bullets / tags — `1.6`)
    - `--text-ui: 13px;` / `--text-ui-sm: 12px;` (libellés UI, liens nav, CTAs)
    - `--text-label: 11px;` / `--text-label-sm: 10px;` (labels mono `01 — ABOUT`, badges, méta)
    > Note : tu peux choisir des noms plus proches de Tailwind (`--text-5xl`, etc.) si tu préfères — l'essentiel est que les **valeurs** et l'intention (display/body/ui/label) soient présentes et documentées. Reste cohérent.
  - [x] **Letter-spacing** `--tracking-*` : `--tracking-display: -0.04em;`, `--tracking-tight: -0.03em;`, `--tracking-snug: -0.02em;`, `--tracking-base: -0.005em;` (corps Inter), `--tracking-wide: 0.1em;`, `--tracking-wider: 0.12em;` (labels mono uppercase).
  - [x] **Line-height** `--leading-*` : `--leading-display: 0.98;`, `--leading-heading: 1.05;`, `--leading-snug: 1.15;`, `--leading-body: 1.55;`, `--leading-relaxed: 1.65;`, `--leading-loose: 1.8;` (listes mono).
  - [x] **Espacement** `--spacing-*` : `--spacing-section-y: 96px;`, `--spacing-section-x: 80px;`, `--spacing-gutter: 32px;` (largeur des rails latéraux de `GridSection`), `--spacing-section-y-mobile: 56px;`, `--spacing-section-x-mobile: 20px;`. (La « réduction mobile » est appliquée au niveau composant via les variantes responsive Tailwind en Story 1.3 / Epic 2 — ici on expose les deux jeux de valeurs comme tokens.)
  - [x] **Rayons** `--radius-*` si utile : `--radius-sm: 4px;`, `--radius-md: 6px;`, `--radius-lg: 8px;`, `--radius-xl: 10px;`, `--radius-2xl: 12px;` (valeurs récurrentes dans `Minimal.jsx` : 4/6/8/10/12).
  - [x] Mettre à jour `:root` et `body` : fond `var(--color-bg)`, couleur `var(--color-text)`, `font-family: var(--font-sans)`. **Supprimer** le bloc `@media (prefers-color-scheme: dark)` du scaffold : le site est **dark-only** (le design n'a pas de variante claire) ; la palette claire `#ffffff`/`#171717` du scaffold n'a aucun usage. Optionnel : `color-scheme: dark;` sur `:root` pour aligner les UI natives (scrollbars).

- [x] **Tâche 4 — Vérifier les utilitaires générés (AC: #1)**
  - [x] Après config, confirmer que les classes attendues existent et compilent, par ex. : `bg-bg`, `bg-surface`, `text-text-strong`, `text-accent`, `border-line`, `font-display`, `font-mono`, `text-display-2xl`, `tracking-display`, `leading-display`, `p-section-y`, `px-section-x`. (Tailwind v4 génère les utilitaires à la demande au build — un simple usage dans la page placeholder suffit à valider.)
  - [x] `npm run build` → succès, routes `○ (Static)` (aucune régression vs Story 1.1). `npm run lint` → 0 erreur. `npm run typecheck` → 0 erreur.

- [x] **Tâche 5 — Page placeholder de démonstration (optionnel mais recommandé)**
  - [x] Remplacer le contenu de `src/app/page.tsx` (page d'accueil par défaut de `create-next-app`) par un **placeholder minimal** qui exerce les tokens et les 3 polices : un fond `bg-bg`, un titre en `font-display` (Cormorant), un label mono `font-mono` (style `00 ↗ DESIGN SYSTEM`), un paragraphe de corps en `font-sans` (Inter) avec `text-text-muted`, un échantillon de l'accent (`text-accent`), et 2-3 « surfaces » (`bg-surface` + `border border-line`). **But :** valider visuellement le rendu et forcer la génération des utilitaires. **Interdit :** recréer `Nav`/`GridSection`/`SectionHead`/`Footer` ou structurer les vraies sections (c'est Story 1.3 / Epic 2). Garder ça à ~40-60 lignes max, sans logique.
  - [x] Retirer du `public/` les SVG du scaffold uniquement s'ils ne servent plus à rien après le remplacement de `page.tsx` (`next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg`) — sinon laisser. Ne PAS toucher au `favicon.ico` (la pipeline favicon/OG est en Epic 4).

- [x] **Tâche 6 — Validation finale (AC: #1, #2)**
  - [x] `npm run dev` → page placeholder rendue sur fond `#0a0a0a`, les 3 polices visiblement appliquées (Cormorant en titre, JetBrains Mono en label, Inter en corps), aucun flash de police non stylée perceptible.
  - [x] `npm run build && npm run lint && npm run typecheck` → tout vert. Dans la sortie du build, vérifier la présence des `.woff2` sous `/_next/static/media/` (preuve de l'auto-hébergement) ; aucune route serveur dynamique introduite.
  - [x] Commits Conventional Commits (message simple, **sans** trailer `Co-Authored-By` sauf demande explicite). Suggestion : `feat: add Technical Minimal design tokens and self-hosted fonts`.
  - [x] Le repo distant `MMann5/portfolio` est connecté à Vercel (Story 1.1) → un `push` sur `main` déclenchera un déploiement auto ; pas d'action manuelle requise. Optionnel : vérifier que le déploiement prod reflète le placeholder.
  - [x] Remplir le *Dev Agent Record* (modèle, notes, liste des fichiers).

### Review Findings

_Revue de code adversariale (Blind Hunter + Edge Case Hunter + Acceptance Auditor) — 2026-05-12._

**Décisions requises (résolues) :**

- [x] [Review][Decision→Patch] Espace de nommage `text-*` partagé entre `--color-text-*` et `--text-*` — **Résolu : option A** (renommage). Les tokens de texte sont renommés `--color-text-*` → `--color-fg-*` dans `globals.css` (+ commentaire de nommage), et `page.tsx` mis à jour (`text-fg-strong/-muted/-subtle/-faint/-faintest`). Plus de cohabitation `text-text-*` / `text-*`. [`src/app/globals.css`, `src/app/page.tsx`]
- [x] [Review][Decision→Patch] Globs Bash trop larges dans `.claude/settings.local.json` — **Résolu : option A** (restriction). `git push *` → `git push origin *` ; `git rm *` et les deux `curl` épinglés à l'URL de preview supprimés ; `git *` (ajouté en cours de session) retiré ; ajout d'helpers read-only explicites (`git status/diff/log/show *`). [`.claude/settings.local.json`]

**Patches appliqués :**

- [x] [Review][Patch] `Inter` → `preload: true` explicite (aligné AC#2 / Tâche 2). [`src/app/layout.tsx`]
- [x] [Review][Patch] *File List* du Dev Agent Record complétée — ajout de `.claude/settings.local.json` et `sprint-status.yaml` + note de revue. [`1-2a-...md` § File List]
- [x] [Review][Patch] `<h1>` placeholder → palier responsive `text-display-md sm:text-display-2xl` (évite le débordement horizontal sur mobile). [`src/app/page.tsx`]

**Reporté (forward-looking) :**

- [x] [Review][Defer] Italique Cormorant non chargé — les wordmarks du marquee (`--text-marquee`, commenté « Cormorant italique ») seront en faux-italique tant que `style: ["italic"]` n'est pas demandé ; le commentaire « pas de version variable sur Google Fonts » est par ailleurs douteux (`variable` figure dans les poids dispos). Cadré pour Epic 2 / Story 2.1 par la story. [`src/app/layout.tsx`] — reporté
- [x] [Review][Defer] `_global-error` rend son propre `<html>`/`<body>` hors de l'arbre du root layout → les variables `--font-*` ne s'y appliquent pas ; une page d'erreur globale stylée (si ajoutée) verrait ses polices retomber sur les fallbacks. [`src/app/layout.tsx` / `globals.css` chaînes `@theme inline`] — reporté

## Dev Notes

### Contexte & objectif

Deuxième story de l'Epic 1 (« Fondations & shell bilingue déployé »), après la Story 1.1 (scaffold + CI + déploiement Vercel — **done**). Objectif : poser l'**identité visuelle « Technical Minimal »** (territoire Linear/Vercel) sous forme de **design tokens Tailwind v4** + **polices auto-hébergées** — pour que les stories suivantes (1.2b i18n, 1.3 shell, Epic 2 sections, Epic 3 mouvement) consomment des utilitaires cohérents au lieu de valeurs en dur. Le design de référence est **`Minimal.jsx`** (variante retenue) et **`Portfolio.html`** dans `_bmad-output/planning-artifacts/design/` ; c'est la source de vérité visuelle (il n'existe pas de `Architecture.md` ni `UX Design.md` formels — le dossier `design/` fait office de spec UX, cf. epics.md § UX Design Requirements).

### État du code après Story 1.1 (point de départ — à modifier)

Stack effective (≠ Dev Notes de 1.1 qui anticipaient Next 15) : **Next.js 16.2.6** (App Router, Turbopack par défaut, `next lint` supprimé → script `lint` = `eslint`), **React 19.2.4**, **TypeScript ^5** (`strict` + `noUncheckedIndexedAccess` + `noImplicitOverride`), **Tailwind CSS v4** (`@tailwindcss/postcss`, config CSS-first dans `globals.css`, pas de `tailwind.config.js`), **ESLint 9** flat config (`eslint.config.mjs`, avec `ignores` pour `_bmad/**`, `_bmad-output/**`, `docs/**`). Arborescence `src/`. Alias `@/*`. `package-lock.json` committé.

Fichiers concernés (tous **UPDATE**, sauf page placeholder qui est un remplacement de contenu) :

- **`src/app/layout.tsx`** — état actuel : importe `Geist` + `Geist_Mono` de `next/font/google`, expose `--font-geist-sans` / `--font-geist-mono`, applique `${geistSans.variable} ${geistMono.variable} h-full antialiased` sur `<html lang="en">`, `<body className="min-h-full flex flex-col">`, `metadata = { title: "Create Next App", description: "Generated by create next app" }`. → **Remplacer** les polices par Inter/JetBrains Mono/Cormorant (Tâche 2). Garder `lang="en"`, `h-full`, `antialiased`, la structure flex du `<body>` (utile pour un footer collé plus tard). Le `metadata` placeholder « Create Next App » : **laisser tel quel ou mettre un titre minimal** (« Michael Mann ») — les vraies métadonnées SEO sont en Epic 4 ; ne pas sur-investir.
- **`src/app/globals.css`** — état actuel : `@import "tailwindcss";` puis `:root { --background:#fff; --foreground:#171717 }`, `@theme inline { --color-background; --color-foreground; --font-sans: var(--font-geist-sans); --font-mono: var(--font-geist-mono) }`, `@media (prefers-color-scheme: dark)` qui passe en `#0a0a0a`/`#ededed`, `body { background; color; font-family: Arial, Helvetica, sans-serif }`. → **Réécrire** : ajouter le bloc complet de tokens (Tâche 3), supprimer le `@media dark` (dark-only), corriger `body { font-family: var(--font-sans) }` (le scaffold a un bug : il déclare `--font-sans` mais le `body` utilise `Arial`).
- **`src/app/page.tsx`** — état actuel : page d'accueil par défaut `create-next-app` (logo Next, liens templates/learn, boutons Deploy/Docs, classes `bg-zinc-50 dark:bg-black` etc.). → **Remplacer** par le placeholder minimal de la Tâche 5 (ou, si tu choisis de ne pas faire la Tâche 5, l'adapter a minima pour qu'il rende sur `bg-bg` sans `dark:` — mais le placeholder dédié est préférable pour démontrer les polices). **Ne pas** y mettre de structure de sections réelle.
- **`next.config.ts`**, **`postcss.config.mjs`**, **`tsconfig.json`**, **`eslint.config.mjs`** — **ne pas toucher** (rien à changer ici pour cette story).

Comportement à préserver : le build doit rester **100% SSG** (routes `○ Static`), `lint` + `typecheck` verts, le déploiement Vercel auto sur `push` doit continuer de fonctionner. Aucune route serveur dynamique, aucun `fetch` runtime, aucun `output: 'export'`.

### Valeurs du design « Technical Minimal » (extraites de `Minimal.jsx`)

| Aspect | Valeur(s) | Usage dans le design |
|---|---|---|
| Fond global | `#0a0a0a` | `tmRoot.background` |
| Surfaces de section alt. | `#080808` (clients, panneau méta Maqom), `#070707` (section AI) | bandes contrastées |
| Cartes / fenêtres | `#0c0c0c` (carte terminal Maqom), `#0f0f0f` (header fenêtre), `#101010` (chips, tuiles KPI) | conteneurs |
| Voile de surface | `rgba(255,255,255,0.01–0.02)` | léger lift sur cartes |
| Bordures | `#1f1f1f` (principale), `#1a1a1a` (douce, tuiles) | `borderBottom`, `border` |
| Texte titres | `#fafafa` | h1, h2, h3, h4 |
| Texte corps fort | `#ededed` | `tmRoot.color`, valeurs méta |
| Texte corps | `#cfcfcf` (about, bullets), `#a3a3a3` (sous-accroche, sous-titres, descriptions) | paragraphes |
| Texte muted | `#888` | méta mono, libellés secondaires |
| Texte faint (déco) | `#666` (labels `01 ↗`, méta uppercase, `$`/`·`), `#555` (footer), `#444` (numéros de bullet, séparateurs `→`) | **décoratif / large uniquement** |
| Accent doré | `#d4a574` | KPI, `idx`, liens `$ open …`, highlights `<span>` dans h1/h2 |
| Accent alpha | `rgba(212,165,116,0.06)` fond chip, `0.2`/`0.3` bordures, `0.08→0.02` dégradé carte contact | chips/cartes accentuées |
| Vert « available » | `#7eb389` (+ `boxShadow: 0 0 8px`) ; dot terminal `#7eb389` | badge dispo, statut projet |
| Boutons macOS | `#ff5f57` / `#febc2e` / `#28c840` | déco fenêtre terminal — **inline, pas de token** |
| Bouton primaire | fond `#ededed`, texte `#0a0a0a` | « Get in touch → », CTAs hero/contact |
| Police UI/corps | `'Inter', -apple-system, sans-serif`, `font-size: 14`, `line-height: 1.55`, `letter-spacing: -0.005em` | `tmRoot` |
| Police mono | `'JetBrains Mono', ui-monospace, Menlo, monospace` | labels, nav `$ cd ./about`, chips, méta |
| Police display | `'Cormorant Garamond', Georgia, serif` (souvent `italic`, `font-weight: 400`) | wordmarks clients (44px), titres `h2` de section, *« quote »* méthodo |
| Tailles | h1 `84/0.98/-0.04em`, h2 section `48/1.05/-0.03em`, h2 AI `40/1.1/-0.03em`, h3 `32/-0.02em`, h4 carte `28` / méthodo `26`, marquee `44/+0.04em`, sous-accroche `17/1.55`, corps `15/1.65`, corps dense `14/1.6`, UI `13`/`12`, labels mono `11`/`10` (souvent `letter-spacing 0.1em`–`0.12em`, `text-transform: uppercase`) | — |
| Espacement section | `padding: 96px 80px` (`GridSection`), rails latéraux `width: 32px`, paddings clients `0 80px` / `32px 0` | desktop ; mobile « fortement réduit » (valeurs précises non spécifiées → tokens mobile proposés `56px`/`20px`, ajustables) |
| Rayons | `4` (chips/badges), `6` (boutons, tuiles KPI), `8` (méta strip, cartes), `10` (cartes role/stack/méthodo), `12` (carte Maqom/contact) | — |
| Nav | `position: sticky; top:0; z-index:50`, `background: rgba(10,10,10,0.85)`, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid #1f1f1f`, `padding: 14px 32px` | **composant Story 1.3** — listé ici pour contexte uniquement |

> `Portfolio.html` est le conteneur HTML qui monte les variantes React du canvas ; `design-canvas (3).jsx` contient d'autres variantes (hors scope — variantes alternatives = Epic 8). Le contenu (textes FR/EN à venir) est dans `content.md` / `content.js` — **pas** la matière de cette story (le modèle de contenu typé = Story 1.3, le remplissage = Epic 2).

### Audit de contraste AA (AR11 / UX-DR1 / UX-DR18) — à appliquer dès le nommage des tokens

Ratios approximatifs sur fond `#0a0a0a` (≈ 0,21 % de luminance relative) — seuils WCAG 2.1 : **4.5:1** pour le texte courant, **3:1** pour le grand texte (≥ 24px ou ≥ 18.66px gras) et les composants UI :

| Gris | Ratio approx. sur `#0a0a0a` | Verdict |
|---|---|---|
| `#fafafa` | ~19:1 | ✅ partout |
| `#ededed` | ~17:1 | ✅ partout |
| `#cfcfcf` | ~12:1 | ✅ partout |
| `#a3a3a3` | ~7.8:1 | ✅ texte courant |
| `#888888` | ~5.6:1 | ✅ texte courant (**plancher confortable**) |
| `#777777` | ~4.4:1 | ⚠️ limite — ✅ grand texte/UI, ❌ petit texte |
| `#666666` | ~3.4:1 | ❌ texte courant — ✅ grand texte/UI/déco |
| `#555555` | ~2.6:1 | ❌ même UI — déco uniquement (footer, séparateurs) |
| `#444444` | ~2.0:1 | ❌ — déco pure (numéros de bullet, `→`) |
| accent `#d4a574` | ~8.5:1 | ✅ partout |

**Conséquences pour les tokens :** ne **jamais** mapper `--color-text-faint` (`#666`) / `--color-text-faintest` (`#444`) à du corps de texte dans les composants ; ce sont des tokens « déco / label large / bordure de texte ». Les labels mono `01 — ABOUT` du design sont en `#666` à `10–11px` → en l'état **non conformes** ; la correction (passer ces labels à `#888`+ ou les agrandir/épaissir) sera tranchée à l'**Epic 4 / Story 4.1** (audit + ajustements transverses). Ici : exposer un `--color-text-subtle: #888` clairement étiqueté « plancher AA pour petit texte » pour que les composants à venir s'en servent. Documenter ça en commentaire dans `globals.css`.

### Spécificités techniques (Next 16 / `next/font` / Tailwind v4)

- **`next/font/google` auto-héberge** : à la compilation, Next télécharge les fichiers de police et les sert depuis le domaine de l'app (`/_next/static/media/*.woff2`) — **zéro requête runtime** vers Google (satisfait NFR4 « polices auto-hébergées, pas de requête tierce runtime »). Pas besoin de `next/font/local` ni de copier des `.woff2` à la main.
- **`preload`** : `true` (défaut) uniquement pour **Inter** (police critique, présente above-the-fold partout) ; `false` pour JetBrains Mono et Cormorant (utilisées plus bas / décoratives) afin de ne pas alourdir le `<head>` initial — aligné NFR4 (« police critique préchargée ») et le budget perf (NFR3).
- **`display: "swap"`** sur les trois → pas de FOIT (texte affiché immédiatement en fallback puis swap) ; couvre l'AC « no visible FOIT ».
- **`subsets: ["latin"]`** sur les trois (le site est FR/EN ; pas de cyrillique/grec/vietnamien). L'hébreu (Epic 8, Vision) ajoutera éventuellement un subset/une police RTL — hors scope.
- **Cormorant Garamond** : police statique multi-poids sur Google Fonts (pas de version variable) → `next/font` exige `weight: [...]` (sinon erreur de build). Le design l'utilise surtout en `400` (souvent `italic`). Demander `["400","500","600"]` ; si le build refuse un poids, le retirer. Pour l'italique des wordmarks, l'`italic` est appliqué via CSS (`font-style: italic`) au niveau composant (Epic 2) — pas besoin de déclarer `style: ["italic"]` ici sauf si tu veux précharger l'italique (non requis).
- **Variables CSS de police** : `next/font` ne génère une variable CSS (`--font-inter`, …) que si on passe `variable`. Cette variable doit être appliquée sur un ancêtre commun → `<html>` (le scaffold le fait déjà pour Geist). Dans `globals.css`, le bloc `@theme inline { --font-sans: var(--font-inter), … }` fait le pont vers l'utilitaire Tailwind `font-sans` (le `inline` est nécessaire ici parce que la valeur est un `var()` — sans `inline`, Tailwind émettrait `font-family: var(--font-sans)` qui contiendrait `var(--font-inter)`, ce qui marche aussi, mais le scaffold a déjà choisi `@theme inline` — rester cohérent).
- **Tailwind v4** : config 100% CSS-first. `@theme` enregistre les tokens **et** les expose comme variables CSS globales (`:root`) **et** comme utilitaires. `@theme inline` : même chose mais l'utilitaire embarque la valeur résolue (utile pour les `var()`). Pas de `tailwind.config.js` à créer. Les utilitaires sont générés à la demande (au build, en scannant les classes utilisées) — d'où l'intérêt de la page placeholder pour « activer » les classes qu'on veut valider. Réf. : `node_modules/next/dist/docs/` (font) + docs Tailwind v4 (theme variables / `@theme` / functions & directives).
- **AGENTS.md du repo** : « This is NOT the Next.js you know » → **lire `node_modules/next/dist/docs/` avant d'écrire du code** (API `next/font` susceptible de différer des connaissances d'entraînement ; respecter les avis de dépréciation). Ne pas se fier de mémoire à l'API `next/font` d'une version antérieure.

### Apprentissages de la Story 1.1 (à reprendre)

- ESLint flat config (`eslint.config.mjs`) **ignore** `_bmad/**`, `_bmad-output/**`, `docs/**` (sinon les `.jsx` du dossier `design/` font échouer le lint) — ne pas y toucher, ne pas lint les artefacts.
- `npm run lint` = `eslint` (Next 16 a supprimé `next lint`), `npm run typecheck` = `tsc --noEmit` (utilisé par la CI `.github/workflows/ci.yml`). Les **3 portes de qualité** = `build` (SSG OK) + `lint` (0 erreur) + `typecheck` (0 erreur), à passer en local **et** en CI.
- Commits = Conventional Commits, message simple, **sans** trailer `Co-Authored-By` (sauf demande explicite de l'utilisateur).
- `next.config.ts` épingle `turbopack.root` sur le dossier projet (un `package-lock.json` parasite existe dans `$HOME`) — laisser tel quel.
- Le repo distant est **`github.com/MMann5/portfolio`** (public), connecté à Vercel (URL prod `https://portfolio-three-omega-48ezqd212w.vercel.app/`), déploiement auto sur `push main` (~19 s de propagation observée). `gh` CLI est installé mais **non authentifié et se bloque** dans cet environnement → ouvrir les PR via l'UI GitHub si besoin (cette story n'a pas besoin de PR — push direct sur `main` après validation).

### Project Structure Notes

- Tout se passe dans `src/app/` : `layout.tsx` (polices + variables), `globals.css` (tokens Tailwind), `page.tsx` (placeholder). Aucun nouveau dossier nécessaire. (Un éventuel dossier `src/components/` arrive en Story 1.3 — ne pas le créer ici.)
- Alias d'import `@/*` inchangé. Pas de nouvelle dépendance npm : `next/font` est dans `next`, Tailwind v4 est déjà installé. **Ne pas** ajouter `tailwindcss-animate` ni `tailwind.config.js` ni shadcn/ui (shadcn « au besoin » — pas besoin ici).
- Convention de nommage des tokens : sémantique (`bg`, `surface`, `line`, `text`, `accent`, `display-*`, `label-*`) — pas de noms de teintes brutes (`gray-700`…) ; documenter en commentaire dans `globals.css` la table « token → valeur → usage / verdict AA » pour les stories suivantes.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2a: Design system « Technical Minimal » (tokens & polices)]
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR7 (polices `next/font` auto-hébergées, subset latin, `display:swap`, preload Inter), AR11 (audit contrastes des gris du design), AR1 (scaffold Next/TS/Tailwind), AR12 (hors scope)
- [Source: _bmad-output/planning-artifacts/epics.md#UX Design Requirements] — UX-DR1 (design tokens « Technical Minimal »), UX-DR2 (typographies Inter/JetBrains Mono/Cormorant via `next/font`), UX-DR18 (contraste / `:focus-visible` — transverse)
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 1: Fondations & shell bilingue déployé] — FR33 (identité visuelle / tokens-polices), NFR3 (budget JS), NFR4 (polices auto-hébergées + preload + no FOIT)
- [Source: _bmad-output/planning-artifacts/prd.md#Web App Specific Requirements] — Next.js App Router + TS strict + Tailwind, statique par défaut, cibles navigateurs
- [Source: _bmad-output/planning-artifacts/design/Minimal.jsx] — variante de design retenue : valeurs de couleurs, tailles, espacements, familles de polices
- [Source: _bmad-output/planning-artifacts/design/Portfolio.html] — conteneur de montage du design
- [Source: _bmad-output/planning-artifacts/design/content.md] — contenu (référence ; non implémenté dans cette story)
- [Source: _bmad-output/implementation-artifacts/1-1-scaffold-du-projet-deploiement-statique-ci.md] — stack effective, conventions, état du code, apprentissages
- [Source: node_modules/next/dist/docs/] — doc Next 16 (notamment `next/font`) — **à lire avant implémentation** (cf. AGENTS.md)

## Dev Agent Record

### Agent Model Used

claude-opus-4-7[1m] (Claude Opus 4.7, 1M context) — workflow `bmad-dev-story`

### Debug Log References

- Lu `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` + `01-app/03-api-reference/02-components/font.md` : API `next/font/google` en Next 16 inchangée (`{ subsets, weight?, style?, display, preload, variable, fallback, adjustFontFallback, ... }`), auto-hébergement confirmé (« stored as static assets and served from the same domain … no requests are sent to Google by the browser »), variables CSS appliquées via `className` sur `<html>`. Inter & JetBrains Mono = polices variables (pas de `weight` requis) ; Cormorant Garamond = non variable → `weight: ["400","500","600"]`.
- `npm run lint` → exit 0. `npm run typecheck` (`tsc --noEmit`) → exit 0. `npm run build` → exit 0, `▲ Next.js 16.2.6 (Turbopack)`, routes `/` et `/_not-found` marquées `○ (Static)`, aucune route dynamique.
- Vérif auto-hébergement : `find .next/static/media -name '*.woff2'` → 18 fichiers émis ; `grep -r 'fonts.gstatic\|fonts.googleapis' .next/server` → aucun résultat (zéro requête runtime Google).
- `npm run dev` (smoke test) → `GET / 200` ; `<html>` porte les classes `*__variable` des trois polices + `h-full antialiased`.

### Completion Notes List

- **Tâche 1** — doc Next 16 (`next/font`) + Tailwind v4 (config CSS-first via `@theme` / `@theme inline`, namespaces de tokens → utilitaires) relue avant implémentation, conformément à `AGENTS.md`. Aucune dépréciation impactante.
- **Tâche 2** — `src/app/layout.tsx` : imports `Geist`/`Geist_Mono` remplacés par `Inter` (`variable: --font-inter`, `preload` par défaut = critique), `JetBrains_Mono` (`--font-jetbrains-mono`, `preload: false`), `Cormorant_Garamond` (`--font-cormorant`, `preload: false`, `weight: ["400","500","600"]`) — tous `subsets: ["latin"]`, `display: "swap"`. Les trois classes `*.variable` posées sur `<html>` (avec `h-full antialiased`), `lang="en"` conservé (i18n = Story 1.2b). `metadata` mis à un titre minimal « Michael Mann » (vraies métadonnées SEO = Epic 4). Toutes références `--font-geist-*` retirées.
- **Tâche 3** — `src/app/globals.css` réécrit : bloc `@theme` (surfaces, lignes, texte avec audit AA en commentaire, accent + alphas, statut/inversion, rayons, espacement section desktop+mobile, tracking, leading, échelle `--text-*` avec `--line-height`/`--letter-spacing` embarqués) + bloc `@theme inline` pour les familles de polices (`--font-sans`/`--font-mono`/`--font-display` → `var(--font-inter|jetbrains-mono|cormorant)` + fallbacks). `:root { color-scheme: dark }`. `body` : `bg`/`text`/`font-sans`/`text-body-sm`/`leading-body`/`tracking-base`. Bloc `@media (prefers-color-scheme: dark)` du scaffold supprimé (site dark-only) ; bug du scaffold corrigé (`body` utilisait `Arial` malgré `--font-sans`). Palette Tailwind par défaut conservée (pas de `--color-*: initial`).
- **Tâche 4** — utilitaires générés et compilés sans erreur : `bg-bg`, `bg-surface`/`-2`/`-3`, `bg-accent`, `border-line`, `border-line-soft`, `text-text-strong`/`-muted`/`-subtle`/`-faint`/`-faintest`, `text-accent`, `font-display`/`font-mono`/`font-sans`, `text-display-2xl`, `text-body-lg`, `text-label`/`-sm`, `tracking-wide`, `px-section-x`/`py-section-y` (+ variantes `-mobile`), `rounded-lg`/`-md`. `build`/`lint`/`typecheck` verts, aucune régression vs Story 1.1 (toujours 100 % SSG).
- **Tâche 5** — `src/app/page.tsx` remplacé par un placeholder minimal (~50 lignes, sans logique) exerçant les 3 polices (titre `font-display`, label `font-mono`, corps `font-sans`) et un nuancier de surfaces/accent — pas de composant de shell. SVG du scaffold devenus inutilisés supprimés de `public/` (`file/globe/next/vercel/window.svg`) ; le dossier `public/` se retrouve vide → non recréé (Next 16 le tolère ; les assets de marque arriveront en Epic 4). `favicon.ico` (sous `src/app/`) non touché.
- **Tâche 6** — validations finales toutes vertes (voir Debug Log). Pas de nouvelle dépendance npm. Commits Conventional Commits sans trailer. Repo distant `MMann5/portfolio` connecté à Vercel → le `push main` déclenchera le déploiement auto (pas d'action manuelle).
- **Note pour les stories suivantes** : les labels mono du design (`#666` à 10–11px) sont **non conformes AA** en l'état ; le token `--color-fg-subtle` (`#888`) est le plancher sûr pour du petit texte — la mise en conformité transverse est cadrée pour Epic 4 / Story 4.1. La police d'**italique** Cormorant (wordmarks du marquee) n'est pas préchargée ; `font-style: italic` la synthétisera en attendant — à confirmer/charger en Epic 2 (Story 2.1) si le rendu synthétique ne convient pas.

### File List

- `src/app/layout.tsx` — MODIFIÉ : polices `next/font/google` (Inter / JetBrains Mono / Cormorant Garamond), variables sur `<html>`, `metadata` minimal
- `src/app/globals.css` — MODIFIÉ : design tokens « Technical Minimal » (`@theme` + `@theme inline`), `color-scheme: dark`, base `body`, suppression du `@media` dark du scaffold
- `src/app/page.tsx` — MODIFIÉ : placeholder minimal de démonstration des tokens/polices (remplace la page d'accueil par défaut)
- `public/file.svg`, `public/globe.svg`, `public/next.svg`, `public/vercel.svg`, `public/window.svg` — SUPPRIMÉS (assets du scaffold devenus inutilisés)
- `.claude/settings.local.json` — MODIFIÉ : ajout de permissions Bash (gh auth, git remote/fetch/pull/checkout/credential, git push origin, helpers git read-only)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — MODIFIÉ : statut story `1-2a` → `review` (puis `done` après revue)

> Revue de code (2026-05-12) — patches appliqués : `Inter` → `preload: true` explicite ; `<h1>` placeholder → palier responsive `text-display-md sm:text-display-2xl` ; tokens de texte renommés `--color-text-*` → `--color-fg-*` (évite la collision d'utilitaires `text-*` avec l'échelle `--text-*`) — `globals.css` + `page.tsx` mis à jour en conséquence.

## Change Log

- 2026-05-12 — Story créée (workflow `bmad-create-story`) : design tokens « Technical Minimal » (Tailwind v4 CSS-first) + intégration des polices auto-hébergées Inter / JetBrains Mono / Cormorant Garamond via `next/font/google` + application de l'identité de base sur `layout.tsx`/`globals.css` + page placeholder de démonstration. Hors scope : composants de shell (1.3), i18n (1.2b), contenu typé / sections (Epic 2). Audit de contraste AA cadré pour le nommage des tokens (correction transverse → Epic 4 / Story 4.1). (SM: claude-opus-4-7[1m])
- 2026-05-12 — Implémentation (workflow `bmad-dev-story`) : `layout.tsx` (3 polices `next/font` auto-hébergées, variables CSS), `globals.css` (tokens `@theme`/`@theme inline`, dark-only, base `body`), `page.tsx` (placeholder de démo), suppression des SVG inutilisés du scaffold. Validations `build`/`lint`/`typecheck` vertes ; 18 `.woff2` émis sous `/_next/static/media/`, zéro requête runtime Google ; toujours 100 % SSG. Story → `review`. (Dev: claude-opus-4-7[1m])
