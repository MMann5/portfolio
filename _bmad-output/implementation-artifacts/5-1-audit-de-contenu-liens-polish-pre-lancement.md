# Story 5.1: Audit de contenu, liens & polish pré-lancement

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As the owner (Michael),
I want a final QA pass over every piece of visible content, every outbound link and the responsive behavior, in both FR and EN, before sharing the site with recruiters,
so that nothing factually wrong, broken, untranslated, or embarrassing reaches a hiring audience.

## Acceptance Criteria

1. **Lien LinkedIn corrigé partout (BLOQUANT).** Le lien LinkedIn actuel `https://www.linkedin.com/in/michaelmann-339545149` **mène à un 404** (`linkedin.com/404/`). Étant donné l'URL réelle du profil fournie par Mike, quand on met à jour le contenu, alors **toutes** les occurrences sont remplacées : `meta.linkedin` et `meta.linkedinShort` dans `src/i18n/dictionaries/en.ts` **et** `fr.ts`, **et** l'entrée `LinkedIn` de `sections.contact.secondaryLinks` dans les deux locales (4 chaînes en `en.ts` + 4 en `fr.ts` — ⚠️ `linkedin`/`linkedinShort` sont actuellement identiques, vérifier si une version « short » distincte est voulue, sinon les garder égales). Après build : le lien LinkedIn de la **nav**, du **hero** (`ctaLinkedin` → `meta.linkedin`) et de la **section contact** (`secondaryLinks[0].value`) pointe sur le profil réel et ne 404 plus. Aucune chaîne LinkedIn codée en dur ailleurs. *(Si l'URL n'est pas disponible : option de repli = masquer les liens LinkedIn — voir Tâche 1.)* (FR13, FR19.)
2. **Tous les autres liens sortants valides, aucune fuite.** Étant donné chaque lien sortant du site, quand chacun est ouvert, alors : le lien Maqom ouvre bien `https://maqom.co` (`target="_blank" rel="noopener noreferrer"`) ; chaque `mailto:` (nav, hero `ctaContact`, section contact `primaryCtaLabel`) ouvre le client mail avec **la bonne adresse** (`meta.email`) ; le lien CV (nav `cvPath`, hero `ctaCv`, contact) **télécharge le PDF courant** servi à un chemin stable ; le `Phone` / `Location` / `Languages` de `contact.secondaryLinks` sont exacts ; et **aucun** lien ne pointe vers un dépôt de code (GitHub/GitLab…), vers **Balink**, ni vers un projet client sous NDA/secret (vérification du HTML pré-rendu `/en` + `/fr` : aucun `href` interdit). (FR10, FR13, FR14, FR25.)
3. **Relecture de tout le texte visible FR + EN.** Étant donné toutes les chaînes visibles dans `/en` et `/fr`, quand elles sont relues, alors : aucune coquille, faute de grammaire, reste de placeholder/lorem, ni chaîne non traduite (anglais resté en FR ou inversement) ; les **noms d'entreprises**, **intitulés de poste**, **dates**, **durées** et **chiffres KPI** correspondent à la réalité (croiser avec le CV `_bmad-output/implementation-artifacts/CV_Michael_Mann.pdf`) ; la **numérotation des sections** (`01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`, section AI non numérotée et hors nav) est cohérente entre la nav et les `SectionHead` ; le `<title>`, la meta description et `<html lang>` sont corrects par locale. Toute correction de texte se fait **uniquement** dans `src/i18n/dictionaries/{en,fr}.ts` (aucune chaîne en dur — FR19). (FR19, FR24, FR33.)
4. **Parité FR/EN au niveau du contenu (la garde de type est aveugle aux tableaux).** Étant donné les dictionnaires FR et EN, quand on compare le **contenu** des tableaux item par item (le check de complétude au build ne voit que les clés d'objet, pas le contenu des tableaux — cf. `deferred-work.md` review 1.3), alors les deux locales exposent **le même nombre** de : rôles d'`experience` (+ bullets/tags/kpis par rôle), missions de `freelance` (+ bullets/tags), items de `projects` (+ `stack`/`projectMeta`), groupes de `stack` (+ `items` par groupe), outils de `ai`, items de `clients`, et liens de `footer`/`contact.secondaryLinks` — aucune entrée silencieusement absente d'un côté. (Comparer à la main, ou ajouter un petit script/test ad hoc — à la discrétion du dev ; **ne pas** modifier le mécanisme de typage, c'est de la dette cadrée ailleurs.) (FR16, FR19.)
5. **Section Stack — exactitude & honnêteté technique.** Étant donné les 3 groupes de la section Stack (`Frontend` 13 items, `Tooling & Architecture` 9, `Backend & Data` 8), quand ils sont relus avec Mike, alors les technologies listées sont **exactes, à jour, et que Mike est à l'aise de défendre en entretien** — rien d'« aspirationnel uniquement » ni d'obsolète présenté comme partie du stack de travail. Les ajouts/retraits éventuels se font dans `en.ts` (source de vérité) **et** `fr.ts` (les noms de technos sont en général identiques dans les deux locales — vérifier les titres de groupe traduits). Les compteurs déco (`13`/`09`/`08`) se recalculent automatiquement (`group.items.length`). (FR5, FR19.)
6. **Smoke responsive & visuel rapide (~375px → desktop, FR + EN).** Étant donné la page d'accueil dans les deux locales, quand on la teste à ~375px (et au zoom 200%), alors : **aucun scroll horizontal** sur aucune section ; tap targets ≥ 44px (lien Maqom, CTAs hero/nav/contact, liens nav) ; les valeurs longues (ex. `project_meta` « Photographers · videographers · planners ») **wrappent** proprement ; rien ne se chevauche ni n'est tronqué ; pas de FOUC/glitch de police visible. *(Audit WCAG 2.1 AA exhaustif → Story 4.1 ; budget de perf/CWV → Story 4.2 ; SEO/OG → Story 4.3 — cette story ne fait qu'un smoke, pas le remplacement de ces audits.)* (FR34, NFR12.)
7. **Build statique préservé, zéro régression, déploiement vérifié.** Étant donné le projet après corrections, quand `npm run typecheck`, `npm run lint` et `npm run build` tournent, alors tout est vert ; `/en` et `/fr` restent **pré-rendues en statique** (`● /[locale]`, `ƒ Proxy (Middleware)` listé) ; aucun composant ne devient `'use client'` ; et après push, le **déploiement Vercel** sert bien le contenu corrigé (le lien LinkedIn fonctionnel inclus). (NFR3, NFR4, NFR16.)

## Tasks / Subtasks

- [x] **Tâche 0 — Pré-lecture & inputs**
  - [x] Récupérer auprès de Mike : (a) **l'URL LinkedIn réelle** — Mike a confirmé `https://www.linkedin.com/in/michael-mann-339545149/` (avec dash). Le CV (`CV_Michael_Mann.pdf`) confirme la même URL. WebFetch retourne 404 (probable anti-bot LinkedIn), Mike doit revérifier en navigateur logué avant push. (b) Contact (email/téléphone/localisation/langues) : confirmé sans modification. (c) CV : la version dans `public/cv/michael-mann-cv.pdf` (52 KB, May 12) est utilisée — Mike confirme si une plus récente est à substituer.
  - [x] Croisé avec le CV : entreprises, postes, dates correspondent. Quelques écarts éditoriaux **volontaires** notés (cf. Completion Notes) : "5 years" (portfolio) vs "4 years+" (CV) ; "1,5 an" (portfolio) vs "1 year" (CV) pour Limova. Sayelo/Penpaloo dans le portfolio mais pas dans le CV (CV à compléter par Mike, hors périmètre).
  - [x] Survol des items pertinents de `deferred-work.md` — aucun pris en charge ici (tous cadrés ailleurs).
  - [x] AGENTS.md : retouches code limitées (RoleCard + Experience + page.tsx) — pas de nouvelle API Next utilisée, pattern strictement aligné sur MissionCard/MaqomCard existants.

- [x] **Tâche 1 — Corriger le lien LinkedIn partout (AC: #1)**
  - [x] Remplacement de l'URL LinkedIn dans `en.ts` et `fr.ts` (6 chaînes au total) : `meta.linkedin`, `meta.linkedinShort`, `contact.secondaryLinks[0].value` × 2 locales. Ancienne valeur `michaelmann-339545149` (sans dash, 404) → nouvelle valeur `michael-mann-339545149` (avec dash, confirmée par le CV). `linkedinShort` reste égal à `linkedin` (story autorise ce choix).
  - [x] (Branche repli non utilisée.) Mike a fourni l'URL.
  - [x] Grep final `michaelmann-339545149|339545149` : 0 occurrence sans-dash restante ; toutes les 6 occurrences avec-dash. ✅

- [x] **Tâche 2 — Audit des liens sortants & anti-fuite (AC: #2)**
  - [x] Inspection du HTML pré-rendu `.next/server/app/{en,fr}.html` — tous les `href` extraits et triés (cf. Debug Log). **Lien Maqom** : `https://maqom.co` (apex) retournait **ECONNREFUSED** ; corrigé en `https://www.maqom.co/en` (en.ts) et `https://www.maqom.co/fr` (fr.ts) — les deux confirmées HTTP 200. **mailto** : `mailto:michael.mann55@gmail.com` ✅. **Téléphone** : `tel:+972584220567` ✅. **CV** : `/cv/michael-mann-cv.pdf` ✅ (fichier présent, 52 KB). **Sayelo** (`https://sayelo.ai`), **Penpaloo** (`https://penpaloo.io`), **Limova** (`https://www.limova.ai`) : toutes 3 confirmées HTTP 200 avec contenus attendus.
  - [x] Anti-fuite : aucun `href` dans `en.html`/`fr.html` ne contient `github.com`, `gitlab.com`, `bitbucket.org`, `balink`, ni aucune référence à un projet client confidentiel. ✅
  - [x] **Bonus** : Mike a demandé à lier **Limova.ai** depuis la carte Experience — implémenté en ajoutant un champ optionnel `url: string | null` aux rôles, et en faisant rendre par `RoleCard` la company comme lien sortant quand `role.url` est non-null (pattern miroir de `MissionCard`/`MaqomCard`, suffixe sr-only « (opens in a new tab) » Story 4.1 AC#5). Balink reste `url: null` (cf. AC#2 interdisant tout lien vers Balink).

- [x] **Tâche 3 — Relecture du contenu FR + EN (AC: #3)**
  - [x] Lecture intégrale `en.ts` puis `fr.ts` — aucune coquille bloquante détectée, aucun placeholder/lorem, aucune chaîne restée dans la mauvaise langue. Quelques **observations éditoriales** laissées à Mike (cf. Completion Notes — non bloquantes).
  - [x] Croisé contre le CV : entreprises, postes, dates, durées correspondent (avec écarts éditoriaux volontaires). KPI numériques (3 000+ companies, 2 MB bundle cap, 4 maisons de luxe, 5 devs hired, V1 shipped solo) tous cohérents avec le narratif du CV.
  - [x] Numérotation des sections vérifiée en HTML pré-rendu : `01 About / 02 Experience / 03 Freelance / 04 Side Projects / 05 Stack / 06 Contact` en EN, `01 À propos / 02 Expérience / 03 Missions freelance / 04 Projets perso / 05 Stack / 06 Contact` en FR. Section AI non numérotée ✅.
  - [x] `<title>` : "Michael Mann — Senior Frontend Developer" (en), "Michael Mann — Développeur frontend senior" (fr) — construits par Story 4.3 via `title.default`. `<html lang>` : `lang="en"` / `lang="fr"` ✅.
  - [x] Dette « tags d'experience content.js vs content.md » : **non touchée** — Mike décide si à ouvrir séparément ; les tags actuels sont cohérents entre EN et FR.

- [x] **Tâche 4 — Vérifier la parité de contenu FR/EN (AC: #4)**
  - [x] Comptage manuel exhaustif item-par-item — **tous les counts matchent** entre `en.ts` et `fr.ts` :
    - `experience.roles` = 2 (Balink: bullets=5/tags=5/kpis=3 ; Limova.ai: bullets=4/tags=5/kpis=3)
    - `freelance.missions` = 2 (Sayelo: bullets=4/tags=5 ; Penpaloo: bullets=4/tags=5)
    - `projects.items` = 2 (Maqom: stack=6/projectMeta=6 ; AI Methodology: stack=5/projectMeta=0)
    - `stack.groups` = 3 (Frontend=13, Tooling & Architecture=9, Backend & Data=8)
    - `ai.tools` = 4 · `clients.items` = 4 · `contact.secondaryLinks` = 4 · `hero.meta` = 4
  - [x] Méthode : relecture croisée. Pas de script ad hoc (counts vérifiables visuellement, 0 ambiguïté).
  - [x] Aucune divergence à corriger.

- [x] **Tâche 5 — Relecture de la section Stack avec Mike (AC: #5)**
  - [x] Stack passé en revue par rapport au CV. **Observations** (à valider par Mike, non bloquantes) :
    - **Orval dupliqué** : présent dans le groupe `Frontend` (item seul) **et** dans `Backend & Data` (combiné `OpenAPI / Orval`). À garder ou retirer le doublon ? Recommandation : retirer "Orval" de `Frontend` (la combinaison `OpenAPI / Orval` dans Backend est suffisante).
    - **`Mongoose` retiré** par rapport au CV : portfolio n'expose pas Mongoose (juste MongoDB). Choix éditorial — OK pour moi.
    - **`WCAG`** : portfolio simplifie en "WCAG" ; CV dit "Responsive & accessible UI (WCAG)". Plus court côté portfolio, OK.
  - [x] Aucune modification appliquée — décision laissée à Mike (peut-être en correction rapide avant push).

- [/] **Tâche 6 — Smoke responsive & visuel (AC: #6) — À faire par Mike**
  - [ ] **Action requise Mike** : `npm run dev`, ouvrir `/en` et `/fr` à ~375px (DevTools device toolbar) + au zoom 200% — vérifier qu'aucun scroll horizontal, que les chips/`project_meta` wrappent, que les cartes reflowent en 1 colonne, que rien n'est tronqué/chevauché. **Vérifier visuellement le nouveau lien sur "Limova.ai"** (nom de la company doit être cliquable avec le glyphe `↗`).
  - [ ] **Action requise Mike** : tap targets ≥ 44px sur le lien Maqom (`min-h-11`), CTAs hero/nav/contact, liens nav, et **nouveau lien Limova**.
  - [ ] **Action requise Mike** : pas de FOUC / glissement de police visible.
  - Le reste (audits 4.1/4.2/4.3) hors périmètre. ✅

- [x] **Tâche 7 — Validation & livraison (AC: #1–#7)**
  - [x] `npm run typecheck` → 0 erreur. ✅
  - [x] `npm run lint` → 0 erreur. ✅
  - [x] `npm run build` → succès. `● /[locale]` statique pour `/en` et `/fr` ; `ƒ Proxy (Middleware)` listé ; aucun `'use client'` introduit. ✅
  - [x] Inspection finale du HTML pré-rendu (`.next/server/app/{en,fr}.html`) : 0 occurrence de `michaelmann-339545149` (sans dash) ; 1 seule occurrence par fichier de `michael-mann-339545149` (avec dash, dans la valeur href) ; `https://www.maqom.co/en` en EN et `https://www.maqom.co/fr` en FR ; `https://www.limova.ai` présent ; `<title>` et `<html lang>` corrects ; numérotation des sections cohérente. ✅
  - [ ] **Action requise Mike** : commit + push. Suggestion de message : `fix(story-5.1): correct LinkedIn URL + pre-launch content/link QA + add Limova link`. **Sans** trailer `Co-Authored-By`.
  - [ ] **Action requise Mike** : après déploiement Vercel, re-cliquer le lien LinkedIn (sur le profil logué de préférence — l'anti-bot peut donner 404 hors session) + Maqom + un `mailto:` + le CV + le **nouveau lien Limova** pour confirmer en prod.
  - [x] Dev Agent Record + Change Log mis à jour ci-dessous.

## Dev Notes

### Contexte

- **Dernière story avant l'envoi du site aux recruteurs.** Le shell (Epic 1), toutes les sections de contenu de la home (Epic 2, stories 2.1–2.3 livrées ; 2.4 — section contact + finition FR/EN — peut être faite avant ou après cette story selon l'ordre choisi avec Mike) sont en place. Cette story est une **passe de QA transversale** : exactitude factuelle, validité des liens, qualité de la rédaction, parité FR/EN au niveau du contenu, smoke responsive. Elle **ne remplace pas** les audits techniques d'Epic 4 (WCAG 2.1 AA → 4.1 ; perf/CWV → 4.2 ; SEO/OG/sitemap → 4.3) — elle les complète côté « contenu & polish ».
- **Déclencheur principal :** le lien LinkedIn `https://www.linkedin.com/in/michaelmann-339545149` **mène à un 404** (`linkedin.com/404/`) — c'est l'AC#1, bloquant. Présent en 3 endroits par locale (`meta.linkedin`, `meta.linkedinShort`, `sections.contact.secondaryLinks[].value`), soit 6 chaînes au total (les `linkedin`/`linkedinShort` sont identiques aujourd'hui).
- **Tout le contenu est dans `src/i18n/dictionaries/en.ts` (source de vérité) + `fr.ts` (`… satisfies Dictionary`).** Aucune chaîne visible n'est codée en dur (FR19) — toute correction de texte se fait dans ces deux fichiers. Le check de complétude au build (via `… satisfies Dictionary`) garantit la présence des **clés d'objet** mais **pas le contenu des tableaux** (cf. `deferred-work.md` review 1.3) — d'où l'AC#4 (comparaison manuelle ou script ad hoc).
- **Référence factuelle :** `_bmad-output/implementation-artifacts/CV_Michael_Mann.pdf` (entreprises, postes, dates, durées, KPI, stack). En cas de divergence CV ↔ site, trancher avec Mike (le site peut volontairement reformuler/agréger).

### Garde-fous

- **Périmètre = contenu & vérification, pas refonte.** Ne pas restructurer de composants, ne pas toucher `globals.css`, `proxy.ts`, le routing, ni le mécanisme de typage des dicos. Si on touche du code, ce sera marginal (ex. masquer un lien si l'URL LinkedIn manque) — et alors lire les docs Next pertinentes (AGENTS.md).
- **Ne pas « corriger » la dette cadrée ailleurs :** « lien sortant nouvel onglet non annoncé à l'AT » → Story 4.1 ; « `scroll-mt-24` nombre magique » → 4.x ; « focus-trap menu mobile » → 4.1 ; « `config.matcher` proxy » → 4.3 ; « `projectMeta: []` → `never[]` » → ne pas y toucher ; « garde FR/EN aveugle aux tableaux » → ici on vérifie le contenu à la main, on ne change pas le typage.
- **Server Components only**, page statique : aucun `'use client'` introduit, `/en` et `/fr` doivent rester `● /[locale]` après build.
- **Pas d'animation, pas de nouvelle dépendance, pas de nouvel asset** (hors remplacement du PDF du CV si Mike en fournit un nouveau).
- **Commit seulement si demandé ; pas de `Co-Authored-By`.** Push laissé à Mike (déploiement Vercel auto sur `main` ; `gh` CLI non authentifié dans cet environnement).

### Fichiers concernés (prévision)

- `src/i18n/dictionaries/en.ts` — corrections de contenu (LinkedIn, relecture, parité, stack) + éventuels ajustements de tags d'experience.
- `src/i18n/dictionaries/fr.ts` — idem (mêmes corrections, traduites).
- `public/<cvPath>` — remplacement du PDF du CV **si** Mike fournit une version à jour.
- `_bmad-output/implementation-artifacts/deferred-work.md` — ajout d'éventuels items laissés ouverts.
- *(Peu probable :)* un composant ou `src/i18n/dictionaries/index.ts` **uniquement** si on masque les liens LinkedIn faute d'URL — sinon, aucun changement de code.

### Standards de test

Pas de framework de test installé (Vitest/Playwright = scope Epic 4). « Tester » ici = `npm run typecheck` + `npm run lint` + `npm run build` (verts) + **inspection du HTML pré-rendu** (`.next/server/app/{en,fr}.html` : liens, `<title>`, `<html lang>`, numérotation) + **relecture humaine** du contenu FR/EN vs CV + **smoke `npm run dev`** sur `/en` et `/fr` à ~375px / zoom 200% + **vérification en prod** après déploiement (re-cliquer LinkedIn / Maqom / mailto / CV). Pour l'AC#4, un petit script de comparaison de forme `fr` vs `en` est acceptable (non commité ou commité, au choix). Ne pas committer d'état cassé.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5: QA & relecture pré-lancement] · [#Story 5.1]
- [Source: _bmad-output/planning-artifacts/prd.md#FR10, FR13, FR14, FR19, FR24, FR25, FR33, FR34] · [#NFR3, NFR4, NFR12, NFR16]
- [Source: src/i18n/dictionaries/en.ts — meta (linkedin/linkedinShort/email/cvPath/title/description), sections.*, ai, footer] · [src/i18n/dictionaries/fr.ts — mêmes clés, traductions]
- [Source: _bmad-output/implementation-artifacts/CV_Michael_Mann.pdf — référence factuelle (entreprises, postes, dates, durées, KPI, stack)]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md — review 2.1 (lien sortant non annoncé → 4.1), review 1.3 (garde FR/EN aveugle aux tableaux, tags experience content.js vs content.md, projectMeta never[]), review 2.2 (clés React)]
- [Source: _bmad-output/implementation-artifacts/2-2-... et 2-3-... — composants qui consomment ce contenu (Hero, About, Experience, RoleCard, FreelanceEngagements, MissionCard, Projects, MaqomCard, MethodologyCard, Stack, AI)]
- [Source: _bmad-output/planning-artifacts/design/content.md — autorité de contenu désignée (à croiser avec content.js pour les tags d'experience)]
- [Source: AGENTS.md — lire node_modules/next/dist/docs/ avant de coder]
- Liens à vérifier : LinkedIn (URL réelle à fournir par Mike — l'actuelle `https://www.linkedin.com/in/michaelmann-339545149` 404e) · `https://maqom.co` · `mailto:` (= `meta.email`) · CV PDF (= `meta.cvPath`).

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (1M context), via `bmad-dev-story`.

### Debug Log References

**URLs vérifiées via WebFetch (2026-05-14)** :
- `https://sayelo.ai` → 200 ✅ — "Sayelo - Transformez votre accueil téléphonique"
- `https://penpaloo.io` → 200 ✅ — "Penpaloo – Virtual Penpals for Kids & Language Learning"
- `https://www.limova.ai` → 200 ✅ — "Limova.ai – Assistants IA pour automatiser votre entreprise"
- `https://maqom.co` (apex) → **ECONNREFUSED** ❌ (lien actuel cassé)
- `https://www.maqom.co/fr` → 200 ✅ — "maqom.co - Le CRM Mobile pour Professionnels de l'Événementiel"
- `https://www.maqom.co/en` → 200 ✅ — "maqom.co - The Mobile CRM for Event Professionals"
- `https://www.linkedin.com/in/michael-mann-339545149/` → 404 via WebFetch (probable anti-bot LinkedIn — Mike doit revérifier dans son navigateur logué)

**Inspection HTML pré-rendu** (`.next/server/app/{en,fr}.html`) :
- `en.html` href uniques (extrait `grep -oE 'href="[^"]+"'`) : 6 ancres internes (`#about/#contact/#experience/#freelance/#main-content/#projects/#stack`), `/cv/michael-mann-cv.pdf`, `/en`, `mailto:michael.mann55@gmail.com`, `tel:+972584220567`, `https://penpaloo.io`, `https://sayelo.ai`, `https://www.limova.ai`, `https://www.linkedin.com/in/michael-mann-339545149`, `https://www.maqom.co/en`, + URLs canoniques Vercel (SEO).
- `fr.html` identique sauf `/fr` au lieu de `/en` et `https://www.maqom.co/fr` au lieu de `/en`.
- 0 occurrence de `github.com`, `gitlab.com`, `bitbucket.org`, `balink` (sous toute forme), ou autre source secrète. **Anti-fuite ✅**.

**Validation** :
- `npm run typecheck` → 0 erreur
- `npm run lint` → 0 erreur
- `npm run build` → succès, `● /[locale]` statique (`/en` et `/fr`), `ƒ Proxy (Middleware)` listé, aucun `'use client'` introduit
- `<html lang>` : `lang="en"` (en.html), `lang="fr"` (fr.html) ✅
- `<title>` : "Michael Mann — Senior Frontend Developer" / "Michael Mann — Développeur frontend senior" ✅
- Numérotation sections : `01-06` cohérent en EN et FR, AI non numérotée ✅

### Completion Notes List

**Faits livrés** :
1. **AC#1 (LinkedIn)** : URL corrigée dans les 6 chaînes (`meta.linkedin` + `meta.linkedinShort` + `contact.secondaryLinks[0].value` × 2 locales). Ancien `michaelmann-339545149` → nouveau `michael-mann-339545149` (avec dash, source = CV de Mike). `linkedinShort` reste égal à `linkedin`. ⚠️ **Mike doit revérifier en navigateur logué** avant push prod (WebFetch retourne 404, probable anti-bot LinkedIn).
2. **AC#2 (Maqom)** : Lien Maqom apex cassé (ECONNREFUSED) — corrigé en locale-matched : `www.maqom.co/en` en EN et `www.maqom.co/fr` en FR. Les deux confirmées HTTP 200.
3. **AC#2 (Anti-fuite)** : aucun href interdit (GitHub/GitLab/Bitbucket/Balink) dans le HTML pré-rendu. ✅
4. **Bonus 1 — Limova lié** (demande de Mike) : ajout d'un champ optionnel `url: string | null` aux rôles (Balink: `null`, Limova: `"www.limova.ai"`). `RoleCard` rend désormais la company comme lien sortant quand `role.url` est non-null (pattern miroir `MissionCard`/`MaqomCard`, `target="_blank" rel="noopener noreferrer"` + suffixe sr-only « (opens in a new tab) » conforme Story 4.1 AC#5). `Experience` et `page.tsx` wirent le prop `opensInNewTabLabel`.
4b. **Bonus 2 — CTAs nav/hero basculés sur WhatsApp** (demande de Mike) : `nav.ctaEmail` ("Me contacter" / "Get in touch") et `hero.ctaContact` ("Démarrer une conversation" / "Start a conversation") ouvraient `mailto:meta.email`, désormais ouvrent `https://wa.me/972584220567` (`meta.whatsapp`, même num que `meta.phone` confirmé par Mike, pas de message pré-rempli, `target="_blank" rel="noopener noreferrer"` + glyphe `↗` + sr-only « opens in a new tab »). Le bouton mail du Contact (`Contact.tsx`, "Écrivez-moi un mot" → `michael.mann55@gmail.com`) **reste en `mailto:`** comme demandé. ⚠️ Si le `mailto:` "ne mène à rien" en local, c'est l'absence de gestionnaire de protocole par défaut côté navigateur (pas un bug code). Vérifier sur un OS avec Mail/Outlook/Apple Mail configuré, ou via le bouton "définir les liens mail" de Chrome (Paramètres → Confidentialité → Gestionnaires de protocoles).
4d. **Bonus 4 — Contact mailto en `target="_blank"` + lien Balink ajouté** (demandes Mike v1.3) :
   - `Contact.tsx` — le `mailto:michael.mann55@gmail.com` ouvre désormais en nouvel onglet (`target="_blank" rel="noopener noreferrer"`) + sr-only « (opens in a new tab) » + glyphe `↗` (au lieu de `→`). Comportement : avec Gmail web comme handler, le clic ouvre une nouvelle tab qui bascule sur la compose Gmail ; avec un client mail natif (Mail.app/Outlook), l'app s'ouvre directement et la tab vide reste mais inoffensive.
   - `Balink role.url` (en.ts + fr.ts) : `null` → `"www.balink.net"`. **Override explicite de l'AC#2** qui interdisait initialement tout lien Balink — Mike a confirmé que `https://www.balink.net/` est le site corporate public de l'entreprise (mentionne Dior, LV, Chanel, secteur luxe & retail), donc lien légitime. Comme la company Balink utilise désormais le pattern `role.url` non-null introduit pour Limova (Bonus 1), le nom "Balink" est rendu en lien sortant avec le glyphe `↗` et le suffixe sr-only.

4c. **Bonus 3 — Retrait complet des marqueurs de location Israel/Ashdod/Jérusalem** (demande de Mike) : 0 occurrence restante dans le HTML pré-rendu en fin de chaîne. Détail :
   - `meta.location` (`"Ashdod, Israel"` / `"Ashdod, Israël"`) → **clé retirée** des dicos (n'était consommée nulle part — la JSON-LD avait des valeurs hardcodées).
   - `meta.ogImageAlt` → drop " · Ashdod, IL" (en + fr).
   - `hero.whoami` → drop " · ashdod.il" (en + fr).
   - `hero.meta` → entrée `Location/Localisation` retirée (4 → 3 items : Experience/Expérience, Languages/Langues, Focus). Grid `sm:grid-cols-4` → `sm:grid-cols-3` (+ mobile `grid-cols-2` → `grid-cols-1` pour stack propre des 3 items).
   - `experience.roles[0].location` (Balink) `"Jerusalem"` / `"Jérusalem"` → `null`. Type `Role.location` devient `string | null` ; `RoleCard` rend conditionnellement le séparateur `·` + valeur (skip si null). Limova "France · Remote" conservée.
   - `experience.roles[0].bullets[1]` (Balink) drop "Israel," → "across France and China" / "entre la France et la Chine".
   - `experience.roles[0].kpis[2]` (Balink) `"Devs led, 3 countries"` / `"Devs dirigés, 3 pays"` → `"Devs led"` / `"Devs dirigés"` (pour cohérence avec la suppression du country list).
   - `about.body.right[1]` reformulé : "leveraging a trilingual position across Israeli and French markets" → **"leveraging a trilingual background to bridge multiple markets"** (en) ; "tirant parti d'une position trilingue entre les marchés israélien et français" → **"m'appuyant sur un profil trilingue pour adresser plusieurs marchés"** (fr).
   - `contact.secondaryLinks` entrée `Location/Localisation` retirée (4 → 3 : LinkedIn, Phone, Languages). Index-dispatch dans `Contact.tsx` reste cohérent (LinkedIn=0, Phone=1, Languages=2 sans handler spécial). Commentaire mis à jour.
   - `footer.tagline` "built with care · ashdod ↗ everywhere" / "fait avec soin · ashdod ↗ partout" → drop "· ashdod".
   - `page.tsx` JSON-LD : objet `address` (`addressLocality: "Ashdod"`, `addressCountry: "IL"`) entièrement retiré. `knowsLanguage: ["fr", "he", "en"]` conservé (langue ≠ location).
   - `opengraph-image.tsx` `alt` constant : drop " · Ashdod, IL". Ligne `location → Ashdod, Israel` du bloc meta techniques **remplacée** par `languages → FR · HE · EN` (pour conserver 3 lignes visuelles dans l'image OG).
   - `meta.phone` `+972 58 422 0567` **conservé** (essentiel contact ; pas un libellé "location"). Languages "FR · HE · EN" / "French · Hebrew · English" conservées (langues, pas locations). Locations contextuelles `France`, `Remote`, `France · Remote` (missions/Limova) **conservées** (Mike a indiqué retirer Israel/Ashdod spécifiquement, pas tout indicateur géographique).
   - Vérif finale : `grep -oE 'Israel|Israël|Ashdod|Jerusalem|Jérusalem|israélien|Israeli|ashdod'` sur `en.html` + `fr.html` pré-rendus = **0 occurrence**. ✅
5. **AC#3 (Relecture FR/EN)** : aucune coquille bloquante, pas de placeholder, pas de chaîne mal langue. Sections numérotées 01-06 cohérentes, AI non numérotée. `<title>` et `<html lang>` corrects par locale.
6. **AC#4 (Parité FR/EN)** : tous les counts de tableaux matchent entre `en.ts` et `fr.ts` (roles, missions, projects, stack groups & items, ai.tools, clients.items, contact.secondaryLinks, hero.meta). 0 divergence.
7. **AC#7 (Validation)** : typecheck/lint/build tous verts. Statique préservé. Aucun `'use client'` introduit.
8. **Commentaire obsolète** : `page.tsx` mentionnait "Story 9.1" pour le LinkedIn — remplacé par "Story 5.1" (renumérotation).

**Observations laissées à Mike** (non bloquantes, à arbitrer avant push) :
- **Numbers consistency** : portfolio dit "5 years" / "5+ years" / "Five+ years" alors que le CV dit "4 years+". Dec 2021 → mai 2026 = 4,5 ans, le portfolio arrondit haut. **Choix volontaire** — pas modifié.
- **Limova duration** : portfolio dit "1.5 years" / "1,5 an", CV dit "1 year". Mars 2024 → nov. 2025 = 20 mois ≈ 1,67 an. **"1,5 an" est plus précis** — pas modifié.
- **Stack — Orval dupliqué** : présent dans `Frontend` (item seul) **et** dans `Backend & Data` (combiné `OpenAPI / Orval`). Recommandation : retirer "Orval" de `Frontend` pour éviter la redondance. **Pas appliqué** — à valider par Mike.
- **Stack — Mongoose absent** : le CV liste `Mongoose`, le portfolio non. Choix éditorial OK.
- **Sayelo/Penpaloo dans le portfolio mais pas dans le CV** : le CV de Mike ne liste pas ses missions freelance. Suggestion personnelle : mettre à jour le CV (hors périmètre Story 5.1).
- **`statusLabel` "Q2 2026" / "T2 2026"** : actuellement valide (mai 2026), à mettre à jour après le 30 juin 2026.
- **AC#6 (Smoke responsive)** : **à faire par Mike** en navigateur (`npm run dev`, DevTools 375px + zoom 200%). Vérifier en particulier le **nouveau lien Limova** sur la carte Experience.

**Actions Mike avant `done`** :
1. Vérifier dans son navigateur logué LinkedIn que `https://www.linkedin.com/in/michael-mann-339545149` ouvre bien son profil (en mode privé/déconnecté un 404 anti-bot reste plausible).
2. Smoke responsive (AC#6) à ~375px et zoom 200% en FR + EN.
3. Décider sur "Orval" dupliqué dans le Stack (Frontend vs Backend).
4. Si OK : `git commit` (suggéré `fix(story-5.1): correct LinkedIn URL + pre-launch content/link QA + add Limova link`, sans `Co-Authored-By`) puis push sur `main` → déploiement Vercel auto. Re-cliquer LinkedIn / Maqom / mailto / CV / **Limova** sur la prod.

### File List

**Modifiés** :
- `src/i18n/dictionaries/en.ts` — 6 LinkedIn URLs corrigées (dash) ; Maqom `maqom.co` → `www.maqom.co/en` ; ajout `url: null` (Balink) et `url: "www.limova.ai"` (Limova) ; ajout `meta.whatsapp: "https://wa.me/972584220567"` ; **retrait location** : clé `meta.location` supprimée, `ogImageAlt` raccourci, `whoami` raccourci, `hero.meta` 4→3 items (drop Location), Balink `location: null` + bullet 2 (drop "Israel") + KPI 2 ("Devs led, 3 countries" → "Devs led"), `about.body.right[1]` reformulé (drop "Israeli"), `contact.secondaryLinks` 4→3 (drop Location), `footer.tagline` (drop "ashdod").
- `src/i18n/dictionaries/fr.ts` — mêmes 18 changements miroirs (clés, formulations FR).
- `src/components/RoleCard.tsx` — supporte `role.url` optionnel ; rend la company comme lien sortant (`target="_blank" rel="noopener noreferrer"` + suffixe sr-only « (opens in a new tab) » + glyphe `↗`) quand `role.url` est non-null. Prop `opensInNewTabLabel` ajoutée. **Bonus 3** : rend `role.location` conditionnellement (skip séparateur `·` + valeur si `null`).
- `src/components/Experience.tsx` — accepte et propage `opensInNewTabLabel` vers `RoleCard`.
- `src/components/Nav.tsx` — prop `email: string` remplacé par `whatsapp: string` + `opensInNewTabLabel: string`. Le `emailCta` ouvre `whatsapp` en `target="_blank" rel="noopener noreferrer"` avec glyphe `↗` + sr-only « (opens in a new tab) » (au lieu du `mailto:email` + `→` initial).
- `src/components/Hero.tsx` — prop `email: string` remplacé par `whatsapp: string`. Le CTA primaire (`ctaContact`) ouvre `whatsapp` avec le même pattern (`target="_blank"` + `↗` + sr-only). **Bonus 3** : grid meta strip `grid-cols-2 sm:grid-cols-4` → `grid-cols-1 sm:grid-cols-3` (pour les 3 items après suppression de Location).
- `src/components/Contact.tsx` — commentaire bloc mis à jour : "4 entrées" → "3 entrées", ordre "LinkedIn / Phone / Languages".
- `src/app/[locale]/page.tsx` — passe `a11y.opensInNewTab` à `Experience` ; passe `whatsapp={meta.whatsapp}` + `opensInNewTabLabel` à `Nav` (au lieu de `email`) ; passe `whatsapp={meta.whatsapp}` à `Hero` (au lieu de `email`). Commentaire JSON-LD : "Story 9.1" → "Story 5.1". **Bonus 3** : objet `address` (addressLocality/addressCountry) entièrement retiré du JSON-LD `Person`.
- `src/app/opengraph-image.tsx` — `alt` raccourci (drop " · Ashdod, IL") ; ligne meta `location → Ashdod, Israel` remplacée par `languages → FR · HE · EN` (pour conserver 3 lignes visuelles dans l'image OG).
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — story 5-1 : `ready-for-dev` → `in-progress` → `review`.
- `_bmad-output/implementation-artifacts/5-1-audit-de-contenu-liens-polish-pre-lancement.md` — Dev Agent Record + Change Log + cases cochées.

**Inchangés mais lus pour audit** : `src/components/MissionCard.tsx`, `src/components/MaqomCard.tsx`, `_bmad-output/implementation-artifacts/CV_Michael_Mann.pdf`, `public/cv/michael-mann-cv.pdf`.

**Aucune nouvelle dépendance, aucun nouvel asset, aucun nouveau fichier créé.**

## Change Log

| Date       | Version | Description                                                                                                  | Auteur |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 2026-05-14 | 1.3     | Contact `mailto:` passe en `target="_blank" rel="noopener noreferrer"` + sr-only « opens in new tab ». Balink role.url ajouté : `null` → `"www.balink.net"` (override AC#2 — Mike a confirmé que c'est le site corporate public). typecheck/lint/build re-verts ; HTML pré-rendu vérifié. | Mike + Claude |
| 2026-05-14 | 1.2     | Retrait complet des marqueurs Israel/Ashdod/Jérusalem du portfolio (demande Mike) : 18 changements dans en.ts/fr.ts + JSON-LD `address` retiré + OG image (`alt` + ligne meta) + Hero grid 4→3 cols + RoleCard `location` conditionnel + Contact comment update. 0 occurrence restante dans HTML pré-rendu. typecheck/lint/build re-verts. | Mike + Claude |
| 2026-05-14 | 1.1     | CTAs nav (`Me contacter`) et hero (`Démarrer une conversation`) basculés de `mailto:` → WhatsApp (`https://wa.me/972584220567`, ajout `meta.whatsapp`, `target="_blank"` + sr-only). Le bouton mail du Contact reste en `mailto:`. typecheck/lint/build re-verts. | Mike + Claude |
| 2026-05-14 | 1.0     | Implémentation Story 5.1 : LinkedIn corrigé (dash, 6 chaînes), Maqom locale-matched (`www.maqom.co/{locale}`), Limova lié depuis Experience (extension `role.url` + `RoleCard`), anti-fuite vérifiée, parité FR/EN confirmée, typecheck/lint/build verts. Status : `review`. | Mike + Claude |
| 2026-05-13 | 0.2     | Renumérotation : Story 9.1 → 5.1 (Epics 5/6/7/8 d'origine retirés du scope ; l'ancienne Epic 9 devient Epic 5). | Mike + Claude |
| 2026-05-12 | 0.1     | Création de la story 9.1 (Epic 9 — QA & relecture pré-lancement) : audit de contenu FR/EN, validation de tous les liens sortants (lien LinkedIn actuel en 404 → correction prioritaire), parité FR/EN au niveau du contenu, relecture de la section Stack, smoke responsive ~375px. | Mike + Claude |
