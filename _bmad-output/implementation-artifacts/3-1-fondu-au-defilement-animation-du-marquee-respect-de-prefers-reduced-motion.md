# Story 3.1: Fondu au défilement, animation du marquee & respect de `prefers-reduced-motion`

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a visitor,
I want content blocks to fade in as they enter the viewport and the client marquee to scroll, with all of this neutralized when I've requested reduced motion,
so that the page feels alive but never works against my accessibility needs.

## Acceptance Criteria

1. **Hook `useScrollFadeIn` (IntersectionObserver) — fondu d'entrée sans layout thrashing (FR31, NFR6, UX-DR16).** Étant donné le hook `useScrollFadeIn` (ou son composant wrapper `FadeIn`), quand un bloc de contenu entre dans le viewport au défilement, alors il passe de `opacity: 0; transform: translateY(16px)` (état initial) à `opacity: 1; transform: translateY(0)` via une transition CSS (`transition-[opacity,transform]`), **uniquement** via `opacity` et `transform` (aucun layout thrashing — pas de `width`/`height`/`top`/`left` animés), à ~60 fps, sans déclenchement de paint layout. La transition se produit une seule fois (l'observateur se désobserve après la première intersection). Les blocs déjà dans le viewport au chargement de la page (hero, marquee clients) NE sont PAS wrappés — le fondu concerne les sections **sous le fold** : About, Experience, Freelance Engagements, Side Projects, Stack, AI & Agentic Engineering, Contact.

2. **Animation du marquee clients — défilement horizontal CSS (FR7, FR32, NFR6, UX-DR6).** Étant donné le composant `Clients`, quand il est rendu, alors les wordmarks (Louis Vuitton, Dior, Messika, Tiffany & Co.) défilent horizontalement en boucle via `transform: translateX(…)` uniquement, grâce à un `@keyframes marquee-scroll` (`from { transform: translateX(0) } to { transform: translateX(-33.333%) }`). L'inner container duplique les items (×3) pour créer un loop seamless ; l'ensemble a `width: max-content` ; l'`overflow: hidden` de l'outer wrapper masque le contenu hors viewport. La vitesse est adaptée : ~20 s sur mobile (viewport étroit), ~32 s sur desktop (`sm:`) ; les glyphes séparateurs `·` restent entre chaque nom. La bande reste `aria-hidden` (les noms sont accessibles dans la section Experience). **`Clients` reste un Server Component** — aucun `'use client'` introduit.

