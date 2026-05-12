# Story 1.1: Scaffold du projet, déploiement statique & CI

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer (Michael),
I want a Next.js (App Router) + TypeScript strict + Tailwind project scaffolded, deployed statically on Vercel on every push, with a CI pipeline running ESLint and type-checking,
so that I have a reproducible foundation and every change ships safely without manual steps.

## Acceptance Criteria

1. **Scaffold local fonctionnel.** Étant donné un dépôt greenfield vide, quand le projet est créé avec `create-next-app` (App Router) avec TypeScript `strict` activé et Tailwind CSS, alors `npm run dev` sert une page en local, `npm run build` produit un build pré-rendu / statique (toutes les routes générées en SSG, aucune route serveur dynamique), et `npm run lint` (ESLint) passe sans erreur ; et la structure du projet, le `.gitignore` et un commit initial sont en place.

2. **Déploiement Vercel automatique & atomique.** Étant donné que le dépôt est connecté à Vercel, quand je pousse sur la branche par défaut, alors Vercel construit et déploie le site automatiquement en sortie statique pré-rendue, avec des déploiements atomiques (un build échoué ne remplace jamais la version en production) ; et une mise à jour de contenu courante se propage en production en moins de ~2 minutes.

3. **CI GitHub Actions bloquante.** Étant donné un workflow GitHub Actions, quand un push ou une pull request est effectué, alors le workflow exécute ESLint et `tsc --noEmit` et échoue à la moindre erreur ; et le statut du workflow est visible sur la PR.

> Note de portée : cette story livre **uniquement la fondation** — scaffold, config qualité, pipeline CI, déploiement. Aucun design token, police, composant de shell (`Nav`/`GridSection`/`SectionHead`/`Footer`), routing i18n ni modèle de contenu ici (Stories 1.2a, 1.2b, 1.3). La page servie peut rester la page d'accueil par défaut de `create-next-app` (ou un placeholder minimal) — ne pas sur-construire.

## Tasks / Subtasks

