---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/design/content.md'
  - '_bmad-output/planning-artifacts/design/content.js'
  - '_bmad-output/planning-artifacts/design/Portfolio.html'
  - '_bmad-output/planning-artifacts/design/Minimal.jsx'
  - '_bmad-output/planning-artifacts/design/design-canvas (3).jsx'
---

# portfolio - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for **portfolio** (site vitrine personnel de Michael Mann), decomposing the requirements from the PRD, the design de référence (`design/`), and the technical decisions embedded in the PRD's *Web App Specific Requirements* / *Implementation Considerations* sections into implementable stories. Périmètre couvert : **MVP (Phase 1) + Post-MVP (Growth / Vision)**.

> ⚠️ Pas de document `Architecture.md` ni de `UX Design.md` formels — les décisions techniques et UX sont extraites du PRD et du dossier `design/` (voir *Additional Requirements* et *UX Design Requirements*).

## Requirements Inventory

### Functional Requirements

**A. Présentation du contenu portfolio**

- **FR1 :** Un visiteur peut consulter une section hero présentant le nom, le titre, une accroche, une sous-accroche, une bande de métadonnées (localisation, expérience, langues, focus) et un badge de disponibilité.
- **FR2 :** Un visiteur peut consulter une section « about » présentant le positionnement de Michael (architecture, design systems, performance, leadership).
- **FR3 :** Un visiteur peut consulter une section « experience » listant les rôles, chacun avec entreprise, lieu, intitulé, dates, durée, indicateurs clés (KPI), points marquants et tags technologiques.
- **FR3a :** Un visiteur peut consulter une section « freelance engagements » listant les missions freelance, chacune avec nom, intitulé, dates, durée, statut (ex. « Completed » / « Shipped to production »), un lien sortant vers le produit/site de la mission (ex. `sayelo.ai`, `penpaloo.io`), une accroche, des points marquants et des tags technologiques. Elle s'insère entre « experience » et « side projects » → numérotation des labels : `01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`.
- **FR4 :** Un visiteur peut consulter une section « side projects » présentant chaque projet avec nom, statut, tagline, description, stack ; le projet vedette (Maqom) est mis en avant et inclut un lien sortant vers `maqom.co`.
- **FR5 :** Un visiteur peut consulter une section « stack » organisant les technologies par groupes (Frontend, Tooling & Architecture, Backend & Data).
- **FR6 :** Un visiteur peut consulter une section « AI & Agentic Engineering » présentant le positionnement et un ensemble d'outils/méthodes (Claude Code, Claude Design, BMAD, MCP Stack).
- **FR7 :** Un visiteur peut consulter une bande de logos/wordmarks des marques clientes (Louis Vuitton, Dior, Messika, Tiffany & Co.), présentée de façon décorative.
- **FR8 :** Un visiteur peut consulter une section « contact » avec un appel à l'action e-mail primaire et des informations secondaires (LinkedIn, téléphone, localisation, langues).
- **FR9 :** Un visiteur peut consulter un pied de page (mention de copyright).
- **FR10 :** Le site n'expose aucun lien vers les dépôts de code ni vers les projets clients sous secret professionnel (notamment Balink).

**B. Navigation & appels à l'action**

- **FR11 :** Un visiteur peut naviguer vers chaque section depuis une barre de navigation persistante.
- **FR12 :** Un visiteur peut, depuis n'importe quel endroit du site, déclencher un contact e-mail via un appel à l'action présent dans la barre de navigation, dans le hero et dans la section contact.
- **FR13 :** Un visiteur peut accéder au profil LinkedIn de Michael depuis la navigation/le hero/la section contact.
- **FR14 :** Un visiteur peut télécharger le CV de Michael depuis le site.
- **FR15 :** Un visiteur voit l'indicateur de disponibilité (« available — Q2 2026 ») de manière cohérente dans la navigation et le hero.

**C. Internationalisation**

- **FR16 :** Un visiteur peut consulter l'intégralité du site en français ou en anglais.
- **FR17 :** Un visiteur peut basculer la langue à tout moment via un sélecteur visible, et son choix est conservé entre les visites/pages.
- **FR18 :** Le site sert un contenu correctement localisé pour les moteurs de recherche (URLs localisées, `hreflang`, `lang` du document).
- **FR19 :** Aucun texte affiché n'est codé en dur en dehors du système de traduction (toute chaîne visible existe en FR et EN).

**D. Blog (infra MVP, contenu post-MVP)**

- **FR20 :** Un éditeur (Michael) peut ajouter un article de blog en déposant un fichier de contenu (MDX) dans le dépôt, sans modifier le code de présentation.
- **FR21 :** Le site n'affiche la section blog et son lien de navigation que lorsqu'au moins un article est publié ; tant qu'aucun article n'existe, la section et le lien restent masqués.
- **FR22 :** *(Post-MVP)* Un visiteur peut consulter la liste des articles et lire un article individuel.
- **FR23 :** *(Post-MVP)* Un visiteur/agrégateur peut s'abonner aux articles via un flux RSS.

**E. Édition & maintenance du contenu**

- **FR24 :** Un éditeur (Michael) peut mettre à jour tout le contenu textuel et structuré du portfolio (hero, about, experience, projets, stack, AI, contact, footer) depuis une source de contenu centralisée et typée, en FR et EN.
- **FR25 :** Un éditeur (Michael) peut remplacer le fichier de CV téléchargeable.
- **FR26 :** Un éditeur (Michael) peut déclencher un déploiement du site à jour via une opération de publication standard (push) ; le déploiement est automatique.

**F. Découvrabilité, partage & mesure**

- **FR27 :** Le site fournit des métadonnées de référencement et de partage (titre, description, OpenGraph/Twitter Card avec image, données structurées `Person`, `sitemap`, `robots`).
- **FR28 :** Le site est indexable et pré-rendu de sorte que son contenu soit accessible aux moteurs de recherche sans exécution de JavaScript.
- **FR29 :** Le site mesure de façon respectueuse de la vie privée les visites et les déclenchements d'appels à l'action de contact, pour suivre la conversion visite → contact.

**G. Expérience visuelle & interactions**

- **FR30 :** Un visiteur sur dispositif à pointeur fin voit un curseur personnalisé (point + anneau) ; ce curseur est désactivé sur dispositif tactile/pointeur grossier.
- **FR31 :** Un visiteur voit les blocs de contenu apparaître en fondu à l'entrée dans le viewport au défilement.
- **FR32 :** Un visiteur ayant exprimé une préférence de mouvement réduit (`prefers-reduced-motion`) voit ces animations (curseur personnalisé, fondu au défilement, marquee) désactivées ou neutralisées.
- **FR33 :** Le site reproduit fidèlement la direction visuelle de référence « Technical Minimal » (palette sombre + accent doré, typographies Inter/JetBrains Mono/Cormorant Garamond, grille de fond des sections, cartes style fenêtre-terminal, rangées de KPI, marquee de wordmarks).
- **FR34 :** Le site s'affiche correctement et reste pleinement utilisable du mobile (~375px) au grand écran desktop, sans défilement horizontal parasite.

