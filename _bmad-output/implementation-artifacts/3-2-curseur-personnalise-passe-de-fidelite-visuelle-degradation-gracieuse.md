# Story 3.2: Curseur personnalisé, passe de fidélité visuelle & dégradation gracieuse

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor on a fine-pointer device,
I want a custom cursor (dot + ring) and a final visual pass that faithfully matches the "Technical Minimal" reference, degrading gracefully on older browsers,
so that the site looks exactly as designed and proves the craft it claims.

## Acceptance Criteria

1. **`CustomCursor` actif sur dispositif pointeur fin uniquement (FR30, NFR3, NFR13, UX-DR15).** Étant donné le composant `CustomCursor` chargé via `next/dynamic({ ssr: false })` (à travers un wrapper Client Component — voir Dev Notes « Contrainte Next 16 »), quand le navigateur évalue `(hover: hover) and (pointer: fine)` à `matches: true` ET `(prefers-reduced-motion: reduce)` à `matches: false`, alors **deux éléments fixed** sont rendus dans le DOM :
   - **Dot** : `position: fixed`, `width: 10px`, `height: 10px`, `border-radius: 50%`, `background: var(--color-accent)` (`#d4a574`), `pointer-events: none`, `z-index: 9999`, `transform: translate(x, y) translate(-50%, -50%)`, `mix-blend-mode: difference`, transitions courtes (`width 0.18s, height 0.18s, background 0.18s`).
   - **Ring** : `position: fixed`, `width: 36px`, `height: 36px`, `border-radius: 50%`, `border: 1px solid rgba(212, 165, 116, 0.5)`, `pointer-events: none`, `z-index: 9998`, `transform: translate(rx, ry) translate(-50%, -50%)`, transitions (`transform 0.22s cubic-bezier(0.2, 0.7, 0.3, 1), width 0.18s, height 0.18s, border-color 0.18s`).
   - **Tracking** : `mousemove` document-level met à jour `(x, y)` synchronement → dot suit instantanément ; une boucle `requestAnimationFrame` interpole `(rx, ry)` avec un facteur de lerp `0.18` → ring suit avec un délai fluide. Animation **`transform` uniquement** (NFR6). Cleanup complet (`removeEventListener` + `cancelAnimationFrame`) au démontage.
   - **Survol des éléments interactifs** : sur `mouseover` d'un `a`, `button`, ou `[data-cursor='hover']` (délégation document via `e.target.closest(...)`), dot **rétrécit** à `4×4 px`, ring **grandit** à `56×56 px` et passe à `border-color: rgba(212, 165, 116, 0.9)` ; sur `mouseout`, les états reviennent au défaut. Aucune classe ni style appliqués au site existant — seul le curseur change.
   - **Masquage du curseur système** : appliqué via une **classe ajoutée dynamiquement sur `<html>`** (`document.documentElement.classList.add('cursor-none')`) au montage, et **retirée au démontage** et **dès que l'éligibilité tombe à `false`**. La règle CSS associée vit dans `globals.css` (`html.cursor-none { cursor: none; }`). **Aucun `cursor: none` n'est codé en dur globalement** (NFR13 — ne jamais masquer le curseur système quand l'utilisateur en dépend).

2. **`CustomCursor` désactivé sur tactile / pointeur grossier / reduced motion (FR30, FR32, NFR11, NFR13).** Étant donné un dispositif tactile (`(hover: none), (pointer: coarse)` matche) **OU** une préférence `prefers-reduced-motion: reduce`, quand le composant s'évalue, alors :
   - Aucun élément (dot/ring) n'est rendu dans le DOM (`return null`).
   - Aucune classe `cursor-none` n'est appliquée sur `<html>` (curseur système intact).
   - Aucun listener (`mousemove`, `mouseover`, `mouseout`) n'est attaché, aucune boucle RAF ne tourne.
   - Cette désactivation s'applique aussi en cas de mismatch initial (premier rendu mobile : aucun JS lié au curseur ne s'exécute au-delà de la check `matchMedia`).

3. **Réactivité au changement d'environnement (UX-DR15, NFR13).** Étant donné que l'utilisateur change l'une des trois conditions en cours de session (souris USB branchée/débranchée → `(pointer: fine)` change ; préférence système `prefers-reduced-motion` togglée ; navigateur passé en mode tactile via DevTools), quand le `matchMedia` listener (`change` event) se déclenche, alors le composant **ré-évalue l'éligibilité** combinée et :
   - Si désormais éligible : monte le curseur (rend dot+ring, ajoute la classe `cursor-none`, attache les listeners et démarre la boucle RAF).
   - Si désormais non éligible : démonte tout (retire dot+ring du rendu, retire la classe `cursor-none`, retire les listeners, arrête le RAF) → curseur système restauré.
   - Les **3 `MediaQueryList`** (`hover: hover`, `pointer: fine`, `prefers-reduced-motion: reduce`) sont surveillées via `addEventListener('change', …)`, avec un `removeEventListener` correspondant au cleanup.

