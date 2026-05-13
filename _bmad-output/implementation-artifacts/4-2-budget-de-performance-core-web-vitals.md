# Story 4.2: Budget de performance & Core Web Vitals

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor on a mobile connection,
I want the home page to load fast and stay smooth,
so that I never bounce because the site is slow.

## Acceptance Criteria

1. **Core Web Vitals tenus sur mobile simulé (NFR1, NFR2, NFR6, AC#1 epic).** Étant donné la page d'accueil servie en mode production (`npm run build && npm run start`) sous conditions mobiles simulées Lighthouse (CPU 4×, réseau 4G), quand un audit Lighthouse est lancé en mode `Navigation` sur `/en` et `/fr`, en device `Mobile` ET `Desktop`, alors :
   - **LCP** (Largest Contentful Paint) < **2,0 s** sur mobile · cible < **1,5 s** sur desktop.
   - **FCP** (First Contentful Paint) < **1,5 s** sur mobile · cible < **1,0 s** sur desktop.
   - **CLS** (Cumulative Layout Shift) < **0,1** dans les 4 combinaisons (cible 0,00 — aucune image raster, polices Inter préchargées avec `display: swap` ⇒ on s'attend à 0).
   - **INP** (Interaction to Next Paint) < **200 ms** mesuré sur quelques interactions clés : ouverture/fermeture du menu mobile, clic sur un lien de section, bascule de langue, clic sur un CTA email.
   - **Lighthouse Performance** ≥ **95/100** (cible 100) dans les 4 combinaisons `/en mobile`, `/en desktop`, `/fr mobile`, `/fr desktop`.
   - **Les 4 scores Performance + les 4 valeurs LCP/FCP/CLS/INP par locale sont reportés** dans les Completion Notes (template prêt en Tâche 7).
   - Animations (curseur custom, fade-in, marquee) en `transform`/`opacity` uniquement (déjà acquis Stories 3.1/3.2) — à re-vérifier qu'aucune régression de jank ≥ 60fps n'est apparue depuis la Story 4.1 (token `--spacing-nav-height`, `ResizeObserver` du `Nav`, listeners du `SkipLink`).

2. **Budget JS initial respecté + non-critique chargé en différé (NFR3, NFR7, AC#2 epic).** Étant donné la sortie de `npm run build` (Next.js 16.2.6 Turbopack, mode production), quand le tableau « Route » est lu sur les routes `/[locale]`, alors :
   - **First Load JS de `/[locale]`** < **~150 KB gzip** (cible : aussi bas que possible, ≤ 130 KB idéal). La valeur observée est **reportée dans les Completion Notes** (template prêt en Tâche 1).
   - **First Load JS shared by all** (`chunks/...` partagés du middleware Next + runtime React) ≤ **~120 KB gzip** (ordre de grandeur attendu pour Next 16 + React 19 ; à valider).
   - Les polices auto-hébergées via `next/font` (Inter, JetBrains Mono, Cormorant Garamond) ne comptent **pas** dans ce budget (servies en chunks séparés, mesurées séparément si nécessaire — cf. AR7).
   - **`CustomCursor` est chargé via `next/dynamic({ ssr: false })`** (acquis Story 3.2, [src/components/CursorMount.tsx](src/components/CursorMount.tsx)) — re-vérifier via la sortie de build qu'il apparaît bien dans un chunk asynchrone séparé (`async chunks` / `_app-pages-internals` ou nom de chunk dédié), pas dans le bundle principal.
   - **Aucun nouveau client component** n'est introduit par cette story sans `next/dynamic` (politique de tri).
   - **Si le bundle dépasse 150 KB gzip** : exécuter `npx next experimental-analyze --output` (Next 16.1+ — disponible en 16.2.6 selon [node_modules/next/dist/docs/01-app/02-guides/package-bundling.md:23](node_modules/next/dist/docs/01-app/02-guides/package-bundling.md#L23)), identifier le ou les modules clients sur-dimensionnés, et appliquer une (ou plusieurs) des stratégies suivantes (dans l'ordre de préférence) :
     1. Déplacer la frontière `'use client'` plus en profondeur (ex. si `Nav` ré-importe via barrels un module lourd, importer le strict nécessaire) ;
     2. Charger le module via `next/dynamic({ ssr: false })` (uniquement si non requis SSR — sinon laisser SSR) ;
     3. Remplacer une dépendance lourde par une implémentation plus petite ou native (`navigator.sendBeacon`, `fetch keepalive`, etc.).

3. **Politique `next/image` + zéro scroll horizontal de ~320px → desktop (NFR5, NFR16, FR34, AC#3 epic).** Étant donné qu'aucune image raster n'est aujourd'hui présente dans le rendu de la page d'accueil (la marque `MMLogo` est un `<svg>` inline ; les wordmarks clients sont du texte Cormorant italique ; aucun `<img>` ni `background-image: url(…)` dans `src/` — confirmé par grep `next/image|Image|<img|background-image|background:.*url` sur `src/` qui ne ressort que `src/proxy.ts` (commentaire `next/image` du matcher i18n), pas un usage applicatif), quand on cherche à pré-empêcher toute future régression et qu'on audite le scroll horizontal au plus petit viewport :
   - **Politique documentée** : toute future image raster (ex. OG image Story 4.3, screenshots case studies Story 7.1, photos « about ») **DOIT** utiliser le composant `next/image` avec `width`/`height` explicites (ou `fill` + parent `position: relative`), formats AVIF/WebP auto-générés (réglage par défaut de `next/image` — pas de `unoptimized={true}`), `loading="lazy"` pour tout asset sous le fold, `sizes` adapté à la grille responsive. Pas de `<img>` natif. Pas de `background-image: url(…)` (sauf assets de marque ≤ 1 KB inline base64 si vraiment nécessaire). Cette politique est ajoutée comme **note** dans [AGENTS.md](AGENTS.md) (ou un nouvel `agents-notes.md` si AGENTS.md n'est pas modifiable) — section « Images » courte, 3-5 lignes (cf. Tâche 4).
   - **Aucun scroll horizontal parasite** sur `/en` et `/fr`, du viewport **`320px`** au viewport **`1920px`** (incluant la zone limite `~321-374px` que la story 2.4 n'a pas testée — cf. dette différée review 2.4 « Smoke browser à ~320px non exécuté pour la section Contact »).
   - **Zone à risque connue** : carte « AI-Driven Development Methodology » ([src/components/MethodologyCard.tsx:29-31](src/components/MethodologyCard.tsx#L29-L31)) — `<h3>` `text-display-sm` 28px avec un titre de 35 caractères (« AI-Driven Development Methodology »). Sans `break-words` ni `min-w-0` parent, ce titre peut déborder à ~320px. **Fix attendu** (Tâche 5) : ajouter `break-words` sur le `<h3>` ; ajouter `min-w-0` à `<article>` ou au conteneur parent si nécessaire (les flex/grid enfants par défaut ne wrap pas le texte au-delà du contenu intrinsèque sans `min-w-0`).
   - **Autres zones à smoke-tester** :
     - **`MaqomCard`** [src/components/MaqomCard.tsx:54-67](src/components/MaqomCard.tsx#L54-L67) — en-tête combinant `<h3>` + `{url} · CRM` mono + badge `FEATURED` ; le `flex-wrap` est en place mais le `<h3>` `text-display-sm` 28px peut déborder à ~320px (le mot « Maqom » fait 5 chars ⇒ pas de risque, à reconfirmer).
     - **`Hero` meta strip** [src/components/Hero.tsx:75-85](src/components/Hero.tsx#L75-L85) — grille 2 colonnes à ~320px ; les valeurs (`location`, `experience` `12+ years`, `languages` `EN · FR · HE`) sont courtes ⇒ peu de risque ; à reconfirmer.
     - **`Contact` carte CTA primaire** [src/components/Contact.tsx:69-87](src/components/Contact.tsx#L69-L87) — bouton `mailto:michael.mann55@gmail.com` (27 chars) + lien CV ; le `flex-wrap` est en place ; à reconfirmer (déjà différé review 2.4).
     - **Marquee clients** [src/components/Clients.tsx:28-42](src/components/Clients.tsx#L28-L42) — `overflow-hidden` clip le débordement horizontal ; aucun risque.
     - **`Nav` mobile** [src/components/Nav.tsx:236](src/components/Nav.tsx#L236) — `gap-4` peut serrer à 320px entre logo + bouton menu ; à reconfirmer.
   - Pour chaque zone où un débordement est détecté, fix minimal : `min-w-0` (sur le flex/grid enfant qui contient le texte long), `break-words` (sur le bloc texte lui-même), ou `overflow-wrap: anywhere` en dernier recours.
   - Le smoke test est exécuté en DevTools mobile emulation à 320×568 (iPhone 5/SE) et 360×640 (Android baseline) sur `/en` ET `/fr` (les chaînes FR sont plus longues que EN dans 80% des cas) — checklist Tâche 5.

4. **Curseur custom : RAF mis en idle quand la souris est immobile (NFR6 — batterie/CPU mobile-rendering ≈ no-op mais utile sur desktop ; résolution dette différée Story 3.2).** Étant donné [src/components/CustomCursor.tsx:83-88](src/components/CustomCursor.tsx#L83-L88), où la boucle `requestAnimationFrame` se ré-enchaîne inconditionnellement même quand `(x, y) ≈ (rx, ry)` (souris immobile), quand un utilisateur laisse la souris stationnaire (ex. lecture du Hero), alors :
   - La boucle RAF **s'arrête** quand `|x - rx| < 0,1 AND |y - ry| < 0,1` (épsilon en pixels — seuil sub-pixel pour ne pas créer de glissement visible). Implémentation : dans `loop()`, après le calcul de `rx`/`ry`, tester l'épsilon — si atteint, **NE PAS** ré-enchaîner `requestAnimationFrame` ; à la place, marquer un drapeau `idle = true`.
   - La boucle **reprend** au prochain `mousemove` (`onMove`) : si `idle === true`, relancer la boucle via `raf = requestAnimationFrame(loop)` et remettre `idle = false`.
   - **Cleanup inchangé** : `cancelAnimationFrame(raf)` au démontage / `enabled: false` continue de fonctionner (`raf` est mis à jour à chaque enchaînement, et `cancelAnimationFrame(0)` est un no-op silencieux si la boucle n'est pas active).
   - **Le `dot` (positionné directement dans `onMove`) reste réactif** — l'épsilon n'affecte que le `ring` (lerp 0.18). Le `dot` n'est pas concerné par la boucle RAF.
   - **Pas de régression visuelle perceptible** : le ring atterrit sur sa position finale à `0.1px` près — invisible à l'œil ; le « snap » du `onMove` après une période d'idle est instantané (transition CSS `transform 0.22s cubic-bezier`).
   - **Justification documentée** : commentaire ajouté au-dessus de la fonction `loop()` mentionnant le seuil et la dette résolue (`Story 4.2 AC#4 — résolution dette review 3.2`).
   - **Dette différée 3.2 résolue** : ligne `requestAnimationFrame tourne en continu même quand la souris est immobile` dans [_bmad-output/implementation-artifacts/deferred-work.md](../implementation-artifacts/deferred-work.md) marquée `~~strikethrough~~` avec renvoi à AC#4.

5. **MethodologyCard : prévention overflow à ~320px (résolution dette différée Story 2.3).** (Voir AC#3 paragraphe « Zone à risque connue ») — fix `break-words` + `min-w-0` appliqué ; dette différée review 2.3 « Nom long carte méthodo (`<h3>` `text-display-sm` 28px) — risque overflow à ~320px » marquée résolue par strikethrough avec renvoi à AC#3/#5.

6. **Zéro régression / build vert / SSG préservé (NFR22).** Étant donné la totalité du site après cette story, quand `npm run typecheck`, `npm run lint`, `npm run build` tournent, alors ils passent **sans erreur**. Le rendu statique de `/en` et `/fr` reste pré-rendu (`generateStaticParams`, `dynamicParams = false` à [src/app/[locale]/layout.tsx:51](src/app/[locale]/layout.tsx#L51)). Le scroll-spy `Nav`, le `SkipLink`, le `LanguageSwitcher`, le `FadeIn`, le `CustomCursor` (avec sa nouvelle gestion idle RAF), toutes les sections de contenu (Epic 2), tous les CTAs (email, CV, LinkedIn) restent fonctionnels et inchangés en comportement utilisateur. Aucun scroll horizontal parasite de **320px** à **1920px** (cf. AC#3 — exigence renforcée par rapport au plancher 375px des stories 2.x).

## Tasks / Subtasks

- [ ] **Tâche 0 — Pré-lecture obligatoire (AGENTS.md / CLAUDE.md)**
  - [ ] **AGENTS.md** impose de **lire les docs Next dans `node_modules/next/dist/docs/`** avant d'écrire du code. Pour cette story, lire :
    - [node_modules/next/dist/docs/01-app/02-guides/production-checklist.md](node_modules/next/dist/docs/01-app/02-guides/production-checklist.md) — best practices `next build` / Lighthouse / Core Web Vitals / `useReportWebVitals`.
    - [node_modules/next/dist/docs/01-app/02-guides/package-bundling.md](node_modules/next/dist/docs/01-app/02-guides/package-bundling.md) (sections « Next.js Bundle Analyzer Experimental » + « Optimizing Large Bundles ») — `npx next experimental-analyze` est disponible en 16.1+. Le repo est 16.2.6.
    - [node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md](node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md) — pour confirmer le pattern `next/dynamic({ ssr: false })` via Client wrapper (déjà appliqué en Story 3.2 sur `CursorMount`).
    - [node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md](node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md) — props `next/image` (au cas où une image OG est introduite ici en bonus — ce n'est PAS le scope de cette story, mais utile pour rédiger la politique de Tâche 4).
    - [node_modules/next/dist/docs/01-app/02-guides/analytics.md](node_modules/next/dist/docs/01-app/02-guides/analytics.md) — `useReportWebVitals` (hors scope de cette story ; Story 5.1 fera le suivi côté analytics ; à ne pas implémenter ici).
    - **Avis de dépréciation** : scanner les premières lignes de la doc Next 16 (ex. `version-16.md` migration) pour s'assurer qu'aucun pattern utilisé (notamment `next/dynamic({ ssr: false })` côté Client wrapper) n'a été déprécié en 16.x.
  - [ ] Lire ce fichier de story de bout en bout, **ET** les sections Completion Notes / File List / Review Findings de la story précédente [4-1-accessibilite-wcag-2-1-aa.md](4-1-accessibilite-wcag-2-1-aa.md) (patterns Next 16, profil Chrome MCP verrouillé, convention « Mike commit lui-même », convention française des commentaires).
  - [ ] Lire intégralement [_bmad-output/implementation-artifacts/deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md) — cette story résout **2 dettes** (review 3.2 RAF idle, review 2.3 MethodologyCard 320px). Les autres dettes (LinkedIn 404, statusSnake, URL fragility, garde FR/EN tableau aveugle, etc.) restent **hors périmètre** et seront résolues en Story 9.1 / 4.3.
  - [ ] Lire le commentaire d'audit de contraste dans [src/app/globals.css:7-17](src/app/globals.css#L7-L17) — confirme que l'a11y est acquise et que cette story se concentre sur la perf. Ne PAS toucher aux tokens de couleur.

- [ ] **Tâche 1 — Mesure de référence du First Load JS (AC: #2)**
  - [ ] Exécuter `npm run build` à froid (après `rm -rf .next` pour éviter le cache Turbopack qui peut masquer des régressions). _Si Windows : `Remove-Item -Recurse -Force .next` côté PowerShell._
  - [ ] Capturer la sortie complète de la section « Route (app) » du build. Format attendu (Next 16.2.6 Turbopack) :
    ```
    Route (app)                                  Size     First Load JS
    ┌ ● /[locale]                                X kB      Y kB
    ├   ├ /[locale]/_not-found                   X kB      Z kB
    + First Load JS shared by all                          W kB
      ├ chunks/main-app-…                                  A kB
      ├ chunks/webpack-…                                   B kB
      └ …
    ```
  - [ ] Reporter la **valeur First Load JS du `/[locale]`** dans les Completion Notes (template Tâche 7). **Note** : la sortie Next affiche le poids **non-gzip** (KB raw) ; le ratio gzip est typiquement **~30-40%** ⇒ pour une valeur affichée X KB, la version gzip est environ `0.3 × X` à `0.4 × X`. Le budget AC est **~150 KB gzip** ⇒ ≈ **375-500 KB raw** dans la sortie Next (très confortable a priori).
  - [ ] **Si la valeur affichée raw > ~500 KB sur `/[locale]`** : passer à la Tâche 2 (bundle analyzer + optimisation).
  - [ ] **Si la valeur affichée raw ≤ ~500 KB** : noter dans les Completion Notes que le budget est tenu de loin et SKIP la Tâche 2 (l'analyzer reste optionnel pour la documentation, mais pas requis).
  - [ ] Vérifier que `/en` et `/fr` sont toujours marqués `● (SSG)` dans la sortie (régression critique à détecter — Story 4.1 review patch P10 a introduit un `ResizeObserver` dans `Nav.tsx` ; si une nouvelle dépendance runtime venait s'introduire silencieusement, le marker `(SSG)` disparaîtrait).

- [ ] **Tâche 2 — Bundle analyzer (CONDITIONNEL : seulement si Tâche 1 indique un dépassement OU si on veut documenter le profil bundle de référence)**
  - [ ] Exécuter `npx next experimental-analyze --output` (Next 16.1+ — confirmé dispo en 16.2.6). Sortie : `.next/diagnostics/analyze/`.
  - [ ] Inspecter le treemap (mode « JavaScript », filtre « client », route `/[locale]`). Identifier les 5 plus gros modules client et les noter dans les Completion Notes.
  - [ ] **Suspects probables** (par expérience Next 16 + React 19) :
    - `react-dom` runtime (~40-50 KB gzip — inévitable, partie du « shared by all »).
    - Next.js client runtime + router (~30-40 KB gzip — inévitable).
    - `Nav.tsx` (~5-10 KB gzip — Client component avec `useState`, `useRef`, `useEffect`, scroll-spy via `useActiveSection`).
    - `LanguageSwitcher.tsx` (~3-5 KB gzip).
    - `FadeIn.tsx` + `useScrollFadeIn.ts` (~1-2 KB gzip — minimaliste IntersectionObserver).
    - `CustomCursor.tsx` (~3-5 KB gzip — **MAIS** chargé via `next/dynamic({ ssr: false })` ⇒ NE DEVRAIT PAS apparaître dans le First Load JS du `/[locale]`, juste dans un chunk asynchrone séparé). **Si c'est le cas (apparaît dans first load), c'est une régression à corriger.**
  - [ ] **Si une dépendance > 30 KB gzip est trouvée et n'est ni du runtime React/Next**, investiguer :
    - **Premier réflexe** : `'use client'` mal placé ? Voir si la frontière client peut être resserrée. Exemple : si `Nav.tsx` importe un module utilitaire qui dépend lui-même d'une lib lourde, soit l'import est inutile (tree-shake aidé par un import nommé), soit il faut déplacer le calcul côté serveur et passer la valeur en props.
    - **Deuxième réflexe** : `next/dynamic({ ssr: false })` via un Client wrapper (cf. pattern `CursorMount` de Story 3.2).
    - **Troisième réflexe** : remplacer la dépendance par une implémentation plus petite ou native (ex. `navigator.sendBeacon` au lieu de `axios`).
  - [ ] **NOTE** : aucune dépendance npm n'est attendue ici (la story ne doit PAS introduire de nouvelle dépendance, sauf si un fix l'exige — auquel cas le justifier en Completion Notes).

- [ ] **Tâche 3 — Vérification du non-blocking script policy (AC: #2)**
  - [ ] Confirmer que `CursorMount.tsx` charge bien `CustomCursor` via `next/dynamic({ ssr: false })` ([src/components/CursorMount.tsx:10-13](src/components/CursorMount.tsx#L10-L13)) — déjà acquis Story 3.2. **Aucun changement attendu.**
  - [ ] Confirmer que **aucun autre composant** n'est marqué `'use client'` sans nécessité. Grep `'use client'` sur `src/` ⇒ liste attendue :
    - `Nav.tsx` (useState, useEffect — nécessaire)
    - `LanguageSwitcher.tsx` (useTransition, onClick — nécessaire)
    - `CustomCursor.tsx` (useState, useEffect, refs — nécessaire)
    - `CursorMount.tsx` (next/dynamic wrapper — nécessaire ; cf. Story 3.2 dette « next/dynamic({ ssr: false }) interdit en Server Component »)
    - `FadeIn.tsx` (useScrollFadeIn hook — nécessaire)
    - `useScrollFadeIn.ts` (lib client hook — nécessaire)
    - `useActiveSection.ts` (lib client hook — nécessaire)
    - Aucun autre. **Si un autre composant a `'use client'`, vérifier qu'il en a besoin** — sinon le retirer (régression silencieuse).
  - [ ] Documenter dans les Completion Notes la liste des composants client confirmés (snapshot pour la non-régression future).

- [ ] **Tâche 4 — Politique `next/image` documentée (AC: #3)**
  - [ ] Confirmer qu'**aucune image raster** n'est aujourd'hui rendue depuis `src/` en grepant les patterns suivants :
    ```
    rg 'next/image|from "next/image"' src/
    rg '<img|<Image ' src/
    rg 'background-image|background:\s*url' src/
    rg "url\(/" src/app/globals.css
    ```
    Aucun résultat applicatif attendu (le seul match est le commentaire `next/image` du `matcher` de [src/proxy.ts](src/proxy.ts) qui exclut `/_next/image` du i18n middleware — c'est de la **plomberie**, pas un usage applicatif).
  - [ ] **Ajouter une note de politique** :
    - **Option A (préférée)** : ajouter une ligne dans `AGENTS.md` (qui est l'autorité agent-facing, déjà vu par CLAUDE.md). Forme attendue : un bloc de 5-7 lignes intitulé « Images » sous une nouvelle section ou à la fin du fichier, indiquant : « Toute image raster utilisée dans `src/` doit passer par `next/image` (formats AVIF/WebP automatiques, `width`/`height` obligatoires sauf `fill`, `loading="lazy"` sous le fold, pas de `<img>` natif, pas de `background-image: url(/file.png)` sauf SVG ≤ 1 KB inline). Aujourd'hui : aucune image raster rendue — seulement le `MMLogo` SVG inline + les wordmarks clients en texte Cormorant. Voir Story 4.2. »
    - **Option B (si AGENTS.md doit rester intact pour une raison politique)** : créer `docs/image-policy.md` (3-5 lignes, même contenu) et le référencer dans `AGENTS.md` par une ligne unique « Voir `docs/image-policy.md` pour la politique d'images. ». **NOTE** : `docs/` existe déjà dans le repo (vérifié `ls -la`). À privilégier `docs/` plutôt que créer un fichier orphelin.
    - **Choix par défaut** : Option A si `AGENTS.md` est court et modifiable (il l'est — 3 lignes selon `Read AGENTS.md` mais voir le fichier réel). Sinon B.
  - [ ] **NE PAS** ajouter de `next/image` actuellement (pas de cas d'usage). L'OG image (`splash.png`) est l'affaire de **Story 4.3 (SEO)** — y ajouter le `next/image` ferait double-emploi.
  - [ ] **Garde-fou pour le futur** : pas de lint Tailwind « no-img » disponible nativement ; pas de plugin ESLint à ajouter (overhead pour 1 règle). On s'appuie sur la politique documentée + la code review.

- [ ] **Tâche 5 — Audit & fix scroll horizontal de 320px → 1920px (AC: #3, #5)**
  - [ ] **Démarrer `npm run dev`** sur `http://localhost:3000` (ou `next start` après build, idem). Ouvrir Chrome DevTools → Toggle device toolbar.
  - [ ] **Smoke à 320×568 (iPhone 5/SE)** sur `/en` et `/fr` — scroller la page entière, capter tout débordement horizontal (le viewport doit montrer une scrollbar horizontale si débordement). Identifier chaque section coupable.
  - [ ] **Smoke à 360×640 (Android baseline)** sur `/en` et `/fr` — idem.
  - [ ] **Smoke à 375×667 (iPhone SE/8)** sur `/en` et `/fr` — déjà couvert par les stories 2.x mais re-vérifier.
  - [ ] **Smoke à 1440×900 (desktop classique)** et **1920×1080 (large desktop)** sur `/en` et `/fr` — la grille doit rester centrée, aucune section ne doit overflow.
  - [ ] **Fix MethodologyCard `<h3>` long** (résolution dette différée review 2.3) :
    - Modifier [src/components/MethodologyCard.tsx:29-31](src/components/MethodologyCard.tsx#L29-L31) :
      ```tsx
      <h3 className="font-sans text-display-sm font-semibold tracking-snug text-fg-strong break-words">
        {item.name}
      </h3>
      ```
    - Ajouter `min-w-0` à l'`<article>` parent si nécessaire (la classe Tailwind correspond à `min-width: 0` qui annule le défaut `min-content` des flex/grid children — sans ça, `break-words` peut être ignoré dans certains contextes flex/grid).
    - **Vérifier** à 320px : « AI-Driven Development Methodology » wrap correctement sur 2-3 lignes ; pas de scroll horizontal.
    - **Pas de régression** à 768/1024/1440px : le titre tient sur 1 ligne (largeur du conteneur suffisante).
  - [ ] **Fix autres zones si overflow détecté** — appliquer le pattern minimal (`min-w-0` parent + `break-words` ou `overflow-wrap: anywhere` sur le bloc texte). Documenter chaque fix appliqué dans le Change Log et les Completion Notes (composant + ligne + raison).
  - [ ] **Cas spécial — Hero `<h1>`** : si le titre `headline.lead + headline.accent + headline.tail` overflow à 320px (peu probable car le palier mobile est `text-display-sm` 28px, mais à vérifier en FR où la chaîne peut être plus longue), envisager :
    - `break-words` sur le `<h1>` (mais ça casse l'esthétique de wrap manuel `whitespace-nowrap` du fragment doré ≥ sm — laisser le wrap naturel mobile).
    - Réduction supplémentaire de la taille à 320px via `text-2xl` (24px) en `xs:` custom — mais Tailwind v4 n'a pas `xs` par défaut ; ce serait un nouveau breakpoint à introduire. **NON recommandé** sauf overflow réel.
  - [ ] **Cas spécial — `Nav` mobile à 320px** : si le `gap-4` entre logo MM + brandName + bouton menu déborde, réduire à `gap-3` côté mobile via `gap-3 sm:gap-4`.
  - [ ] **Cas spécial — Contact email button (différé 2.4)** : à 320px, le mail `michael.mann55@gmail.com` (27 chars) + glyphe `→` peut overflow le panneau CTA primaire — vérifier que le `flex-wrap` fait son job et que rien ne dépasse de la carte. Si overflow, ajouter `break-all` au `<a>` ou réduire le padding `px-3.5 sm:px-3` du bouton.
  - [ ] **Documenter** dans les Completion Notes la liste des fix appliqués (`MethodologyCard` + autres si nécessaire). Si aucun autre fix n'a été requis, **le dire explicitement** (« smoke 320/360/375/1440/1920 sur /en et /fr passé sans nouveau fix »).

- [ ] **Tâche 6 — `CustomCursor` : RAF idle gating (AC: #4)**
  - [ ] Lire la version actuelle de [src/components/CustomCursor.tsx:50-124](src/components/CustomCursor.tsx#L50-L124) en entier (effet `enabled` complet).
  - [ ] **Modifier la fonction `loop()` et le handler `onMove`** :
    ```tsx
    let idle = false;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      // Idle gating (Story 4.2 AC#4 — résolution dette review 3.2) : si le ring a rattrapé
      // la souris (à <0.1px près sub-pixel), arrêter la boucle RAF. Reprise au prochain
      // mousemove. Économise CPU + batterie sur laptop (RAF 60-120 fps avec
      // mix-blend-mode coûteux qui tournait inutilement quand la souris était immobile).
      if (Math.abs(x - rx) < 0.1 && Math.abs(y - ry) < 0.1) {
        idle = true;
        return; // NE PAS ré-enchaîner requestAnimationFrame
      }
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (firstMove) {
        rx = x;
        ry = y;
        firstMove = false;
        dot.classList.add("cursor-dot--visible");
        ring.classList.add("cursor-ring--visible");
      }
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      // Reprise de la boucle RAF si elle a été stoppée par l'idle gate.
      if (idle) {
        idle = false;
        raf = requestAnimationFrame(loop);
      }
    };
    ```
  - [ ] **Vérifications statiques** :
    - Le `firstMove` reste avant le test idle (sinon le 1er mousemove ne déclencherait pas la boucle initiale).
    - Le `cancelAnimationFrame(raf)` du cleanup est inchangé — il fonctionne même si `raf` correspond à une boucle déjà stoppée (no-op silencieux).
    - Le `dot` (positionné directement dans `onMove`) n'est pas affecté — il suit la souris instantanément, indépendamment de la boucle RAF du ring.
  - [ ] **Smoke test attendu** (à déléguer à Mike si extension navigateur non scriptable — voir Tâche 7) :
    - Ouvrir `/en` sur Chrome desktop avec souris.
    - Laisser la souris immobile 5s → ouvrir l'inspecteur Performance, vérifier que `requestAnimationFrame` ne se déclenche plus.
    - Bouger la souris → la boucle reprend, le ring suit.
    - Garder l'œil sur le ring : aucun « saut » visuel, transition fluide.
  - [ ] **Mettre à jour [_bmad-output/implementation-artifacts/deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md)** : section `## Deferred from: code review of story-3.2`, ligne `**`requestAnimationFrame` tourne en continu même quand la souris est immobile**` — la **préfixer** par `~~` et **suffixer** par `— **RÉSOLU (Story 4.2 AC#4, 2026-05-13)** : idle gating ajouté dans la boucle. Quand `|x-rx| < 0.1 && |y-ry| < 0.1`, la boucle s'arrête ; reprise au prochain mousemove via réenchaînement explicite dans `onMove`.`

- [ ] **Tâche 7 — Audit Lighthouse Performance runtime (AC: #1)**
  - [ ] **`npm run build && npm run start`** (port 3000 ; si occupé, prendre un autre port).
  - [ ] **Ouvrir Chrome (instance dédiée, non MCP — cf. Story 4.1 Debug Log : profil Chrome MCP verrouillé)**. URL : `http://localhost:3000/en`.
  - [ ] **Lighthouse via DevTools** (PAS via extension — DevTools est plus fiable) :
    - Onglet « Lighthouse ».
    - Mode `Navigation` (cold load).
    - Catégories : `Performance` UNIQUEMENT (Accessibility/Best-Practices/SEO non requises ici — Stories 4.1/4.3 les couvrent).
    - Device : `Mobile` (CPU 4× slowdown, Slow 4G throttling — préset par défaut Lighthouse).
    - Cliquer « Analyze page load » → noter Performance, LCP, FCP, CLS, INP.
  - [ ] **Répéter** sur `/fr` mobile, `/en` desktop, `/fr` desktop. Soit **4 runs au total**.
  - [ ] **Reporter dans les Completion Notes** (template prêt) :
    ```
    Lighthouse Performance :
      /en mobile  : Perf ___ · LCP ___ s · FCP ___ s · CLS ___ · INP ___ ms
      /en desktop : Perf ___ · LCP ___ s · FCP ___ s · CLS ___ · INP ___ ms
      /fr mobile  : Perf ___ · LCP ___ s · FCP ___ s · CLS ___ · INP ___ ms
      /fr desktop : Perf ___ · LCP ___ s · FCP ___ s · CLS ___ · INP ___ ms

    Budget vs cible :
      LCP < 2.0 s mobile  : __PASS / FAIL_
      FCP < 1.5 s mobile  : __PASS / FAIL_
      CLS < 0.1           : __PASS / FAIL_
      INP < 200 ms        : __PASS / FAIL_
      Performance ≥ 95    : __PASS / FAIL_
    ```
  - [ ] **Si un seuil est dépassé** : identifier l'opportunité spécifique remontée par Lighthouse (panneau « Opportunities ») et corriger :
    - **Render-blocking resources** : repousser via `next/dynamic` ou `<Script strategy="lazyOnload">`. Aucun script tiers actuel ⇒ peu probable.
    - **Largest Contentful Paint element** : si le LCP est un texte (probable — Hero `<h1>` ou sous-accroche), pas grand-chose à optimiser (Inter est déjà preloaded). Si LCP > 2.0 s sur mobile alors qu'aucun blocking, vérifier le throttling Lighthouse (préset par défaut peut surévaluer — c'est connu).
    - **Cumulative Layout Shift** : si CLS > 0, identifier l'élément (DevTools Performance Insights). Suspect probable : `ResizeObserver` du `Nav` qui setProperty `--nav-height` à la 1re mesure → pourrait shifter si le ResizeObserver tarde. Mitigation : pré-charger `--nav-height: 72px` dans le `:root` (fait via `--spacing-nav-height` qui fallback à 72px dans globals.css — voir [src/app/globals.css:77](src/app/globals.css#L77) — donc déjà mitigé). À reconfirmer.
    - **Interaction to Next Paint** : si INP > 200 ms, profiler l'interaction la plus lente. Suspect : ouverture du menu mobile (focus useEffect + ResizeObserver re-mesure). Cible : main thread < 50 ms par tâche.
  - [ ] **NE PAS** marquer la story `review` avec un seuil failed. Soit corriger, soit documenter clairement l'écart et justifier (ex. INP 220 ms sur ouverture menu mobile = dette acceptée → ajouter à `deferred-work.md`).
  - [ ] **Délégation possible à Mike** : si Chrome MCP est verrouillé par une session interactive (cf. Story 4.1 Debug Log), le dev agent peut **préparer** la build (`npm run start` en background), documenter la procédure, et **déléguer** la passe Lighthouse à Mike en code-review — comme pour Story 4.1 AC#8. Dans ce cas, marquer dans les Completion Notes : « Audit Lighthouse à exécuter par Mike — checklist préparée Tâche 7 ; la story est marquée `review` (pas `done`) pour permettre cette validation. ».

- [ ] **Tâche 8 — Mise à jour `deferred-work.md` (résolution dettes différées)**
  - [ ] **Dette `requestAnimationFrame` (review 3.2)** : strikethrough comme spécifié en Tâche 6.
  - [ ] **Dette « Nom long carte méthodo » (review 2.3)** : trouver dans `## Deferred from: code review of story-2.3 (2026-05-13)` la ligne `**Nom long carte méthodo (`<h3>` `text-display-sm` 28px) — risque overflow à ~320px**` — la **préfixer** par `~~` et **suffixer** par `— **RÉSOLU (Story 4.2 AC#3/#5, 2026-05-13)** : `break-words` ajouté au `<h3>` de `MethodologyCard.tsx` ; smoke 320px sur /en et /fr passé sans débordement.`
  - [ ] **Dette « Smoke browser à ~320px non exécuté pour la section Contact » (review 2.4)** : si la passe de Tâche 5 confirme l'absence de débordement Contact à 320px ⇒ strikethrough avec renvoi à AC#3 ; sinon, documenter le fix appliqué + strikethrough.
  - [ ] **Toute nouvelle dette détectée** pendant l'audit (ex. INP marginalement > 200 ms accepté, ou opportunité Lighthouse non corrigée) : ajouter une nouvelle entrée `## Deferred from: code review of story-4.2 (2026-05-13)` en bas du fichier.

- [ ] **Tâche 9 — Non-régression + mise à jour sprint-status + Change Log + Completion Notes + File List (AC: #6)**
  - [ ] `npm run typecheck` → 0 erreur.
  - [ ] `npm run lint` → 0 erreur, 0 warning.
  - [ ] `npm run build` → succès ; `/en` et `/fr` marqués `● (SSG)` ; First Load JS reporté.
  - [ ] **Smoke browser final** (déléguable à Mike) sur `/en` ET `/fr` :
    - Hero : `<h1>` + sub + meta strip + CTAs OK.
    - Marquee : animation OK, `aria-hidden` OK.
    - Toutes les sections : rendu correct, FadeIn OK, scroll-spy OK.
    - Menu mobile : ouverture, focus initial, Échap OK (Story 4.1 acquis).
    - Skip link : `Tab` initial → visible, `Enter` → scroll vers `<main>` (Story 4.1 acquis).
    - LanguageSwitcher : FR↔EN OK, annonce `aria-live` OK (Story 1.2b acquis).
    - CustomCursor : actif sur desktop avec souris ; **ring s'arrête bien quand la souris est immobile** (vérification visuelle simple : laisser la souris 3s, observer aucun clignotement RAF dans Chrome DevTools Performance) ; désactivé sous DevTools `prefers-reduced-motion: reduce`.
    - 320px, 360px, 375px, 1440px, 1920px : aucun scroll horizontal parasite.
  - [ ] **Mettre à jour [`_bmad-output/implementation-artifacts/sprint-status.yaml`](_bmad-output/implementation-artifacts/sprint-status.yaml)** :
    - `development_status['4-2-budget-de-performance-core-web-vitals']` : `ready-for-dev` → `in-progress` (à l'entrée de la story) → `review` (à la sortie, avant code-review).
    - `last_updated` : `2026-05-13` (ou la date du jour de fin de story).
    - **NE PAS** toucher aux autres clés.
  - [ ] **Cocher** toutes les tâches/sous-tâches achevées (`[x]`).
  - [ ] **Compléter** Dev Agent Record / Change Log / Completion Notes / File List ci-dessous.
  - [ ] **Ne pas commiter d'état cassé.** Mike commit après revue (convention 3.1/3.2/4.1).

## Dev Notes

### Contexte projet & contraintes héritées

- **Next.js 16.2.6 / React 19.2.4** (cf. [package.json](package.json), 3 deps + 9 devDeps — repo très lean). App Router avec segments de locale (`app/[locale]/...`). Site **statique** (SSG, `dynamicParams = false`). Pas de backend, pas d'auth, pas d'API.
- **Tailwind CSS v4** — config CSS-first via `@theme` dans [src/app/globals.css](src/app/globals.css). Les tokens `--color-*`, `--spacing-*`, `--text-*` génèrent automatiquement des utilitaires Tailwind. Token `--spacing-nav-height: var(--nav-height, 72px)` introduit en Story 4.1 ⇒ déjà utilisé par `GridSection.scroll-mt-nav-height`.
- **AGENTS.md / CLAUDE.md** : lecture obligatoire de `node_modules/next/dist/docs/` AVANT toute écriture de code. Patterns Next 15/16 connus :
  - `dynamic({ ssr: false })` interdit en Server Component (Story 3.2 a traité cela via `CursorMount` Client wrapper).
  - `cookies()` / `headers()` opt-out le SSG — à éviter (déjà absent du codebase).
- **Convention de revue / commits** : Mike commit lui-même après revue ; le dev agent ne crée PAS de commit (cf. Completion Notes Stories 3.1/3.2/4.1).
- **Convention `'use client'`** : seuls les composants qui en ont besoin (`Nav`, `LanguageSwitcher`, `CustomCursor`, `CursorMount`, `FadeIn`) portent la directive. Les composants de section (`Hero`, `About`, `Experience`, `Contact`, `Projects`, `Stack`, `AI`, `Clients`, `Footer`, `SkipLink`, `GridSection`, `SectionHead`, `MMLogo`, `AvailabilityBadge`, `MaqomCard`, `MethodologyCard`, `MissionCard`, `RoleCard`) sont **Server Components** par défaut.
- **Convention française des commentaires de code** : les commentaires applicatifs (`// …`) du codebase BMAD sont en français quand ils explicitent une décision (cf. Story 4.1 review patch P6 « Commentaire de décision `CustomCursor.tsx` à traduire en français »). Le code lui-même reste en anglais (identifiants, types, props). **Tout nouveau commentaire de décision ajouté par cette story doit être en français.**

### Patterns d'architecture & garde-fous

- **Politique de bundle size** : 150 KB gzip est le plafond AC. Le ratio gzip → raw est ~30-40% ⇒ la sortie `next build` montre **raw KB**, donc le seuil affiché est ~375-500 KB raw. Le repo actuel est minimal (Next 16 + React 19 + 3 fonts via next/font + 5 composants Client petits) ⇒ on s'attend très en-dessous (~120-200 KB raw selon l'expérience Next 16). **Si dépassement** : voir Tâche 2 (analyzer + 3 stratégies de mitigation).

- **`useReportWebVitals` est PAS implémenté ici** : le hook permet d'envoyer les CWV à un endpoint analytics — c'est la responsabilité de **Story 5.1 (analytics)**, pas de cette story. Cette story se contente de **mesurer** Lighthouse en local et de **documenter** les valeurs.

- **`next/image` policy without enforcement runtime** : la politique est documentaire (Tâche 4). Pas de lint Tailwind / ESLint plugin ajouté. Justification : (a) overhead pour 1 règle qu'on peut catcher en code review ; (b) le repo a un nombre fini de composants ; (c) l'introduction d'un plugin lint est plus risquée que la valeur ajoutée.

- **CustomCursor RAF idle gating — pourquoi 0.1px et pas plus** :
  - Le seuil sub-pixel garantit aucun « jitter » visible (le lerp 0.18 converge à 5-10 frames pour passer de quelques px à <0.1px ⇒ ~80-160ms à 60fps, transition fluide invisible).
  - Un seuil plus large (ex. 1px) introduirait un « stop » à 1px de la souris ; au prochain mousemove de 0.5px, la boucle reprendrait avec un léger lag visible.
  - 0.1px est aussi cohérent avec le seuil que Framer Motion et la plupart des libs d'animation utilisent en interne pour leur idle gating.

- **Pourquoi le `dot` n'est pas concerné par l'idle gating** :
  - Le `dot` est positionné **directement** dans `onMove` (pas de lerp, pas de RAF — instantané). Quand la souris est immobile, le `dot` ne bouge plus de toute façon. Donc l'idle gating sur la boucle RAF n'affecte que le `ring` (qui a un lerp).

- **`ResizeObserver` du `Nav` (Story 4.1 patch P10) & CLS** :
  - Au premier render serveur, `--nav-height` n'est pas encore défini ⇒ `--spacing-nav-height` fallback à `72px` (cf. [globals.css:77](src/app/globals.css#L77)).
  - Au premier `useEffect` côté client, le `ResizeObserver` mesure la nav réelle et écrit `--nav-height` sur `<html>`. Si la valeur réelle est ≠ 72px (ex. 68px sur desktop, 52px sur mobile), un re-layout théorique peut survenir.
  - **Impact CLS** : presque nul — `--nav-height` n'affecte que `scroll-margin-top` (qui n'est sollicité que lors d'une navigation par ancre, pas au premier paint). Aucun élément visible ne se déplace au premier paint.
  - **Vérification** : Lighthouse Performance Insights doit reporter CLS = 0,00 (cible). Si non, investiguer.

- **Marquee perf** :
  - `width: max-content` + `animate-marquee` avec `transform: translateX(-33.333%)` sur 32s (desktop) ou 20s (mobile) — animation CSS pure, exécutée sur le compositor thread.
  - Aucun JavaScript runtime impliqué après le mount initial.
  - **Suspect CLS** : tripled items rendus dès le SSR ⇒ pas de shift au premier paint.

- **FadeIn perf** :
  - `useScrollFadeIn` utilise un IntersectionObserver lazy ⇒ pas de scroll listener coûteux.
  - Animation CSS `transition-[opacity,transform] duration-700 ease-out` avec `motion-reduce:transition-none` ⇒ respect de `prefers-reduced-motion`.
  - **Suspect INP** : aucun — les transitions sont déclenchées par IO, pas par interaction utilisateur.

### Mesure de référence attendue (template pour les Completion Notes)

```
=== First Load JS (npm run build, mode production) ===
Route (app)                                  Size     First Load JS
┌ ● /[locale]                                ___ kB   ___ kB
+ First Load JS shared by all                         ___ kB
  ├ chunks/main-app-…                                 ___ kB
  ├ chunks/webpack-…                                  ___ kB

Conversion approx. gzip (×0.35) :
  /[locale] : ___ kB gzip · Budget AC ~150 kB gzip · ___PASS / FAIL_

=== Bundle Analyzer (si exécuté — Tâche 2) ===
Top 5 modules client :
  1. ___ (___ kB)
  2. ___ (___ kB)
  3. ___ (___ kB)
  4. ___ (___ kB)
  5. ___ (___ kB)

=== Lighthouse Performance (production, npm run start) ===
                  /en mobile  /en desktop  /fr mobile  /fr desktop
Performance       ___         ___          ___         ___
LCP (s)           ___         ___          ___         ___
FCP (s)           ___         ___          ___         ___
CLS               ___         ___          ___         ___
INP (ms)          ___         ___          ___         ___

Budget vs cible (mobile) :
  LCP < 2.0 s  : __PASS / FAIL_
  FCP < 1.5 s  : __PASS / FAIL_
  CLS < 0.1    : __PASS / FAIL_
  INP < 200 ms : __PASS / FAIL_
  Performance ≥ 95 : __PASS / FAIL_

=== Vérification non-régression ===
typecheck : 0 erreur · OK
lint      : 0 erreur, 0 warning · OK
build     : succès · /en SSG · /fr SSG · OK
```

### Standards de test

Aucun framework de test installé (Playwright/Jest = Story 4.x ou Epic 7 / 7.2 CI Lighthouse durci). « Tester » = :
- `npm run typecheck` + `npm run lint` + `npm run build` (tous verts).
- **Audit Lighthouse Performance** via Chrome DevTools (PAS extension axe — c'est l'a11y de Story 4.1) sur `/en` et `/fr`, en mode prod (`npm run start`). Mobile + Desktop, 4 runs au total.
- **Bundle Analyzer** (optionnel, conditionnel à un dépassement de budget) via `npx next experimental-analyze --output`.
- **Smoke responsive manuel** : 320px, 360px, 375px, 1440px, 1920px, sur `/en` ET `/fr` — aucun scroll horizontal, comportement des cartes (`MethodologyCard`, `MaqomCard`, `Hero` meta strip, `Contact` CTA) validé.
- **Smoke CustomCursor** : laisser la souris immobile 3s, observer aucune activité RAF dans Chrome DevTools > Performance > Frames (la boucle RAF doit s'arrêter).

Ne pas commiter d'état cassé.

### Project Structure Notes

- **Nouveaux fichiers** :
  - **Aucun nouveau composant** créé par cette story.
  - **Optionnellement** : `docs/image-policy.md` (3-5 lignes) si l'**Option B** de la Tâche 4 est retenue. Sinon, modification d'`AGENTS.md` (Option A).

- **Modifiés** :
  - `src/components/CustomCursor.tsx` — ajout du `idle` gate + relance dans `onMove` (Tâche 6).
  - `src/components/MethodologyCard.tsx` — `break-words` sur le `<h3>` (Tâche 5).
  - **Éventuellement** d'autres composants si la passe 320px de Tâche 5 révèle un débordement (à documenter en Completion Notes).
  - `AGENTS.md` — ajout de la note de politique d'images (Option A — Tâche 4).
  - `_bmad-output/implementation-artifacts/sprint-status.yaml` — `4-2-…` `ready-for-dev` → `in-progress` (entrée) → `review` (sortie) ; `last_updated`.
  - `_bmad-output/implementation-artifacts/deferred-work.md` — strikethrough des dettes résolues (review 3.2 RAF, review 2.3 MethodologyCard 320px, éventuellement review 2.4 Contact 320px).
  - Ce fichier story (Dev Agent Record, Change Log, Completion Notes, File List à compléter).

- **Fichiers à NE PAS toucher** :
  - **Tokens de couleur ni d'espacement** dans `globals.css` — l'audit de contraste de Story 4.1 reste l'autorité. La hauteur de nav (`--spacing-nav-height`) reste à 72px (fallback) + `--nav-height` dynamique (ResizeObserver Story 4.1).
  - **Polices** dans `layout.tsx` — Inter preloaded + Cormorant/JetBrains Mono `preload: false` reste optimal (NFR4).
  - **`next.config.ts`** — pas de changement (config volontairement minimale ; pas de `output: 'export'` car ferait perdre l'optimisation `next/image` ; aucune addition requise pour cette story).
  - **`Nav.tsx`, `Hero.tsx`, `Contact.tsx`, etc.** — sauf si la Tâche 5 révèle un débordement 320px imputable à l'un d'eux (alors fix minimal documenté).
  - **`useScrollFadeIn.ts`, `useActiveSection.ts`, `FadeIn.tsx`, `Clients.tsx`, `SkipLink.tsx`** — perf déjà optimale, aucun changement requis.
  - **`src/i18n/dictionaries/*`** — aucun changement (pas de nouveau libellé introduit par cette story).
  - **Aucune dépendance npm ajoutée** — `npx next experimental-analyze` est un sous-commande Next built-in (pas un paquet à installer ; cf. [package-bundling.md:23](node_modules/next/dist/docs/01-app/02-guides/package-bundling.md#L23)).
  - **Aucun fichier de config** : `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `src/i18n/config.ts`, `src/proxy.ts`.

### Hors périmètre explicite (à NE PAS confondre)

Toutes ces choses **NE SONT PAS** dans cette story (et **NE DOIVENT PAS** être traitées ici) :

- **Lighthouse en CI (bloquant ou advisory)** = **Story 4.3** (SEO) — l'AC final de Story 4.3 ajoute le check Lighthouse à la pipeline CI. Story 4.2 ne touche pas `.github/workflows/ci.yml`.
- **Métadonnées SEO, OG image, sitemap, robots, JSON-LD, hreflang, canonical** = **Story 4.3**.
- **Analytics privacy-friendly + `useReportWebVitals`** = **Story 5.1**.
- **Fix LinkedIn 404, `statusSnake` robustness, MaqomCard URL fragility, PII duplication, garde FR/EN array-blind, audit factuel de contenu, smoke Contact 200% zoom** = **Story 9.1** (audit pré-lancement).
- **Lighthouse CI durci (bloquant)** = **Story 7.2** (Post-MVP).
- **CI durci par budget JS strict** = **Story 7.2** (Post-MVP).
- **CSP, `next/script` lazyOnload** = futur (pas dans le périmètre MVP).
- **Token `--z-cursor`** = dette ouverte différée 3.2 (à introduire quand modal/toast arrive — pas dans MVP).
- **`html.cursor-none` ne couvre pas inputs/select/textarea** = dette différée 3.2 (à traiter quand Story 4.x/9.1 introduira un formulaire — aucun cas aujourd'hui).
- **`mouseleave` viewport pour le CustomCursor** = polish différé 3.2 (non bloquant ; pas dans cette story).
- **`mix-blend-mode: difference` contraste du dot par-dessus la Nav** = audit visuel **Story 9.1** (polish pré-lancement).

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2] — ACs canoniques (`Given the home page under simulated mobile conditions`, `Given the JavaScript shipped on initial load`, `Given images`).
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4] — objectifs Epic 4 (a11y + perf + SEO) et NFRs perf couverts (NFR1–3, 5, 7, 16).
- [Source: _bmad-output/planning-artifacts/prd.md#NFR1] — LCP < 2.0 s, FCP < 1.5 s, CLS < 0.1, INP < 200 ms (mobile 4× CPU, 4G).
- [Source: _bmad-output/planning-artifacts/prd.md#NFR2] — Lighthouse Performance ≥ 95 mobile + desktop.
- [Source: _bmad-output/planning-artifacts/prd.md#NFR3] — JS initial < ~150 KB gzip hors polices ; non-critique via `next/dynamic`.
- [Source: _bmad-output/planning-artifacts/prd.md#NFR5] — images AVIF/WebP, sized, lazy, no CLS.
- [Source: _bmad-output/planning-artifacts/prd.md#NFR6] — animations `transform`/`opacity`, ~60 fps.
- [Source: _bmad-output/planning-artifacts/prd.md#NFR7] — poids total transféré accueil < ~600 KB (indicatif).
- [Source: _bmad-output/planning-artifacts/prd.md#NFR16] — pas de scroll horizontal de ~320px à grands écrans.
- [Source: _bmad-output/planning-artifacts/prd.md#AR2, AR3] — SSG, Vercel statique.
- [Source: _bmad-output/planning-artifacts/prd.md#AR7] — polices `next/font`, Inter preloaded, subset latin.
- [Source: _bmad-output/planning-artifacts/prd.md#AR8] — `next/image` AVIF/WebP, logos SVG inline.
- [Source: _bmad-output/implementation-artifacts/deferred-work.md] — 2 dettes résolues par cette story :
  - Review 3.2 ligne `**requestAnimationFrame tourne en continu même quand la souris est immobile**` → AC#4 (Tâche 6).
  - Review 2.3 ligne `**Nom long carte méthodo (\`<h3>\` \`text-display-sm\` 28px) — risque overflow à ~320px**` → AC#3/#5 (Tâche 5).
  - Éventuellement Review 2.4 ligne `**Smoke browser à ~320px non exécuté pour la section Contact**` → AC#3 (Tâche 5) si la passe ne trouve aucun débordement Contact.
- [Source: src/app/[locale]/layout.tsx#L20-L44] — config `next/font` (Inter preloaded, JetBrains Mono + Cormorant `preload: false`).
- [Source: src/app/[locale]/layout.tsx#L51] — `dynamicParams = false` (SSG strict).
- [Source: src/app/globals.css#L77] — `--spacing-nav-height: var(--nav-height, 72px)` (fallback CSS-first).
- [Source: src/components/CustomCursor.tsx#L50-L124] — boucle RAF + `onMove` à modifier en Tâche 6.
- [Source: src/components/CursorMount.tsx#L10-L13] — pattern `next/dynamic({ ssr: false })` à confirmer en Tâche 3 (NFR3).
- [Source: src/components/MethodologyCard.tsx#L29-L31] — `<h3>` `text-display-sm` à corriger en Tâche 5.
- [Source: src/components/Nav.tsx#L117-L132] — `ResizeObserver` qui maintient `--nav-height` (Story 4.1 patch P10 ; à ne pas toucher).
- [Source: AGENTS.md, CLAUDE.md] — lire `node_modules/next/dist/docs/` avant de coder ; politique d'images à ajouter en Tâche 4.
- [Source: node_modules/next/dist/docs/01-app/02-guides/production-checklist.md] — best practices Next.js prod.
- [Source: node_modules/next/dist/docs/01-app/02-guides/package-bundling.md] — `npx next experimental-analyze`.
- [Source: node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md] — `next/dynamic` patterns (déjà internalisé Story 3.2).
- [Source: node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md] — props `next/image` (utile pour rédiger la politique Tâche 4).
- [Source: node_modules/next/dist/docs/01-app/02-guides/analytics.md] — `useReportWebVitals` (PAS implémenté ici ; Story 5.1).
- [Source: _bmad-output/implementation-artifacts/4-1-accessibilite-wcag-2-1-aa.md] — story précédente. Patterns à reproduire : `'use client'` au sommet quand nécessaire, `useRef` pour DOM refs, `useEffect` cleanup rigoureux, conventions de revue (Mike commit), commentaires de décision en français, **délégation des audits navigateur à Mike** quand le profil Chrome MCP est verrouillé. Notes héritées : ResizeObserver `Nav` `--nav-height` (patch P10), idle Tab → SkipLink, focus disclosure ARIA APG.
- [Source: _bmad-output/implementation-artifacts/3-2-curseur-personnalise-passe-de-fidelite-visuelle-degradation-gracieuse.md] — Story 3.2 (CustomCursor). Pattern `next/dynamic({ ssr: false })` via `CursorMount.tsx` Client wrapper, conventions de cleanup `useEffect`, `(hover: hover) and (pointer: fine)` + `prefers-reduced-motion: reduce` éligibilité, watcher `matchMedia('change')`.

### Anti-patterns à éviter (rappels)

- **NE PAS** ajouter `useReportWebVitals` ici (Story 5.1).
- **NE PAS** ajouter Lighthouse CI workflow ici (Story 4.3).
- **NE PAS** ajouter `next/image` même pour l'OG image (Story 4.3).
- **NE PAS** ajouter de nouvelles dépendances npm sans justification.
- **NE PAS** modifier les tokens de couleur (audit Story 4.1 = autorité).
- **NE PAS** activer `output: 'export'` dans `next.config.ts` (ferait perdre l'optimisation `next/image` — cf. commentaire existant lignes 6-11).
- **NE PAS** modifier les paramètres de `next/font` (Inter preloaded, JetBrains Mono / Cormorant `preload: false` reste optimal).
- **NE PAS** ajouter de focus-trap au menu mobile (Story 4.1 a délibérément choisi pattern disclosure ARIA APG).
- **NE PAS** committer d'état cassé (convention 3.x/4.x — Mike commit après revue).
- **NE PAS** ajouter de commit créé par le dev agent.
- **NE PAS** introduire de nouveau breakpoint Tailwind `xs` sauf nécessité absolue (cassé `<h1>` à 320px confirmé en browser).
- **NE PAS** marquer la story `done` directement — passer par `review` pour permettre la code-review (et la validation Lighthouse si déléguée à Mike).

## Dev Agent Record

### Agent Model Used

<!-- À renseigner par le dev agent à l'entrée de la story. Exemple : Claude Opus 4.7 (1M context) — `claude-opus-4-7[1m]`, invoqué via le skill BMAD `bmad-dev-story` le 2026-05-XX. -->

### Debug Log References

<!-- À remplir au fil de l'implémentation. Format suggéré (cf. Story 4.1) :
- Décisions ou problèmes rencontrés.
- Patterns Next 16 internalisés.
- Profil Chrome MCP : si verrouillé, signaler et déléguer l'audit Lighthouse à Mike.
- Mesures intermédiaires (First Load JS, Lighthouse scores) avec dates / versions de Next. -->

### Completion Notes List

<!-- À remplir à la sortie. Synthèse rapide + détails par AC. Inclure :
- Résolution des 2 dettes différées (3.2 RAF, 2.3 MethodologyCard 320px).
- Mesures First Load JS (template Tâche 1).
- Mesures Lighthouse Performance (template Tâche 7).
- Liste des fix 320px appliqués (Tâche 5).
- Liste des composants Client confirmés (Tâche 3).
- Décisions d'optimisation prises en cas de dépassement (Tâche 2).
- Nouvelles dettes détectées (ajoutées à `deferred-work.md`). -->

### File List

<!-- À remplir à la sortie. Format Stories 4.1 / 3.2.

#### Créés

- (Optionnel) `docs/image-policy.md` — si Option B Tâche 4.

#### Modifiés

- `src/components/CustomCursor.tsx` — idle gate RAF (Tâche 6).
- `src/components/MethodologyCard.tsx` — `break-words` sur `<h3>` (Tâche 5).
- (Éventuels autres fix 320px — à lister.)
- `AGENTS.md` — politique d'images (Tâche 4, Option A).
- `_bmad-output/implementation-artifacts/deferred-work.md` — strikethrough des 2 (ou 3) dettes résolues.
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — `4-2-…` `ready-for-dev` → `in-progress` → `review` ; `last_updated`.
- Ce fichier de story.

#### Fichiers de configuration / hooks **NON modifiés** (vérifié)

- `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `package.json`, `package-lock.json`.
- `src/app/globals.css` (tokens couleur/spacing/typo).
- `src/app/[locale]/layout.tsx` (config next/font, generateStaticParams).
- `src/i18n/config.ts`, `src/i18n/dictionaries/*`, `src/proxy.ts`.
- `src/hooks/useActiveSection.ts`, `src/hooks/useScrollFadeIn.ts`.
- `.github/workflows/ci.yml` (Story 4.3 ajoutera le job Lighthouse).
- Composants hors périmètre : (à lister si aucun fix 320px ailleurs que MethodologyCard).
-->

### Change Log

| Date | Auteur | Changement |
|---|---|---|
| 2026-05-13 | bmad-create-story | Création initiale du fichier story (Status `ready-for-dev`). |

<!-- Le dev agent appendra :
| 2026-05-XX | Amelia (dev agent) | Status `ready-for-dev` → `in-progress`. |
| 2026-05-XX | Amelia | Tâche 1 : First Load JS mesuré (X kB raw / Y kB gzip estimé). |
| 2026-05-XX | Amelia | Tâche 5 : `break-words` sur `MethodologyCard.tsx` h3. Résout dette review 2.3. |
| 2026-05-XX | Amelia | Tâche 6 : idle gate RAF dans `CustomCursor.tsx`. Résout dette review 3.2. |
| 2026-05-XX | Amelia | Tâche 4 : politique `next/image` documentée dans `AGENTS.md`. |
| 2026-05-XX | Amelia | Tâche 7 : Lighthouse mesurés (Perf /en mobile X · /en desktop Y · /fr mobile Z · /fr desktop W). |
| 2026-05-XX | Amelia | Tâche 9 : typecheck/lint/build verts ; /en + /fr SSG préservés. |
| 2026-05-XX | Amelia | Tâche 9 : Status `in-progress` → `review` ; sprint-status.yaml aligné. |
-->
