# Story 1.1: Scaffold du projet, déploiement statique & CI

Status: done

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

- [x] **Tâche 1 — Scaffolder le projet Next.js (AC: #1)**
  - [x] Exécuter `npx create-next-app@latest .` dans le dossier du projet (`C:\Users\Micha\Desktop\portfolio`) avec les options : **TypeScript = oui**, **ESLint = oui**, **Tailwind CSS = oui**, **App Router = oui**, **`src/` directory = oui** (recommandé), **import alias `@/*` = oui**, **Turbopack pour `next dev` = oui**. Refuser toute option « customize default import alias » autre que `@/*`. — _Note : `_bmad/` et `_bmad-output/` déplacés temporairement hors du dossier le temps du scaffold (create-next-app refuse un dossier contenant ces répertoires), puis restaurés. Version installée : **Next.js 16.2.6** (et non 15.x — `create-next-app@latest` livre désormais Next 16 ; App Router + React 19.2 + Tailwind v4, conforme à l'intention « dernière version »). Turbopack est le bundler par défaut en Next 16 (le flag `--turbopack` est donc implicite)._
  - [x] Vérifier `package.json` : scripts `dev`, `build`, `start`, `lint` présents ; dépendances `next` (~~15.x~~ **16.2.6**), `react` / `react-dom` (19.2.4), `typescript` (^5), `tailwindcss` (^4 via `@tailwindcss/postcss`), `eslint` (^9) + `eslint-config-next` (16.2.6). — _En Next 16, `next lint` est supprimé ; le script `lint` est `eslint` (flat config) — c'est attendu._
  - [x] Dans `tsconfig.json`, confirmer `"strict": true` (déjà posé par le scaffold). Ajouter explicitement, si absents : `"noUncheckedIndexedAccess": true` et `"noImplicitOverride": true` (durcissement aligné NFR22 — TS strict). — _Ajoutés._
  - [x] Ajouter un script `"typecheck": "tsc --noEmit"` à `package.json` (utilisé par la CI). — _Ajouté._
  - [x] Vérifier que `.gitignore` (généré par le scaffold) ignore `node_modules`, `.next`, `out`, `.vercel`, `*.log`, `.env*`. — _Vérifié (tous présents : `/node_modules`, `/.next/`, `/out/`, `.vercel`, `npm-debug.log*`, `.env*`)._
  - [x] Lancer `npm run dev` → page accessible sur `http://localhost:3000`. Lancer `npm run build` → build réussit, sortie des routes marquées `○ (Static)` / `● (SSG)`, aucune route `ƒ (Dynamic)`. Lancer `npm run lint` → 0 erreur. Lancer `npm run typecheck` → 0 erreur. — _`dev` : HTTP 200 sur `/`. `build` : succès, `/` et `/_not-found` marquées `○ (Static)`, aucune route dynamique. `lint` : 0 erreur. `typecheck` : 0 erreur._

- [x] **Tâche 2 — Garantir le rendu statique (AC: #1, #2)**
  - [x] Dans `next.config.ts` (ou `.mjs`), **ne PAS** activer `output: 'export'` (cela désactiverait l'optimisation `next/image` requise par AR8 ; Vercel pré-rend déjà les pages statiques). Laisser la config minimale ; ajouter un commentaire expliquant que le rendu statique est obtenu par SSG par défaut (pas de `fetch` dynamique, pas de `cookies()`/`headers()` dans les routes de pages à ce stade) et que Vercel sert ces pages depuis le CDN. — _Commentaire ajouté. `output: 'export'` non activé. Bonus : `turbopack.root` épinglé sur le dossier du projet pour neutraliser l'avertissement « multiple lockfiles » (un `package-lock.json` existe dans `$HOME`)._
  - [x] S'assurer qu'aucun fichier de page n'utilise `export const dynamic = 'force-dynamic'` ni d'API dynamique de requête. (Le middleware i18n viendra en Story 1.2b — hors scope ici.) — _Vérifié via grep sur `src/` : aucune occurrence._

- [x] **Tâche 3 — Initialiser le dépôt Git & commit initial (AC: #1)**
  - [x] `git init` (le dossier n'est pas encore un dépôt Git — vérifié). Définir la branche par défaut sur `main` (`git branch -M main`). — _`create-next-app` a déjà fait `git init` + un commit auto « Initial commit from Create Next App » ; branche renommée `main`._
  - [x] `git add -A` puis commit initial : `chore: scaffold Next.js App Router + TypeScript strict + Tailwind`. Suivre la convention de message du repo (Conventional Commits). Inclure le trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` uniquement si l'utilisateur le demande — sinon message simple. — _Commit auto du scaffold amendé en `chore: scaffold Next.js App Router + TypeScript strict + Tailwind` (message simple, pas de trailer), incluant `_bmad/`, `_bmad-output/`, `docs/`, `.claude/` et les fichiers générés. Second commit `ci: add GitHub Actions workflow running ESLint and tsc --noEmit`._
  - [x] Créer le dépôt distant GitHub (`gh repo create` ou via l'UI) et pousser `main`. **Demander à l'utilisateur** le nom/visibilité du dépôt avant de créer quoi que ce soit de distant. — _`gh` CLI installé (v2.92.0) mais l'auth interactive n'a pas abouti et `gh` se bloque dans l'environnement ; dépôt **`MMann5/portfolio`** créé **en public via l'UI GitHub** par l'utilisateur. `git remote add origin https://github.com/MMann5/portfolio.git` + `git push -u origin main` → branche `main` poussée (`2cec8d4`)._

- [x] **Tâche 4 — Connecter Vercel & valider le déploiement automatique (AC: #2)**
  - [x] Connecter le dépôt GitHub au projet Vercel (import via dashboard Vercel ou `vercel link` + `vercel git connect`). **Cette étape requiert une action de l'utilisateur** (login Vercel / autorisation GitHub) — proposer à l'utilisateur de lancer `vercel login` puis `vercel` via `! <commande>` dans la session. — _Projet importé via le dashboard Vercel par l'utilisateur. URL de prod : `https://portfolio-three-omega-48ezqd212w.vercel.app/` → HTTP 200, sert la page par défaut `Create Next App` (conforme à la note de portée)._
  - [x] Vérifier les réglages Vercel : Framework Preset = **Next.js** (détecté auto), build command = `next build` (défaut), output = géré par Vercel (ne PAS forcer « Other » / static export). — _Preset Next.js détecté auto, réglages par défaut conservés._
  - [x] Pousser un commit trivial sur `main` → confirmer qu'un déploiement de production se déclenche automatiquement, réussit, et que l'URL de prod sert le site. Vérifier le comportement atomique : un build qui échoue laisse la prod précédente en place (constat documenté, pas besoin de provoquer un échec réel si risqué — Vercel garantit ce comportement par conception). — _Commit `6ee10c4` (ajout d'un marqueur `public/deploy-check.txt`) poussé sur `main` → déploiement prod auto déclenché et réussi ; marqueur servi sur l'URL de prod. Marqueur retiré ensuite (`b8c7fb7`). Comportement atomique : garanti par conception Vercel (un build échoué ne remplace pas la prod) — non provoqué volontairement._
  - [x] Noter le temps de propagation observé (doit être < ~2 min pour une mise à jour de contenu) dans les Completion Notes. — _~19 s entre `git push` et la disponibilité du nouveau contenu sur l'URL de prod (≪ 2 min)._

- [x] **Tâche 5 — Pipeline CI GitHub Actions (AC: #3)**
  - [x] Créer `.github/workflows/ci.yml` : déclencheurs `push` (sur `main`) et `pull_request`. Un job `quality` sur `ubuntu-latest` : `actions/checkout@v4` → `actions/setup-node@v4` (Node `20`, `cache: 'npm'`) → `npm ci` → `npm run lint` → `npm run typecheck`. Le job échoue si l'une de ces étapes retourne un code non nul. — _Créé et commité._
  - [x] Vérifier que `package-lock.json` est commité (requis par `npm ci`). — _Vérifié : présent dans le commit initial._
  - [x] Ouvrir une PR de test (ou pousser sur une branche) pour confirmer que le check CI apparaît sur la PR et passe au vert. Optionnel : suggérer à l'utilisateur d'activer une *branch protection rule* exigeant ce check sur `main` (hors scope strict — mentionner seulement). — _PR #1 (`chore/ci-smoke-test`) ouverte par l'utilisateur ; check **CI / quality** vert ; PR mergée (`dadee9e`), branche supprimée. Marqueur de fumée retiré du `README.md` ensuite (`a298a19`). Branch protection : suggérée à l'utilisateur (optionnel, non requis par la story)._

- [x] **Tâche 6 — Validation finale (AC: #1, #2, #3)**
  - [x] Re-vérifier en local : `npm run build && npm run lint && npm run typecheck` → tout vert. — _Les 3 commandes : exit 0._
  - [x] Vérifier que le déploiement Vercel de prod est vert et accessible. — _`https://portfolio-three-omega-48ezqd212w.vercel.app/` → HTTP 200, dernier déploiement prod vert._
  - [x] Vérifier que le workflow CI est vert sur le dernier push/PR. — _Check CI vert sur la PR #1 et sur les pushes `main` (`dadee9e`, `a298a19`)._
  - [x] Remplir la section *Dev Agent Record* (modèle utilisé, notes, liste des fichiers). — _Voir ci-dessous._

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

claude-opus-4-7[1m] (Claude Opus 4.7, 1M context) — workflow `bmad-dev-story`

### Debug Log References

- `npx create-next-app@latest . --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --turbopack --use-npm --yes` — premier essai échoué (« directory contains files that could conflict: `_bmad/`, `_bmad-output/` »), résolu en déplaçant temporairement ces deux dossiers hors de l'arborescence puis en les restaurant après scaffold.
- `npm run typecheck` → exit 0 ; `npm run lint` → exit 0 (après ajout des `ignores` ESLint pour `_bmad/**`, `_bmad-output/**`, `docs/**` — sinon les fichiers de design de référence `.jsx` faisaient échouer le lint) ; `npm run build` → exit 0, routes `○ (Static)`.
- `npm run dev` (smoke test) → `GET / 200`.

### Completion Notes List

- **Scaffold réalisé avec Next.js 16.2.6** (et non 15.x comme anticipé dans les Dev Notes) : `create-next-app@latest` livre désormais Next 16. Stack effective : Next 16.2.6 (App Router, Turbopack par défaut), React 19.2.4, TypeScript ^5 (`strict` + `noUncheckedIndexedAccess` + `noImplicitOverride`), Tailwind CSS v4 (`@tailwindcss/postcss`, config CSS-first), ESLint 9 (flat config) + `eslint-config-next` 16.2.6. En Next 16, `next lint` est supprimé → script `lint` = `eslint`. Aucun impact négatif sur les ACs ; à signaler aux stories suivantes (1.2a/1.2b/1.3) qui référencent « Next 15 ».
- **Page servie** = page d'accueil par défaut de `create-next-app` (non modifiée, conformément à la note de portée).
- **Rendu statique** confirmé : `npm run build` ne génère que des routes `○ (Static)` (`/`, `/_not-found`) ; aucune route `ƒ (Dynamic)`. `output: 'export'` volontairement **non** activé (préserve `next/image`, cf. AR8). Commentaire explicatif ajouté dans `next.config.ts`.
- **Durcissement bonus** : `turbopack.root` épinglé sur le dossier du projet dans `next.config.ts` — il existe un `package-lock.json` parasite dans `$HOME` que Next inférait à tort comme racine du workspace.
- **Git** : `create-next-app` a auto-`git init` + créé un commit « Initial commit from Create Next App ». Branche renommée `main` ; ce commit amendé en `chore: scaffold Next.js App Router + TypeScript strict + Tailwind` (message simple, sans trailer Co-Authored-By, conformément à la consigne de la story) en incluant `_bmad/`, `_bmad-output/`, `docs/`, `.claude/`. Puis commit `ci: add GitHub Actions workflow running ESLint and tsc --noEmit`. Historique : `b5fc7dc` puis `2cec8d4`.
- **CI** : `.github/workflows/ci.yml` créé — `on: push (main) + pull_request`, job `quality` sur `ubuntu-latest` : checkout@v4 → setup-node@v4 (Node 20, cache npm) → `npm ci` → `npm run lint` → `npm run typecheck`. `package-lock.json` bien commité.
- **Dépôt GitHub** (Tâche 3.3) : ✅ `MMann5/portfolio` créé en public via l'UI, `main` poussé, remote `origin` configuré.
- **CI** (Tâche 5) : ✅ workflow vert sur la PR #1 (mergée) et sur `main`.
- **Vercel** (Tâche 4) : ✅ projet importé via le dashboard, preset Next.js auto, déploiement prod auto sur `push` vérifié, URL prod `https://portfolio-three-omega-48ezqd212w.vercel.app/` (HTTP 200, page par défaut). Déploiements atomiques garantis par conception Vercel.
- **Temps de propagation Vercel observé : ~19 s** (push → contenu en prod) — bien sous la cible ~2 min (NFR19).
- **Story DONE** : les 3 portes de qualité vertes en local + CI verte + déploiement Vercel prod vert et accessible. Note pour les stories suivantes (1.2a/1.2b/1.3) : stack effective = **Next 16.2.6** (et non 15.x) ; ESLint flat config avec `ignores` pour `_bmad/**`, `_bmad-output/**`, `docs/**`.

### File List

**Générés par `create-next-app` (puis ajustés) :**
- `package.json` — ajout du script `"typecheck": "tsc --noEmit"`
- `package-lock.json`
- `tsconfig.json` — ajout `"noUncheckedIndexedAccess": true`, `"noImplicitOverride": true`
- `next.config.ts` — commentaire « rendu statique / pas d'export », `turbopack.root`
- `eslint.config.mjs` — ajout des `ignores` `_bmad/**`, `_bmad-output/**`, `docs/**`
- `postcss.config.mjs`
- `next-env.d.ts`
- `.gitignore`
- `README.md`
- `AGENTS.md`, `CLAUDE.md` (référence `@AGENTS.md`)
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/app/favicon.ico`
- `public/*` (assets statiques du scaffold)

**Créés :**
- `.github/workflows/ci.yml`

## Change Log

- 2026-05-12 — Scaffold Next.js 16 (App Router, TS strict durci, Tailwind v4) + config qualité (`typecheck`, ESLint flat config ignorant les artefacts BMAD) + `next.config.ts` (rendu statique, `turbopack.root`) + dépôt Git local (branche `main`, commit initial) + workflow CI GitHub Actions (ESLint + `tsc --noEmit`). Validations locales `build`/`lint`/`typecheck` vertes. Story mise en pause (HALT) en attente des actions utilisateur : dépôt GitHub distant + connexion Vercel + PR de test CI. (Dev: claude-opus-4-7[1m])
- 2026-05-12 — Dépôt distant `MMann5/portfolio` créé en public (UI GitHub), `main` poussé (remote `origin`). PR de fumée #1 ouverte → check CI **quality** vert → mergée (`dadee9e`) ; marqueur retiré du README (`a298a19`). Tâches 3 et 5 terminées. Reste : Tâche 4 (connexion Vercel + déploiement auto) puis Tâche 6 (validation finale → `done`). (Dev: claude-opus-4-7[1m])
- 2026-05-12 — Projet importé sur Vercel (dashboard, preset Next.js auto), URL prod `https://portfolio-three-omega-48ezqd212w.vercel.app/` (HTTP 200). Déploiement prod auto sur `push main` vérifié via marqueur `public/deploy-check.txt` (commit `6ee10c4` → marqueur servi → retiré `b8c7fb7`) ; propagation ~19 s. Tâches 4 et 6 terminées. **Story → Status: done.** (Dev: claude-opus-4-7[1m])