- [ ] **Tâche 1 — Scaffolder le projet Next.js (AC: #1)**
  - [ ] Exécuter `npx create-next-app@latest .` dans le dossier du projet (`C:\Users\Micha\Desktop\portfolio`) avec les options : **TypeScript = oui**, **ESLint = oui**, **Tailwind CSS = oui**, **App Router = oui**, **`src/` directory = oui** (recommandé), **import alias `@/*` = oui**, **Turbopack pour `next dev` = oui**. Refuser toute option « customize default import alias » autre que `@/*`.
  - [ ] Vérifier `package.json` : scripts `dev`, `build`, `start`, `lint` présents ; dépendances `next` (15.x), `react` / `react-dom` (19.x), `typescript` (5.x), `tailwindcss` (4.x via `@tailwindcss/postcss`), `eslint` + `eslint-config-next`.
  - [ ] Dans `tsconfig.json`, confirmer `"strict": true` (déjà posé par le scaffold). Ajouter explicitement, si absents : `"noUncheckedIndexedAccess": true` et `"noImplicitOverride": true` (durcissement aligné NFR22 — TS strict).
  - [ ] Ajouter un script `"typecheck": "tsc --noEmit"` à `package.json` (utilisé par la CI).
  - [ ] Vérifier que `.gitignore` (généré par le scaffold) ignore `node_modules`, `.next`, `out`, `.vercel`, `*.log`, `.env*`.
  - [ ] Lancer `npm run dev` → page accessible sur `http://localhost:3000`. Lancer `npm run build` → build réussit, sortie des routes marquées `○ (Static)` / `● (SSG)`, aucune route `ƒ (Dynamic)`. Lancer `npm run lint` → 0 erreur. Lancer `npm run typecheck` → 0 erreur.

- [ ] **Tâche 2 — Garantir le rendu statique (AC: #1, #2)**
  - [ ] Dans `next.config.ts` (ou `.mjs`), **ne PAS** activer `output: 'export'` (cela désactiverait l'optimisation `next/image` requise par AR8 ; Vercel pré-rend déjà les pages statiques). Laisser la config minimale ; ajouter un commentaire expliquant que le rendu statique est obtenu par SSG par défaut (pas de `fetch` dynamique, pas de `cookies()`/`headers()` dans les routes de pages à ce stade) et que Vercel sert ces pages depuis le CDN.
  - [ ] S'assurer qu'aucun fichier de page n'utilise `export const dynamic = 'force-dynamic'` ni d'API dynamique de requête. (Le middleware i18n viendra en Story 1.2b — hors scope ici.)

- [ ] **Tâche 3 — Initialiser le dépôt Git & commit initial (AC: #1)**
  - [ ] `git init` (le dossier n'est pas encore un dépôt Git — vérifié). Définir la branche par défaut sur `main` (`git branch -M main`).
  - [ ] `git add -A` puis commit initial : `chore: scaffold Next.js App Router + TypeScript strict + Tailwind`. Suivre la convention de message du repo (Conventional Commits). Inclure le trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` uniquement si l'utilisateur le demande — sinon message simple.
  - [ ] Créer le dépôt distant GitHub (`gh repo create` ou via l'UI) et pousser `main`. **Demander à l'utilisateur** le nom/visibilité du dépôt avant de créer quoi que ce soit de distant.

- [ ] **Tâche 4 — Connecter Vercel & valider le déploiement automatique (AC: #2)**
  - [ ] Connecter le dépôt GitHub au projet Vercel (import via dashboard Vercel ou `vercel link` + `vercel git connect`). **Cette étape requiert une action de l'utilisateur** (login Vercel / autorisation GitHub) — proposer à l'utilisateur de lancer `vercel login` puis `vercel` via `! <commande>` dans la session.
  - [ ] Vérifier les réglages Vercel : Framework Preset = **Next.js** (détecté auto), build command = `next build` (défaut), output = géré par Vercel (ne PAS forcer « Other » / static export).
  - [ ] Pousser un commit trivial sur `main` → confirmer qu'un déploiement de production se déclenche automatiquement, réussit, et que l'URL de prod sert le site. Vérifier le comportement atomique : un build qui échoue laisse la prod précédente en place (constat documenté, pas besoin de provoquer un échec réel si risqué — Vercel garantit ce comportement par conception).
  - [ ] Noter le temps de propagation observé (doit être < ~2 min pour une mise à jour de contenu) dans les Completion Notes.

- [ ] **Tâche 5 — Pipeline CI GitHub Actions (AC: #3)**
  - [ ] Créer `.github/workflows/ci.yml` : déclencheurs `push` (sur `main`) et `pull_request`. Un job `quality` sur `ubuntu-latest` : `actions/checkout@v4` → `actions/setup-node@v4` (Node `20`, `cache: 'npm'`) → `npm ci` → `npm run lint` → `npm run typecheck`. Le job échoue si l'une de ces étapes retourne un code non nul.
  - [ ] Vérifier que `package-lock.json` est commité (requis par `npm ci`).
  - [ ] Ouvrir une PR de test (ou pousser sur une branche) pour confirmer que le check CI apparaît sur la PR et passe au vert. Optionnel : suggérer à l'utilisateur d'activer une *branch protection rule* exigeant ce check sur `main` (hors scope strict — mentionner seulement).

- [ ] **Tâche 6 — Validation finale (AC: #1, #2, #3)**
  - [ ] Re-vérifier en local : `npm run build && npm run lint && npm run typecheck` → tout vert.
  - [ ] Vérifier que le déploiement Vercel de prod est vert et accessible.
  - [ ] Vérifier que le workflow CI est vert sur le dernier push/PR.
  - [ ] Remplir la section *Dev Agent Record* (modèle utilisé, notes, liste des fichiers).

## Dev Notes

### Contexte & objectif

Première story du projet **portfolio** (site vitrine personnel one-page de Michael Mann, FR/EN, esthétique « Technical Minimal », déploiement statique Vercel). Projet **greenfield** : le dossier ne contient pour l'instant que les artefacts BMAD (`_bmad/`, `_bmad-output/`, `docs/`) et un dossier `_bmad-output/planning-artifacts/design/` avec le design de référence (`Minimal.jsx`, `Portfolio.html`, `content.js`/`content.md`, assets logo/splash). Aucune base de code applicative n'existe encore. Cette story pose **uniquement** : scaffold Next.js, config qualité TS strict + ESLint, pipeline CI, déploiement Vercel automatique. Tout le reste (tokens, polices, i18n, contenu typé, composants de shell) arrive dans les stories 1.2a / 1.2b / 1.3.

### Stack & décisions (sources : PRD §§ Web App Specific Requirements / Implementation Considerations ; `epics.md` AR1–AR12)

- **AR1 — Scaffold :** greenfield, `create-next-app` en **App Router** + **TypeScript strict** + **Tailwind CSS** (shadcn/ui au besoin, *pas* dans cette story). Aucun starter template tiers.
- **AR2 — Rendu statique :** SSG / pré-rendu au build, **aucune** donnée dynamique côté serveur, pas d'API applicative, pas d'auth, pas de DB, pas de temps réel. Le site doit être servable comme statique → garder toutes les routes en génération statique ; **ne pas** utiliser `output: 'export'` (briserait `next/image` voulu par AR8 — Vercel pré-rend et sert depuis le CDN de toute façon).
- **AR3 — Déploiement :** Vercel, déploiement statique automatique sur `push`, déploiements atomiques (rollback préservé), propagation < ~2 min.
- **AR9 — Qualité / CI :** ESLint + TypeScript strict en CI ; check Lighthouse en CI = *souhaitable en MVP, bloquant en Growth* → **hors scope de cette story** (le check Lighthouse en CI advisory est livré en Story 4.3 ; le durcissement bloquant en Story 7.2). Ici : seulement ESLint + `tsc --noEmit`.
- **AR12 — Hors scope explicite :** pas de PWA, pas de CLI, pas de backend/DB/auth/temps réel ; pas de lien Balink ni vers des repos (contrainte de contenu — pas pertinent ici mais à garder en tête : ne pas committer d'URL de repo dans des fichiers visibles).

### Versions & spécificités techniques actuelles (à jour ~2026)

- **Next.js 15.x** (App Router, React 19) — `npx create-next-app@latest` installe cette version. Turbopack est stable pour `next dev` ; l'option « Use Turbopack for `next dev`? » → **oui**.
- **React 19.x** — livré par le scaffold ; aucune action particulière.
- **Tailwind CSS v4** — le scaffold Next 15 récent configure Tailwind v4 via `@tailwindcss/postcss` (plus de `tailwind.config.js` obligatoire ; config CSS-first via `@import "tailwindcss"` dans `globals.css`). Ne pas downgrader vers v3. Les *design tokens* « Technical Minimal » seront ajoutés en Story 1.2a (ne rien faire ici au-delà du défaut).
- **TypeScript 5.x**, `strict: true` posé par le scaffold. Durcissements recommandés : `noUncheckedIndexedAccess`, `noImplicitOverride`.
- **ESLint 9 (flat config)** — `eslint-config-next` fournit la config ; `next lint` / `npm run lint` fonctionne out of the box. Ne pas réécrire la config à la main.
- **Node.js** : Next 15 requiert Node **^18.18 || ^20 || >=22**. CI : épingler **Node 20** (`actions/setup-node@v4` avec `node-version: 20`). En local, Michael est sur Windows 11 — `npx`/`npm` standard.
- **`next.config`** : le scaffold récent génère `next.config.ts` (TypeScript). Garder minimal.

### Fichiers / structure attendus après scaffold

```
portfolio/
  .github/workflows/ci.yml        # NEW — créé en Tâche 5
  src/app/layout.tsx              # généré par le scaffold
  src/app/page.tsx                # généré (page par défaut — OK de la garder pour l'instant)
  src/app/globals.css             # généré (contient @import "tailwindcss")
  public/                         # généré (assets statiques)
  next.config.ts                  # généré — garder minimal, commenter le choix « pas d'export statique »
  tsconfig.json                   # généré — strict ; ajouter les durcissements
  eslint.config.mjs               # généré (flat config)
  postcss.config.mjs              # généré (@tailwindcss/postcss)
  package.json                    # généré — ajouter le script "typecheck"
  package-lock.json               # généré — DOIT être commité (npm ci en CI)
  .gitignore                      # généré — vérifier .next, out, .vercel, node_modules
  _bmad/  _bmad-output/  docs/    # existants — ne pas toucher ; ils doivent rester dans le repo
```

Important : `create-next-app .` dans un dossier non vide demande confirmation et **ne supprime pas** les dossiers existants (`_bmad/`, `docs/`, etc.) — il refuse seulement si des fichiers entrent en conflit avec ceux qu'il crée (peu probable ici). Si un conflit survient (ex. un `README.md`), résoudre manuellement plutôt que de vider le dossier.

### CI — contenu attendu de `.github/workflows/ci.yml`

- `name: CI`
- `on: { push: { branches: [main] }, pull_request: {} }`
- 1 job `quality` / `runs-on: ubuntu-latest` :
  1. `actions/checkout@v4`
  2. `actions/setup-node@v4` avec `node-version: '20'` et `cache: 'npm'`
  3. `npm ci`
  4. `npm run lint`
  5. `npm run typecheck`
- Toute étape en échec ⇒ job rouge ⇒ check rouge sur la PR. Pas de déploiement depuis la CI (Vercel s'en charge via son intégration Git).

### Étapes nécessitant une action de l'utilisateur (ne pas tenter d'automatiser silencieusement)

- **Création du dépôt GitHub** : demander nom + visibilité avant `gh repo create`.
- **Connexion Vercel** : `vercel login` puis `vercel` / `vercel link` sont interactifs → proposer à l'utilisateur de les lancer via `! <commande>` dans la session, ou de le faire depuis le dashboard Vercel (Import Project). Ne pas inventer de token.
- **Branch protection** (optionnel) : à faire par l'utilisateur dans les settings GitHub.

### Testing standards

Aucun framework de tests applicatifs n'est requis ni installé par cette story (pas de tests unitaires/e2e dans le périmètre — l'infra de tests E2E type Playwright n'est pas demandée au MVP). La « suite de tests » de cette story = les **3 portes de qualité** : `npm run build` (build réussi, routes statiques), `npm run lint` (0 erreur ESLint), `npm run typecheck` (`tsc --noEmit`, 0 erreur), exécutées en local **et** en CI. Critère de done : ces 3 commandes vertes en local, workflow CI vert, déploiement Vercel de prod vert et accessible.

### Project Structure Notes

- Pas de document `Architecture.md` ni `UX Design.md` formels : les décisions techniques viennent du PRD (§ Web App Specific Requirements / Implementation Considerations) et sont consolidées dans `epics.md` (AR1–AR12). Pas de `project-context.md` dans le repo.
- Choisir l'arborescence `src/` (option du scaffold) pour aligner avec la pratique Next.js moderne et garder la racine propre (les dossiers `_bmad*` y vivent déjà).
- L'alias d'import doit rester `@/*` (défaut Next) — les stories suivantes y comptent.
- Conflit potentiel : `create-next-app` génère un `README.md` ; s'il écrase quelque chose d'utile, fusionner manuellement. Sinon, RAS.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Scaffold du projet, déploiement statique & CI]
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements] — AR1 (scaffold), AR2 (rendu statique), AR3 (déploiement Vercel), AR9 (CI ESLint+TS, Lighthouse hors scope ici), AR12 (hors scope)
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 1: Fondations & shell bilingue déployé] — FR26 (déploiement auto sur push), FR28 (SSG), NFR17–NFR23
- [Source: _bmad-output/planning-artifacts/prd.md#Web App Specific Requirements] — Next.js App Router + TS strict + Tailwind, statique par défaut, Vercel, cibles navigateurs (2 dernières versions, pas d'IE)
- [Source: _bmad-output/planning-artifacts/prd.md#NFR18] — déploiement atomique / rollback ; [#NFR19] — propagation < ~2 min ; [#NFR22] — TS strict + ESLint en CI

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
