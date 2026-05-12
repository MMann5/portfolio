# Story 9.1: Audit de contenu, liens & polish pré-lancement

Status: ready-for-dev

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

- [ ] **Tâche 0 — Pré-lecture & inputs**
  - [ ] Récupérer auprès de Mike : (a) **l'URL LinkedIn réelle** (vérifiée en navigation privée — celle dans le code, `…/in/michaelmann-339545149`, 404e), (b) confirmation de l'**adresse email** (`meta.email`), du **téléphone**, de la **localisation** et des **langues** affichés dans `contact.secondaryLinks`, (c) le **CV à jour** (PDF) si une nouvelle version existe.
  - [ ] Croiser avec le CV : `_bmad-output/implementation-artifacts/CV_Michael_Mann.pdf` (entreprises, postes, dates, durées, KPI, stack).
  - [ ] Lire `_bmad-output/implementation-artifacts/deferred-work.md` (items pertinents : « lien LinkedIn nouvel onglet non annoncé » review 2.1 — ne **pas** le « corriger » ici, c'est cadré Story 4.1 ; « garde FR/EN aveugle aux tableaux » review 1.3 — base de l'AC#4 ; « tags d'experience source content.js vs content.md » — à arbitrer avec Mike ici ou en 2.4 ; « projectMeta: [] → never[] » — ne pas y toucher).
  - [ ] AGENTS.md : si une retouche touche du code (peu probable — surtout du contenu de dico), survoler les docs Next pertinentes dans `node_modules/next/dist/docs/`.

- [ ] **Tâche 1 — Corriger le lien LinkedIn partout (AC: #1)**
  - [ ] Si l'URL réelle est fournie : remplacer dans `src/i18n/dictionaries/en.ts` → `meta.linkedin`, `meta.linkedinShort` ; et `sections.contact.secondaryLinks` (entrée `{ label: "LinkedIn", value: … }`). Idem dans `src/i18n/dictionaries/fr.ts` (mêmes 3 endroits). Décider si `linkedinShort` doit être un alias court distinct (ex. `linkedin.com/in/michaelmann`) ou rester égal à `linkedin` — documenter.
  - [ ] Si l'URL réelle **n'est pas** disponible : masquer proprement les liens LinkedIn (nav `ctaLinkedin`/équivalent, hero `ctaLinkedin`, entrée `LinkedIn` de `secondaryLinks`) sans casser les layouts — et noter dans le Debug Log + ajouter un item `deferred-work.md` « réactiver LinkedIn une fois l'URL confirmée ». *(À éviter si possible — préférer obtenir l'URL.)*
  - [ ] Vérifier qu'aucune autre occurrence de `linkedin`/`linkedin.com`/`339545149` ne subsiste codée en dur (`grep`).

- [ ] **Tâche 2 — Audit des liens sortants & anti-fuite (AC: #2)**
  - [ ] Inspecter le HTML pré-rendu (`.next/server/app/{en,fr}.html`) : lister tous les `href`/`mailto:` ; vérifier le lien Maqom (`https://maqom.co`, `target="_blank" rel="noopener noreferrer"`), les `mailto:meta.email`, le `cvPath`.
  - [ ] Vérifier que **aucun** `href` ne pointe vers : un dépôt de code (`github.com`, `gitlab.com`, `bitbucket.org`…), `balink` (sous toute forme), ou un projet client sous secret. (FR10.)
  - [ ] Vérifier le fichier CV : présent dans `public/` au chemin de `meta.cvPath`, à jour, et le lien le télécharge bien (header `Content-Disposition`/attribut `download` selon l'implémentation Story 1.3/2.4).

- [ ] **Tâche 3 — Relecture du contenu FR + EN (AC: #3)**
  - [ ] Relire `src/i18n/dictionaries/en.ts` puis `src/i18n/dictionaries/fr.ts` section par section (`meta`, `nav`, `hero`, `clients`, `sections.{about,experience,freelance,projects,stack,contact}`, `ai`, `footer`, `langSwitcher`) : coquilles, grammaire, ponctuation, cohérence terminologique, aucune chaîne restée dans la mauvaise langue, aucun placeholder.
  - [ ] Vérifier l'exactitude factuelle vs CV : noms d'entreprises (`experience.roles[].company`), `location`, `title`, `dates`, `duration`, `kpis[].value`/`label`, bullets ; missions freelance (`freelance.missions[].name`/`title`/`dates`/`duration`/`url`/`status`/bullets) ; projets (`projects.items[].name`/`url`/`status`/`tagline`/`description`/`descriptionTwo`/`stack`/`projectMeta`).
  - [ ] Vérifier la numérotation des sections (`num` dans chaque `sections.*`) et que la nav (`Object.values(sections)`) + les `SectionHead` affichent `01…06` cohérents, AI non numérotée.
  - [ ] Vérifier `meta` : `title`, `description` (par locale), `email`, `cvPath`, `linkedin*` — et que `<html lang>` / `<title>` du HTML pré-rendu correspondent.
  - [ ] Arbitrer avec Mike la dette « tags d'experience : `content.js` vs `content.md` » (review 1.3) — figer les tags voulus dans les deux locales.

- [ ] **Tâche 4 — Vérifier la parité de contenu FR/EN (AC: #4)**
  - [ ] Comparer item par item le contenu des tableaux entre `en.ts` et `fr.ts` : nombre de `experience.roles` et, par rôle, `bullets`/`tags`/`kpis` ; `freelance.missions` et, par mission, `bullets`/`tags` ; `projects.items` et, par item, `stack`/`projectMeta` ; `stack.groups` et, par groupe, `items` ; `ai.tools` ; `clients.items` ; `footer`/`contact.secondaryLinks`.
  - [ ] Méthode au choix : relecture croisée manuelle, ou petit script ad hoc / test runtime comparant la « forme » de `fr` et `en` (compte d'éléments par chemin). **Ne pas** modifier le mécanisme de typage (`as const`, tuples…) — c'est de la dette cadrée séparément ; si une garantie plus forte est jugée nécessaire, l'ouvrir comme item `deferred-work.md`.
  - [ ] Corriger toute divergence trouvée (ajouter l'entrée manquante du bon côté, traduite).

- [ ] **Tâche 5 — Relecture de la section Stack avec Mike (AC: #5)**
  - [ ] Passer en revue les 3 groupes (`Frontend`, `Tooling & Architecture`, `Backend & Data`) et leurs items ; retirer ce qui est obsolète / purement aspirationnel, ajouter ce qui manque — Mike valide « je peux en parler en entretien ».
  - [ ] Répercuter les changements dans `en.ts` **et** `fr.ts` (vérifier les titres de groupe traduits ; les noms de technos sont en général identiques). Les compteurs déco se recalculent seuls.

- [ ] **Tâche 6 — Smoke responsive & visuel (AC: #6)**
  - [ ] `npm run dev` (si dispo) : `/en` **et** `/fr` à ~375px (DevTools device toolbar) — parcourir toutes les sections : **aucun scroll horizontal**, chips qui wrappent, `project_meta` qui wrappe, cartes qui reflowent en 1 colonne, rien de tronqué/chevauché. Refaire au zoom 200%.
  - [ ] Vérifier les tap targets ≥ 44px (lien Maqom `min-h-11`, CTAs hero/nav/contact, liens nav).
  - [ ] Vérifier qu'il n'y a pas de FOUC / faux-italique / glissement de police visible au chargement.
  - [ ] *(Hors périmètre — ne pas faire ici :)* audit clavier/ARIA complet (Story 4.1), Lighthouse/CWV (Story 4.2), OG/Twitter/JSON-LD/sitemap (Story 4.3), audit fin à 320px (Story 4.2).

- [ ] **Tâche 7 — Validation & livraison (AC: #1–#7)**
  - [ ] `npm run typecheck` → 0 erreur (⚠️ si on ajoute un `projectMeta` non vide côté méthodo en corrigeant la parité, attention au `never[]` — préférer ne pas toucher ce champ ; sinon prévoir un type explicite, mais ça déborde alors sur la dette 1.3 → en discuter).
  - [ ] `npm run lint` → 0 erreur.
  - [ ] `npm run build` → succès ; `● /[locale]` statique pour `/en` et `/fr` ; `ƒ Proxy (Middleware)` listé ; aucun `'use client'` introduit.
  - [ ] Inspection finale du HTML pré-rendu : lien LinkedIn = profil réel (plus de `339545149`) ; aucun `href` interdit ; `<title>`/`<html lang>` corrects ; numérotation des sections cohérente.
  - [ ] Commit Conventional Commits, message simple, **sans** trailer `Co-Authored-By` (sauf demande explicite). Suggestion : `fix(story-9.1): correct LinkedIn URL + pre-launch content/link QA`. *(Commit/push laissés à la discrétion de Mike — convention du repo.)*
  - [ ] Push sur `main` → déploiement Vercel auto ; ouvrir l'URL déployée et **re-cliquer le lien LinkedIn** + le lien Maqom + un `mailto:` + le CV pour confirmer en prod.
  - [ ] Remplir le *Dev Agent Record* (modèle, Debug Log, Completion Notes, File List) + le *Change Log* ; reporter dans `deferred-work.md` tout point laissé ouvert.

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

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 9: QA & relecture pré-lancement] · [#Story 9.1]
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

### Debug Log References

### Completion Notes List

### File List

## Change Log

| Date       | Version | Description                                                                                                  | Auteur |
| ---------- | ------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 2026-05-12 | 0.1     | Création de la story 9.1 (Epic 9 — QA & relecture pré-lancement) : audit de contenu FR/EN, validation de tous les liens sortants (lien LinkedIn actuel en 404 → correction prioritaire), parité FR/EN au niveau du contenu, relecture de la section Stack, smoke responsive ~375px. | Mike + Claude |