**H. Accessibilité**

- **FR35 :** Un visiteur peut parcourir et activer tous les éléments interactifs au clavier, avec un indicateur de focus visible, et accéder directement au contenu principal via un lien d'évitement.
- **FR36 :** Un visiteur utilisant un lecteur d'écran obtient des libellés et une structure de document cohérents (titres hiérarchisés, repères de page, libellés des liens d'icônes, éléments décoratifs masqués de l'arbre d'accessibilité).

### NonFunctional Requirements

**Performance**

- **NFR1 :** Page d'accueil, conditions mobile simulées (CPU 4×, réseau 4G) : LCP < 2,0 s, FCP < 1,5 s, CLS < 0,1, INP < 200 ms.
- **NFR2 :** Lighthouse (mobile et desktop, accueil) : Performance ≥ 95 (cible 100), Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
- **NFR3 :** JS exécuté au chargement initial de l'accueil < ~150 KB gzip (hors polices) ; scripts non critiques (curseur, etc.) chargés en différé.
- **NFR4 :** Polices auto-hébergées (pas de requête tierce runtime), sous-ensembles latins, `display: swap`, police critique (Inter) préchargée ; aucun FOIT visible.
- **NFR5 :** Images en formats modernes (AVIF/WebP), dimensionnées, `lazy` hors premier écran ; aucun décalage de mise en page dû aux images.
- **NFR6 :** Animations (curseur, fade-in, marquee) en `transform`/`opacity` uniquement, ~60 fps, sans jank perceptible.
- **NFR7 :** Poids total transféré de l'accueil au premier chargement visé < ~600 KB (indicatif).

**Accessibility**

- **NFR8 :** Conformité WCAG 2.1 AA sur l'ensemble du site.
- **NFR9 :** Texte courant ≥ 4,5:1 de contraste (≥ 3:1 grand texte / UI) ; gris du design de référence audités et ajustés si besoin.
- **NFR10 :** Navigation clavier complète, ordre de tab logique, focus toujours visible (`:focus-visible`), lien d'évitement vers le contenu principal.
- **NFR11 :** `prefers-reduced-motion: reduce` neutralise curseur personnalisé, fade-in et marquee.
- **NFR12 :** Structure sémantique correcte : un seul `<h1>`, hiérarchie de titres cohérente, repères (`nav`/`main`/`footer`), libellés accessibles sur liens d'icônes, décoratif (marquee) hors arbre a11y ; cible 0 erreur aux audits automatiques (axe / Lighthouse).
- **NFR13 :** Le curseur personnalisé ne masque jamais le curseur système sur les dispositifs où l'utilisateur en dépend (activé uniquement sur pointeurs fins).

**Compatibility**

- **NFR14 :** Rendu/fonctionnement complets sur les 2 dernières versions de Chrome, Edge, Firefox, Safari — desktop et mobile (iOS Safari, Chrome Android). Pas d'IE ni de navigateurs legacy.
- **NFR15 :** Dégradation gracieuse des effets reposant sur du CSS récent (`backdrop-filter`, `mix-blend-mode`) : sur navigateur non compatible, l'expérience reste lisible et utilisable.
- **NFR16 :** Aucun défilement horizontal parasite ni élément tronqué de ~320px de large jusqu'aux grands écrans desktop.

**Reliability & Operability**

- **NFR17 :** Site hébergé en statique sur CDN (Vercel) ; disponibilité visée ≥ 99,9 % ; aucune dépendance runtime à un tiers pour l'affichage du contenu.
- **NFR18 :** Déploiement automatique sur `push`, sans intervention manuelle ; un déploiement échoué ne remplace pas la prod (rollback / déploiement atomique).
- **NFR19 :** Un déploiement courant (mise à jour de contenu) se propage en prod en moins de ~2 minutes.

**Maintainability**

- **NFR20 :** Tout le contenu (textes, métadonnées, données structurées des sections, articles MDX) est centralisé, typé et séparé de la présentation ; ajouter/modifier du contenu ne requiert aucune modification des composants de présentation.
- **NFR21 :** Le contenu existe intégralement en FR et EN ; l'absence d'une traduction est détectable (échec de build ou avertissement de lint) ; aucune chaîne visible codée en dur.
- **NFR22 :** Le code respecte TypeScript strict et passe ESLint sans erreur en CI ; un contrôle Lighthouse en CI signale les régressions perf/a11y (bloquant à terme — souhaitable en MVP).
- **NFR23 :** Les composants sont portés fidèlement du design de référence (`Minimal.jsx`) vers React/TS + Tailwind (styles inline → classes), avec une référence visuelle permettant de vérifier la non-régression.

**Privacy & Compliance**

- **NFR24 :** Mesure d'audience respectueuse de la vie privée : pas de cookies de suivi, pas de PII, conforme RGPD sans bannière de consentement (ex. solution sans cookie type Plausible) ; seules les visites et déclenchements de CTA contact sont suivis, de façon agrégée.
- **NFR25 :** Aucune donnée personnelle de visiteur n'est collectée, stockée ou transmise à des tiers en dehors de cette mesure agrégée.

**SEO & Discoverability**

- **NFR26 :** Le contenu principal est pré-rendu et présent dans le HTML initial (lisible par les crawlers sans exécution de JS).
- **NFR27 :** Métadonnées complètes : `<title>`/description par langue, OpenGraph + Twitter Card avec image, JSON-LD `Person` (nom, rôle, lieu, `sameAs` LinkedIn), `sitemap.xml`, `robots.txt`, `hreflang` FR↔EN, URL canonique.

### Additional Requirements

