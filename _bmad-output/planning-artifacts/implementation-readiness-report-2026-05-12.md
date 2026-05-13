---
stepsCompleted: [step-01-document-discovery, step-02-prd-analysis, step-03-epic-coverage-validation, step-04-ux-alignment, step-05-epic-quality-review, step-06-final-assessment]
documentsIncluded:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/epics.md
  - _bmad-output/planning-artifacts/product-brief-portfolio.md
  - _bmad-output/planning-artifacts/design/ (UX informel)
documentsMissing:
  - architecture (aucun document trouvé — confirmé par l'utilisateur de procéder sans)
---

# Implementation Readiness Assessment Report

**Date:** 2026-05-12
**Project:** portfolio

> ⚠️ **Snapshot du 2026-05-12 — partiellement superseded au 2026-05-13.**
> Les Epics 5 (analytics privacy-friendly), 6 (blog — déjà retiré le 2026-05-12), 7 (Growth — case studies / « now »/changelog / CI durci) et 8 (Vision — hébreu RTL / variantes de design) ont été **retirées du scope le 2026-05-13** ; l'ancienne Epic 9 (QA & relecture pré-lancement) devient **Epic 5**. Les exigences associées (FR20–FR23, FR29, NFR24, AR10, UX-DR20) sont retirées dans `prd.md` et `epics.md`. Toute analyse de couverture FR/NFR/AR ci-dessous référençant ces epics doit être considérée comme historique — voir `prd.md` et `epics.md` pour l'état courant.

## 1. Document Inventory

**Documents inclus dans l'évaluation :**
- PRD : `_bmad-output/planning-artifacts/prd.md` (38.9 Ko, 12 mai 2026)
- Epics & Stories : `_bmad-output/planning-artifacts/epics.md` (50.9 Ko, 12 mai 2026)
- Product Brief : `_bmad-output/planning-artifacts/product-brief-portfolio.md` (+ distillate)
- UX (informel) : dossier `_bmad-output/planning-artifacts/design/` — `content.md`, `Minimal.jsx`, `Portfolio.html`, logos & splash assets

**Documents manquants :**
- ⚠️ **Architecture** — non trouvé. L'utilisateur a confirmé de procéder sans ; le rapport note l'impact sur la traçabilité technique.
- ⚠️ **Spec UX formelle** — absente ; le dossier `design/` est utilisé comme source UX informelle.

**Aucun doublon de format détecté.**

## 2. PRD Analysis

**Source :** `prd.md` (lu intégralement). Classification : site portfolio statique Next.js App Router / TS strict / Tailwind, FR/EN, complexité faible, greenfield, release phasée.

### Functional Requirements (36)

**A. Présentation du contenu portfolio** — FR1 hero (nom, titre, accroche, sous-accroche, meta strip, badge dispo) · FR2 about (positionnement) · FR3 experience (rôles + KPI + tags) · FR4 side projects (Maqom vedette + lien `maqom.co`) · FR5 stack (3 groupes) · FR6 AI & Agentic (4 outils) · FR7 marquee marques clientes (décoratif) · FR8 contact (CTA email + secondaires) · FR9 footer (copyright) · FR10 aucun lien repo/Balink.

**B. Navigation & CTA** — FR11 nav persistante vers chaque section · FR12 CTA email depuis nav+hero+contact · FR13 LinkedIn depuis nav/hero/contact · FR14 CV téléchargeable · FR15 badge dispo cohérent nav+hero.

**C. Internationalisation** — FR16 site intégral FR ou EN · FR17 bascule langue à tout moment, persistante · FR18 contenu localisé SEO (URLs, `hreflang`, `lang`) · FR19 aucun texte en dur hors dico.

**D. Blog** — FR20 ajout article MDX sans toucher la présentation · FR21 section/nav blog masquées tant que vide · FR22 *(Post-MVP)* liste + lecture article · FR23 *(Post-MVP)* RSS.

**E. Édition & maintenance** — FR24 contenu portfolio depuis source centralisée typée FR+EN · FR25 remplacement fichier CV · FR26 déploiement automatique sur push.

**F. Découvrabilité, partage & mesure** — FR27 métadonnées SEO/partage (OG, Twitter, JSON-LD Person, sitemap, robots) · FR28 site indexable & pré-rendu sans JS · FR29 mesure privacy-friendly visites + CTA contact.

**G. Expérience visuelle & interactions** — FR30 curseur perso sur pointeur fin (off tactile) · FR31 fondu au scroll · FR32 `prefers-reduced-motion` neutralise curseur/fade-in/marquee · FR33 fidélité direction « Technical Minimal » · FR34 responsive ~375px→desktop, pas de scroll horizontal.

**H. Accessibilité** — FR35 clavier complet + focus visible + skip-link · FR36 libellés & structure cohérents pour lecteurs d'écran.

**Total FR : 36** (FR22, FR23 explicitement Post-MVP).

### Non-Functional Requirements (27)

- **Performance** — NFR1 CWV mobile (LCP<2s, FCP<1,5s, CLS<0,1, INP<200ms) · NFR2 Lighthouse Perf≥95 / A11y=100 / BP≥95 / SEO≥95 · NFR3 JS initial <~150KB gzip, scripts non critiques différés · NFR4 polices auto-hébergées, preload Inter, pas de FOIT · NFR5 images AVIF/WebP, lazy, pas de CLS image · NFR6 animations `transform`/`opacity`, ~60fps · NFR7 poids total accueil <~600KB (indicatif).
- **Accessibility** — NFR8 WCAG 2.1 AA · NFR9 contraste ≥4,5:1 texte courant · NFR10 clavier complet, focus visible, skip-link · NFR11 `prefers-reduced-motion` neutralise animations · NFR12 sémantique (1 `<h1>`, hiérarchie, repères, libellés icônes, décoratif hors a11y tree), 0 erreur axe/Lighthouse · NFR13 curseur perso ne masque jamais le curseur système.
- **Compatibility** — NFR14 2 dernières versions Chrome/Edge/Firefox/Safari desktop+mobile · NFR15 dégradation gracieuse `backdrop-filter`/`mix-blend-mode` · NFR16 pas de scroll horizontal de ~320px aux grands écrans.
- **Reliability & Operability** — NFR17 statique CDN Vercel, dispo ≥99,9% · NFR18 déploiement auto sur push, atomique/rollback · NFR19 propagation <~2min.
- **Maintainability** — NFR20 contenu centralisé/typé/séparé de la présentation · NFR21 contenu intégral FR+EN, absence détectable, aucune chaîne en dur · NFR22 TS strict + ESLint en CI, Lighthouse en CI (bloquant à terme, souhaitable MVP) · NFR23 composants portés fidèlement de `Minimal.jsx` avec référence visuelle.
- **Privacy & Compliance** — NFR24 analytics privacy-friendly sans cookie, RGPD sans bannière · NFR25 aucune PII visiteur collectée/transmise.
- **SEO & Discoverability** — NFR26 contenu pré-rendu dans le HTML initial · NFR27 métadonnées complètes (titre/description par langue, OG+Twitter+image, JSON-LD Person, sitemap, robots, hreflang, canonique).

**Total NFR : 27.**

### Additional Requirements / Contraintes
- Stack imposée : Next.js App Router, TS strict, Tailwind (+ shadcn/ui au besoin), SSG, Vercel ; pas de backend/auth/DB/temps réel/PWA/CLI.
- i18n : `app/[locale]/...` ou middleware + cookie ; dictionnaire typé unique dérivé de `content.js`/`content.md`.
- Blog : MDX dans `content/blog/`, section masquée tant que vide (dérivée au build).
- Portage composants de référence : `Nav`, `GridSection`, `Hero`, `Clients`, `SectionHead`, `About`, `RoleCard`/`Experience`, `Projects`, `Stack`, `AI`, `Contact`, `Footer`, `CustomCursor`, hook `useScrollFadeIn`.
- Assets : logos SVG, splash → favicon set + OG image + manifest.
- Hors V1 explicite : lien Balink, liens repos, articles éditoriaux, case studies dédiées, hébreu, CMS/auth/backend, PWA, A/B testing.
- Risque connu : contrastes `#a3a3a3`/`#888` sur `#0a0a0a` possiblement sous AA → audit + ajustement.

### PRD Completeness Assessment (initial)
PRD complet et de haute qualité : exigences numérotées et atomiques (FR1–36, NFR1–27), critères de succès mesurables, 5 parcours utilisateurs avec mapping de capacités, scoping phasé clair, spécificités web (perf, SEO, a11y, i18n) développées, risques + mitigations. Zones à valider en aval : (a) arbitrage URLs localisées vs middleware/cookie « laissé à l'archi » — or **aucun document d'architecture n'existe** ; (b) « repli EN-only » comme option de dernier recours — à clarifier dans le scope des epics ; (c) check Lighthouse en CI « souhaitable » en MVP — statut ambigu.

## 3. Epic Coverage Validation

**Source :** `epics.md` (lu intégralement). Le document inclut un *Requirements Inventory* (FR1–36, NFR1–27), des *Additional Requirements* (AR1–AR12), des *UX Design Requirements* (UX-DR1–UX-DR21), une *FR Coverage Map*, 8 epics et 18 stories.

### Coverage Matrix

| FR | Exigence (résumé) | Couverture epics/stories | Statut |
|---|---|---|---|
| FR1 | Hero | Epic 2 / Story 2.1 | ✓ Couvert |
| FR2 | About | Epic 2 / Story 2.2 | ✓ Couvert |
| FR3 | Experience + KPI | Epic 2 / Story 2.2 (+ Epic 7 case studies) | ✓ Couvert |
| FR4 | Side projects / Maqom + lien | Epic 2 / Story 2.3 | ✓ Couvert |
| FR5 | Stack (3 groupes) | Epic 2 / Story 2.3 | ✓ Couvert |
| FR6 | AI & Agentic (4 cartes) | Epic 2 / Story 2.3 | ✓ Couvert |
| FR7 | Marquee marques clientes | Epic 2 / Story 2.1 (animation Epic 3 / Story 3.1) | ✓ Couvert |
| FR8 | Contact | Epic 2 / Story 2.4 | ✓ Couvert |
| FR9 | Footer | Epic 1 / Story 1.3 | ✓ Couvert |
| FR10 | Aucun lien repo/Balink | Epic 2 / Story 2.4 | ✓ Couvert |
| FR11 | Nav persistante | Epic 1 / Story 1.3 | ✓ Couvert |
| FR12 | CTA email nav+hero+contact | Epic 1 (nav) + Epic 2 / Stories 2.1, 2.4 | ✓ Couvert |
| FR13 | LinkedIn | Epic 2 / Stories 2.1, 2.4 | ✓ Couvert |
| FR14 | CV téléchargeable | Epic 1 / Story 1.3 (lien) + Epic 2 / Story 2.4 (fichier) | ✓ Couvert |
| FR15 | Badge dispo nav+hero | Epic 1 / Story 1.3 + Epic 2 / Story 2.1 | ✓ Couvert |
| FR16 | Site intégral FR/EN | Epic 1 / Story 1.2 (infra) + Epic 2 (contenu) | ✓ Couvert |
| FR17 | Bascule langue persistante | Epic 1 / Story 1.2 | ✓ Couvert |
| FR18 | Contenu localisé SEO | Epic 1 / Story 1.2 (`lang`, URLs) + Epic 4 / Story 4.3 (`hreflang`, canonical) | ✓ Couvert |
| FR19 | Aucun texte en dur | Epic 1 / Stories 1.2, 1.3 | ✓ Couvert |
| FR20 | Ajout article MDX | Epic 6 / Story 6.1 | ✓ Couvert |
| FR21 | Blog masqué tant que vide | Epic 6 / Story 6.1 | ✓ Couvert |
| FR22 | *(Post-MVP)* Liste + lecture article | Epic 6 / Story 6.2 | ✓ Couvert (Post-MVP) |
| FR23 | *(Post-MVP)* RSS | Epic 6 / Story 6.2 | ✓ Couvert (Post-MVP) |
| FR24 | Contenu centralisé typé FR+EN | Epic 1 / Story 1.3 (modèle) + Epic 2 / Story 2.4 (renseigné) | ✓ Couvert |
| FR25 | Remplacement CV | Epic 2 / Story 2.4 | ✓ Couvert |
| FR26 | Déploiement auto sur push | Epic 1 / Story 1.1 | ✓ Couvert |
| FR27 | Métadonnées SEO/partage | Epic 4 / Story 4.3 | ✓ Couvert |
| FR28 | Indexable & pré-rendu sans JS | Epic 1 / Story 1.3 (SSG) + Epic 4 / Story 4.3 (vérif crawl) | ✓ Couvert |
| FR29 | Mesure privacy-friendly | Epic 5 / Story 5.1 | ✓ Couvert |
| FR30 | Curseur perso (pointeur fin) | Epic 3 / Story 3.2 | ✓ Couvert |
| FR31 | Fondu au scroll | Epic 3 / Story 3.1 | ✓ Couvert |
| FR32 | `prefers-reduced-motion` | Epic 3 / Stories 3.1, 3.2 | ✓ Couvert |
| FR33 | Fidélité « Technical Minimal » | Epic 1 / Story 1.2 (tokens/polices) + Epic 2 (sections) + Epic 3 / Story 3.2 (passe finale) | ✓ Couvert |
| FR34 | Responsive ~375px→desktop | Epic 2 / Story 2.4 (par section) + Epic 4 / Story 4.2 (audit ~320px) | ✓ Couvert |
| FR35 | Clavier + focus + skip-link | Epic 4 / Story 4.1 | ✓ Couvert |
| FR36 | Libellés & structure lecteur d'écran | Epic 4 / Story 4.1 | ✓ Couvert |

### Éléments présents dans les epics mais hors FR1–36 du PRD
- **Section « Freelance Engagements » + composant `MissionCard`** (Epic 2 / Story 2.2, UX-DR21) : nouvelle section `03 — Freelance Engagements` (missions type `sayelo.ai`, `penpaloo.io`), avec renumérotation des labels de section (`01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`). Issue de `content.md`, pas du PRD. ⚠️ **Le PRD n'a pas été mis à jour pour refléter cette section** — incohérence PRD↔epics↔contenu à réconcilier (le PRD couvre J3 « freelance » dans les parcours mais ne définit ni section dédiée ni FR associé).
- **Epic 7** (case studies dédiées, page « now »/changelog, CI Lighthouse durci) et **Epic 8** (hébreu RTL, variantes de design) : extensions Post-MVP cohérentes avec les Phases 2/3 du PRD, sans FR dédié (extensions de FR3/FR4/FR16/FR17/FR33, durcissement de NFR22). OK.

### Couverture NFR (synthèse — analyse détaillée à l'étape ultérieure)
Les 27 NFR sont rattachés à des epics (Epic 1 : NFR4, 14, 17–23 partiel ; Epic 3 : NFR6, 11, 15 ; Epic 4 : NFR1–3, 5, 7–10, 12, 13, 16, 22, 26, 27 ; Epic 5 : NFR24, 25). Couverture NFR apparente : 27/27.

### Coverage Statistics
- Total PRD FRs : **36**
- FRs couverts dans les epics : **36** (dont 2 Post-MVP : FR22, FR23)
- **Pourcentage de couverture FR : 100 %**
- Aucun FR manquant. ⚠️ 1 ajout hors-PRD (section Freelance Engagements) → PRD à mettre à jour pour rester la source de vérité.

## 4. UX Alignment Assessment

### UX Document Status
**Pas de document UX formel** (`*ux*.md`). En revanche, l'UX est matérialisée par : (a) le dossier `design/` — `content.md`/`content.js` (contenu réel FR/EN), `Portfolio.html` / `Minimal.jsx` / `design-canvas (3).jsx` (design de référence « Technical Minimal ») ; (b) la section *Web App Specific Requirements* du PRD (responsive, perf, a11y, browser matrix, implementation considerations) ; (c) les 21 *UX Design Requirements* (UX-DR1–UX-DR21) cadrées dans `epics.md`, chacune rattachée à des stories. C'est une couverture UX fonctionnelle pour un projet de cette taille, même si elle n'est pas centralisée dans un livrable dédié.

### Alignement UX ↔ PRD
- **Cohérent globalement** : les UX-DR couvrent les composants et comportements décrits dans le PRD (hero dense above-the-fold, marquee décoratif, About 2 colonnes, RoleCard + KPI rows, terminal-card Maqom, Stack 3 groupes, AI 4 cartes, Contact, Footer, CustomCursor, useScrollFadeIn, responsive, a11y transverse).
- ⚠️ **Écart majeur — section « Freelance Engagements » (UX-DR21)** : présente dans `content.md` et dans les epics, **absente du PRD**. Renumérotation des labels de section induite (`01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`). Le PRD doit être amendé (ajout d'une section + FR correspondant + mise à jour de la liste des sections en §Product Scope / §FR1–10) pour éviter une divergence source-de-vérité.
- ⚠️ **Numérotation des sections** : le PRD/`Portfolio.html` parlent de `01 — About`, `02 — Experience`… sans « Freelance Engagements » ; `content.md` impose la nouvelle numérotation. À figer une bonne fois (le PRD est l'autorité officielle, mais c'est `content.md` qui est à jour).
- ✓ Parcours utilisateurs du PRD (J1–J5) correctement traduits en capacités → stories (cf. §3).

### Alignement UX ↔ Architecture
- ⚠️ **Aucun document d'architecture** — l'arbitrage technique structurant pour l'UX (i18n : segments `app/[locale]/...` **ou** middleware + cookie ; structure des routes localisées ; stratégie de chargement du `CustomCursor` via `next/dynamic` ; pipeline favicon/OG/manifest ; pipeline MDX + détection au build pour le démasquage du blog) est dispersé entre le PRD (§Implementation Considerations) et `epics.md` (AR1–AR12). C'est suffisant pour démarrer (projet faible complexité, stack maîtrisée), **mais l'arbitrage i18n routing n'est pas tranché** — il est explicitement laissé « à l'archi » dans le PRD et reste en « ou » dans AR4. À décider avant Story 1.2.
- ✓ Les contraintes de perf (NFR1–7) supportent l'UX visée : animations `transform`/`opacity`, IntersectionObserver, `next/dynamic` pour le curseur, `next/font` auto-hébergé, `next/image` — tout est cohérent avec le design de référence.
- ⚠️ **Contrastes du design de référence** (`#a3a3a3`/`#888` sur `#0a0a0a`) — risque connu (AR11/UX-DR1/Story 4.1) : l'audit pourrait forcer un ajustement des tokens, donc un léger écart visuel assumé vs `Minimal.jsx`. Bien tracé.

### Warnings
- ⚠️ **W-UX-1** : Pas de document UX ni d'architecture formels — décisions UX/techniques dispersées (PRD §Web App + epics AR/UX-DR). Acceptable pour ce projet, mais réduit la traçabilité ; recommandation : ne pas créer ces docs maintenant, mais consolider l'arbitrage i18n routing dans `epics.md`/Story 1.2.
- ⚠️ **W-UX-2** : Section « Freelance Engagements » dans le contenu/epics mais pas dans le PRD → mettre le PRD à jour (FR + §Scope + numérotation des sections).
- ⚠️ **W-UX-3** : Arbitrage i18n routing (`app/[locale]` vs middleware+cookie) non tranché — à décider avant l'implémentation de l'i18n.

## 5. Epic Quality Review

**Référentiel :** standards `create-epics-and-stories` (epics = valeur utilisateur, indépendance des epics, pas de dépendances vers le futur, sizing et complétude des stories, AC en Given/When/Then testables, traçabilité aux FR). Périmètre revu : 8 epics, 18 stories.

### Structure des epics — valeur utilisateur & indépendance

| Epic | Valeur utilisateur | Indépendance | Verdict |
|---|---|---|---|
| 1 — Fondations & shell bilingue déployé | ✓ « visiteur charge une page rapide, en FR/EN, nav persistante + footer + identité visuelle » — page réellement consultable. Story 1.1 (scaffold + déploiement + CI) est purement technique mais **attendue et légitime pour un greenfield** (setup + CI/CD tôt). | Autonome. | ✅ OK |
| 2 — Page d'accueil, toutes les sections | ✓ forte (le portfolio lisible de bout en bout). | N'utilise qu'Epic 1 ; fonctionne sans Epic 3 (animations) ni Epic 4 (audit). | ✅ OK |
| 3 — Mouvement, curseur & fidélité | ✓ polish/fidélité (preuve du craft). | Dépend d'Epic 1+2 (rétro — OK). | ✅ OK |
| 4 — Accessibilité, perf & SEO — prêt au lancement | ✓ (site utilisable au clavier/lecteur d'écran, rapide, partageable). | Dépend d'Epic 1+2 et logiquement d'Epic 3 (mesure perf du curseur `next/dynamic`) — rétro, OK ; l'ordre 3→4 est respecté. | ✅ OK |
| 5 — Analytics privacy-friendly | ✓ valeur propriétaire (mesure conversion). | Dépend d'Epic 2 (CTA contact) — rétro, OK. | ✅ OK |
| 6 — Blog infra (MVP) & activation (Post-MVP) | ✓ propriétaire (MVP) puis visiteur/lecteur (Post-MVP). | Autonome (infra) ; Story 6.2 Post-MVP. | 🟡 voir M-2 |
| 7 — Growth : case studies, « now »/changelog, CI durci | ✓ (approfondissement, évolution visible). Post-MVP, aligné Phase 2. | Dépend d'Epic 1/2/4 — rétro, OK. | ✅ OK |
| 8 — Vision : hébreu RTL, variantes de design | ✓ (3ᵉ langue, itérations design). Post-MVP, aligné Phase 3. | Dépend d'Epic 1 (i18n) / 2 (sections) — rétro, OK. | ✅ OK |

→ **Aucun epic « jalon technique sans valeur utilisateur ».** Aucun epic N ne dépend d'un epic N+1. Aucune dépendance circulaire. Découpage MVP (Epics 1–6) / Post-MVP (Epics 7–8) cohérent avec le scoping phasé du PRD.

### Qualité des stories

- **AC en Given/When/Then :** ✅ respecté partout, ACs testables et spécifiques (seuils chiffrés en Story 4.2 : LCP<2s, JS<~150KB ; cibles Lighthouse en 4.1/4.3 ; `mailto:` prérempli vérifiable en 2.1).
- **Sizing :**
  - 🟠 **Story 1.2** (« Design system + i18n FR/EN ») cumule : tokens Tailwind + intégration des 3 polices `next/font` + routing locale `app/[locale]` + dictionnaire typé + détection de clé manquante + sélecteur de langue + persistance cookie. C'est gros et hétérogène — **recommandé de scinder** en « 1.2a Design tokens & polices » et « 1.2b Infra i18n & sélecteur de langue ».
  - 🟡 **Story 2.2** couvre 3 sections (About + Experience + Freelance Engagements) — large mais cohérent (même patron « liste d'entrées ») : acceptable.
  - 🟡 **Story 2.4** est une story « fourre-tout de finition » (Contact + remplissage complet FR/EN + fichier CV + passe responsive globale) — acceptable comme story de clôture d'Epic 2, mais surveiller le périmètre à l'exécution.
- **Dépendances internes / vers le futur :**
  - 🟡 **Story 2.1** AC : « animation added in Epic 3 » — référence vers un epic ultérieur, mais la story **est complétable sans** (marquee statique). Note acceptable, pas un bloqueur.
  - 🟠 **Story 6.1** AC : « the blog presence becomes available (full reading pages delivered in Story 6.2) » — référence vers une story Post-MVP. Incohérence latente : si ≥1 article apparaît en MVP, le lien de nav devient « disponible » sans page de lecture. En pratique le MVP ship avec 0 article ⇒ inoffensif, mais l'AC gagnerait à préciser que le **lien de nav ne s'affiche qu'à partir de l'activation (Story 6.2)**, ou à déplacer ce comportement entièrement en 6.2.
- **Création de tables / entités :** N/A (pas de base de données — site statique). ✅
- **Starter template :** AR1 = pas de starter tiers ⇒ `create-next-app` (App Router). **Story 1.1 fait exactement cela.** ✅
- **Indicateurs greenfield :** story de setup initial + config env + pipeline CI/CD tôt → présents (Story 1.1). ✅
- **Traçabilité aux FR :** maintenue via la *FR Coverage Map* + le bloc « FRs covered » de chaque epic. ✅

### Findings par sévérité

**🔴 Critiques :** aucun.

**🟠 Majeurs :**
- **M-1 — Story 1.2 surdimensionnée** : scinder design-system vs infra i18n (réduit le risque et clarifie les AC).
- **M-2 — Story 6.1 ↔ 6.2, référence avant** : clarifier que l'apparition du lien de nav / section blog appartient à l'activation (Story 6.2, Post-MVP) ; reformuler l'AC de 6.1 en conséquence.
- **M-3 — Section « Freelance Engagements » absente du PRD** (déjà signalé §3/§4) : impacte la traçabilité — le PRD doit être amendé (FR dédié + §Scope + numérotation des sections) avant le démarrage d'Epic 2.

**🟡 Mineurs :**
- m-1 — Story 1.3 : la nav expose un lien CV alors que le **fichier CV** n'arrive qu'en Story 2.4 → lien mort transitoire pendant Epic 1. Soit déplacer l'ajout du fichier CV en Story 1.3, soit noter explicitement que le lien CV est activé en 2.4.
- m-2 — Plusieurs AC montrent des chaînes littérales (« available — Q2 2026 », « $ cd ./about ») alors que NFR21/FR19 imposent le passage par le dictionnaire typé : ce sont des exemples d'illustration, mais préciser dans l'AC que ces libellés proviennent du module de contenu.
- m-3 — Story 2.1 : note « animation added in Epic 3 » (référence avant, non bloquante).
- m-4 — Pas de story dédiée au pipeline favicon/OG/manifest (fondu dans Story 4.3) — acceptable mais à garder en tête.
- m-5 — Le PRD évoque un « repli EN-only » de dernier recours ; les epics n'en disent rien (i18n FR+EN traité comme acquis dès Epic 1) — cohérent avec « experience MVP », mais à confirmer comme décision arrêtée.

### Best Practices Compliance Checklist (synthèse)
- [x] Chaque epic délivre de la valeur utilisateur
- [x] Chaque epic peut fonctionner indépendamment (pas de dépendance vers un epic ultérieur)
- [~] Stories correctement dimensionnées — **Story 1.2 à scinder** (sinon OK)
- [~] Pas de dépendances vers le futur — **2 références avant mineures** (Story 2.1 → Epic 3 ; Story 6.1 → Story 6.2)
- [x] Tables créées au bon moment — N/A (pas de BDD)
- [x] Critères d'acceptation clairs et testables (Given/When/Then)
- [x] Traçabilité aux FR maintenue

## 6. Summary and Recommendations

### Overall Readiness Status

**🟢 PRÊT — sous réserve de 3 actions de réconciliation (toutes légères).**

La planification est solide et bien au-dessus de la moyenne pour un projet de cette taille : PRD complet (FR1–36, NFR1–27, critères mesurables, 5 parcours), couverture FR **100 %** dans les epics, 8 epics / 18 stories à valeur utilisateur, sans epic « jalon technique », sans dépendance vers le futur (hors 2 références mineures), AC en Given/When/Then testables, traçabilité maintenue. Aucun défaut critique. L'implémentation peut démarrer ; les points ci-dessous sont à traiter en parallèle, idéalement avant les stories concernées.

### Critical Issues Requiring Immediate Action

Aucun bloqueur critique. Les trois points « majeurs » sont des désynchronisations / clarifications, pas des trous de planification :

1. **M-3 — La section « Freelance Engagements » existe dans le contenu (`content.md`) et les epics (Story 2.2, UX-DR21) mais pas dans le PRD.** Le PRD doit rester la source de vérité → l'amender (FR dédié, mise à jour de §Product Scope et de la liste/numérotation des sections : `01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`). À faire **avant le démarrage d'Epic 2**.
2. **M-1 — Story 1.2 surdimensionnée** (design tokens + 3 polices + routing locale + dictionnaire typé + sélecteur + persistance). La scinder en `1.2a Design tokens & polices` et `1.2b Infra i18n & sélecteur de langue`. À faire **avant le démarrage d'Epic 1**.
3. **W-UX-3 — Arbitrage i18n routing non tranché** (`app/[locale]/...` vs middleware + cookie ; AR4 le laisse en « ou », le PRD le renvoie « à l'archi » — qui n'existe pas). Décider et figer la décision dans `epics.md` / Story 1.2b. À faire **avant l'implémentation de l'i18n**.

### Recommended Next Steps

1. **Mettre à jour le PRD** : ajouter la section « Freelance Engagements » (description + FR + scope MVP) et la nouvelle numérotation des sections ; vérifier l'alignement PRD ↔ `content.md` ↔ `epics.md`.
2. **Scinder Story 1.2** dans `epics.md` (1.2a design-system / 1.2b i18n) et y inscrire la décision d'architecture i18n routing retenue.
3. **Reformuler l'AC de Story 6.1** (M-2) : préciser que l'apparition du lien de nav / section blog relève de l'activation (Story 6.2, Post-MVP) — en MVP, infra MDX présente mais section et lien jamais affichés.
4. **Trancher les points mineurs** : lien CV transitoirement mort en Epic 1 (m-1 → déplacer le fichier CV en Story 1.3 ou noter l'activation en 2.4) ; préciser dans les AC que les libellés type « available — Q2 2026 » viennent du module de contenu (m-2) ; confirmer que le « repli EN-only » du PRD est abandonné (m-5).
5. **(Optionnel mais conseillé)** Consolider les décisions techniques dispersées (PRD §Implementation Considerations + AR1–AR12) en une courte note d'architecture dans `epics.md` — pas un document séparé, juste un point d'ancrage unique pour l'i18n routing, le pipeline MDX/démasquage blog, le pipeline favicon/OG/manifest, et le chargement `next/dynamic` du curseur.

### Final Note

Cette évaluation a identifié **0 problème critique, 3 problèmes majeurs (réconciliation/clarification), 5 problèmes mineurs**, répartis sur 5 catégories (inventaire documentaire, PRD, couverture epics, alignement UX/archi, qualité des epics). Le manque le plus structurel est l'absence de document d'architecture formel, atténué par la faible complexité du projet et les `Additional Requirements` (AR1–AR12) déjà rédigés dans `epics.md` ; le seul vrai trou qu'il laisse est l'arbitrage i18n routing, à trancher. Les artefacts peuvent être améliorés avec ces retours, ou l'implémentation peut démarrer telle quelle en traitant les 3 actions majeures au fil de l'eau (avant les epics concernés).

**Évaluateur :** Claude (rôle Product Manager — traçabilité des exigences) · **Date :** 2026-05-12 · **Projet :** portfolio

## 7. Remédiation appliquée (2026-05-12, post-évaluation)

Corrections apportées aux artefacts suite à cette évaluation :

**`prd.md` :**
- Ajout de **FR3a** — section « Freelance Engagements » (missions avec liens sortants, statut, KPI/highlights, tags) ; numérotation des labels de section officialisée (`01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`).
- §Product Scope : « freelance engagements » ajouté à la liste des sections V1 ; tableau *Journey Requirements Summary* : nouvelle ligne pour la section Freelance Engagements.
- §Implementation Considerations : arbitrage **i18n routing tranché** → segments de locale `app/[locale]/...` (URLs `/fr`, `/en`, `generateStaticParams`, `hreflang`/canonical par locale, cookie + middleware léger) ; `freelance` ajouté au modèle de contenu ; `MissionCard`/`Freelance` ajouté à la liste des composants ; ordre canonique des sections explicité.
- §Risk Mitigation : suppression du « repli EN-only » — périmètre FR + EN confirmé **ferme**.
- En-tête : note de révision 2026-05-12.

**`epics.md` :**
- *Requirements Inventory* : ajout de **FR3a** ; *FR Coverage Map* : entrée FR3a, FR14 réattribué (fichier CV + lien nav en Epic 1 / Story 1.3 ; liens hero/contact en Epic 2), FR16/17/18/19/33 granularisés au niveau story (1.2a/1.2b).
- **AR4 — i18n routing** : décision figée (segments `app/[locale]/...` + cookie + middleware), → impacte Story 1.2b.
- **Story 1.2 scindée** en **1.2a** (design tokens & polices) et **1.2b** (i18n : routing par locale, dictionnaire typé, sélecteur de langue + middleware/cookie) — ACs réécrits.
- **Story 1.3** : ajout d'un AC livrant le fichier CV (PDF) servi à un chemin stable + lien CV de la nav ; AC Nav précisé (libellés `v2026.1` / `available — Q2 2026` issus du module de contenu, `aria-current` sur la section active).
- **Story 2.4** : `freelance` ajouté à la liste des sections vérifiées ; AC CV reformulé (fichier + lien nav livrés en Story 1.3, liens hero/contact ici).
- **Story 6.1** : AC reformulé pour lever la référence-avant — la détection au build (`hasPublishedPosts`) pilote le rendu conditionnel ; les pages liste/article, le RSS et le démasquage auto de la nav sont explicitement renvoyés à la Story 6.2 (Post-MVP).
- Blocs *Epic List* (Epic 1 & Epic 2) : « FRs covered » mis à jour (FR3a, FR14) + liste des stories.

**Reliquat (mineur, non bloquant) :** la consolidation des décisions techniques dispersées en une courte note d'architecture dédiée n'a pas été créée — la décision i18n routing (le seul vrai trou) est désormais inscrite dans AR4 et le PRD, ce qui suffit pour démarrer ; le reste (pipeline MDX/démasquage blog, pipeline favicon/OG/manifest, chargement `next/dynamic` du curseur) est déjà couvert par AR5/AR6/AR8 et les stories concernées.

→ **Statut post-remédiation : 🟢 PRÊT.** Les 3 actions majeures sont traitées ; les points mineurs restants sont des notes d'attention à l'exécution, pas des correctifs requis.