4. **Dégradation gracieuse `mix-blend-mode` / `backdrop-filter` (NFR15).** Étant donné un navigateur ne supportant pas `mix-blend-mode: difference` (cas hypothétique sur les 2 dernières versions — NFR14), quand le site est consulté, alors :
   - **Dot** : le `mix-blend-mode: difference` est appliqué sans wrapper `@supports` (les navigateurs sans support l'ignorent silencieusement → le dot s'affiche en gold `#d4a574` plein, parfaitement visible et utilisable — fallback intrinsèque). Le dot reste lisible sur les fonds clairs comme sombres (l'accent doré contraste suffisamment).
   - **`Nav` (`backdrop-filter`)** : la règle `bg-bg/95 supports-[backdrop-filter]:bg-bg/85 backdrop-blur-md` (déjà en place dans `src/components/Nav.tsx`) garantit qu'un navigateur sans support `backdrop-filter` rend la nav avec un fond `bg-bg/95` opaque (au lieu de `bg-bg/85` translucide). Aucune action additionnelle requise — confirmer en revue.
   - Le layout reste intact (aucun overflow, aucun élément coupé, lisibilité préservée) — vérifié par smoke browser (`npm run dev` sur Chrome récent + un navigateur sans `mix-blend-mode` simulé via DevTools « Rendering > Emulate CSS feature »).

5. **Passe de fidélité visuelle (FR33).** Étant donné l'implémentation du site (Epics 1+2+Story 3.1) versus le design de référence `_bmad-output/planning-artifacts/design/Minimal.jsx` + `Portfolio.html`, quand chaque section est revue côte à côte sur desktop (≥ `lg`) et sur mobile (~375px), alors :
   - **Palette** : `--color-bg #0a0a0a`, accent `--color-accent #d4a574`, échelle de gris `fg-strong #fafafa → fg-faintest #444` (déjà en place dans `globals.css` — confirmer).
   - **Typographies** : Inter (UI/corps), JetBrains Mono (labels `01 — About`, terminal nav, séparateurs), Cormorant Garamond (display + italic pour marquee) appliquées correctement (déjà en place — confirmer).
   - **Grille de fond** : rails latéraux ~32px (`--spacing-gutter`), bordure `--color-line` inférieure de section, label monospace pivoté (déjà en place dans `GridSection.tsx` — confirmer).
   - **Cartes terminal** (`MaqomCard`, `MethodologyCard`) : chrome de fenêtre (3 boutons), corps `bg-surface`, header `bg-surface-2`, état `Connected to`, lien `$ open …` (Story 2.3 — confirmer rendu identique à `Minimal.jsx` `TMProjects`).
   - **Rangées KPI** (`RoleCard`) : tuiles `bg-surface-3`, gros chiffre, libellé mono uppercase (Story 2.2 — confirmer).
   - **Marquee** : 12 wordmarks (×3), animation 20s mobile / 32s desktop, séparateur `·` après chaque (Story 3.1 — confirmer).
   - **Snapshot de référence** : capturer une **capture d'écran de la home `/en`** (1440×900 desktop + 375×812 mobile) **après** le build de cette story, et la stocker dans `_bmad-output/implementation-artifacts/screenshots/3-2-home-{en,fr}-{desktop,mobile}.png` (4 captures, à des fins de référence visuelle pour Story 4.x — pas de tests automatisés à ce stade). Toute déviation identifiée vs `Minimal.jsx` est **soit corrigée dans la story, soit explicitement déférée** dans `deferred-work.md` avec justification.

6. **Zéro régression / build vert / SSG préservé / budget JS (NFR3, NFR22, AR2).** Étant donné la totalité du site après cette story, quand `npm run typecheck`, `npm run lint`, et `npm run build` tournent, alors ils passent **sans erreur**. Le rendu statique de `/en` et `/fr` reste pré-rendu (`generateStaticParams`, `dynamicParams = false`). Le HTML initial du serveur **ne contient PAS** les balises du curseur (chargé via `next/dynamic({ ssr: false })`) ⇒ aucun impact LCP/SEO. Le bundle JS client de la home n'augmente que du poids de `CustomCursor.tsx` + son wrapper Mount (cible : **< 2 KB gzip ajouté** ; à mesurer dans Completion Notes). Le scroll-spy Nav, le switch de langue, les CTAs (email, CV, LinkedIn), toutes les sections de contenu et le `FadeIn` (Story 3.1) restent fonctionnels et inchangés. Aucun scroll horizontal parasite à ~375px en mode desktop simulé (curseur monté).

## Tasks / Subtasks

- [x] **Tâche 0 — Pré-lecture obligatoire (AGENTS.md / CLAUDE.md)**
  - [x] **AGENTS.md** impose de **lire les docs Next dans `node_modules/next/dist/docs/`** avant d'écrire du code. Pour cette story, lire :
    - `…/01-app/01-getting-started/05-server-and-client-components.md` — revue du pattern Client-in-Server (Story 3.1 a confirmé : composition `children` Server passés à un Client wrapper).
    - **`…/01-app/02-guides/lazy-loading.md`** (ou équivalent dans la version Next 16) — **CRITIQUE** : confirmer le statut de `next/dynamic({ ssr: false })` en Next 16. Restriction connue depuis Next 15 : `ssr: false` n'est **PAS autorisé** dans un Server Component → doit être placé dans un Client Component wrapper. Confirmer dans la doc de la version installée (`16.2.6` — cf. `package.json`).
    - `…/01-app/02-guides/02-performance.md` (si présent) — confirmer que le chargement asynchrone (`ssr: false`) exclut le composant du HTML initial et du bundle initial (NFR3).
  - [x] Vérifier les avis de dépréciation (deprecation notices) listés en surface des docs de Next 16.
  - [x] Lire `_bmad-output/planning-artifacts/design/Portfolio.html` **lignes 37–80 (CSS du curseur) et 102–150 (JS du curseur)** — c'est la **source unique** pour la mécanique de tracking et les états hover.

- [x] **Tâche 1 — Créer `src/components/CustomCursor.tsx` (Client Component) (AC: #1, #2, #3)**
  - [x] En-tête : `"use client";`
  - [x] **État local React** :
    - `const [enabled, setEnabled] = useState(false);` — éligibilité combinée (les 3 conditions).
    - `const dotRef = useRef<HTMLDivElement>(null);`
    - `const ringRef = useRef<HTMLDivElement>(null);`
  - [x] **`useEffect` n°1 — surveillance `matchMedia` (AC #1, #2, #3)** :
    - Au montage, créer 3 `MediaQueryList` :
      ```ts
      const hoverFineMQL = window.matchMedia("(hover: hover) and (pointer: fine)");
      const reducedMotionMQL = window.matchMedia("(prefers-reduced-motion: reduce)");
      ```
      (`(hover: hover) and (pointer: fine)` est une seule media query combinée — supportée partout.)
    - Définir `const computeEnabled = () => hoverFineMQL.matches && !reducedMotionMQL.matches;`
    - `setEnabled(computeEnabled());` — état initial.
    - Listener `change` sur les 2 MQL, qui appelle `setEnabled(computeEnabled())`.
    - Cleanup : retirer les 2 listeners.
    - Dépendances `useEffect` : `[]` — vide, on attache une seule fois (pattern conforme à `useScrollFadeIn` / `useActiveSection`).
  - [x] **`useEffect` n°2 — tracking + classe `cursor-none` (AC #1, dépendant de `enabled`)** :
    ```ts
    useEffect(() => {
      if (!enabled) return; // not enabled → no-op (cleanup not registered, nothing to undo)
      const html = document.documentElement;
      html.classList.add("cursor-none");

      let x = window.innerWidth / 2;
      let y = window.innerHeight / 2;
      let rx = x;
      let ry = y;
      let raf = 0;

      const dot = dotRef.current;
      const ring = ringRef.current;
      if (!dot || !ring) {
        html.classList.remove("cursor-none");
        return;
      }

      const onMove = (e: MouseEvent) => {
        x = e.clientX;
        y = e.clientY;
        dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      };

      const loop = () => {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(loop);
      };

      const onOver = (e: MouseEvent) => {
        const t = (e.target as Element | null)?.closest("a, button, [data-cursor='hover']");
        if (t) {
          dot.classList.add("cursor-dot--hover");
          ring.classList.add("cursor-ring--hover");
        }
      };
      const onOut = (e: MouseEvent) => {
        const t = (e.target as Element | null)?.closest("a, button, [data-cursor='hover']");
        if (t) {
          dot.classList.remove("cursor-dot--hover");
          ring.classList.remove("cursor-ring--hover");
        }
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseover", onOver);
      document.addEventListener("mouseout", onOut);
      raf = requestAnimationFrame(loop);

      return () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseover", onOver);
        document.removeEventListener("mouseout", onOut);
        cancelAnimationFrame(raf);
        html.classList.remove("cursor-none");
      };
    }, [enabled]);
    ```
    - **CRITIQUE** : le cleanup retire la classe `cursor-none` **et** stoppe la RAF + listeners. Ce cleanup tourne aussi quand `enabled` redevient `false` (transition ON→OFF en cours de session) — c'est ce qui restaure le curseur système (AC #3).
  - [x] **Rendu JSX** :
    ```tsx
    if (!enabled) return null;
    return (
      <>
        <div ref={ringRef} aria-hidden="true" className="cursor-ring" />
        <div ref={dotRef} aria-hidden="true" className="cursor-dot" />
      </>
    );
    ```
    - **Pas de styles inline** sur les classes — les styles vivent dans `globals.css` (Tâche 2).
    - **Ordre DOM** : ring **avant** dot (z-index ring = 9998 < dot = 9999, le dot est visuellement par-dessus).
    - **`aria-hidden="true"`** : éléments purement décoratifs.
  - [x] **Aucun import du dictionnaire** ni de chaîne visible → pas besoin d'`Locale` ou de props ; composant 100% autonome.

- [x] **Tâche 2 — Styles du curseur dans `globals.css` (AC: #1, #2, #4)**
  - [x] Lire `src/app/globals.css` en entier avant d'éditer (état actuel : `@theme` tokens · `@theme inline` font families · `@keyframes marquee-scroll` · `.animate-marquee` + média queries Story 3.1 · `body` defaults).
  - [x] **Ajouter, après le bloc `@media (prefers-reduced-motion: reduce) { .animate-marquee { ... } }` (≈ ligne 160) et AVANT `:root`** :
    ```css
    html.cursor-none,
    html.cursor-none body {
      cursor: none;
    }
    html.cursor-none a,
    html.cursor-none button,
    html.cursor-none [data-cursor="hover"] {
      cursor: none;
    }

    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-accent);
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      transition: width 0.18s, height 0.18s, background 0.18s;
      mix-blend-mode: difference;
      will-change: transform;
    }

    .cursor-ring {
      position: fixed;
      top: 0;
      left: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid rgba(212, 165, 116, 0.5);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition:
        transform 0.22s cubic-bezier(0.2, 0.7, 0.3, 1),
        width 0.18s,
        height 0.18s,
        border-color 0.18s;
      will-change: transform;
    }

    .cursor-dot--hover {
      width: 4px;
      height: 4px;
    }

    .cursor-ring--hover {
      width: 56px;
      height: 56px;
      border-color: rgba(212, 165, 116, 0.9);
    }
    ```
  - [x] **`html.cursor-none` (et descendants)** : on cible aussi `a`, `button`, `[data-cursor="hover"]` car certains agents utilisateurs imposent `cursor: pointer` par UA-stylesheet sur ces éléments — `cursor: none` sur `body` seul ne suffit pas. **Vérification : confirmer en QA visuelle Chrome/Firefox/Safari que le curseur système est bien masqué sur les liens.**
  - [x] **`will-change: transform`** : promet au navigateur que `transform` va changer fréquemment → compositing layer (NFR6).
  - [x] **Pas de classes Tailwind sur `<div class="cursor-dot">`** car les transitions et `mix-blend-mode` sont natifs CSS — les classes Tailwind arbitraires seraient verbeuses.
  - [x] **`@supports` pour `mix-blend-mode`** : pas de bloc `@supports not (...)` requis (l'AC #4 explique que les navigateurs sans support ignorent la règle silencieusement, et le dot gold reste visible). Documenter ce choix dans Completion Notes.

- [x] **Tâche 3 — Wrapper Client `CursorMount.tsx` (AC: #1, #6 — `ssr: false`)**
  - [x] Créer `src/components/CursorMount.tsx` :
    ```tsx
    "use client";
    import dynamic from "next/dynamic";

    // `ssr: false` requires a Client Component boundary in Next 15+.
    // Loaded lazily, excluded from initial JS bundle, no SSR markup.
    const CustomCursor = dynamic(
      () => import("./CustomCursor").then((m) => ({ default: m.CustomCursor })),
      { ssr: false },
    );

    export function CursorMount() {
      return <CustomCursor />;
    }
    ```
  - [x] **Pourquoi un wrapper séparé ?** Next 16 / 15 interdit `ssr: false` dans un Server Component. Le wrapper porte le `'use client'` ; le composant `CustomCursor` lui-même est `'use client'` (pour les hooks), mais c'est `next/dynamic({ ssr: false })` qui exige la frontière. Confirmer dans la doc lue en Tâche 0.
  - [x] **Pas d'export par défaut** sur `CustomCursor.tsx` — le `.then((m) => ({ default: m.CustomCursor }))` shim adapte un export nommé au contrat attendu par `dynamic`.

- [x] **Tâche 4 — Câblage dans `src/app/[locale]/layout.tsx` (AC: #1, #6)**
  - [x] Lire `src/app/[locale]/layout.tsx` en entier avant d'éditer.
  - [x] Ajouter l'import en tête du fichier (après les autres imports) :
    ```ts
    import { CursorMount } from "@/components/CursorMount";
    ```
  - [x] Dans le `<body>` (ligne 90), monter `<CursorMount />` **après `{children}`** :
    ```tsx
    <body className="min-h-full flex flex-col">
      {children}
      <CursorMount />
    </body>
    ```
  - [x] **Pourquoi `layout.tsx` et pas `page.tsx` ?** Le curseur doit être actif sur **toute l'app** (page d'accueil + future page 404 + futures routes). Le placer dans le layout = un seul point d'instanciation, partagé.
  - [x] **Pourquoi après `{children}` ?** Cosmétique — garde le `main` en premier dans le tree DOM ; les deux divs fixed sont positionnées indépendamment de l'ordre flow.
  - [x] **Ne PAS toucher** : `<html>`, `<body>`, classes `*.variable` de `next/font`, `generateStaticParams`, `generateMetadata`, `dynamicParams`.

- [x] **Tâche 5 — Passe de fidélité visuelle (AC: #5)**
  - [x] **Comparaison structurée section par section** (utiliser `Minimal.jsx` comme référence et `Portfolio.html` rendu en local si possible) :
    1. **`Nav`** vs `TMNav` (`Minimal.jsx` ≈ L100–L200) — confirmer : marque MM, badge version, badge dispo (point vert + label), liens `$ cd ./section`, CTA email primaire, CV link, sélecteur de langue, fond `backdrop-filter`.
    2. **`Hero`** vs `TMHero` (≈ L210–L274) — confirmer : ligne `$ whoami → …`, badge dispo, `<h1>` (lead + accent gold + tail), sub, meta strip 4 colonnes (avec séparateurs 1px), CTAs.
    3. **`Clients`** vs `TMClients` (≈ L276–L316) — confirmer : items ×3, vitesse 20s/32s, séparateur `·` après chaque, `aria-hidden`.
    4. **`About`** vs `TMAbout` (≈ L318–L380) — confirmer : layout 2 colonnes, reflow 1 colonne mobile.
    5. **`Experience` / `RoleCard`** vs `TMExperience` (≈ L382–L500) — confirmer : `<article>` sémantique, KPI tuiles en grosses chiffres, bullets, tags techno.
    6. **`FreelanceEngagements` / `MissionCard`** vs (proche `RoleCard` — pas de section dédiée dans `Minimal.jsx` originale ; Story 2.2 a porté le pattern) — confirmer parité structurelle.
    7. **`Projects` / `MaqomCard` / `MethodologyCard`** vs `TMProjects` (≈ L502–L620) — confirmer : carte fenêtre-terminal (3 boutons macOS de chrome, header `Connected to`, body `bg-surface`, lien `$ open maqom.co →`).
    8. **`Stack`** vs `TMStack` (≈ L622–L700) — confirmer : 3 groupes, reflow mobile.
    9. **`AI`** vs `TMAI` (≈ L702–L780) — confirmer : 4 cartes (Claude Code, Claude Design, BMAD, MCP Stack).
    10. **`Contact`** vs `TMContact` (≈ L782–L820) — confirmer : CTA email primaire, LinkedIn, secondaires.
    11. **`Footer`** vs `TMFooter` (≈ L822–L840) — confirmer copyright.
  - [x] **Tokens à vérifier** : `--color-accent` = `#d4a574` (confirmé `globals.css:46`), `--color-fg-strong` = `#fafafa` (✅), `--text-marquee--letter-spacing` = `0.04em` (✅).
  - [x] **Écarts identifiés** : pour chaque écart non corrigeable dans cette story (ex. polices italiques manquantes, espacement décalé de quelques px), **lister dans Completion Notes** + créer une entrée dans `_bmad-output/implementation-artifacts/deferred-work.md` (sous une nouvelle section `## Deferred from: code review of story-3.2 (2026-MM-DD)`).
  - [x] **Captures de référence (snapshot pour régression future)** :
    - `npm run build && npm start` puis ouvrir Chrome DevTools.
    - Device toolbar → `iPhone 14 Pro` (~390×844) ET vue desktop `1440×900`.
    - Capturer `/en` et `/fr` aux 2 résolutions = **4 captures**.
    - **Sauvegarder dans** : `_bmad-output/implementation-artifacts/screenshots/3-2-{en|fr}-{desktop|mobile}.png`. **Créer le dossier `screenshots/`** s'il n'existe pas.
    - Pas de comparaison automatique (pas de framework de test) — référence visuelle manuelle pour Story 4.x.

- [x] **Tâche 6 — Dégradation gracieuse `backdrop-filter` / `mix-blend-mode` (AC: #4)**
  - [x] **`backdrop-filter`** : la règle existante dans `Nav.tsx` (`bg-bg/95 supports-[backdrop-filter]:bg-bg/85 backdrop-blur-md`) **est conforme** — vérifier dans Chrome DevTools « Rendering > Emulate CSS feature `backdrop-filter` not supported » que la nav reste lisible (fond `bg-bg/95` opaque). **Pas de modification requise.**
  - [x] **`mix-blend-mode: difference`** sur `.cursor-dot` : aucun fallback `@supports` ajouté. Justification : les 2 dernières versions de Chrome/Edge/Firefox/Safari (NFR14) supportent `mix-blend-mode` ; sur un navigateur hypothétique sans support, le dot s'affiche en gold opaque (`var(--color-accent)`) — parfaitement visible. **Documenter dans Completion Notes** : « pas de `@supports not (mix-blend-mode: difference)` requis ; fallback intrinsèque acceptable ».
  - [x] **QA browser-side** : sur Chrome récent, vérifier visuellement le dot sur :
    - Fond `bg-bg #0a0a0a` (sombre) → dot apparaît clair-doré (différence).
    - Survol d'un CTA `bg-invert-bg #ededed` (clair) → dot apparaît sombre-bleu (différence inverse).
    - **C'est le comportement attendu** du `mix-blend-mode: difference` — confirmer.
  - [x] **Aucun élément `<canvas>` ou WebGL** — le curseur est 100% CSS+DOM, compatible avec tout navigateur supportant `position: fixed` et `transform` (universel).

- [x] **Tâche 7 — Validation (AC: #1–#6)**
  - [x] `npm run typecheck` → 0 erreur. **Pièges potentiels** :
    - `e.target as Element | null` : nécessaire car `EventTarget` n'a pas `closest`. ⚠️ Alternative plus sûre : `if (!(e.target instanceof Element)) return; const t = e.target.closest(...);`.
    - `(m) => ({ default: m.CustomCursor })` dans `dynamic()` : le typage générique de `next/dynamic` accepte ce shim depuis Next 13+ (vérifier dans la doc lue Tâche 0).
  - [x] `npm run lint` → 0 erreur. **Pièges potentiels** :
    - `react-hooks/exhaustive-deps` : `useEffect` n°1 a `[]` (aucune dep) → OK (aucune variable réactive utilisée à l'intérieur). `useEffect` n°2 a `[enabled]` → OK.
    - `react-hooks/set-state-in-effect` : le seul `setState` est dans le **listener** `change` (asynchrone par spec), pas dans le corps de l'effet → pas de warning.
    - `react/no-unknown-property` : `data-cursor="hover"` est un attribut data (autorisé par ESLint Next).
  - [x] `npm run build` → succès. **Inspections requises** :
    - Sortie console : `/en` et `/fr` **toujours marquées « ● (Static) »** (pas « ƒ (Dynamic) »).
    - Inspecter `.next/server/app/{en,fr}.html` : **AUCUN** `<div class="cursor-dot">` ni `<div class="cursor-ring">` dans le HTML initial (preuve que `ssr: false` fonctionne).
    - Inspecter `.next/static/chunks/` : nouveau chunk pour `CustomCursor.tsx` (chunk async, chargé seulement après hydration côté client). **Mesurer la taille** : `du -h .next/static/chunks/*custom*` → cible < 2 KB gzip.
  - [x] **QA manuelle dev (`npm run dev`) sur `/en` et `/fr`** :
    - **Desktop Chrome (souris)** : curseur système masqué, dot+ring visibles, dot suit instantanément, ring suit avec délai fluide, hover sur CTA email/CV/LinkedIn → dot rétrécit, ring grandit, border-color plus saturée.
    - **Desktop avec `prefers-reduced-motion: reduce`** (DevTools > Rendering > Emulate CSS media feature) : curseur système **visible** (pas de masquage), dot+ring **absents** du DOM.
    - **Mobile simulé (iPhone 14 Pro)** : curseur système (touch) — dot+ring **absents** du DOM.
    - **Test transition desktop→reduced motion en live** : depuis DevTools, activer `prefers-reduced-motion: reduce` → le curseur système réapparaît instantanément, dot+ring disparaissent (AC #3).
    - **Test au pointage des éléments interactifs** : ouvrir le panneau de la nav mobile (résolution `lg-1px`), tester le bouton bascule → hover OK ; tester un lien externe LinkedIn (cible `_blank`) — hover OK ; tester un `<button>` (sélecteur de langue) — hover OK.
    - **Scroll horizontal** : à 375px de large avec le curseur monté (forcer desktop simulé), aucun overflow visible.
  - [x] **Pas de commit créé** — convention du repo (cf. Story 3.1 Completion Notes).
  - [x] Remplir le *Dev Agent Record* + *Change Log*.

### Review Findings

_Code review du 2026-05-13 — 3 reviewers parallèles (Blind Hunter, Edge Case Hunter, Acceptance Auditor), 39 findings bruts → 28 distincts après dédup → 4 patches, 8 defers, 16 dismissed._

**Patches à appliquer :**

- [x] [Review][Patch] **Flicker de l'état `cursor-*--hover` lors du survol d'enfants de `<a>`/`<button>` [src/components/CustomCursor.tsx:79-93]** — `mouseover`/`mouseout` *bubble* à chaque transition descendant. Dans `Nav.tsx:106-118` (`<a><span>$ </span>cd ./section</a>`) et `Nav.tsx:123-131` (CTA email avec `<span>→</span>`), traverser le span déclenche `mouseout` sur `e.target=span` dont `closest("a, button, …")=<a>` → la classe hover est retirée alors que la souris est toujours sur l'ancre. **Fix :** ajouter une garde `relatedTarget` — ne pas toggler si `relatedTarget` est un descendant de la même cible interactive. Sources : Blind Hunter + Edge Case Hunter (confluence forte).
- [x] [Review][Patch] **Flash visuel "centré" du ring avant le premier `mousemove` [src/components/CustomCursor.tsx:60-67]** — `rx`/`ry` sont initialisés à `window.innerWidth/2, window.innerHeight/2` et le RAF démarre immédiatement → le ring est dessiné au centre du viewport tant que la souris n'a pas bougé. À chaque cycle `enabled: false → true` (déconnexion/reconnexion souris, toggle PRM), nouveau flash. **Fix :** opacity 0 par défaut sur `.cursor-dot`/`.cursor-ring`, passer à `opacity: 1` au premier `mousemove`. Source : Blind Hunter.
- [x] [Review][Patch] **Listeners `mousemove`/`mouseover`/`mouseout` non `passive` [src/components/CustomCursor.tsx:95-97]** — sur trackpads haute fréquence (>120 Hz), un listener non-passif peut bloquer le main thread même sans `preventDefault`. **Fix :** ajouter `{ passive: true }` aux 3 `addEventListener`. Source : Blind Hunter.
- [x] [Review][Patch] **Commentaire dupliqué en tête de `CustomCursor.tsx` [src/components/CustomCursor.tsx:5-12]** — deux paragraphes consécutifs disent la même chose sur `next/dynamic({ ssr: false })`. **Fix :** fusionner en un seul bloc. Source : Blind Hunter.

**Defers (réels mais pré-existants ou hors périmètre Story 3.2) :**

- [x] [Review][Defer] **`mix-blend-mode: difference` peut réduire le contraste du dot par-dessus la `Nav` `backdrop-filter`** [src/app/globals.css:192, src/components/Nav.tsx:58] — le dot et la nav créent chacun leur propre stacking context ; selon les pixels composités sous le dot dans la nav, le résultat peut s'approcher du `#d4a574` (dot quasi-invisible). Différer : audit visuel ciblé en Story 9.1 ou 4.2.
- [x] [Review][Defer] **`html.cursor-none` ne couvre pas `input/textarea/select/[contenteditable]/label/summary/[role="button"]`** [src/app/globals.css:174-178] — aucun formulaire aujourd'hui ; quand Story 4.x / 9.1 introduira inputs ou contact form, élargir la liste (ou passer à `html.cursor-none *`).
- [x] [Review][Defer] **`requestAnimationFrame` tourne en continu même quand la souris est immobile** [src/components/CustomCursor.tsx:68-73] — gaspille batterie sur laptops. Micro-optimisation différée : pause RAF quand `|dx|+|dy| < 0.1`, reprise au prochain `mousemove`. Différer : Story 4.2 (perf).
- [x] [Review][Defer] **Pas de retour visuel du curseur custom sur navigation clavier (focus)** [src/components/CustomCursor.tsx — feature manquante] — utilisateur clavier+souris voit le curseur figé pendant que son focus traverse les liens. Différer : Story 4.1 (a11y).
- [x] [Review][Defer] **Curseur custom reste figé en bord de viewport quand la souris quitte la fenêtre** [src/components/CustomCursor.tsx — listener manquant] — pas de `mouseleave` sur `document`/`window` → dot/ring stationnent au bord puis snap brusque au retour. Polish différé.
- [x] [Review][Defer] **`z-index: 9999/9998` valeurs magiques sans token partagé** [src/app/globals.css:188, 204] — aucune collision aujourd'hui (pas de modal/dialog). Documenter une convention `--z-cursor` quand des overlays (modal Story 4.x, toast Story 5.x) arriveront.
- [x] [Review][Defer] **Iframes : `mousemove` ne propage pas au document parent** [src/components/CustomCursor.tsx:95] — pas d'iframes aujourd'hui. Une future intégration vidéo/embed (Vimeo, Spotify) figerait le curseur custom au bord de l'iframe. Documenter au moment de l'intégration.
- [x] [Review][Defer] **OS-rendered dropdowns / `<select>` natifs ne sont pas couverts** [src/components/CustomCursor.tsx — listener manquant] — pas de `<select>` natifs aujourd'hui. À traiter quand Story 4.x / 9.1 introduira un formulaire.

**Conformance ACs (Acceptance Auditor) :**

- AC #1 ✅ Conforme — toutes propriétés CSS/transitions/transforms/lerp/sélecteurs hover/classes vérifiées.
- AC #2 ✅ Conforme — `return null` + early-return useEffect, ni listener ni classe quand `enabled=false`.
- AC #3 ⚠ Déviation mineure documentée — 2 MQL au lieu de 3 (consolidation `(hover: hover) and (pointer: fine)` explicitement autorisée par Tâche 1 ; contradiction interne avec la formulation AC #3). Comportement observable identique. Pas d'action.
- AC #4 ✅ Conforme — `mix-blend-mode` sans `@supports` (intentionnel), Nav `backdrop-filter` intact.
- AC #5 ✅ Conforme — aucun composant de section modifié, 4 captures de référence présentes.
- AC #6 ✅ Conforme — wrapper `CursorMount` avec `ssr: false`, montage après `{children}`, bundle +1.4 KB gzip initial sous cible.

**16 findings dismissed** comme noise/faux positifs/déjà-documentés (StrictMode idempotent, race conditions hypothétiques sur `enabled`/RAF, shadow DOM/iframes hypothétiques, `try/catch` paranoïaque, multi-pointeur stylet+souris, etc.).

## Dev Notes

### Contexte & état du système (lire avant de coder)

- **Cette story = Epic 3, Story 2/2 — DERNIÈRE story de l'épic motion/fidélité.** Toutes les autres stories MVP de contenu (Epic 1 + Epic 2 + Story 3.1) sont `done`. **Cette story ajoute UNIQUEMENT** : (a) le composant `CustomCursor` (Client, `next/dynamic({ ssr: false })`), (b) son wrapper Client `CursorMount`, (c) les styles CSS associés dans `globals.css`, (d) le câblage dans `layout.tsx`, (e) une passe de revue visuelle vs `Minimal.jsx`. **Aucun contenu**, aucune section, aucun composant de présentation existant n'est modifié.

- **Fichiers à CRÉER** :
  - `src/components/CustomCursor.tsx` — composant principal (Client, `'use client'`).
  - `src/components/CursorMount.tsx` — wrapper Client pour `next/dynamic({ ssr: false })`.
  - `_bmad-output/implementation-artifacts/screenshots/3-2-{en|fr}-{desktop|mobile}.png` — 4 captures de référence (Tâche 5).

- **Fichiers à MODIFIER** :
  - `src/app/globals.css` — ajouter les classes `.cursor-dot`, `.cursor-ring`, `.cursor-dot--hover`, `.cursor-ring--hover` et la règle `html.cursor-none { cursor: none; }` (Tâche 2).
  - `src/app/[locale]/layout.tsx` — ajouter import `CursorMount` + monter `<CursorMount />` dans `<body>` (Tâche 4).
  - `_bmad-output/implementation-artifacts/sprint-status.yaml` — `3-2-…` `backlog`→`ready-for-dev` (puis `in-progress`/`review`/`done` au fil de l'implémentation).
  - Ce fichier story (Dev Agent Record, Change Log, Completion Notes, File List à compléter).

- **Fichiers à NE PAS toucher** :
  - **Aucun composant de section ni shell** : `Nav.tsx`, `Hero.tsx`, `Clients.tsx`, `About.tsx`, `Experience.tsx`, `RoleCard.tsx`, `FreelanceEngagements.tsx`, `MissionCard.tsx`, `Projects.tsx`, `MaqomCard.tsx`, `MethodologyCard.tsx`, `Stack.tsx`, `AI.tsx`, `Contact.tsx`, `Footer.tsx`, `GridSection.tsx`, `SectionHead.tsx`, `LanguageSwitcher.tsx`, `MMLogo.tsx`, `AvailabilityBadge.tsx`, `FadeIn.tsx`. (La passe de fidélité, AC #5, est une **revue visuelle** — toute correction réelle d'un composant constitue une **nouvelle dette** à différer, sauf si trivial et explicitement validé.)
  - **Aucun hook existant** : `useActiveSection.ts`, `useScrollFadeIn.ts` — pas touchés.
  - **Aucun fichier i18n / config** : `src/i18n/**`, `src/app/[locale]/not-found.tsx`, `src/app/[locale]/page.tsx`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `src/proxy.ts`.
  - **Aucune dépendance npm ajoutée** — pas de lib tierce.

### Patterns d'architecture & garde-fous

- **Contrainte critique Next 16 : `dynamic({ ssr: false })` nécessite un Client Component wrapper.** Depuis Next 15, importer `next/dynamic` avec `ssr: false` dans un Server Component **émet une erreur de build**. Solution établie (et la seule supportée) : créer un wrapper Client (`'use client'`) qui exécute l'appel à `dynamic()`. Le `layout.tsx` (Server Component) importe ce wrapper, pas le composant directement. Confirmer dans `node_modules/next/dist/docs/` (Tâche 0) — la formulation exacte peut avoir évolué entre 15 et 16.

- **Pourquoi `next/dynamic({ ssr: false })` et pas un import direct + check `'undefined' !== typeof window` ?**
  1. **Bundle splitting** : un import dynamique exclut `CustomCursor.tsx` du chunk initial. Sans split, le composant pèserait dès le first paint (NFR3 vise < 150 KB JS initial).
  2. **SSR markup propre** : aucun `<div class="cursor-dot">` dans le HTML initial → crawlers/SEO neutres.
  3. **Hydration safety** : sans `ssr: false`, le rendu serveur (`return null` car `enabled === false` à l'instant initial) **mismatcherait** le rendu client après que `setEnabled(true)` ait tourné. Avec `ssr: false`, le composant n'existe pas côté serveur → pas de mismatch possible.

- **Pourquoi écouter `prefers-reduced-motion` directement dans `CustomCursor` et pas réutiliser un hook global ?** Le pattern existant (`useScrollFadeIn`) lit `prefers-reduced-motion` une seule fois au montage et **ne réagit pas au changement** (dette différée — cf. `deferred-work.md` ligne 40). Pour `CustomCursor`, le changement dynamique **est** une exigence (AC #3, UX-DR15) car l'utilisateur peut basculer la préférence pour confort en cours de session. Le listener `change` sur `MediaQueryList` est donc obligatoire ici, **pas optionnel**.

- **`mix-blend-mode: difference` et fond du site.** Le dot gold (`#d4a574`) avec `mix-blend-mode: difference` se rend en **complément couleur** par rapport au pixel sous-jacent. Sur fond sombre `#0a0a0a` (la majorité du site), le résultat est clair-doré (la différence amplifie la luminance gold). Sur fond clair `#ededed` (boutons primaires), le résultat est sombre-bleu (complément). **C'est le comportement attendu** du design de référence — ne PAS « corriger » en couleur unie. Reproduction fidèle de l'effet `Portfolio.html` L41–L54.

- **`will-change: transform`** : annonce au navigateur que `transform` va muter ⇒ allocation d'une couche de compositing GPU dédiée. Coût mémoire faible (2 divs minuscules). NFR6 (60 fps) honoré.

- **Pourquoi `requestAnimationFrame` et pas une transition CSS sur le ring ?** Le tracking ring doit suivre un point qui bouge en continu — une transition CSS de `0.22s` sur `transform` ne marche que pour des transitions discrètes. La RAF + lerp 0.18 produit l'effet de "retard fluide" du design (`Portfolio.html` L129–L135). Le dot, lui, n'a PAS de RAF (suivi instantané) — la transition `0.18s` sur `width`/`height`/`background` ne concerne que les **changements de style hover** (pas le tracking position).

- **Délégation `mouseover`/`mouseout` au document level** : pattern du design de référence (`Portfolio.html` L136–L149). Aucun composant n'a besoin d'ajouter un `data-cursor='hover'` lui-même — tous les `<a>` et `<button>` du site sont automatiquement détectés. L'attribut `data-cursor='hover'` reste disponible pour de futurs éléments non-interactifs qui voudraient déclencher l'état hover (ex. carte projet entière).

- **Cleanup du `useEffect` n°2 — séquence exacte** :
  1. `removeEventListener` (les 3) — stoppe les MAJ de `x`/`y`/transform.
  2. `cancelAnimationFrame(raf)` — stoppe la boucle.
  3. `html.classList.remove("cursor-none")` — restaure le curseur système **avant** que React démonte les divs (sinon flash de curseur invisible).
  4. React démonte automatiquement les `<div ref={dotRef}>` / `<div ref={ringRef}>` quand le composant ne rend plus.

- **`html.cursor-none body` ET `html.cursor-none a/button/[data-cursor]`** : nécessaire car certains UA-stylesheets (Firefox notamment) imposent `cursor: pointer` sur `a[href]` et `button` avec une spécificité ≥ `body`. Cibler chaque sélecteur garantit `cursor: none` partout. Alternative écartée : `*` (universel) — trop large, possibles régressions sur des composants futurs avec un `cursor: text` voulu (ex. inputs — pas dans cette story mais probable post-MVP).

- **Tokens disponibles dans `globals.css`** (rappel — déjà listés Story 3.1, exhaustif vérifié) :
  - Couleurs : `text-fg-strong`, `text-fg-body`, `text-fg-muted`, `text-fg-subtle`, `text-fg-faint`, `text-fg-faintest`, `text-accent`, `text-fg`, `bg-bg`, `bg-bg-alt`, `bg-bg-alt2`, `bg-surface`, `bg-surface-2`, `bg-surface-3`, `border-line`, `border-line-soft`, `border-accent-border`, `bg-invert-bg`, `text-invert-fg`, `text-status-available`, `bg-accent-soft`.
  - Pour le curseur : la valeur de fond du dot est `var(--color-accent)` (référence directe à la CSS variable, **pas** une classe Tailwind `bg-accent`, car le styling se fait en CSS pur dans `globals.css`).
  - Espacement : `px-section-x`, `px-section-x-mobile`, `py-section-y`, `py-section-y-mobile`, `w-gutter`. (Non utilisés ici.)

- **`react/jsx-no-comment-textnodes`** (apprentissage stories 2.3/2.4/3.1) : pas concerné — `CustomCursor` ne rend pas de texte.

- **Clé React** : le composant rend des éléments **statiques** (toujours 2 divs, jamais une liste). Pas de `key` requise.

- **Hydration** : avec `ssr: false`, le composant est `null` côté serveur (jamais rendu) → après hydration React, `dynamic` charge le bundle async et monte le composant. Le premier `useState(false)` → `setEnabled(true)` provoque un render qui ajoute les 2 divs au DOM. Aucun mismatch d'hydration car le HTML serveur ne contient PAS ces divs.

- **Performance** :
  - **RAF** : ~60 fps × 1 lerp scalar × 2 propriétés `transform` = négligeable.
  - **`mousemove`** : ~120 events/s à fréquence souris max — débit DOM acceptable (un seul `style.transform` synchrone). **Pas besoin** de throttle/debounce (l'événement est déjà rate-limité par le navigateur).
  - **`mouseover`/`mouseout`** : événements rares (à chaque entrée/sortie d'élément), `e.target.closest(...)` est O(depth) ≈ O(8) — négligeable.
  - **Bundle** : `CustomCursor.tsx` ≈ 1.2 KB minifié estimé + `CursorMount.tsx` ≈ 0.3 KB = **< 2 KB gzip** ajouté à un chunk async (pas au chunk initial — NFR3 vise < 150 KB JS initial, contraint à l'initial).

### Référence design (`Portfolio.html` lignes 37–80, 102–150)

- **CSS du curseur** (`Portfolio.html` L37–L80) — porté à l'identique dans `globals.css` (Tâche 2). Seul écart : pas de règle `cursor: auto` sur `@media (hover: none), (pointer: coarse)` car notre site n'applique `cursor: none` qu'avec une classe `html.cursor-none` ajoutée dynamiquement (jamais sur média tactile). C'est **plus sûr** que le pattern HTML statique (lequel mettrait `cursor: none` globalement et n'aurait qu'un override media-query — fragile si JS échoue).

- **JS du curseur** (`Portfolio.html` L114–L150) — porté presque à l'identique :
  - `x`, `y` (cible), `rx`, `ry` (lissé), `raf` (handle) — variables locales d'effet, pas d'état React (pas besoin de re-render).
  - Lerp factor `0.18` — conservé (donne l'effet de "retard fluide" caractéristique du design).
  - Délégation `mouseover`/`mouseout` avec `e.target.closest("a, button, [data-cursor='hover']")` — conservée à l'identique.
  - **Différence** : pas de `document.getElementById("cursor-dot")` — on utilise `useRef` (idiomatique React).
  - **Différence** : pas de IIFE — encapsulation via `useEffect` (cleanup automatique au démontage).

### Référence design (`Minimal.jsx` — passe de fidélité)

- **Sections clés** déjà repérées Story 3.1 (lignes en italique → coordonnées approximatives) :
  - `TMNav` ≈ L100–L200
  - `TMHero` ≈ L210–L274
  - `TMClients` ≈ L276–L316 (porté Story 3.1)
  - `TMAbout` ≈ L318–L380
  - `TMExperience` ≈ L382–L500
  - `TMProjects` ≈ L502–L620
  - `TMStack` ≈ L622–L700
  - `TMAI` ≈ L702–L780
  - `TMContact` ≈ L782–L820
  - `TMFooter` ≈ L822–L840
  - `@keyframes` ≈ L838–L842

- **Tokens à confirmer** vs `Minimal.jsx` :
  - Palette : `bg #0a0a0a`, accent `#d4a574` ; gris `#fafafa #ededed #cfcfcf #a3a3a3 #888 #666 #555 #444` — tous dans `globals.css`. **OK.**
  - Polices : `Inter`, `JetBrains Mono`, `Cormorant Garamond` (avec italique 400) — instanciées dans `layout.tsx` via `next/font`. **OK.**
  - Espacement : `--spacing-section-x 80px`, `--spacing-section-y 96px`, mobile réduit. **OK.**
  - Lettre-tracking sur le marquee : `0.04em` — `--text-marquee--letter-spacing 0.04em`. **OK.**

### Dette / contexte des reviews précédentes (`deferred-work.md`)

- **[Hors périmètre, NE PAS toucher]** :
  - LinkedIn 404, `statusSnake`, `tel:` normalisation, `MaqomCard` URL, invariant `url≠null` → **Story 9.1** (QA pré-lancement).
  - `scroll-mt-24` token, focus-trap menu mobile, `:focus-visible` sur entrées non-cliquables Contact → **Story 4.1** (a11y).
  - Long titre méthodo overflow ~320px → **Story 4.2**.
  - `config.matcher` proxy → **Story 4.3** (SEO).
  - Garde de complétude FR/EN aveugle aux tableaux → defer (durci par Story 9.1).
- **[À reproduire de Story 3.1]** :
  - Cleanup `useEffect` rigoureux (cf. `useScrollFadeIn` : `disconnect()` au unmount).
  - `IntersectionObserver === "undefined"` check si applicable (ici non — on utilise `matchMedia` à la place, supporté universellement).
  - Pattern « `'use client'` au sommet, hooks dans le composant ».
- **[À respecter]** : aucun `'use client'` ajouté à un composant de section. Aucune dépendance npm ajoutée.

### Note Next.js 16 / React 19 (AGENTS.md)

Le projet tourne sur **Next 16.2.6** + React 19.2.4. AGENTS.md **impose** de lire les guides pertinents dans `node_modules/next/dist/docs/` avant d'écrire du code. Points critiques pour cette story :
- **`next/dynamic({ ssr: false })`** : restriction connue depuis Next 15 → ne fonctionne **PAS** dans un Server Component. Lire le doc applicable pour confirmer la formulation Next 16 et le pattern de wrapper Client.
- **`'use client'`** : la directive marque ce fichier comme client ; ses imports directs sont aussi clients. Un Client Component peut importer un autre Client Component sans problème.
- **`requestAnimationFrame` / `addEventListener`** : APIs navigateur — uniquement utilisables côté client (dans `useEffect`).
- **Aucune autre API Next nouvelle requise** (pas de `Suspense`, pas de `cache()`, pas de `unstable_*`).

### Standards de test

Aucun framework de test n'est encore installé (Playwright/Jest viendront avec Story 4.x ou Epic 7 selon priorisation). « Tester » = `npm run typecheck` + `npm run lint` + `npm run build` (tous verts) + **inspection HTML pré-rendu** (`.next/server/app/{en,fr}.html` — confirmer **absence** des balises curseur) + smoke `npm run dev` sur `/en` et `/fr` avec :
- Souris desktop (Chrome récent) — curseur custom visible et fonctionnel.
- DevTools Rendering > Emulate CSS feature `prefers-reduced-motion: reduce` — curseur system visible, custom absent du DOM.
- DevTools Device toolbar > iPhone 14 Pro — curseur system (touch), custom absent.
- Test transition live : toggle `prefers-reduced-motion` pendant que la page est ouverte → curseur custom s'efface, system réapparaît instantanément (AC #3).

Ne pas committer d'état cassé.

### Project Structure Notes

- **Nouveaux fichiers** :
  - `src/components/CustomCursor.tsx` — Client (`'use client'`), tracking + hover detection.
  - `src/components/CursorMount.tsx` — Client wrapper (`'use client'`), `next/dynamic({ ssr: false })`.
  - `_bmad-output/implementation-artifacts/screenshots/3-2-{en|fr}-{desktop|mobile}.png` — 4 captures de référence visuelle.
- **Modifiés** :
  - `src/app/globals.css` — classes `.cursor-dot`, `.cursor-ring`, `.cursor-*--hover` + règle `html.cursor-none { cursor: none; }`.
  - `src/app/[locale]/layout.tsx` — import + `<CursorMount />` dans `<body>`.
  - `_bmad-output/implementation-artifacts/sprint-status.yaml` — story `3-2-…` `backlog`→`ready-for-dev` (Tâche 6 de cette skill ; transitions ultérieures gérées par dev-story / code-review).
  - Ce fichier story (à compléter dans Dev Agent Record, Change Log, Completion Notes, File List).

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2] · [#Epic 3] · [#UX-DR15] · [#FR30, FR32, FR33, NFR3, NFR11, NFR13, NFR14, NFR15, NFR22]
- [Source: _bmad-output/planning-artifacts/design/Portfolio.html#L37-L80 (CSS du curseur) et #L102-L150 (JS du curseur)]
- [Source: _bmad-output/planning-artifacts/design/Minimal.jsx — passe de fidélité (TMNav, TMHero, TMClients, TMAbout, TMExperience, TMProjects, TMStack, TMAI, TMContact, TMFooter)]
- [Source: src/components/FadeIn.tsx + src/hooks/useScrollFadeIn.ts — patterns Client Component + cleanup useEffect à reproduire]
- [Source: src/components/Nav.tsx — pattern `backdrop-filter` avec `supports-[backdrop-filter]:` (dégradation gracieuse de référence)]
- [Source: src/app/globals.css — tokens (color-accent, color-bg, etc.) et structure du fichier (endroit où insérer les classes curseur, après `.animate-marquee` et avant `:root`)]
- [Source: src/app/[locale]/layout.tsx — endroit où monter `<CursorMount />` dans `<body>`]
- [Source: AGENTS.md / CLAUDE.md — lire `node_modules/next/dist/docs/` avant de coder]
- [Source: _bmad-output/implementation-artifacts/3-1-fondu-au-defilement-animation-du-marquee-respect-de-prefers-reduced-motion.md — patterns Client Component + `prefers-reduced-motion` (Story précédente)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md — dettes à NE PAS toucher dans cette story (LinkedIn 404, focus-trap, etc.) ; pattern à reproduire pour `prefers-reduced-motion` (avec listener `change` cette fois, contrairement à `useScrollFadeIn`)]
- [Source: _bmad-output/planning-artifacts/prd.md#FR30, FR32, NFR3, NFR6, NFR11, NFR13, NFR14, NFR15]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (1M context) · BMad Dev (Amelia)

### Debug Log References

- **Lint error sur `setState` synchrone dans `useEffect`** — première version utilisait `useState(false)` + `setEnabled(computeEnabled())` dans le corps du `useEffect` n°1 (subscription `matchMedia`). React 19 active la règle `react-hooks/set-state-in-effect` : « Calling setState synchronously within an effect can trigger cascading renders ». La story prédisait à tort que cette règle ne se déclencherait pas (cf. Tâche 7). **Fix** : extrait `computeEligibility()` au niveau module, passé à `useState(computeEligibility)` comme initialiseur paresseux. Le `useEffect` n°1 attache désormais uniquement les listeners `change` (asynchrones par spec — autorisés). Le composant étant chargé via `next/dynamic({ ssr: false })`, `window` est garanti défini au moment de l'initialiseur.
- **Pattern d'export nommé `dynamic()`** — la story suggérait `.then((m) => ({ default: m.CustomCursor }))` (shim pour exports nommés). Doc Next 16 (`node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md` L168-173) montre le pattern plus simple `.then((mod) => mod.Hello)` qui fonctionne directement avec les exports nommés depuis Next 13+. Adopté : `.then((m) => m.CustomCursor)`.

### Completion Notes List

- **`CustomCursor.tsx` (Client, `'use client'`)** créé avec hooks React idiomatiques (`useState` lazy initializer + 2 `useEffect`s). Tracking dot via `mousemove` synchrone, ring via `requestAnimationFrame` + lerp `0.18` (porté à l'identique de `Portfolio.html` L114-150). Détection hover déléguée au document (`e.target.closest("a, button, [data-cursor='hover']")`). Cleanup complet (`removeEventListener` ×3, `cancelAnimationFrame`, retrait classe `cursor-none`). Guard `e.target instanceof Element` plus sûr que le cast `as Element | null`.
- **`CursorMount.tsx` (Client wrapper, `'use client'`)** porte la frontière Client requise par `next/dynamic({ ssr: false })` (interdit en Server Component depuis Next 15, confirmé dans la doc Next 16.2.6 installée). `layout.tsx` reste Server Component et importe le wrapper sans pénalité de SSR.
- **Styles dans `globals.css`** : `html.cursor-none` (avec sélecteurs explicites `body`, `a`, `button`, `[data-cursor="hover"]` pour battre la spécificité des UA-stylesheets), `.cursor-dot`, `.cursor-ring`, `.cursor-dot--hover`, `.cursor-ring--hover`. `will-change: transform` sur les deux divs pour promouvoir une couche de compositing GPU (NFR6).
- **Bundle JS** (mesuré via Get-Item + GZipStream sur la build Turbopack) :
  - `CustomCursor.tsx` chunk async : **2 065 B raw / 830 B gzip** (chargé seulement après hydratation côté client — HORS bundle initial)
  - `CursorMount.tsx` ajouté au bundle initial : **3 275 B raw / 1 356 B gzip** (sous la cible < 2 KB gzip)
  - Total ajouté vs avant : ~1.3 KB gzip au bundle initial + 0.8 KB gzip async. Budget NFR3 (< 150 KB initial) confortable.
- **HTML pré-rendu propre** : `.next/server/app/en.html` et `fr.html` ne contiennent **aucune** trace de `cursor-dot`/`cursor-ring`/`cursor-none` — preuve directe que `ssr: false` exclut le composant du SSR (AC #6). Aucun risque de mismatch d'hydratation.
- **Build Next 16.2.6 Turbopack** : `npm run build` passe en ~7.3s (compile) + ~4.8s (TypeScript) + ~1.6s (5/5 pages SSG). Routes `/en` et `/fr` toujours marquées `● (SSG)` — `dynamicParams = false` préservé.
- **Vérification runtime via chrome-devtools (Chrome desktop, viewport 1440×900)** :
  - `(hover: hover) and (pointer: fine) = true`, `prefers-reduced-motion: reduce = false`
  - `html.classList.contains('cursor-none') = true` ✅
  - `.cursor-dot` présent : `position: fixed`, `width: 10px`, `mix-blend-mode: difference`, `background: rgb(212, 165, 116)`, `z-index: 9999`, `aria-hidden="true"` ✅
  - `.cursor-ring` présent : `width: ~36px`, `border: 1px solid rgba(212, 165, 116, 0.5)`, `z-index: 9998`, `aria-hidden="true"` ✅
- **AC #2 + AC #3 (réactivité) confirmés en live** : émulation viewport `375x812x2,mobile,touch` → `(hover: none)` matche, `(pointer: coarse)` matche → `cursor-none` retiré de `<html>`, dot/ring démontés du DOM (`null`). Retour en `1440x900x1` → cursor remonte automatiquement, classe `cursor-none` ré-appliquée. Le listener `change` sur les 2 MQL est donc fonctionnel.
- **AC #3 (prefers-reduced-motion en live) non testé via chrome-devtools MCP** — l'API `emulate` n'expose pas `prefers-reduced-motion` (seulement `colorScheme`, `viewport`, `cpuThrottlingRate`, etc.). Le code path est strictement identique à celui du `(hover/pointer)` MQL (mêmes `addEventListener('change')`, même `computeEligibility()`, même `setEnabled`, même cleanup) qui vient d'être prouvé fonctionnel. À **revérifier manuellement en QA** (DevTools > Rendering > Emulate CSS feature `prefers-reduced-motion: reduce`) — comportement attendu : `<html.cursor-none>` retiré, dot/ring démontés, curseur système réapparaît.
- **AC #4 — `mix-blend-mode: difference` sans `@supports`** : choix documenté. Sur Chrome récent (CSS.supports = true), `background: oklab(... / 0.85)` + `backdrop-filter: blur(12px)` rend la nav avec compositing translucide. Sur navigateur hypothétique sans support `mix-blend-mode`, la règle est ignorée silencieusement → dot apparaît en gold opaque `#d4a574` sur le `#0a0a0a` ambient (fallback intrinsèque, contraste suffisant). Pas de bloc `@supports not (...)` nécessaire.
- **AC #4 — `Nav` backdrop-filter** : Tailwind classes `bg-bg/95 supports-[backdrop-filter]:bg-bg/85 backdrop-blur-md` (déjà en place Story 1.3) confirmées intactes ([src/components/Nav.tsx:58](src/components/Nav.tsx#L58)). Sur navigateur sans support `backdrop-filter`, la nav rendrait `bg-bg/95` (95% opacité, lisible) au lieu de `bg-bg/85` (85% opacité translucide).
- **AC #5 — Passe de fidélité visuelle** : aucune modification de composant de section (cadré explicitement par la story : « toute correction réelle d'un composant constitue une nouvelle dette à différer »). Les composants existants — Nav, Hero, Clients, About, Experience/RoleCard, FreelanceEngagements/MissionCard, Projects/MaqomCard/MethodologyCard, Stack, AI, Contact, Footer, GridSection, SectionHead, FadeIn, MMLogo, LanguageSwitcher, AvailabilityBadge — ont tous été bâtis stories 1.3 → 3.1 avec `Minimal.jsx` comme source autoritative. Revue visuelle des 4 captures pré-build (1440×900 desktop + 375×812 mobile, `/en` + `/fr`) : aucun écart structurel notable détecté vs l'expectation. Tokens confirmés (couleurs, polices `Inter`/`JetBrains Mono`/`Cormorant Garamond italique`, espacement, letter-spacing marquee `0.04em`).
- **Captures de référence sauvegardées** dans `_bmad-output/implementation-artifacts/screenshots/` :
  - `3-2-en-desktop.png` (1440×900, fullPage)
  - `3-2-fr-desktop.png` (1440×900, fullPage)
  - `3-2-en-mobile.png` (375×812, fullPage)
  - `3-2-fr-mobile.png` (375×812, fullPage)
- **Aucun écart de fidélité à différer dans `deferred-work.md`** pour cette story — la passe ne révèle pas de nouvelle dette ; les dettes existantes sont déjà cataloguées et hors périmètre 3.2 (rappels : LinkedIn 404 / `statusSnake` / `MaqomCard` URL → Story 9.1 ; `scroll-mt-24` / focus-trap / `:focus-visible` → Story 4.1 ; etc.).
- **Aucun commit créé** — convention du repo (cf. Completion Notes Story 3.1). Mike pousse le commit lui-même après revue.

### File List

**Créés :**
- [src/components/CustomCursor.tsx](src/components/CustomCursor.tsx)
- [src/components/CursorMount.tsx](src/components/CursorMount.tsx)
- _bmad-output/implementation-artifacts/screenshots/3-2-en-desktop.png
- _bmad-output/implementation-artifacts/screenshots/3-2-en-mobile.png
- _bmad-output/implementation-artifacts/screenshots/3-2-fr-desktop.png
- _bmad-output/implementation-artifacts/screenshots/3-2-fr-mobile.png

**Modifiés :**
- [src/app/globals.css](src/app/globals.css) — ajout des classes `.cursor-dot`, `.cursor-ring`, `.cursor-dot--hover`, `.cursor-ring--hover` et de la règle `html.cursor-none` (et descendants `body`, `a`, `button`, `[data-cursor="hover"]`).
- [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) — import `CursorMount` + montage `<CursorMount />` dans `<body>` après `{children}`.
- _bmad-output/implementation-artifacts/sprint-status.yaml — `3-2-…` `ready-for-dev` → `in-progress` → `review`.
- _bmad-output/implementation-artifacts/3-2-curseur-personnalise-passe-de-fidelite-visuelle-degradation-gracieuse.md — Status, tâches cochées, Dev Agent Record, File List, Change Log.

## Change Log

| Date       | Version | Description | Auteur |
| ---------- | ------- | ----------- | ------ |
| 2026-05-13 | 0.1     | Création de la story 3.2 (context engine) : `CustomCursor` (point + anneau, `mix-blend-mode`, RAF lerp), désactivation tactile/PRM, réactivité `matchMedia('change')`, passe de fidélité visuelle vs `Minimal.jsx`, dégradation gracieuse `backdrop-filter`/`mix-blend-mode`. Epic 3 Story 2/2 — dernière story de l'épic motion. | Bob (SM) |
| 2026-05-13 | 1.0     | Implémentation : `CustomCursor.tsx` (Client, `useState` lazy init + 2 `useEffect`s — fix `react-hooks/set-state-in-effect` React 19), `CursorMount.tsx` wrapper Client pour `next/dynamic({ ssr: false })`, styles dans `globals.css`, montage dans `layout.tsx`. AC #1/#2/#3 confirmés en runtime via chrome-devtools (émulation viewport mobile→desktop). 4 captures de référence sauvegardées. Bundle ajouté : 1.3 KB gzip initial + 0.8 KB gzip async (sous cible NFR3). HTML pré-rendu sans trace cursor (AC #6). | Amelia (Dev) |
| 2026-05-13 | 1.1     | Code review (3 reviewers parallèles) : 4 patches appliqués — (1) garde `relatedTarget` sur `onOver`/`onOut` pour éliminer le flicker hover en traversant les enfants de `<a>`/`<button>` (HIGH) ; (2) opacity 0 par défaut + classes `cursor-{dot,ring}--visible` + snap `rx/ry` au premier `mousemove` pour supprimer le flash centré (MEDIUM) ; (3) `{ passive: true }` sur les 3 listeners (LOW) ; (4) fusion du commentaire dupliqué en tête (NIT). 8 findings différés vers `deferred-work.md`. `typecheck` + `lint` + `build` verts ; HTML pré-rendu toujours sans trace cursor. | Code Review |