3. **`prefers-reduced-motion: reduce` — neutralisation complète des animations (FR32, NFR6, NFR11).** Étant donné que `prefers-reduced-motion: reduce` est activé dans les préférences système, quand la page charge, alors :
   - Le marquee : l'animation est **figée ou fortement ralentie** (`animation-play-state: paused` sous la media query CSS `@media (prefers-reduced-motion: reduce)`) — les wordmarks s'affichent statiquement comme avant Epic 3, sans défilement.
   - Les fondus au défilement : le hook/composant `FadeIn` détecte `window.matchMedia('(prefers-reduced-motion: reduce)')` au montage et **affiche immédiatement** le contenu (pas de transition, l'élément commence à `opacity: 1; transform: none`) — aucune animation ne court.
   - Aucune autre animation n'est introduite par cette story.

4. **`FadeIn` comme wrapper Server-compatible — aucune régression SSG ni de JS bundle (NFR3, AR2).** Étant donné le composant `FadeIn` (`'use client'`), quand la page est rendue, alors les composants Server (`About`, `Experience`, `FreelanceEngagements`, `Projects`, `Stack`, `AI`, `Contact`) restent **rendus côté serveur** et passés comme `children` au `FadeIn` Client Component — aucun composant serveur n'est converti en client. `npm run build` confirme que `/en` et `/fr` restent pré-rendues en statique. Le bundle JS client de la home **augmente uniquement** du poids de `FadeIn.tsx` + `useScrollFadeIn.ts` (hooks légers, sans dépendance externe — ordre de grandeur : < 1 KB gzip ajouté). `Clients` reste Server Component (aucun `'use client'` — pure CSS animation).

5. **Zéro régression sur l'existant — typecheck, lint, build verts (NFR22).** Étant donné la totalité du site après cette story, quand `npm run build`, `npm run typecheck` et `npm run lint` tournent, alors ils passent sans erreur. Le rendu statique, les ancres de section, le scroll-spy `Nav`, le switch de langue, tous les CTAs (email, CV, LinkedIn), toutes les sections de contenu (Hero, Clients, About, Experience, Freelance, Projects, Stack, AI, Contact, Footer) restent fonctionnels et inchangés dans leur contenu. Aucun scroll horizontal parasite à ~375px. Aucun nouveau `'use client'` dans un composant de section (About, Experience, Freelance, Projects, Stack, AI, Contact).

## Tasks / Subtasks

- [x] **Tâche 0 — Pré-lecture obligatoire (AGENTS.md)**
  - [x] AGENTS.md impose de **lire les docs Next dans `node_modules/next/dist/docs/`** avant d'écrire du code. Pour cette story, lire :
    - `…/01-app/01-getting-started/05-server-and-client-components.md` — CRITIQUE : confirmer qu'un Server Component peut être passé comme `children` d'un Client Component ; c'est le cas (pattern « composition »), le confirmer dans les docs de ta version.
    - `…/01-app/02-guides/02-performance.md` (si disponible) — lazy-loading, `next/dynamic`.
  - [x] Vérifier dans `node_modules/next/dist/docs/` si des rubriques sur les hooks ou animations existent.
  - [x] Heed tout avis de dépréciation.

- [x] **Tâche 1 — `@keyframes` du marquee + `prefers-reduced-motion` dans `globals.css` (AC: #2, #3)**
  - [x] Dans `src/app/globals.css`, **après le bloc `@theme inline`**, ajouter :
    ```css
    @keyframes marquee-scroll {
      from { transform: translateX(0); }
      to   { transform: translateX(-33.333%); }
    }

    @media (prefers-reduced-motion: reduce) {
      .animate-marquee {
        animation-play-state: paused;
      }
    }
    ```
  - [x] La classe `.animate-marquee` (ou un utilitaire Tailwind équivalent) sera appliquée dans `Clients.tsx` (Tâche 2). Utiliser un nom de classe clair et sans collision (`animate-marquee` — pas un nom Tailwind existant).
  - [x] **Ne PAS modifier** les tokens existants ni le reste de `globals.css`.

- [x] **Tâche 2 — Refactorisation de `Clients.tsx` pour l'animation marquee (AC: #2, #3, #4)**
  - [x] Lire `src/components/Clients.tsx` en entier avant de modifier (état actuel : voir Dev Notes).
  - [x] **Dupliquer les items ×3** pour créer un loop seamless : `[...items, ...items, ...items]` (avec le schéma du design de référence `Minimal.jsx` ≈ L295 : `[...C2.clients, ...C2.clients, ...C2.clients]`, shift de `-33.333%` = 1/3 de la largeur totale). Chaque wordmark reçoit `key={i}` (index global parmi les 3×4 = 12 copies — stable, statique).
  - [x] **Inner container** (celui qui anime) : passer de `flex-wrap` à `width: max-content; display: flex; flex-shrink: 0; align-items: center; padding: 20px 0` + appliquer l'animation CSS :
    - Classe de base : `animate-marquee` (définie dans `globals.css` : `animation: marquee-scroll 20s linear infinite`)
    - Breakpoint desktop : `sm:animate-marquee-desktop` OU une propriété CSS custom `--marquee-duration: 20s` overridée à `32s` via un `@media sm` — **voir Dev Notes pour le choix recommandé**.
    - `flex-shrink: 0` sur l'inner div (`shrink-0`).
  - [x] **Outer wrapper** : `overflow-hidden` (déjà en place — préserver).
  - [x] **Séparateurs** : `·` entre chaque wordmark (comme actuellement, `aria-hidden="true"`), sauf après le dernier item du dernier groupe (ou à tous les items si on boucle visuellement — le design `Minimal.jsx` met `·` après **chaque** item sans exception pour fluidifier la boucle, cf. L309).
  - [x] **`Clients` reste Server Component** : **pas de `'use client'`**, l'animation est purement CSS ; aucun `useEffect`/`useState`/hook.
  - [x] Retirer la ligne de commentaire `// l'animation d'Epic 3 remplacera ce wrap par un défilement…` et la note `flex-wrap` ⇒ obsolètes après cette story.
  - [x] `npm run typecheck && npm run lint` verts après cette tâche.

- [x] **Tâche 3 — Hook `useScrollFadeIn` (AC: #1, #3)**
  - [x] Créer `src/hooks/useScrollFadeIn.ts` — **`'use client'`** (utilise `useEffect`/`useRef`/`useState`). Pattern calqué sur `useActiveSection.ts` (lire en entier pour s'aligner sur les conventions).
  - [x] Signature :
    ```ts
    "use client";
    import { useEffect, useRef, useState } from "react";

    export function useScrollFadeIn<T extends HTMLElement = HTMLDivElement>() {
      const ref = useRef<T>(null);
      const [visible, setVisible] = useState(false);

      useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect prefers-reduced-motion — affichage immédiat, aucune animation.
        if (typeof window !== "undefined" &&
            window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setVisible(true);
          return;
        }

        if (typeof IntersectionObserver === "undefined") {
          setVisible(true); // SSR-safe fallback
          return;
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setVisible(true);
              observer.unobserve(el);
            }
          },
          { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
      }, []);

      return { ref, visible };
    }
    ```
  - [x] **Fallback SSR** : `IntersectionObserver === "undefined"` → `setVisible(true)` (évite que le contenu reste invisible si l'IO n'existe pas dans le contexte d'exécution).
  - [x] **`react-hooks/exhaustive-deps`** : le `useEffect` n'a pas de dépendances variables — tableau vide `[]` est correct (l'observateur n'a pas besoin d'être recréé).

- [x] **Tâche 4 — Composant `FadeIn` wrapper Client (AC: #1, #3, #4)**
  - [x] Créer `src/components/FadeIn.tsx` — **`'use client'`** :
    ```tsx
    "use client";
    import type { ReactNode } from "react";
    import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

    type Props = {
      children: ReactNode;
      className?: string;
    };

    export function FadeIn({ children, className = "" }: Props) {
      const { ref, visible } = useScrollFadeIn<HTMLDivElement>();
      return (
        <div
          ref={ref}
          className={`transition-[opacity,transform] duration-700 ease-out ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          } ${className}`}
        >
          {children}
        </div>
      );
    }
    ```
  - [x] **`translate-y-4`** = `16px` — léger (UX-DR16 : pas de translation excessive ; `16px` est discret).
  - [x] **`duration-700`** = 700 ms — fluide sans être lent.
  - [x] **`ease-out`** — décélération naturelle à l'entrée dans le viewport.
  - [x] Le `className` prop permet au `page.tsx` d'ajouter des classes de marge si besoin — mais à ce stade, laisser simple.
  - [x] **Pas de duplication du `transition-[opacity,transform]`** dans `globals.css` — Tailwind gère la classe.
  - [x] ⚠️ **Hydration** : `visible` commence à `false` sur le serveur ET sur le premier rendu client (même état initial côté client — pas de mismatch hydration). La transition de `opacity-0` → `opacity-100` se produit **après** le montage du composant (dans `useEffect`), ce qui est imperceptible pour les sections sous le fold.

- [x] **Tâche 5 — Câblage de `FadeIn` dans `page.tsx` (AC: #1, #4, #5)**
  - [x] Lire `src/app/[locale]/page.tsx` en entier avant de modifier.
  - [x] Ajouter l'import : `import { FadeIn } from "@/components/FadeIn";`
  - [x] Dans le `.map(sectionList)`, wrapper le **corps de chaque section** (tout ce qui suit le `<SectionHead>`) avec `<FadeIn>` :
    - `about` → `<FadeIn><About body={sections.about.body} /></FadeIn>`
    - `experience` → `<FadeIn><Experience roles={sections.experience.roles} /></FadeIn>`
    - `freelance` → `<FadeIn><FreelanceEngagements missions={sections.freelance.missions} /></FadeIn>`
    - `projects` → `<FadeIn><Projects items={sections.projects.items} /></FadeIn>`
    - `stack` → `<FadeIn><Stack groups={sections.stack.groups} /></FadeIn>`
    - `contact` → `<FadeIn><Contact … /></FadeIn>`
  - [x] Le **`SectionHead`** lui-même est **également wrappé** dans un `<FadeIn>` distinct, légèrement décalé visuellement — **OU** laisser le SectionHead visible immédiatement et ne wrapper que le corps : **recommandation = wrapper SectionHead + corps ensemble** dans un seul `<FadeIn>` (comportement plus cohérent : tout le bloc de section apparaît d'un coup). À documenter dans Completion Notes.
  - [x] **Hero** (`GridSection id="hero"`) : **NE PAS** wrapper dans `<FadeIn>` — au-dessus du fold.
  - [x] **Clients** (`GridSection id="clients"`) : **NE PAS** wrapper — immédiatement visible ; l'animation du marquee est gérée par CSS.
  - [x] **`GridSection id="ai"`** (section AI hors map) : wrapper son contenu avec `<FadeIn>` :
    ```tsx
    <GridSection id="ai" label={ai.label} background="alt2">
      <FadeIn>
        <SectionHead label={ai.label} heading={ai.heading} sub={ai.body} />
        <AI tools={ai.tools} />
      </FadeIn>
    </GridSection>
    ```
  - [x] **`Footer`** : **NE PAS** wrapper — ultra-léger, décision cosmétique.
  - [x] **`Nav`** : **NE PAS** toucher.
  - [x] Aucune autre modification de `page.tsx`.

- [x] **Tâche 6 — Validation (AC: #1–#5)**
  - [x] `npm run typecheck` → 0 erreur.
  - [x] `npm run lint` → 0 erreur. ⚠️ `react/jsx-no-comment-textnodes` : `FadeIn.tsx` n'utilise pas de `//` en JSX — non concerné. ⚠️ `react-hooks/set-state-in-effect` : corrigé en wrappant les appels synchrones dans `setTimeout(() => setVisible(true), 0)` pour les chemins de fallback (prefers-reduced-motion, no IO).
  - [x] `npm run build` → succès. Vérifier dans la sortie : `/en` et `/fr` **toujours pré-rendues en statique** ; `FadeIn` est un Client Component mais ses children (Server Components) sont rendus côté serveur — confirmer que le HTML initial de `.next/server/app/{en,fr}.html` contient bien le contenu des sections (About, Experience, etc.) **sans** être vide (ce qui serait le cas si on avait incorrectement mis des Server Components en `'use client'`).
  - [x] Inspection du HTML pré-rendu `.next/server/app/{en,fr}.html` :
    - Le contenu de **toutes les sections** (corps About, rôles Experience, missions Freelance, cartes Projects, groupes Stack, outils AI, Contact) est présent dans le HTML initial — prouve que le rendu serveur n'est pas cassé par `FadeIn`.
    - La section `#clients` contient **12 entrées** (4 items × 3) dans l'inner marquee container. Confirmé : "Louis Vuitton" apparaît 12 fois au total dans le HTML (marquee ×3 + occurrences Experience). 7 occurrences de `opacity-0 translate-y-4` = 7 wrappers FadeIn (6 sections map + AI).
    - Aucun nouveau script client lourd (vérifier que le bundle JS du chunk home n'explose pas).
  - [x] Pas de commit créé — convention du repo « committer seulement si demandé » (cf. Story 2.4 Completion Notes).
  - [x] Remplir le *Dev Agent Record* + *Change Log*.

### Review Findings

_Code review du 2026-05-13 — 3 couches : Blind Hunter, Edge Case Hunter, Acceptance Auditor. ~27 findings bruts → après tri/dédup : 3 patches (dont 1 issu d'une décision utilisateur), 3 defers, 17 dismissés._

**Patches (3) :**

- [x] [Review][Patch] **Révéler immédiatement les sections déjà en intersection au mount** [src/hooks/useScrollFadeIn.ts:23](src/hooks/useScrollFadeIn.ts#L23) — Avant d'attacher l'`IntersectionObserver`, vérifier synchroniquement via `el.getBoundingClientRect()` si l'élément est déjà dans le viewport (top < `window.innerHeight - 48` et bottom > 0) et basculer `setVisible(true)` immédiatement dans ce cas (via `setTimeout(0)` cohérent avec le chemin skip pour satisfaire le lint). Résout : (a) `/fr#contact` via lien externe → Contact visible dès le paint, (b) About partiellement visible au chargement sur mobile court (iPhone 14 Pro Max). Le comportement nominal (sections sous le fold) reste inchangé. Décision utilisateur : Option 3 retenue lors de la revue. Sources : blind+edge.

- [x] [Review][Patch] **Ajouter `motion-reduce:transition-none` à `FadeIn` pour respecter strictement AC #3** [src/components/FadeIn.tsx:16](src/components/FadeIn.tsx#L16) — Actuellement la classe `transition-[opacity,transform] duration-700 ease-out` reste appliquée même en mode `prefers-reduced-motion: reduce` : le chemin `shouldSkip` du hook bascule `setVisible(true)` via `setTimeout(0)`, ce qui déclenche la transition CSS 700 ms entre l'état initial SSR (`opacity-0`) et `opacity-100`. La spec AC #3 dit « aucune animation ne court » en PRM. Fix Tailwind trivial : ajouter `motion-reduce:transition-none` (et idéalement `motion-reduce:translate-y-0 motion-reduce:opacity-100` pour figer l'état dès le SSR). Bénéfice secondaire : neutralise dynamiquement la transition si l'utilisateur change sa préférence en cours de session (résout en partie l'asymétrie identifiée par Edge Case Hunter). Sources : blind+edge+auditor.

- [x] [Review][Patch] **Déplacer le bloc `@keyframes marquee-scroll` / `.animate-marquee` après `@theme inline`** [src/app/globals.css:133-149](src/app/globals.css#L133-L149) — Tâche 1 spécifiait « **Dans `src/app/globals.css`, après le bloc `@theme inline`**, ajouter ». Actuellement inséré entre `@theme {` (lignes 23–131) et `@theme inline {` (ligne 151). Fonctionnellement neutre (Tailwind v4 ne dépend pas de cet ordre pour des règles non-token), mais consigne explicite de la story violée. Source : auditor (AA1).

**Différés (3 — voir `deferred-work.md`) :**

- [x] [Review][Defer] Pas de listener `matchMedia('change')` sur `prefers-reduced-motion` dans `useScrollFadeIn` [src/hooks/useScrollFadeIn.ts:14-22](src/hooks/useScrollFadeIn.ts#L14-L22) — deferred, asymétrie avec marquee CSS (lui ré-évalué dynamiquement) ; impact faible et largement résolu par le patch `motion-reduce:transition-none` ci-dessus si appliqué.
- [x] [Review][Defer] Contrat `items: readonly { name: string }[]` n'enforce pas non-vide ni longueur minimale pour le marquee [src/components/Clients.tsx:9](src/components/Clients.tsx#L9) — deferred, théorique (dictionnaire actuel garantit 4 items) ; à adresser si le dictionnaire devient dynamique.
- [x] [Review][Defer] `width: max-content` peut être < viewport sur certains écrans tablette si les `items.name` sont très courts [src/components/Clients.tsx:31](src/components/Clients.tsx#L31) — deferred, théorique (4 wordmarks longs actuels saturent toute tablette) ; à durcir si le contenu raccourcit.

**Dismissed (17 — bruit ou intention documentée) :** FOUC général (cas spécifique adressé par le 1er patch ci-dessus), dégradation no-JS (portfolio dépend de JS pour Nav/i18n/menu), séparateur `·` après le dernier item (intentionnel Dev Note pour loop seamless), `key={i}` sur 12 items (items statiques du dictionnaire), `shrink-0` sur non-flex parent (no-op inoffensif), padding latéral retiré (intentionnel marquee), `animation-play-state: paused` ne montre que 1/3 du contenu (équivalent à la bande statique MVP — désiré), `useEffect` deps `[]` (pattern correct identique à `useActiveSection`), `setTimeout(0)` inconsistant entre chemins skip/IO (documenté Debug Log de la story pour le lint `react-hooks/set-state-in-effect` ; callbacks IO asynchrones de spec ne déclenchent pas le warning), espace après virgule dans `transition-[opacity,transform]` (Tailwind v4 parse correctement, build green), `threshold: 0.08 + rootMargin -48px` (sections ≫ 8 px, déclenche correctement), `tripled` recalculé à chaque render (Server Component, exécuté au build), wrapper `<div>` casse layout `GridSection` (vérifié : `GridSection` rend `{children}` directement, pas de sélecteur `> *`), `translate-y-4` empiète section voisine pendant 700 ms (cosmétique transient, `py-section-y` de 56–96 px largement supérieur à 16 px), typing `readonly` perdu après spread (sans impact runtime), `33.333%` non exact à 1/3 (drift ≈ 0,013 px par cycle, imperceptible), commentaire « pas de FadeIn » sur Hero (factuel et clair), `×3` hardcoded (constante intentionnelle alignée au design `Minimal.jsx`).

## Dev Notes

### Contexte & état du système (lire avant de coder)

- **Cette story = Epic 3, Story 1/2 — première story du mouvement.** Le site complet est livré (Epics 1+2 `done`) : shell bilingue, toutes les sections de contenu, CV, responsive mobile→desktop. **Cette story ajoute UNIQUEMENT** : (a) l'animation CSS du marquee (`Clients.tsx` refactorisé, pure CSS), (b) le hook `useScrollFadeIn` + le wrapper `FadeIn` (Client Components), (c) le câblage `FadeIn` dans `page.tsx`. Aucun contenu, aucun style de présentation, aucune structure de section n'est modifié.

- **`Clients.tsx` actuellement (état exact à lire) :**
  - Server Component, 50 lignes, pas de `'use client'`.
  - Inner div avec `flex-wrap items-center gap-x-8 gap-y-3 px-section-x-mobile py-5 sm:gap-x-12 sm:px-section-x` — les items **wrappent à la ligne** (comportement de bande statique MVP).
  - Outer wrapper : `overflow-hidden` (déjà en place — à préserver).
  - 4 items (`clients.items` depuis le dictionnaire), séparés par `·`.
  - Commentaire à retirer : `// l'animation d'Epic 3 remplacera ce wrap par un défilement…`.
  - **Ce que cette story change** : inner div passe en `width: max-content; display: flex; flex-shrink: 0` + animation CSS ; items triplés.

- **Design de référence (`_bmad-output/planning-artifacts/design/Minimal.jsx` ≈ L276–316, L838–842) :**
  - Inner container : `display: flex; gap: 80; animation: "tm-marquee 32s linear infinite"; width: "max-content"; alignItems: "center"; padding: "20px 0"`.
  - Items : triplés (`[...C2.clients, ...C2.clients, ...C2.clients]`) pour le loop seamless ; chaque item = wordmark + séparateur `·` après chaque item sans exception (différent du design statique actuel qui omet le `·` sur le dernier).
  - `@keyframes tm-marquee { from { transform: translateX(0); } to { transform: translateX(-33.333%); } }` — se déplace d'exactement 1/3 de la largeur totale (= 1 jeu de 4 items) pour une boucle imperceptible.
  - Chez nous : nommer `marquee-scroll` pour éviter toute collision.

- **Fichiers à CRÉER :**
  - `src/hooks/useScrollFadeIn.ts` — hook Client (`'use client'`), IntersectionObserver + `prefers-reduced-motion`.
  - `src/components/FadeIn.tsx` — wrapper Client (`'use client'`), utilise `useScrollFadeIn`.

- **Fichiers à MODIFIER :**
  - `src/app/globals.css` — ajouter `@keyframes marquee-scroll` + `.animate-marquee` + media query `prefers-reduced-motion`.
  - `src/components/Clients.tsx` — refactoriser l'inner container pour l'animation (tripler les items, passer en `width: max-content`, appliquer l'animation).
  - `src/app/[locale]/page.tsx` — ajouter import `FadeIn` + wrapper `<FadeIn>` sur les corps de sections.

- **Fichiers à NE PAS toucher :**
  - `src/components/{Nav,Hero,GridSection,SectionHead,Footer,LanguageSwitcher,MMLogo,AvailabilityBadge,About,Experience,RoleCard,FreelanceEngagements,MissionCard,Projects,MaqomCard,MethodologyCard,Stack,AI,Contact}.tsx` — aucun composant de présentation modifié (sauf `Clients.tsx`).
  - `src/hooks/useActiveSection.ts` — hook existant, ne pas y toucher.
  - `src/i18n/dictionaries/en.ts`, `fr.ts` — aucune clé ajoutée (le contenu n'évolue pas).
  - `src/app/[locale]/layout.tsx`, `src/app/[locale]/not-found.tsx`, `src/i18n/**`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `public/cv/michael-mann-cv.pdf`, `src/proxy.ts`.

### Patterns d'architecture & garde-fous

- **Server Components comme `children` de Client Components.** C'est un pattern officiel Next.js (React Server Components). `FadeIn` est Client, ses `children` sont des Server Components (`About`, `Experience`, etc.) — ils sont rendus côté serveur et passés comme props React sérialisées. Aucune conversion en `'use client'` n'est nécessaire ni souhaitée. Le HTML initial du serveur contient le contenu — SEO et SSG préservés.

- **`'use client'` uniquement pour `FadeIn.tsx` et `useScrollFadeIn.ts`** — ces deux fichiers utilisent des hooks React et des APIs du navigateur (`IntersectionObserver`, `window.matchMedia`). Tous les autres composants restent Server Components. `Clients.tsx` : **AUCUN `'use client'`** — l'animation est purement CSS.

- **Vitesse responsive du marquee — recommandation d'implémentation :**
  - Option A (recommandée) : CSS custom property dans `globals.css`.
    ```css
    .animate-marquee {
      --marquee-duration: 20s;
      animation: marquee-scroll var(--marquee-duration) linear infinite;
    }
    @media (min-width: 640px) { /* sm */
      .animate-marquee { --marquee-duration: 32s; }
    }
    @media (prefers-reduced-motion: reduce) {
      .animate-marquee { animation-play-state: paused; }
    }
    ```
    → Une seule classe Tailwind dans `Clients.tsx`, le CSS gère le responsive. Pas de classes Tailwind responsive sur le nœud animé (plus propre pour une valeur non standard).
  - Option B : classe Tailwind arbitraire responsive (plus fragile, moins lisible pour une durée d'animation).
  - **Choisir l'Option A, documenter dans Completion Notes.**

- **Séparateurs dans le marquee triplicé :** Le design met un `·` après **chaque** wordmark sans exception (pour que le loop soit fluide visuellement — pas de `·` manquant au point de jonction entre les 3 copies). Adapter le rendu actuel qui omet le `·` après le dernier item. Pour un rendu propre après les 3 copies : toujours afficher le séparateur quelle que soit la position `i`.

- **Tokens disponibles dans `globals.css`** (exhaustif — vérifier avant d'inventer) :
  - Couleurs : `text-fg-strong`, `text-fg-body`, `text-fg-muted`, `text-fg-subtle`, `text-fg-faint`, `text-fg-faintest`, `text-accent`, `text-fg`, `bg-bg`, `bg-bg-alt`, `bg-bg-alt2`, `border-line`, `border-line-soft`, `border-accent-border`, `border-accent-border-strong`, `bg-invert-bg`, `text-invert-fg`, `text-status-available`, `bg-accent-soft`, `bg-white/[0.015]`, `bg-white/[0.03]`.
  - Espacement : `px-section-x`, `px-section-x-mobile`, `py-section-y`, `py-section-y-mobile`, `w-gutter`.
  - Tailles de texte : `text-marquee` (44px, `line-height: 1`, `letter-spacing: 0.04em`), `text-display-2xl`, `text-display-xl`, `text-display-lg`, `text-display-md`, `text-display-sm`, `text-body-lg`, `text-body`, `text-body-sm`, `text-ui`, `text-ui-sm`, `text-label`, `text-label-sm`.
  - Polices : `font-sans` (Inter), `font-mono` (JetBrains Mono), `font-display` (Cormorant).
  - Rayons : `rounded-sm`/`rounded-md`/`rounded-lg`/`rounded-xl`/`rounded-2xl`.

- **`react/jsx-no-comment-textnodes`** (apprentissage stories 2.3/2.4) : wrappez tout libellé commençant par `//` en expression JSX : `{"// clients.shipped_to"}`. Dans `Clients.tsx`, le `shippedToLabel` vient du dictionnaire (pas un literal `//` codé en dur) — non concerné directement, mais à garder en tête si un libellé décoratif est ajouté en dur.

- **`react-hooks/exhaustive-deps`** : dans `useScrollFadeIn`, le `useEffect` avec `[]` (aucune dépendance) est correct — l'observateur ne dépend d'aucune variable réactive (pas de props, pas de state dans la closure).

- **`FadeIn` + hydration :** `useState(false)` → le client commence à `opacity-0 translate-y-4`. Après montage, l'IntersectionObserver déclenche `setVisible(true)` si l'élément est déjà visible. Pour les sections sous le fold (toutes celles wrappées), l'élément n'est pas en intersection au chargement → reste invisible jusqu'au défilement. Comportement attendu. Sections au-dessus du fold (Hero, Clients) : **non wrappées** → toujours visibles.

- **Éviter `next/dynamic`** pour `FadeIn` : le fondu est un composant UI léger (hook léger, aucune dépendance tierce) — pas besoin de lazy-loading. `next/dynamic` est réservé aux scripts réellement coûteux (ex. le `CustomCursor` de Story 3.2 — NFR3). `FadeIn` peut être importé directement dans `page.tsx`.

- **Performance** : `transform` et `opacity` sont composités par le navigateur (pas de reflow/repaint coûteux — NFR6). La transition CSS `.transition-[opacity,transform]` de Tailwind génère `transition-property: opacity, transform`. L'IntersectionObserver est `disconnect()` après la première intersection (cleanup `useEffect`) — pas de fuite mémoire.

### Référence design (`Minimal.jsx`)

- **`TMClients` (≈ L276–316)** — inner container : `display: flex; gap: 80; animation: "tm-marquee 32s linear infinite"; width: "max-content"; alignItems: "center"; padding: "20px 0"`. Wordmarks : `fontFamily: Cormorant Garamond; fontSize: 44; fontWeight: 400; color: #fafafa; letterSpacing: 0.04em; fontStyle: italic`. Séparateurs `·` : `fontFamily: mono; fontSize: 10; color: #555; letterSpacing: 0.1em` (chez nous : `font-mono text-label-sm text-fg-faintest` — décoratif).
- **`@keyframes tm-marquee`** (≈ L838–842) : `from { transform: translateX(0); } to { transform: translateX(-33.333%); }`. À porter sous le nom `marquee-scroll`.
- **Correspondance tokens :** `44px`→`text-marquee`, `#fafafa`→`text-fg-strong`, `font-style: italic`→`italic`, `letter-spacing 0.04em`→déjà dans `--text-marquee--letter-spacing` (inclus dans la classe `text-marquee`).

### Dette / contexte des reviews précédentes (`deferred-work.md`)

- **[Hors périmètre, NE PAS toucher]** : toutes les dettes des stories 1.x–2.4 (LinkedIn 404 → 9.1, `statusSnake` → 9.1, invariant `url≠null` → defer, `scroll-mt-24` → 4.x, menu mobile focus-trap → 4.1, `config.matcher` → 4.3, etc.). Cette story n'est pas un passage de polish général.
- **[À reproduire]** : pattern de `useActiveSection.ts` pour la structure du hook (check `IntersectionObserver === "undefined"` pour SSR-safety, cleanup dans le `return` de `useEffect`).
- **[À respecter]** : clés React stables (dans le marquee triplicé, utiliser `key={i}` — index global parmi 12 copies — plutôt que `key={item.name}` qui serait dupliqué ×3).

### Note Next.js 16 / React 19 (AGENTS.md)

Le projet tourne sur **Next 16.2.6** + React 19.2.4. AGENTS.md **impose** de lire les guides pertinents dans `node_modules/next/dist/docs/` avant d'écrire du code. Points critiques pour cette story :
- La composition « Server Component enfant de Client Component » est explicitement supportée — vérifier dans les docs de ta version.
- `'use client'` au sommet d'un fichier : la directive marque **ce fichier** (et ses imports directs) comme client — les `children` props restent Server-rendus.
- `params: Promise<…>` dans `page.tsx` : ne pas y toucher.

### Standards de test

Aucun framework de test n'est encore installé. « Tester » = `npm run typecheck` + `npm run lint` + `npm run build` (tous verts) + **inspection HTML pré-rendu** (`.next/server/app/{en,fr}.html` — confirmer que le contenu des sections est présent malgré `FadeIn` Client) + smoke `npm run dev` sur `/en` et `/fr` avec et sans `prefers-reduced-motion`. Ne pas committer d'état cassé.

### Project Structure Notes

- **Nouveaux fichiers** :
  - `src/hooks/useScrollFadeIn.ts` — hook Client (`'use client'`), calqué sur `useActiveSection.ts`.
  - `src/components/FadeIn.tsx` — wrapper Client (`'use client'`).
- **Modifiés** :
  - `src/app/globals.css` — `@keyframes marquee-scroll` + `.animate-marquee` + `prefers-reduced-motion`.
  - `src/components/Clients.tsx` — inner container refactorisé (×3 items, `width: max-content`, animation CSS).
  - `src/app/[locale]/page.tsx` — import `FadeIn` + wrapping des corps de sections dans le `.map(sectionList)` + section AI.
  - `_bmad-output/implementation-artifacts/sprint-status.yaml` — `epic-3` `backlog`→`in-progress`, `3-1-…` `backlog`→`ready-for-dev`.
  - Ce fichier story.

### Références

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.1] · [#Epic 3] · [#UX-DR16, UX-DR6] · [#FR31, FR32, FR7, FR33]
- [Source: _bmad-output/planning-artifacts/design/Minimal.jsx#TMClients (~L276–316) et @keyframes tm-marquee (~L838–842)]
- [Source: src/components/Clients.tsx — état actuel (Server Component statique avec flex-wrap ; commentaire « animation = Epic 3 »)]
- [Source: src/hooks/useActiveSection.ts — patron de hook à calquer (IntersectionObserver, SSR-safety, cleanup)]
- [Source: src/app/[locale]/page.tsx — endroit où insérer les <FadeIn> wrappers]
- [Source: src/app/globals.css — tokens existants à utiliser ; endroit où ajouter @keyframes]
- [Source: _bmad-output/implementation-artifacts/2-4-section-contact-contenu-fr-en-complet-cv-finition-responsive.md — Completion Notes (patterns établis : FOCUS_RING, Server Component, clés React)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md — dettes à ne pas toucher ; patterns à reproduire]
- [Source: AGENTS.md — lire node_modules/next/dist/docs/ avant de coder]
- [Source: _bmad-output/planning-artifacts/prd.md#FR31, FR32, NFR6, NFR11] · [#NFR3, NFR14, NFR15]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

- **Fix TypeScript TS18048** : destructuration `([entry])` remplacée par `entries[0]` avec optional chaining `entry?.isIntersecting` — `entry` pouvait être `undefined` selon le compilateur strict.
- **Fix ESLint `react-hooks/set-state-in-effect`** : les appels `setVisible(true)` synchrones dans l'effet (chemins `prefers-reduced-motion` et `IntersectionObserver === undefined`) wrappés dans `setTimeout(() => setVisible(true), 0)` avec cleanup `clearTimeout` — évite les renders en cascade signalés par le linter.

### Completion Notes List

- **Tâche 0** : Docs Next.js `05-server-and-client-components.md` lues. Pattern « Server Component comme `children` d'un Client Component » confirmé dans les docs de Next 16 (section « Interleaving Server and Client Components »). Aucune dépréciation relevée.
- **Tâche 1** : CSS global — Option A (CSS custom property `--marquee-duration`) choisie conformément aux Dev Notes. `@keyframes marquee-scroll` + `.animate-marquee` (20 s mobile, 32 s sm+) + `@media (prefers-reduced-motion: reduce) { animation-play-state: paused }` ajoutés avant le bloc `@theme inline`.
- **Tâche 2** : `Clients.tsx` refactorisé — items triplés (`tripled = [...items, ...items, ...items]`, 12 éléments), inner container en `width: max-content` via `style={{ width: "max-content" }}` (inline inline style pour éviter une classe Tailwind arbitraire non standard), classe `animate-marquee` + `shrink-0 flex items-center py-5`. Séparateur `·` affiché après **chaque** item (loop seamless, pas d'exception sur le dernier). Commentaires obsolètes supprimés. Aucun `'use client'`.
- **Tâche 3** : `useScrollFadeIn.ts` créé — `"use client"`, IntersectionObserver, `prefers-reduced-motion` + fallback SSR. Tableau `[]` vide dans `useEffect` correct (aucune dépendance réactive dans la closure). Clé `react-hooks/exhaustive-deps` satisfaite.
- **Tâche 4** : `FadeIn.tsx` créé — `"use client"`, `translate-y-4` (16 px), `duration-700`, `ease-out`, `className` prop. `useState(false)` = état initial identique serveur et client → pas de mismatch hydration.
- **Tâche 5** : `page.tsx` mis à jour — import `FadeIn` ajouté ; SectionHead + corps de section wrappés **ensemble** dans un seul `<FadeIn>` (tout le bloc de section apparaît d'un coup — plus cohérent que wrapper body seul) ; Hero et Clients non wrappés (au-dessus du fold / animation CSS) ; AI section wrappée ; Footer et Nav non touchés.
- **Tâche 6** : typecheck, lint, build verts. HTML pré-rendu `.next/server/app/en.html` inspecté : 12 occurrences "Louis Vuitton" (marquee ×3 + Experience) et 7 occurrences `opacity-0 translate-y-4` (6 sections map + AI) confirmées. SSG `/en` et `/fr` préservé.

### File List

**Créés :**
- `src/hooks/useScrollFadeIn.ts`
- `src/components/FadeIn.tsx`

**Modifiés :**
- `src/app/globals.css`
- `src/components/Clients.tsx`
- `src/app/[locale]/page.tsx`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`
- `_bmad-output/implementation-artifacts/3-1-fondu-au-defilement-animation-du-marquee-respect-de-prefers-reduced-motion.md`

## Change Log

| Date       | Version | Description                                                                                             | Auteur |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------- | ------ |
| 2026-05-13 | 0.1     | Création de la story 3.1 (context engine) : fondu au défilement (`useScrollFadeIn` + `FadeIn`), animation CSS du marquee clients (×3, `@keyframes marquee-scroll`), respect de `prefers-reduced-motion`. Epic 3 Story 1/2. | Bob (SM) |
| 2026-05-13 | 1.0     | Implémentation complète : `useScrollFadeIn.ts` + `FadeIn.tsx` créés ; `Clients.tsx` refactorisé (×3, CSS marquee) ; `globals.css` mis à jour (keyframes + animate-marquee + PRM) ; `page.tsx` câblé (FadeIn sur 7 sections). Typecheck, lint, build verts. SSG préservé. | claude-sonnet-4-6 |
| 2026-05-13 | 1.1     | Code review (3 couches) + 3 patches appliqués : (a) `useScrollFadeIn` révèle immédiatement les sections déjà en intersection au mount (résout flash sur ancre directe et above-fold mobile) ; (b) `FadeIn` ajoute `motion-reduce:transition-none` (AC #3 strict) ; (c) bloc `@keyframes/.animate-marquee` déplacé après `@theme inline` (Dev Note Tâche 1). Typecheck/lint/build re-verts. 3 defers documentés dans `deferred-work.md`. | claude-opus-4-7 |