*(Décisions techniques extraites du PRD §§ Web App Specific Requirements / Implementation Considerations — il n'existe pas de document Architecture séparé.)*

- **AR1 — Starter / scaffolding :** Projet **greenfield** créé avec **Next.js (App Router) + TypeScript strict + Tailwind CSS** (shadcn/ui au besoin). Pas de starter template tiers imposé ⇒ scaffold `create-next-app` en App Router. → impacte **Epic 1, Story 1**.
- **AR2 — Rendu statique :** SSG / pré-rendu au build, aucune donnée dynamique côté serveur, pas d'API applicative, pas d'authentification, pas de base de données, pas de temps réel. Le site doit être servable comme statique.
- **AR3 — Déploiement :** Hébergement Vercel, déploiement statique automatique sur `push`, déploiements atomiques (rollback préservé), propagation < ~2 min.
- **AR4 — i18n routing (décidé) :** App Router avec **segments de locale (`app/[locale]/...`)** — URLs localisées explicites (`/fr`, `/en`), idiomatique App Router, compatible SSG (`generateStaticParams`), `hreflang` + `<link rel="canonical">` par locale, `<html lang>` dérivé du segment. Préférence de langue mémorisée par cookie, lue par un **middleware léger** qui redirige `/` vers la locale préférée (ou détectée via `Accept-Language`). Dictionnaire typé FR/EN unique dérivé de `content.js`/`content.md`. → impacte **Epic 1, Story 1.2b**.
- **AR5 — Modèle de contenu :** données structurées des sections (meta, hero, clients, about, experience, projects, stack, ai, contact, footer) dans un module TS typé, séparé de la présentation ; blog en MDX dans `content/blog/`.
- **AR6 — Démasquage du blog au build :** présence du lien de nav + section blog dérivée du dossier MDX au moment du build (≥ 1 article ⇒ visible).
- **AR7 — Polices :** Inter, JetBrains Mono, Cormorant Garamond auto-hébergées via `next/font`, sous-ensembles latins, `display: swap`, preload de Inter.
- **AR8 — Images & assets :** `next/image` (AVIF/WebP), logos SVG inline quand possible, `splash*.png` optimisé ; pipeline favicon set + OG image + manifest depuis les assets fournis (`logo.svg`, `logo-dark.svg`, `logo-text.svg`, `maqom-logo-*`, `splash*.png`).
- **AR9 — Qualité / CI :** ESLint + TypeScript strict en CI ; check Lighthouse en CI (souhaitable en MVP, bloquant en Growth) ; déploiement automatique sur push.
- **AR10 — Analytics :** intégration d'une solution d'analytics sans cookie / privacy-friendly (type Plausible), conforme RGPD sans bannière, suivi agrégé visites + clics CTA contact.
- **AR11 — Audit contrastes :** auditer les gris du design de référence (`#a3a3a3`, `#888` sur `#0a0a0a`) dès le portage et ajuster les tokens sous le seuil AA pour le texte courant.
- **AR12 — Hors scope explicite :** pas de PWA installable, pas de CLI, pas de backend, pas de DB, pas d'auth, pas de temps réel ; pas de lien Balink ni vers des repos en MVP.

### UX Design Requirements

*(Le dossier `design/` — `content.md`/`content.js` (contenu), `Portfolio.html` / `Minimal.jsx` / `design-canvas (3).jsx` (design de référence « Technical Minimal ») — fait office de spec UX. Chaque UX-DR est cadré pour générer une story testable.)*

- **UX-DR1 — Design tokens :** établir le système de tokens « Technical Minimal » : palette sombre (`#0a0a0a` fond) + accent doré, échelle d'espacement (desktop ~`96px 80px`, mobile fortement réduit), tokens typographiques pour les 3 familles (Inter UI, JetBrains Mono labels/terminal, Cormorant Garamond display), tokens de gris **audités contraste AA** (cf. AR11).
- **UX-DR2 — Typographies :** intégrer et appliquer Inter (corps/UI), JetBrains Mono (labels de section `01 — About`, nav style terminal, cartes terminal), Cormorant Garamond (titres display) — via `next/font` (cf. AR7).
- **UX-DR3 — Composant `Nav` :** barre de navigation persistante, style terminal (`$ cd ./about`), badge de version (`v2026.1`), liens d'ancrage vers chaque section avec `aria-current` sur la section active, CTA email, sélecteur de langue visible, `backdrop-filter` blur (dégradation gracieuse), CV link.
- **UX-DR4 — Composant `GridSection` :** wrapper de section avec la grille de fond décorative, label de section monospace, paddings responsive.
- **UX-DR5 — Composant `Hero` :** layout dense above-the-fold (~375×667), `<h1>` unique (headline), sous-accroche, meta strip (Location / Experience / Languages / Focus) en grille → 1-2 col mobile, badge de disponibilité, CTAs (email + LinkedIn + CV).
- **UX-DR6 — Composant `Clients` (marquee) :** bande horizontale animée des wordmarks (Louis Vuitton, Dior, Messika, Tiffany & Co.), décorative (`aria-hidden`), vitesse adaptée mobile, figée/ralentie sous `prefers-reduced-motion`, animation en `transform` uniquement.
- **UX-DR7 — Composant `SectionHead` :** label numéroté monospace + heading (Cormorant) + sous-titre, réutilisé par toutes les sections.
- **UX-DR8 — Composant `About` :** layout 2 colonnes (corps gauche / corps droit), reflow 1 colonne mobile.
- **UX-DR9 — Composants `Experience` / `RoleCard` :** liste de rôles ; chaque carte = entreprise, lieu, intitulé, dates, durée, **rangée de KPI en gros** (`3 000+ companies`, `5 devs hired`, `2 MB WeChat cap`...), bullets, tags techno ; `<article>` sémantique.
- **UX-DR10 — Composant `Projects` :** carte « fenêtre-terminal » pour Maqom (chrome de terminal, lien `$ open maqom.co →`, statut, tagline, description, stack) + carte « AI-Driven Development Methodology » ; mise en avant du projet vedette.
- **UX-DR11 — Composant `Stack` :** 3 groupes (Frontend / Tooling & Architecture / Backend & Data) en grille 3-4 col → reflow mobile.
- **UX-DR12 — Composant `AI` :** section « AI & Agentic Engineering » : heading + body + **4 cartes** (Claude Code, Claude Design, BMAD Methodology, MCP Stack), grille → reflow mobile.
- **UX-DR13 — Composant `Contact` :** heading + sous-titre, CTA email primaire (mailto), LinkedIn, liens secondaires (téléphone, localisation), langues.
- **UX-DR14 — Composant `Footer` :** mention de copyright.
- **UX-DR15 — `CustomCursor` :** curseur personnalisé point + anneau, `mix-blend-mode`, activé uniquement sur `(hover: hover) and (pointer: fine)`, désactivé sur `(hover: none), (pointer: coarse)` et sous `prefers-reduced-motion` ; chargé via `next/dynamic` (cf. NFR3) ; ne masque jamais le curseur système.
- **UX-DR16 — `useScrollFadeIn` :** hook IntersectionObserver pour le fondu d'entrée des blocs (`opacity`/`transform`), apparition immédiate sous `prefers-reduced-motion`, sans layout thrashing.
- **UX-DR17 — Responsive :** mobile-first ; breakpoints Tailwind standard ; toutes les grilles denses (Stack/Experience/AI, meta strip) reflow en 1-2 colonnes ; paddings réduits sur mobile ; tap targets ≥ 44px ; texte lisible sans zoom ; aucun scroll horizontal de ~320px aux grands écrans.
- **UX-DR18 — Accessibilité (transverse design) :** `:focus-visible` stylé partout (jamais `outline:none` nu), skip-link « aller au contenu », ordre de tab logique, `aria-label` sur les liens d'icônes (LinkedIn, téléphone), `aria-current` sur le lien de section actif, marquee `aria-hidden` (marques présentes en texte ailleurs), annonce du changement de langue, `lang`/`dir` du `<html>` corrects.
- **UX-DR19 — Pages article blog (Post-MVP) :** template d'article MDX avec syntax highlighting, mise en page de lecture soignée, et page liste des articles ; cohérent avec « Technical Minimal ».
- **UX-DR20 — Variantes de design (Post-MVP / Vision) :** explorer les autres maquettes du canvas (`design-canvas (3).jsx`) comme variantes alternatives — éventuel A/B léger.
- **UX-DR21 — Section « Freelance Engagements » + composant `MissionCard` :** section dédiée (label `03 — Freelance Engagements`) listant les missions freelance ; chaque carte = nom, intitulé, dates, durée, statut (`Completed` / `Shipped to production`), URL sortante (ex. `sayelo.ai`, `penpaloo.io`), tagline, bullets, tags techno ; structurellement proche de `RoleCard` ; `<article>` sémantique ; reflow mobile. **Renumérotation des labels de section :** `01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact` (issu de `content.md`).

### FR Coverage Map

- **FR1 :** Epic 2 — section hero (contenu).
- **FR2 :** Epic 2 — section about.
- **FR3 :** Epic 2 — section experience + KPI (case studies dédiées : Epic 7).
- **FR3a :** Epic 2, Story 2.2 — section `03 — Freelance Engagements` (`MissionCard`), missions avec liens sortants ; modèle de contenu typé (FR24) + `UX-DR21` ; entraîne la renumérotation des labels de section. *(Ajoutée au PRD — révision 2026-05-12.)*
- **FR4 :** Epic 2 — side projects / carte terminal Maqom + lien `maqom.co`.
- **FR5 :** Epic 2 — section stack.
- **FR6 :** Epic 2 — section AI & Agentic (4 cartes).
- **FR7 :** Epic 2 — marquee marques clientes (polish animation : Epic 3).
- **FR8 :** Epic 2 — section contact.
- **FR9 :** Epic 1 — pied de page (dans le shell layout).
- **FR10 :** Epic 2 — contrainte : aucun lien repo / Balink.
- **FR11 :** Epic 1 — barre de navigation persistante.
- **FR12 :** Epic 2 — CTA email hero + contact (CTA email de la nav livré en Epic 1).
- **FR13 :** Epic 2 — liens LinkedIn (nav/hero/contact).
- **FR14 :** Epic 1 — fichier CV servi + lien CV dans la nav (Story 1.3) ; liens CV dans hero/contact en Epic 2.
- **FR15 :** Epic 1 (badge dispo dans la nav) + Epic 2 (badge dans le hero).
- **FR16 :** Epic 1 / Story 1.2b — i18n FR/EN intégral (infra + dico ; contenu rempli en Epic 2).
- **FR17 :** Epic 1 / Story 1.2b — sélecteur de langue visible + persistance (cookie + middleware).
- **FR18 :** Epic 1 / Story 1.2b (`lang`, segments de locale `/fr` `/en`) + Epic 4 / Story 4.3 (`hreflang`, canonical).
- **FR19 :** Epic 1 / Stories 1.2b, 1.3 — aucun texte en dur (check de complétude des locales).
- **FR20 :** Epic 6 — ajout d'article MDX dans `content/blog/`.
- **FR21 :** Epic 6 — section/nav blog masquée tant que vide (détection au build).
- **FR22 :** *(Post-MVP)* Epic 6 — liste + lecture d'article.
- **FR23 :** *(Post-MVP)* Epic 6 — flux RSS.
- **FR24 :** Epic 1 (modèle de contenu typé) + Epic 2 (sections renseignées).
- **FR25 :** Epic 2 — remplacement du fichier CV.
- **FR26 :** Epic 1 — déploiement automatique sur `push`.
- **FR27 :** Epic 4 — métadonnées SEO / partage (OG, Twitter, JSON-LD, sitemap, robots).
- **FR28 :** Epic 1 (rendu SSG) + Epic 4 (vérification crawl sans JS).
- **FR29 :** Epic 5 — mesure privacy-friendly visites → clics contact.
- **FR30 :** Epic 3 — curseur personnalisé (pointeur fin uniquement).
- **FR31 :** Epic 3 — fondu au défilement.
- **FR32 :** Epic 3 — neutralisation `prefers-reduced-motion`.
- **FR33 :** Epic 1 / Story 1.2a (tokens/polices) + Epic 2 (sections) + Epic 3 / Story 3.2 (passe de fidélité finale).
- **FR34 :** Epic 2 (responsive par section) + Epic 4 (audit ~320px, zéro scroll horizontal).
- **FR35 :** Epic 4 — clavier, `:focus-visible`, skip-link.
- **FR36 :** Epic 4 — structure document lecteur d'écran, ARIA, libellés d'icônes.

## Epic List

### Epic 1: Fondations & shell bilingue déployé `MVP`
Un visiteur charge une page rapide, en FR ou EN, avec une navigation persistante (style terminal, badge de version, badge de disponibilité, sélecteur de langue), un pied de page, et l'identité visuelle « Technical Minimal » (design tokens, polices auto-hébergées) en place ; chaque `push` déclenche un déploiement statique Vercel, et la CI (ESLint + TypeScript strict) garde la qualité. Pose le modèle de contenu typé et l'infra i18n sans texte en dur.
**FRs covered:** FR9, FR11, FR14 (fichier CV + lien nav), FR15 (badge nav), FR16, FR17, FR19, FR24 (modèle), FR26, FR28 (SSG), FR33 (tokens/polices)
**ARs:** AR1–AR5, AR7, AR9, AR12 · **UX-DR:** DR1, DR2, DR3, DR4, DR14 · **NFRs:** NFR4, NFR14, NFR17–NFR23 (partiel) · **Stories:** 1.1, 1.2a, 1.2b, 1.3

### Epic 2: Page d'accueil — toutes les sections de contenu `MVP`
Un visiteur lit le portfolio complet : hero (accroche, sous-accroche, meta strip, badge dispo), marquee des marques, about 2 colonnes, experience avec rangées de KPI, freelance engagements (cartes mission), side projects (carte fenêtre-terminal Maqom + lien `maqom.co` + carte méthodo), stack (3 groupes), AI & Agentic (4 cartes), contact (CTA email + LinkedIn + secondaires), footer renseigné — le tout depuis le contenu typé FR+EN, avec CV téléchargeable, sans aucun lien vers Balink/repos, et un rendu responsive du mobile (~375px) au desktop.
**FRs covered:** FR1–FR8, FR3a (section Freelance Engagements), FR10, FR12, FR13, FR14 (liens hero/contact), FR25, FR33 (structure des sections), FR34 (responsive par section)
**UX-DR:** DR5–DR13, DR17, DR21 · **Stories:** 2.1, 2.2, 2.3, 2.4

### Epic 3: Mouvement, curseur & fidélité « Technical Minimal » `MVP`
Un visiteur sur dispositif à pointeur fin voit le curseur personnalisé (point + anneau, `mix-blend-mode`, chargé en `next/dynamic`) ; les blocs de contenu apparaissent en fondu à l'entrée dans le viewport ; le marquee tourne ; tout est désactivé/neutralisé sous `prefers-reduced-motion` ; le rendu est fidèle au design de référence, avec dégradation gracieuse de `backdrop-filter` / `mix-blend-mode`.
**FRs covered:** FR30, FR31, FR32, FR33 (passe de fidélité finale)
**UX-DR:** DR15, DR16, DR6 (animation marquee) · **NFRs:** NFR6, NFR11, NFR15

### Epic 4: Accessibilité, performance & SEO — prêt au lancement `MVP`
Le site atteint WCAG 2.1 AA (contrastes audités et tokens ajustés, navigation clavier complète + `:focus-visible` + skip-link, ARIA correct, structure sémantique avec un seul `<h1>`), tient les budgets de performance (JS initial < ~150 KB gzip, images AVIF/WebP `lazy`, preload Inter, LCP < 2 s / CLS < 0,1 / INP < 200 ms, Lighthouse ≥ 95 / A11y 100), et expose un SEO complet (titres/descriptions par langue, OpenGraph + Twitter Card, JSON-LD `Person`, `sitemap.xml`, `robots.txt`, `hreflang`, canonical, favicon set + OG image depuis les assets) ; un check Lighthouse en CI signale les régressions (souhaitable en MVP).
**FRs covered:** FR18 (hreflang/canonical), FR27, FR28 (vérification), FR34 (audit ~320px), FR35, FR36
**NFRs:** NFR1–NFR3, NFR5, NFR7–NFR10, NFR12, NFR13, NFR16, NFR22 (Lighthouse CI), NFR26, NFR27 · **ARs:** AR8, AR11 · **UX-DR:** DR1 (audit contraste), DR18

### Epic 5: Mesure d'audience privacy-friendly `MVP`
Le site mesure, de façon agrégée et sans cookie (solution type Plausible, conforme RGPD sans bannière de consentement), les visites et les déclenchements des appels à l'action de contact — pour suivre la conversion visite → contact.
**FRs covered:** FR29 · **NFRs:** NFR24, NFR25 · **ARs:** AR10

### Epic 6: Blog — infrastructure (MVP) & activation (Post-MVP) `MVP + Post-MVP`
**MVP :** Michael peut déposer un article MDX dans `content/blog/` sans toucher la présentation ; tant qu'aucun article n'existe, la section blog et son lien de navigation restent masqués (détection au build). **Post-MVP :** dès le 1ᵉʳ article publié, la section et le lien de nav apparaissent automatiquement ; page liste des articles + page article individuelle (syntax highlighting) + flux RSS régénéré au build.
**FRs covered:** FR20, FR21 `MVP` · FR22, FR23 `Post-MVP` · **ARs:** AR6 · **UX-DR:** DR19 `Post-MVP`

### Epic 7: Growth — case studies, page « now »/changelog & CI durci `Post-MVP`
Pages case studies dédiées et approfondies (Balink anonymisé / Limova / Maqom), page « now » / changelog `v2026.x`, et CI Lighthouse durci (budget JS strict, blocage du déploiement sur régression de perf/a11y).
**FRs covered:** — (extension approfondie de FR3/FR4 ; durcissement de NFR22) · *(périmètre PRD — Phase 2 Growth)*

### Epic 8: Vision — hébreu (RTL) & variantes de design `Post-MVP`
Ajout de l'hébreu comme 3ᵉ langue avec `dir="rtl"` (si justifié), exploration des variantes de design du canvas comme alternatives, éventuel A/B léger ; consolidation du site comme hub durable de marque personnelle.
**FRs covered:** — (extension de FR16/FR17 i18n ; FR33 variantes visuelles) · **UX-DR:** DR20 · *(périmètre PRD — Phase 3 Vision)*

---

## Epic 1: Fondations & shell bilingue déployé

Un visiteur charge une page rapide, en FR ou EN, avec une navigation persistante et l'identité visuelle « Technical Minimal » en place ; chaque `push` déclenche un déploiement statique Vercel, et la CI garde la qualité. Pose le modèle de contenu typé et l'infra i18n sans texte en dur.

### Story 1.1: Scaffold du projet, déploiement statique & CI

As a developer (Michael),
I want a Next.js (App Router) + TypeScript strict + Tailwind project scaffolded, deployed statically on Vercel on every push, with a CI pipeline running ESLint and type-checking,
So that I have a reproducible foundation and every change ships safely without manual steps.

**Acceptance Criteria:**

**Given** an empty greenfield repository
**When** I scaffold the project with `create-next-app` (App Router) and enable TypeScript `strict` and Tailwind CSS
**Then** `npm run dev` serves a page locally, `npm run build` produces a static / pre-rendered build, and ESLint runs clean
**And** the project structure, `.gitignore`, and an initial commit are in place

**Given** the repository is connected to Vercel
**When** I push to the default branch
**Then** Vercel builds and deploys the site automatically as static output, with atomic deploys (a failed build never replaces the live version)
**And** a routine content update propagates to production in under ~2 minutes

**Given** a GitHub Actions workflow
**When** a push or pull request is made
**Then** the workflow runs ESLint and `tsc --noEmit` and fails on any error
**And** the workflow status is visible on the PR

### Story 1.2a: Design system « Technical Minimal » (tokens & polices)

As a visitor,
I want the site to render with the "Technical Minimal" visual identity (palette, spacing, typography),
So that everything looks consistent and polished from the first paint.

**Acceptance Criteria:**

**Given** the design reference (`Minimal.jsx` / `Portfolio.html`)
**When** the design tokens are configured in Tailwind
**Then** the dark palette (`#0a0a0a` base) + gold accent, the spacing scale (desktop ~`96px 80px`, reduced on mobile), and typography tokens for Inter (UI/body), JetBrains Mono (section labels, terminal nav), Cormorant Garamond (display headings) are available as utilities

**Given** the three font families
**When** the app builds
**Then** Inter, JetBrains Mono, and Cormorant Garamond are self-hosted via `next/font` (no runtime Google Fonts request), subset to latin, `display: swap`, with Inter preloaded — no visible FOIT

### Story 1.2b: Internationalisation FR/EN — routing par locale, dictionnaire typé & sélecteur de langue

As a visitor,
I want to read the entire site in French or English via locale-prefixed URLs and a visible language switcher that remembers my choice,
So that I get the site in my language, consistently, and search engines see properly localized pages.

**Acceptance Criteria:**

**Given** the App Router locale routing using locale segments (`app/[locale]/...`, locales `fr` and `en`) and a typed FR/EN dictionary derived from `content.js`/`content.md`
**When** I visit `/fr` or `/en`
**Then** the page is statically generated per locale (`generateStaticParams`), content is served from the typed dictionary for the active locale, `<html lang>` reflects the locale, `hreflang` alternates and a per-locale canonical are emitted, and no displayed string is hard-coded outside the dictionary
**And** a missing translation key is detectable (build failure or lint warning)

**Given** the root path `/` and a returning visitor
**When** the request is handled by the lightweight i18n middleware
**Then** it redirects to the preferred locale stored in the language cookie, or to the locale detected from `Accept-Language` when no cookie is set

**Given** the language switcher in the navigation
**When** I switch language
**Then** the page is shown in the chosen language at the corresponding locale-prefixed URL, the change is announced to assistive tech, and my preference is persisted in the cookie across pages and visits

### Story 1.3: Modèle de contenu typé & shell de page (Nav / GridSection / SectionHead / Footer)

As a visitor,
I want a persistent terminal-style navigation (section anchors, version badge, availability badge, email CTA, CV link, language switcher) and a footer, on a statically pre-rendered home page,
So that I can move around the site and contact Michael from anywhere, immediately.

**Acceptance Criteria:**

**Given** a typed content module covering all sections (meta, hero, clients, about, experience, freelance, projects, stack, ai, contact, footer) in FR and EN
**When** the app builds
**Then** all section data is sourced from this module, it is fully typed, separate from presentation, and editing it requires no change to presentation components
**And** both locales are complete (build/lint flags any gap)

**Given** the home page route
**When** it is requested
**Then** it is statically pre-rendered (full HTML in the initial response, readable without JavaScript)

**Given** the `Nav` component
**When** I view any part of the site on desktop or mobile
**Then** the nav is persistent, styled "terminal" (e.g. `$ cd ./about`), shows a version badge (e.g. `v2026.1`) and an availability badge (e.g. `available — Q2 2026`) — both label texts sourced from the typed content module, not hard-coded — links to each section anchor (with `aria-current` on the active section), exposes an email CTA and a CV download link, and includes the visible language switcher
**And** the nav uses `backdrop-filter` blur with a graceful fallback when unsupported

**Given** the CV asset committed to the repo
**When** the site builds
**Then** a downloadable CV file (PDF) is served from the site at a stable path, and the nav CV link points to it and downloads correctly (the hero/contact CV links are wired in Epic 2)

**Given** the `GridSection`, `SectionHead`, and `Footer` components
**When** sections are rendered
**Then** `GridSection` provides the decorative background grid and responsive paddings, `SectionHead` renders a monospace numbered label + Cormorant heading + sub-title, and `Footer` shows the copyright line

## Epic 2: Page d'accueil — toutes les sections de contenu

Un visiteur lit le portfolio complet (hero, marquee, about, experience+KPI, side projects, stack, AI & agentic, contact, footer) depuis le contenu typé FR+EN, avec CV téléchargeable, sans aucun lien Balink/repo, et un rendu responsive mobile→desktop.

### Story 2.1: Section Hero & marquee des marques clientes

As a visitor (recruiter on mobile),
I want a dense hero above the fold (name, title, headline, sub-headline, meta strip, availability badge, contact/LinkedIn/CV CTAs) and a marquee of client wordmarks,
So that in a few seconds I see seniority, luxury brands, stack, and availability — and can contact in one tap.

**Acceptance Criteria:**

**Given** the hero section
**When** the home page loads on a ~375×667 viewport
**Then** the hero delivers its message above the fold: a single `<h1>` headline, sub-headline, a meta strip (Location / Experience / Languages / Focus) reflowing to 1–2 columns, an availability badge, and CTAs for email (mailto), LinkedIn, and CV download
**And** the same availability indicator shown in the nav also appears in the hero

**Given** the email CTA in the hero
**When** I tap it
**Then** a pre-filled `mailto:` to Michael's address opens

**Given** the clients marquee
**When** the hero area renders
**Then** a horizontal band shows the client wordmarks (Louis Vuitton, Dior, Messika, Tiffany & Co.) as a decorative element marked `aria-hidden` (the brand names are present in accessible text elsewhere)
**And** it reflows without horizontal overflow on mobile (animation added in Epic 3)

### Story 2.2: Sections About, Experience & Freelance Engagements

As a visitor (VP Engineering),
I want an "about" section (positioning: architecture, design systems, performance, leadership), an "experience" section listing roles, and a "freelance engagements" section listing missions — each entry with the relevant company/mission, title, dates, duration, status, KPIs/highlights, tech tags (and outbound URL for missions),
So that I can judge depth, leadership, and delivery track record in one read.

**Acceptance Criteria:**

**Given** the about section (label `01 — About`)
**When** it renders on desktop
**Then** it shows a two-column body conveying the positioning (architecture/craft + distributed leadership), reflowing to one column on mobile
**And** all text comes from the typed content module in the active locale

**Given** the experience section (label `02 — Experience`)
**When** it renders
**Then** each role is a semantic `<article>` showing company, location, title, dates, duration, a prominent KPI row (e.g. "3 000+ companies", "5 devs hired", "2 MB WeChat cap"), highlight bullets, and technology tags
**And** the layout reflows cleanly from mobile to desktop without horizontal overflow

**Given** the freelance engagements section (label `03 — Freelance Engagements`) and the `MissionCard` component
**When** it renders
**Then** each mission is a semantic `<article>` showing name, title, dates, duration, status (e.g. "Completed", "Shipped to production"), an outbound URL (e.g. `sayelo.ai`, `penpaloo.io`), tagline, highlight bullets, and technology tags
**And** the section reflows cleanly from mobile to desktop with no horizontal overflow

**Given** the downstream section labels
**When** the home page renders
**Then** the section numbering follows `01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`, consistently in nav anchors and `SectionHead` labels

### Story 2.3: Sections Side Projects, Stack & AI & Agentic Engineering

As a visitor (founder looking for a freelancer / curious peer),
I want a "side projects" section featuring Maqom (terminal-style card with an outbound link to `maqom.co`) plus the AI-Driven methodology card, a "stack" section grouped by domain, and an "AI & Agentic Engineering" section with four tool cards,
So that I see proof of products shipped and the agentic angle.

**Acceptance Criteria:**

**Given** the side projects section (label `04 — Side Projects`)
**When** it renders
**Then** the featured project Maqom is shown as a terminal-window card (window chrome, `$ open maqom.co →` outbound link, status, tagline, description, stack), and the "AI-Driven Development Methodology" card is shown with its status, tagline, description, and stack
**And** the Maqom link points to `https://maqom.co` and opens correctly

**Given** the stack section (label `05 — Stack`)
**When** it renders
**Then** technologies are organized into the groups Frontend, Tooling & Architecture, Backend & Data in a grid that reflows to 1–2 columns on mobile

**Given** the AI & Agentic Engineering section
**When** it renders
**Then** it shows the positioning heading + body and four cards: Claude Code, Claude Design, BMAD Methodology, MCP Stack
**And** the grid reflows cleanly on mobile

### Story 2.4: Section Contact, contenu FR/EN complet, CV & finition responsive

As a visitor and as the owner (Michael),
I want a contact section (primary email CTA + LinkedIn + secondary info), the full FR+EN content populated, a downloadable CV, no links to private repos or Balink, and consistent responsive behavior across all sections,
So that the page is complete, contactable, and fully usable from mobile to desktop in both languages.

**Acceptance Criteria:**

**Given** the contact section (label `06 — Contact`)
**When** it renders
**Then** it shows the heading and sub-title, a primary email CTA (mailto), a LinkedIn link, and secondary info (phone, location, languages)
**And** triggering email is possible from the nav, the hero, and the contact section

**Given** the typed content module
**When** the site is built
**Then** all sections (hero, about, experience, freelance, projects, stack, ai, contact, footer) have complete FR and EN content, editable from this single source without touching presentation
**And** the CV download link works from the hero and the contact section (the CV file itself and the nav CV link are delivered in Story 1.3)

**Given** the content review
**When** the site is inspected
**Then** no link to a code repository and no link to Balink (or any pro-secret client project) is exposed anywhere

**Given** all home-page sections
**When** viewed from ~375px up to large desktop
**Then** dense grids reflow to 1–2 columns, paddings are reduced on mobile, tap targets are ≥ 44px, text is legible without zoom, and there is no stray horizontal scroll

## Epic 3: Mouvement, curseur & fidélité « Technical Minimal »

Le curseur personnalisé, le fondu au défilement et le marquee donnent vie à la page sans jamais nuire à l'accessibilité ; une passe de fidélité aligne le rendu sur le design de référence avec dégradation gracieuse.

### Story 3.1: Fondu au défilement, animation du marquee & respect de `prefers-reduced-motion`

As a visitor,
I want content blocks to fade in as they enter the viewport and the client marquee to scroll, with all of this neutralized when I've requested reduced motion,
So that the page feels alive but never works against my accessibility needs.

**Acceptance Criteria:**

**Given** the `useScrollFadeIn` hook (IntersectionObserver)
**When** a content block enters the viewport on scroll
**Then** it fades / translates in using `opacity`/`transform` only, at ~60 fps, with no layout thrashing

**Given** the clients marquee
**When** it is displayed
**Then** the wordmarks scroll horizontally using `transform` only, at a speed adapted for mobile

**Given** `prefers-reduced-motion: reduce` is set
**When** the page loads
**Then** the scroll fade-in is replaced by immediate appearance and the marquee is frozen or slowed
**And** no motion-based animation runs

### Story 3.2: Curseur personnalisé, passe de fidélité visuelle & dégradation gracieuse

As a visitor on a fine-pointer device,
I want a custom cursor (dot + ring) and a final visual pass that faithfully matches the "Technical Minimal" reference, degrading gracefully on older browsers,
So that the site looks exactly as designed and proves the craft it claims.

**Acceptance Criteria:**

**Given** the `CustomCursor` component loaded via `next/dynamic`
**When** I use a device matching `(hover: hover) and (pointer: fine)`
**Then** a custom dot + ring cursor follows the pointer using `mix-blend-mode`, animated with `transform`/`opacity` only
**And** on `(hover: none), (pointer: coarse)` devices, or when `prefers-reduced-motion: reduce` is set, the custom cursor is disabled and the system cursor is never hidden

**Given** the implemented site versus the design reference (`Minimal.jsx`)
**When** I review each section side by side
**Then** palette, typography, background grid, terminal-style cards, KPI rows, and the marquee match the reference, and a visual reference snapshot is captured for regression checks

**Given** a browser without `backdrop-filter` or `mix-blend-mode`
**When** the site is viewed
**Then** the experience remains legible and usable (e.g. nav slightly less translucent), with no broken layout

## Epic 4: Accessibilité, performance & SEO — prêt au lancement

Le site atteint WCAG 2.1 AA, tient les budgets de performance et expose un SEO complet (métadonnées, social cards, données structurées, favicons/OG) ; un check Lighthouse en CI signale les régressions.

### Story 4.1: Accessibilité WCAG 2.1 AA

As a visitor using a keyboard or a screen reader,
I want full keyboard operability with a visible focus indicator and a skip link, AA-contrast text, and a coherent semantic/ARIA structure,
So that I can use the entire site regardless of how I navigate it.

**Acceptance Criteria:**

**Given** the design reference greys (`#a3a3a3`, `#888` on `#0a0a0a`)
**When** contrast is audited
**Then** body text meets ≥ 4.5:1 (≥ 3:1 for large text / UI), and tokens below threshold are adjusted without breaking the aesthetic

**Given** keyboard navigation
**When** I tab through the page
**Then** every interactive element is reachable and activatable in a logical order, focus is always visible via `:focus-visible` (never bare `outline: none`), and a "skip to content" link is available

**Given** assistive technology
**When** the page is parsed
**Then** there is a single `<h1>`, a coherent heading hierarchy, page landmarks (`nav`/`main`/`footer`), `aria-label` on icon links (LinkedIn, phone), `aria-current` on the active section link, the marquee is `aria-hidden`, and the language switch is announced
**And** automated audits (axe / Lighthouse a11y) report 0 errors and Lighthouse Accessibility = 100

### Story 4.2: Budget de performance & Core Web Vitals

As a visitor on a mobile connection,
I want the home page to load fast and stay smooth,
So that I never bounce because the site is slow.

**Acceptance Criteria:**

**Given** the home page under simulated mobile conditions (4× CPU, 4G)
**When** it loads
**Then** LCP < 2.0 s, FCP < 1.5 s, CLS < 0.1, INP < 200 ms, and Lighthouse Performance ≥ 95 (target ~100)

**Given** the JavaScript shipped on initial load
**When** measured (excluding fonts)
**Then** it is under ~150 KB gzip, with non-critical scripts (custom cursor, etc.) loaded via `next/dynamic`

**Given** images
**When** served
**Then** they use `next/image` in modern formats (AVIF/WebP), are correctly sized, lazy-loaded below the fold, and cause no layout shift
**And** there is no stray horizontal scroll from ~320px up to large desktop

### Story 4.3: SEO, métadonnées de partage & assets de marque

As a search engine or someone sharing the link,
I want pre-rendered content, complete metadata, social cards, structured data, and proper favicons/OG images,
So that the site is discoverable and looks right when shared.

**Acceptance Criteria:**

**Given** the pre-rendered pages
**When** crawled without executing JavaScript
**Then** the main content is present in the initial HTML

**Given** per-language metadata
**When** a page is loaded or shared
**Then** it has a localized `<title>` and description, OpenGraph + Twitter Card with image (`splash.png`), JSON-LD `Person` (name, role, location, `sameAs` LinkedIn), `sitemap.xml`, `robots.txt`, `hreflang` FR↔EN alternates, and a canonical URL

**Given** the brand assets (`logo*.svg`, `splash*.png`)
**When** the build runs
**Then** a favicon set, an OG image, and a web manifest are generated from them
**And** a Lighthouse check runs in CI (advisory in MVP), with Performance ≥ 95 / Accessibility = 100 / Best Practices ≥ 95 / SEO ≥ 95 on the home page

## Epic 5: Mesure d'audience privacy-friendly

Le site mesure, de façon agrégée et sans cookie, les visites et les clics sur les CTA contact pour suivre la conversion visite → contact.

### Story 5.1: Analytics sans cookie & suivi des CTA contact

As the owner (Michael),
I want privacy-friendly, cookie-less analytics that tracks visits and contact-CTA clicks,
So that I can observe the visit → contact conversion without harming visitor privacy or needing a consent banner.

**Acceptance Criteria:**

**Given** a cookie-less analytics solution (Plausible-type)
**When** it is integrated
**Then** it loads a lightweight script, sets no tracking cookies, collects no personally identifying data, sends nothing to third parties beyond aggregate measurement, and is GDPR-compliant without a consent banner

**Given** the contact CTAs (email in nav, hero, contact section)
**When** a visitor triggers one
**Then** an aggregate event is recorded, visible in the analytics dashboard alongside page-view counts

## Epic 6: Blog — infrastructure (MVP) & activation (Post-MVP)

Infrastructure MDX prête dès le MVP avec section/nav masquées tant que vide ; activation complète (pages liste/article, RSS, démasquage auto) en Post-MVP.

### Story 6.1: Infrastructure MDX & masquage conditionnel du blog

As the owner (Michael),
I want to add a blog post by dropping an MDX file in the repo, with the blog section and nav link staying hidden until at least one post exists,
So that the blog infrastructure is ready without showing an empty section.

**Acceptance Criteria:**

**Given** an MDX pipeline for `content/blog/`
**When** I add an MDX file with typed frontmatter (title, date, slug, locale, description)
**Then** it is detected at build time without any change to presentation code

**Given** no published article exists
**When** the site builds and renders
**Then** the blog section and its nav link are not shown

**Given** the build-time blog detection (it counts published MDX articles in `content/blog/`)
**When** the build runs
**Then** the detection result (`hasPublishedPosts`) is exposed to the layout, so the blog section and nav link render only when ≥ 1 article exists — and in the MVP, with zero articles, nothing blog-related is visible anywhere
**And** the actual blog list/article pages, syntax highlighting, RSS feed, and the auto-revealed nav link/section are out of scope here and delivered by Story 6.2 (Post-MVP)

### Story 6.2: Activation du blog — pages liste/article & RSS (Post-MVP)

As a visitor or a feed aggregator,
I want to browse the article list, read individual articles, and subscribe via RSS,
So that I can follow Michael's writing.

**Acceptance Criteria:**

**Given** at least one published article
**When** I visit the blog
**Then** I see an article list page and can open an individual article page with syntax highlighting and a clean reading layout, consistent with "Technical Minimal"
**And** the blog nav link / section appear automatically

**Given** the build
**When** it runs
**Then** an RSS feed (`feed.xml`) is generated / regenerated from the MDX articles, and aggregators can subscribe to it

## Epic 7: Growth — case studies, page « now »/changelog & CI durci

Extensions Post-MVP : pages case studies approfondies, page « now »/changelog, et CI Lighthouse bloquant sur régression.

### Story 7.1: Pages case studies & page « now »/changelog (Post-MVP)

As a visitor evaluating depth,
I want dedicated case-study pages (Balink anonymized / Limova / Maqom) and a "now"/changelog page,
So that I can dig deeper into specific work and see the site evolving.

**Acceptance Criteria:**

**Given** a case-study page template
**When** the case studies are published
**Then** there are dedicated pages for Balink (anonymized, respecting pro secrecy), Limova, and Maqom, each with deeper context than the home-page summary, in FR and EN
**And** they are linked from the relevant home-page entries

**Given** a "now"/changelog page
**When** it is published
**Then** it presents the current focus and a `v2026.x` changelog, in FR and EN

### Story 7.2: CI Lighthouse durci (Post-MVP)

As the owner (Michael),
I want the CI Lighthouse check to be enforcing,
So that a performance or accessibility regression blocks the deploy.

**Acceptance Criteria:**

**Given** the CI pipeline
**When** a push or PR triggers it
**Then** Lighthouse runs with a strict JS budget and the documented score thresholds, and the pipeline fails (blocking the deploy) on any regression below threshold

## Epic 8: Vision — hébreu (RTL) & variantes de design

Extensions Vision : hébreu comme 3ᵉ langue avec RTL, et variantes de design alternatives issues du canvas.

### Story 8.1: Support de l'hébreu (3ᵉ langue, RTL) (Post-MVP)

As a Hebrew-speaking visitor,
I want the site available in Hebrew with proper right-to-left layout,
So that I can read it naturally in my language.

**Acceptance Criteria:**

**Given** a new `he` locale
**When** I switch to Hebrew
**Then** all content is served in Hebrew from the typed dictionary, `<html lang="he" dir="rtl">` is set, and layouts adapt correctly to RTL with no broken or overflowing elements
**And** `hreflang` includes the Hebrew alternate

### Story 8.2: Variantes de design alternatives (Post-MVP)

As the owner (Michael),
I want to explore alternative design variants from the canvas, with a way to switch between them,
So that I can iterate on the site's look and optionally run a light A/B.

**Acceptance Criteria:**

**Given** an alternative design variant from the canvas (`design-canvas (3).jsx`)
**When** it is implemented
**Then** it is available behind a switch mechanism, preserves all content and accessibility, and can optionally be served as a light A/B variant
