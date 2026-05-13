---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
classification:
  projectType: 'static / pre-rendered personal-portfolio site (Next.js App Router + TypeScript + Tailwind, multilingual FR/EN)'
  domain: 'personal branding / portfolio site (unregulated)'
  complexity: 'low'
  projectContext: 'greenfield'
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-portfolio.md'
  - '_bmad-output/planning-artifacts/product-brief-portfolio-distillate.md'
  - '_bmad-output/planning-artifacts/design/content.md'
  - '_bmad-output/planning-artifacts/design/content.js'
  - '_bmad-output/planning-artifacts/design/Portfolio.html'
  - '_bmad-output/planning-artifacts/design/Minimal.jsx'
  - '_bmad-output/planning-artifacts/design/design-canvas (3).jsx'
  - '_bmad-output/planning-artifacts/design/ (logos: logo.svg, logo-dark.svg, logo-text.svg, maqom-logo-light.png, maqom-logo-dark.png; splash.png, splash-dark.png)'
workflowType: 'prd'
releaseMode: phased
documentCounts:
  briefs: 2
  research: 0
  brainstorming: 0
  projectDocs: 0
---

# Product Requirements Document - portfolio

**Author:** Mike
**Date:** 2026-05-12

> **À propos de ce document.** PRD du site portfolio personnel de Michael Mann. Plan : résumé exécutif & positionnement → classification → critères de succès → périmètre (synthèse) → parcours utilisateurs → spécificités web app (stack, perf, SEO, a11y) → scoping phasé & risques → exigences fonctionnelles (FR1–FR36, + FR3a) → exigences non fonctionnelles (NFR1–NFR27). Sources : `product-brief-portfolio.md` (+ distillat), `design/content.md`/`content.js`, design de référence `Portfolio.html`/`Minimal.jsx`.
>
> **Révision 2026-05-12 :** ajout de la section « Freelance Engagements » (FR3a) et de la renumérotation des labels de section, alignement sur `design/content.md` ; arbitrage i18n routing tranché (segments `app/[locale]/...`) ; périmètre FR + EN confirmé ferme (pas de repli EN-only).

## Executive Summary

Le portfolio de Michael Mann est un site vitrine personnel — un site Next.js (App Router) / TypeScript / Tailwind, one-page et pré-rendu, multilingue FR/EN — destiné à convertir trois publics simultanément : recruteurs et hiring managers tech (rôles seniors salariés), CTO/VP Eng/fondateurs (leadership technique), et clients freelance ; tout en donnant de la crédibilité à ses produits indépendants (Maqom). Le problème résolu : un capital professionnel rare — craft frontend pour des maisons de luxe sous contraintes dures, parcours junior → lead d'équipes distribuées, et une pratique avancée de l'*agentic engineering* — aujourd'hui éparpillé entre un CV, LinkedIn et des conversations, donc illisible en 30 secondes par les bonnes personnes. Le site condense ce capital en une expérience rapide, soignée et persuasive, et sert de hub de marque personnelle : il fait passer une candidature de « ignoré » à « entretien » et attire des missions freelance qualifiées.

Le moment est juste : Michael est disponible à partir du Q2 2026, et son angle *agentic engineering* est précisément le sujet où il a une longueur d'avance en 2026 — là où la concurrence montre encore un « dernier projet 2022 ».

### What Makes This Special

La combinaison rare, en un seul profil : **(1) agentic engineering** — « shipping with agents, not just for them » : méthodo BMAD, MCP stack (Context7, Playwright, Sequential Thinking, Brave Search), Claude Code en daily driver, et un boilerplate personnel affiné de projet en projet ; **(2) craft luxe sous contraintes dures** — apps quotidiennes pour Louis Vuitton, Dior, Tiffany & Co., Messika ; 2 WeChat Mini Programs livrés sous la limite des 2 MB via subpackages custom et optimisation de bundle agressive ; **(3) junior → lead** — équipes distribuées Israël/France/Chine, standards frontend établis, hiring & onboarding de 5 dev, ownership delivery de bout en bout ; **(4) trilingue & builder indépendant** — FR natif / HE courant / EN pro, entre marchés israélien et français, fondateur d'un SaaS avec entité, billing multi-devises et KYC Stripe en production.

Le différenciateur structurel : **le site est sa propre démonstration** — Lighthouse ~100, LCP dans le budget, accessibilité WCAG, design system, i18n propre, esthétique « Technical Minimal » (territoire Linear/Vercel) déjà définie via Claude Design. Il prouve les standards qu'il prêche au lieu de les affirmer. L'« unfair advantage » honnête : cette combinaison rare, plus la capacité à livrer ce site lui-même rapidement et proprement avec sa propre méthodo agentique.

## Project Classification

- **Type de projet :** site web vitrine personnel — portfolio one-page **Next.js (App Router)** + TypeScript + Tailwind, pré-rendu / statique par défaut, multilingue FR/EN, déploiement statique sur Vercel. Pas de backend applicatif, pas d'authentification, pas de blog, pas d'analytics.
- **Domaine :** site vitrine / personal branding — non régulé. Pas de contrainte de conformité ; pas d'analytics côté site (donc pas de problématique RGPD côté visiteur).
- **Complexité du domaine :** faible (logique métier minimale). La difficulté réelle : fidélité au design « Technical Minimal », budget de performance strict, i18n propre, accessibilité.
- **Contexte :** greenfield — aucun système existant ; artefacts de planification et design de référence (`Portfolio.html` / `Minimal.jsx` / `content.js`) déjà disponibles.

## Success Criteria

### User Success

- **Recruteur / hiring manager (mobile, <30 s) :** identifie immédiatement séniorité, marques de luxe, stack principale et statut de disponibilité **sans scroller pour trouver le contact** → résultat attendu : la candidature liée passe à l'étape entretien.
- **CTO / VP Eng / fondateur :** trouve assez de matière (rôles détaillés avec impact chiffré, angle agentic, side projects) pour juger pensée systémique + leadership en une visite → résultat : prise de contact pour un rôle senior/leadership.
- **Client freelance potentiel :** voit des preuves de résultats livrés et de fiabilité → résultat : demande de mission qualifiée.
- **Moment « aha » :** « ce site est rapide, soigné, terminal-minimal — et l'angle agentic, je ne l'ai vu nulle part ailleurs ».

### Business Success

- **Métrique nord (3-6 mois) :** hausse mesurable du **taux de réponse aux candidatures** (passage « ignoré » → « entretien ») depuis que le portfolio est en ligne et lié à chaque candidature.
- **3 mois :** site live et lié partout (LinkedIn Featured, CV, signature email, candidatures) avant/pendant la fenêtre Q2 2026 ; ≥ 1 fil de conversation entrant qualifié (poste ou freelance) attribuable au site.
- **12 mois :** le portfolio est cité spontanément dans des échanges de recrutement ; au moins une opportunité concrète (offre, mission, ou crédibilité Maqom) traçable au site.

### Technical Success

Synthèse (détail et seuils chiffrés : voir §§ *Web App Specific Requirements* et *Non-Functional Requirements*) :

- **Performance :** Lighthouse Perf ≥ 95 (cible 100), LCP < 2 s mobile, CLS < 0,1, budget JS initial ~150 KB gzip.
- **Accessibilité :** Lighthouse A11y = 100, WCAG 2.1 AA, `prefers-reduced-motion` respecté.
- **i18n :** FR + EN complet, switch persistant, `hreflang`, aucun texte en dur non traduit.
- **SEO / partage :** contenu pré-rendu, métadonnées sociales + JSON-LD, sitemap/robots, indexable sur « Michael Mann frontend engineer ».
- **Qualité d'implémentation :** fidélité au design de référence « Technical Minimal », TypeScript strict, build reproductible, déploiement statique.

### Measurable Outcomes

| Outcome | Cible | Échéance |
|---|---|---|
| Site en production, FR + EN, lié partout | Live | Q2 2026 |
| Lighthouse Perf / A11y / Best Practices / SEO | ≥ 95 / 100 / ≥ 95 / ≥ 95 | Au lancement |
| LCP (mobile, 4G simulée) | < 2,0 s | Au lancement |
| Contacts entrants qualifiés via le site | ≥ 1 / mois | À partir de M+1 |
| Taux de réponse aux candidatures | En hausse vs. avant-portfolio | M+6 |

## Product Scope (synthèse)

Livraison **monolithique MVP** *(scope post-MVP « Growth » et « Vision » retiré le 2026-05-13)*. Le détail technique est dans le § *Web App Specific Requirements*.

**Dans la V1 (MVP) :** site one-page complet (nav, hero, clients/marquee, about, experience+KPI, **freelance engagements**, projects — Maqom en vedette avec lien `maqom.co` + carte méthodo, stack, AI & agentic, contact, footer), fidèle au design « Technical Minimal » ; i18n **FR + EN** complet ; budget perf strict + WCAG 2.1 AA ; CV téléchargeable ; SEO + métadonnées sociales + favicon/splash ; déploiement statique Vercel + CI lint/types (+ Lighthouse advisory).

**Hors scope (explicite) :** lien vers Balink ou vers des repos (secret pro / repos privés) ; **blog** (articles éditoriaux, MDX, RSS, démasquage auto) ; **analytics / mesure d'audience** (le site n'embarque aucun script de tracking) ; pages case studies dédiées ; hébreu / RTL ; variantes de design alternatives ; CMS/auth/backend ; PWA installable ; A/B testing.

## User Journeys

### Journey 1 — Léa, Tech Recruiter (chemin nominal, mobile)

**Situation :** Léa source pour un poste Senior Frontend dans une scale-up. 40 profils dans son pipeline, traités entre deux réunions, sur téléphone. Le CV de Michael l'a intriguée (luxe + AI), elle a besoin d'un signal rapide avant de pousser le profil au hiring manager.

- **Ouverture :** elle ouvre le portfolio depuis le lien dans la candidature. Charge instantanément (LCP < 2 s), hero net : « Senior frontend engineer building production SaaS for global brands », badge vert « available — Q2 2026 ». En 5 s : séniorité, dispo, localisation, stack.
- **Montée :** scroll au pouce — marquee des maisons (Louis Vuitton, Dior, Tiffany, Messika), cartes Experience avec KPI en gros (« 3 000+ companies », « 5 devs hired », « 2 MB WeChat cap »). Les chiffres parlent sans lire les bullets.
- **Climax :** elle veut contacter — CTA email dans la nav sticky **et** le hero **et** la section contact. Un tap → mail prérempli ; elle copie aussi LinkedIn.
- **Résolution :** elle pousse le profil au hiring manager (« regarde son site, c'est du sérieux »). Candidature → entretien.
- **Risques :** site lent/cassé sur mobile, contact planqué, switch FR/EN invisible ou non fonctionnel.

→ **Capacités :** perf mobile stricte, hero dense above-the-fold, CTA contact omniprésent, KPI scannables, switch de langue visible, liens externes fiables.

### Journey 2 — David, VP Engineering (évaluation approfondie, desktop)

**Situation :** recrute un Lead Frontend ; un de ses devs lui a transféré le portfolio. Veut juger la profondeur : architecture, leadership, maturité produit.

- **Ouverture :** desktop. Il remarque les détails — nav style terminal (`$ cd ./about`), badge `v2026.1`, curseur custom, grille de fond, fade-in subtil. Signal : « cette personne soigne le craft ».
- **Montée :** lit About (architecture/craft + leadership distribué), Experience en détail (équipe de 4 sur 3 continents chez Balink, pivot produit + hiring de 5 devs chez Limova), section AI & agentic (« Shipping with agents, not just for them » — BMAD, MCP, Claude Code). Inédit parmi les portfolios qu'il a vus.
- **Climax :** il réalise que le site *est* la preuve — ouvre DevTools/Lighthouse : ~100. Cohérence discours/exécution.
- **Résolution :** mail perso (« ton angle agentic m'intéresse »). Prise de contact pour un rôle leadership.
- **Risques :** animations lourdes/jank, contenu vague, dernière expérience datée.

→ **Capacités :** profondeur du contenu, section AI/agentic mise en valeur, micro-interactions soignées mais performantes, qualité technique vérifiable, zéro bullshit.

### Journey 3 — Sarah, fondatrice cherchant un freelance senior (FR)

**Situation :** lance un SaaS B2B, cherche un freelance frontend senior pour l'architecture. Française, a trouvé Michael via son réseau. Veut des preuves : a-t-il construit *from scratch* ? livre-t-il ?

- **Ouverture :** elle bascule en **FR** (switch nav) — tout traduit proprement, aucun texte EN résiduel.
- **Montée :** lit Limova.ai (« sole frontend developer for 6 months: built the entire frontend architecture from scratch... shipped V1 ») et Maqom (co-fondateur, entité Cyprus, billing multi-devises, KYC Stripe, PWA). Clique `$ open maqom.co →` : un vrai produit live.
- **Climax :** la carte méthodo « AI-Driven Development Methodology » la rassure — process reproductible, livraison rapide sans perte de qualité. Profil « senior autonome » recherché.
- **Résolution :** mail pour une mission de cadrage. Demande de mission qualifiée.
- **Risques :** lien maqom.co cassé, FR incomplet, absence de code visible (repos privés) — compensée par descriptions produit/stack/challenges détaillées.

→ **Capacités :** i18n FR complet, lien sortant fiable vers Maqom, descriptions de side projects riches, carte méthodo bien présentée.

### Journey 4 — Tom, pair / dev curieux (partage)

**Situation :** a vu un post LinkedIn de Michael sur l'agentic engineering, vient voir le site.

- **Ouverture :** scrolle direct vers la section AI & agentic, lit les 4 cartes (Claude Code, Claude Design, BMAD, MCP Stack).
- **Montée :** comprend le positionnement (« Shipping with agents, not just for them ») et la stack outillée (MCP, BMAD, Claude Code). Le site lui-même fait office de preuve.
- **Résolution :** partage le lien à un pair, autorité accrue sur le sujet ; effet réseau.
- **Risques :** section AI noyée dans la home, ou positionnement vague.

→ **Capacités :** section AI/agentic comme point d'entrée visible et soignée ; le site lui-même comme démo de la méthodo. *(Blog & corpus d'écrits initialement prévus post-MVP — retirés du scope le 2026-05-13.)*

### Journey 5 — Michael, propriétaire (maintenance)

**Situation :** nouveau client signé / nouveau rôle / KPI à actualiser → mettre à jour le contenu et le CV téléchargeable.

- **Ouverture :** édite le contenu (fichier de contenu typé) — un seul endroit, FR + EN.
- **Montée :** remplace le PDF du CV ; ajuste rôles/KPI/stack dans le dictionnaire typé.
- **Climax :** `git push` → déploiement statique automatique (Vercel) en < 1 min, Lighthouse vérifié en CI.
- **Résolution :** site à jour sans effort, qualité garantie par le pipeline ; déployé avec sa propre méthodo agentique — le site est aussi une démo de son workflow.
- **Risques :** contenu en dur dispersé → maintenance pénible ; pas de garde-fou perf en CI → régression silencieuse.

→ **Capacités :** contenu centralisé et typé, contenu/i18n éditables sans toucher la présentation, CV remplaçable, pipeline build/déploiement statique, check Lighthouse en CI.

### Journey Requirements Summary

| Domaine de capacité | Révélé par | MVP ? |
|---|---|---|
| Hero dense above-the-fold + CTA contact omniprésent (nav + hero + contact) | J1, J2 | ✅ |
| Perf mobile stricte (LCP, CLS, budget JS) + check en CI | J1, J5 | ✅ (CI : MVP léger) |
| Contenu détaillé : About 2 colonnes, Experience + KPI rows, side projects riches | J2, J3 | ✅ |
| Section « Freelance Engagements » (missions avec liens sortants, `MissionCard`) | J3 | ✅ |
| Section AI & agentic mise en valeur | J2, J4 | ✅ |
| i18n FR + EN complet, switch visible et persistant, hreflang | J1, J3 | ✅ |
| Liens externes fiables (mailto, LinkedIn, maqom.co), CV téléchargeable | J1, J3, J5 | ✅ |
| Design « Technical Minimal » fidèle + micro-interactions performantes (curseur, fade-in, reduced-motion off) | J2 | ✅ |
| Qualité technique vérifiable : HTML sémantique, métadonnées sociales, Lighthouse | J2 | ✅ |
| Contenu centralisé/typé, éditable sans toucher la présentation | J5 | ✅ |
| Pipeline déploiement statique + CI Lighthouse | J5 | ✅ déploiement / CI Lighthouse advisory |

## Web App Specific Requirements

### Project-Type Overview

Site web one-page, construit avec **Next.js (App Router)** et **TypeScript strict**, **Tailwind CSS** (+ shadcn/ui au besoin). Rendu : statique par défaut (SSG / pré-rendu au build) — aucune donnée dynamique côté serveur, pas d'API applicative, pas d'authentification, pas de blog. Déploiement sur **Vercel**. Le site est essentiellement statique et doit être servi comme tel (pages pré-rendues, assets optimisés).

### Browser Support Matrix

- **Cibles :** 2 dernières versions de Chrome, Edge, Firefox, Safari — desktop et mobile (iOS Safari, Chrome Android). Pas d'IE, pas de legacy.
- **Fonctionnalités CSS modernes assumées :** `backdrop-filter` (nav blur), `mix-blend-mode` (curseur), CSS Grid, `clamp()`, custom properties. Dégradation gracieuse acceptable (ex. nav légèrement moins translucide sans `backdrop-filter`).
- **JS :** ES2020+, modules natifs. Pas de polyfills lourds.

### Responsive Design

- **Mobile-first** : 60 %+ du trafic recruteurs est mobile. Le hero doit livrer son message « above the fold » sur un viewport ~375×667.
- Breakpoints Tailwind standard. Layouts denses du design « Technical Minimal » (grilles 3-4 colonnes Stack/Experience/AI, meta strip hero) → reflow en 1-2 colonnes sur mobile, paddings fortement réduits (le design desktop utilise `96px 80px`).
- Marquee clients : conserver l'animation horizontale, vitesse adaptée mobile.
- Curseur custom : **désactivé** sur `(hover: none), (pointer: coarse)`.
- Cible : pas de scroll horizontal parasite ; tap targets ≥ 44px ; texte lisible sans zoom.

### Performance Targets

- **Lighthouse (mobile + desktop, accueil) :** Performance ≥ 95 (cible ~100), Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95.
- **Core Web Vitals :** LCP < 2,0 s (4G simulée) ; CLS < 0,1 ; INP < 200 ms ; FCP < 1,5 s.
- **Budget JS :** bundle initial < ~150 KB gzip hors fonts (ordre de grandeur — favoriser le statique, `next/dynamic` pour le non-critique comme la logique du curseur).
- **Fonts :** Inter, JetBrains Mono, Cormorant Garamond auto-hébergées via `next/font` (pas de requête Google Fonts runtime), `display: swap`, sous-ensembles latins, preload de la font critique (Inter).
- **Images :** `next/image`, formats modernes (AVIF/WebP), logos SVG inline quand possible, splash optimisé.
- **Animations :** `transform`/`opacity` uniquement ; IntersectionObserver pour le fade-in ; pas de layout thrashing.

### SEO Strategy

- Pages pré-rendues (SSG) → HTML complet pour les crawlers.
- `<title>` + meta description par langue ; OpenGraph + Twitter Card (image `splash.png`) ; JSON-LD `Person` (nom, rôle, lieu, sameAs : LinkedIn).
- `sitemap.xml` + `robots.txt`.
- `hreflang` FR ↔ EN ; URLs localisées (à arbitrer dans l'archi).
- Objectif : « Michael Mann frontend engineer » / « Michael Mann portfolio ».
- HTML sémantique : un seul `<h1>` (hero), hiérarchie `<h2>`/`<h3>` cohérente, `<nav>`, `<main>`, `<footer>`, `<article>` pour rôles/projets/articles.

### Accessibility Level

- **Cible : WCAG 2.1 AA + Lighthouse A11y = 100.**
- Contrastes AA sur tout le texte (vérifier `#a3a3a3`/`#888` sur `#0a0a0a` — ajuster si sous le seuil pour le texte courant).
- Navigation clavier complète ; ordre de tab logique ; `:focus-visible` stylé (jamais `outline: none` nu) ; skip-link « aller au contenu ».
- `prefers-reduced-motion: reduce` → curseur custom désactivé, fade-in remplacé par apparition immédiate, marquee figé/ralenti.
- ARIA minimal et correct : `aria-label` sur les liens d'icônes (LinkedIn, phone…), `aria-current` sur le lien de section actif, marquee décoratif `aria-hidden` (marques présentes en texte accessible ailleurs).
- Switch de langue annoncé ; `lang` du `<html>` mis à jour ; `dir="ltr"`.
- Le curseur custom ne masque jamais le curseur système pour qui en dépend (géré : pointeurs fins uniquement).

### Implementation Considerations

- **Routing / i18n (décidé) :** Next.js App Router avec **segments de locale (`app/[locale]/...`)** — URLs localisées explicites (`/fr`, `/en`), idiomatique App Router, compatible SSG (`generateStaticParams`), `hreflang` + `<link rel="canonical">` par locale, `<html lang>` dérivé du segment. La préférence de langue est mémorisée par cookie, lu par un middleware léger qui redirige `/` vers la locale préférée (ou détectée via `Accept-Language`). Tout le texte passe par un dictionnaire typé FR/EN (un seul fichier de contenu source, dérivé de `content.js`/`content.md`).
- **Contenu :** données structurées (meta, hero, clients, about, experience, **freelance**, projects, stack, ai, contact, footer) dans un module TS typé — éditable sans toucher la présentation. Ordre canonique des sections affichées : `01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`.
- **Composants :** porter ceux du design de référence (`Minimal.jsx` → React/TS + Tailwind, styles inline → classes) : `Nav`, `GridSection`, `Hero`, `Clients` (marquee), `SectionHead`, `About`, `RoleCard`/`Experience`, `MissionCard`/`Freelance`, `Projects` (terminal-card Maqom + carte méthodo), `Stack`, `AI`, `Contact`, `Footer`, + `CustomCursor` et hook `useScrollFadeIn`.
- **Assets :** logos (`logo.svg`, `logo-dark.svg`, `logo-text.svg`, `maqom-logo-*`), `splash*.png` → favicon set + OG image + manifest.
- **Qualité / CI :** ESLint + TypeScript strict en CI ; check Lighthouse en CI (advisory) ; déploiement automatique sur push.
- **Hors scope explicite :** pas de PWA installable pour ce site (Maqom est PWA, pas le portfolio), pas de CLI, pas de backend, pas de base de données, pas d'auth, pas de temps réel, pas de blog, pas d'analytics.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

- **Approche MVP : « experience MVP »** — le site doit être *premium et complet sur la page d'accueil* dès le jour 1 (un portfolio à moitié fini est contre-productif pour un senior). On ne réduit pas les sections de la home. *(Les éléments « post-MVP » historiquement différés — blog, case studies dédiées, hébreu, analytics, variantes de design — ont été retirés du scope le 2026-05-13.)*
- **Critère « c'est utile » :** un recruteur/CTO arrive, comprend le profil en 30 s, peut contacter en 1 tap, le site est rapide et soigné, l'angle agentic est visible.
- **Chemin le plus rapide vers un apprentissage validé :** site en ligne avant/pendant Q2 2026, lié à chaque candidature, observer si le taux de réponse monte.
- **Ressources :** **Michael en solo, assisté IA** (sa propre méthodo agentique). Pas d'équipe, pas de budget, contrainte « ASAP » → favoriser les choix qui minimisent le travail (composants déjà designés à porter, contenu déjà rédigé, stack maîtrisée, déploiement statique Vercel).

### MVP Feature Set (Phase 1)

**Journeys couverts :** J1 (recruteur mobile), J2 (VP Eng desktop), J3 (fondatrice freelance FR), J4 (pair / dev curieux — section AI), J5 (propriétaire).

**Must-have :**
- One-page complet : nav, hero, clients (marquee), about, experience (KPI rows), projects (Maqom terminal-card + lien maqom.co, carte méthodo), stack, AI & agentic, contact, footer.
- Fidélité au design « Technical Minimal » (palette, typos, curseur custom off sur tactile + reduced-motion, fade-in scroll, grille de fond, marquee).
- i18n **FR + EN** complet, switch visible + persistant, hreflang.
- Budget perf strict (Lighthouse ≥ 95 / A11y 100 ; LCP < 2 s ; CLS < 0,1), WCAG 2.1 AA.
- CV téléchargeable (lien nav/hero/contact).
- SEO de base + OG/Twitter + JSON-LD Person + sitemap + robots ; favicon/OG depuis les assets.
- Contenu centralisé/typé (module TS dérivé de `content.js`), éditable sans toucher la présentation.
- Déploiement statique Vercel ; ESLint + TS strict en CI ; check Lighthouse en CI (advisory).
- Exclu : lien Balink, liens repos (secret pro / privés), blog, analytics, case studies dédiées, hébreu/RTL, variantes de design.

### Post-MVP Features

*(Phases 2 « Growth » et 3 « Vision » retirées le 2026-05-13 — blog, case studies dédiées, page « now »/changelog, CI Lighthouse durci, hébreu/RTL, variantes de design : tout hors scope. Le périmètre se réduit au MVP Phase 1.)*

### Risk Mitigation Strategy

- **Risques techniques :**
  - *Tenir le budget perf avec curseur custom + fade-in + marquee + 3 polices* → `next/font` auto-hébergées + preload Inter ; animations `transform`/`opacity` ; curseur en `next/dynamic` ; Lighthouse en CI.
  - *Contrastes du design (`#a3a3a3`/`#888` sur `#0a0a0a`) potentiellement sous le seuil AA pour le texte courant* → audit contrastes dès le portage, ajuster sans trahir l'esthétique.
  - *i18n FR/EN qui laisse traîner du texte en dur* → tout le texte via dictionnaire typé, check de complétude des locales.
  - *Portage de `Minimal.jsx` (styles inline) vers React/TS + Tailwind* → tâche cadrée, composant par composant, snapshot visuel de référence.
- **Risques produit / marché :**
  - *Attribution du « taux de réponse » impossible* → mesure proxy (visites → clics contact) + suivi qualitatif des retours mentionnant le site.
  - *Absence de code public* → compensée par descriptions produit/stack/challenges riches + lien live Maqom + carte méthodo.
- **Risques ressources :**
  - *Solo + ASAP* → scope volontairement borné (pas de blog, pas de case studies dédiées, pas d'hébreu, pas d'analytics, pas de variantes de design — cf. *Post-MVP Features*) ; réutilisation maximale (design + contenu déjà faits). **Le périmètre FR + EN est ferme** (« experience MVP » — un portfolio bilingue à moitié traduit serait contre-productif) : pas de repli EN-only.

## Functional Requirements

### A. Présentation du contenu portfolio

- **FR1 :** Un visiteur peut consulter une section hero présentant le nom, le titre, une accroche, une sous-accroche, une bande de métadonnées (localisation, expérience, langues, focus) et un badge de disponibilité.
- **FR2 :** Un visiteur peut consulter une section « about » présentant le positionnement de Michael (architecture, design systems, performance, leadership).
- **FR3 :** Un visiteur peut consulter une section « experience » listant les rôles, chacun avec entreprise, lieu, intitulé, dates, durée, indicateurs clés (KPI), points marquants et tags technologiques.
- **FR3a :** Un visiteur peut consulter une section « freelance engagements » listant les missions freelance, chacune avec nom, intitulé, dates, durée, statut (ex. « Completed » / « Shipped to production »), un lien sortant vers le produit/site de la mission (ex. `sayelo.ai`, `penpaloo.io`), une accroche, des points marquants et des tags technologiques. Cette section s'insère entre « experience » et « side projects », d'où la numérotation des labels de section : `01 About · 02 Experience · 03 Freelance Engagements · 04 Side Projects · 05 Stack · 06 Contact`.
- **FR4 :** Un visiteur peut consulter une section « side projects » présentant chaque projet avec nom, statut, tagline, description, stack ; le projet vedette (Maqom) est mis en avant et inclut un lien sortant vers `maqom.co`.
- **FR5 :** Un visiteur peut consulter une section « stack » organisant les technologies par groupes (Frontend, Tooling & Architecture, Backend & Data).
- **FR6 :** Un visiteur peut consulter une section « AI & Agentic Engineering » présentant le positionnement et un ensemble d'outils/méthodes (Claude Code, Claude Design, BMAD, MCP Stack).
- **FR7 :** Un visiteur peut consulter une bande de logos/wordmarks des marques clientes (Louis Vuitton, Dior, Messika, Tiffany & Co.), présentée de façon décorative.
- **FR8 :** Un visiteur peut consulter une section « contact » avec un appel à l'action e-mail primaire et des informations secondaires (LinkedIn, téléphone, localisation, langues).
- **FR9 :** Un visiteur peut consulter un pied de page (mention de copyright).
- **FR10 :** Le site n'expose aucun lien vers les dépôts de code ni vers les projets clients sous secret professionnel (notamment Balink).

### B. Navigation & appels à l'action

- **FR11 :** Un visiteur peut naviguer vers chaque section depuis une barre de navigation persistante.
- **FR12 :** Un visiteur peut, depuis n'importe quel endroit du site, déclencher un contact e-mail via un appel à l'action présent dans la barre de navigation, dans le hero et dans la section contact.
- **FR13 :** Un visiteur peut accéder au profil LinkedIn de Michael depuis la navigation/le hero/la section contact.
- **FR14 :** Un visiteur peut télécharger le CV de Michael depuis le site.
- **FR15 :** Un visiteur voit l'indicateur de disponibilité (« available — Q2 2026 ») de manière cohérente dans la navigation et le hero.

### C. Internationalisation

- **FR16 :** Un visiteur peut consulter l'intégralité du site en français ou en anglais.
- **FR17 :** Un visiteur peut basculer la langue à tout moment via un sélecteur visible, et son choix est conservé entre les visites/pages.
- **FR18 :** Le site sert un contenu correctement localisé pour les moteurs de recherche (URLs localisées, `hreflang`, `lang` du document).
- **FR19 :** Aucun texte affiché n'est codé en dur en dehors du système de traduction (toute chaîne visible existe en FR et EN).

### D. Blog *(section retirée le 2026-05-12 — fonctionnalité abandonnée ; FR20–FR23 supprimés ; numéros conservés tels quels pour ne pas renuméroter FR24+.)*

### E. Édition & maintenance du contenu

- **FR24 :** Un éditeur (Michael) peut mettre à jour tout le contenu textuel et structuré du portfolio (hero, about, experience, projets, stack, AI, contact, footer) depuis une source de contenu centralisée et typée, en FR et EN.
- **FR25 :** Un éditeur (Michael) peut remplacer le fichier de CV téléchargeable.
- **FR26 :** Un éditeur (Michael) peut déclencher un déploiement du site à jour via une opération de publication standard (push) ; le déploiement est automatique.

### F. Découvrabilité, partage & mesure

- **FR27 :** Le site fournit des métadonnées de référencement et de partage (titre, description, OpenGraph/Twitter Card avec image, données structurées `Person`, `sitemap`, `robots`).
- **FR28 :** Le site est indexable et pré-rendu de sorte que son contenu soit accessible aux moteurs de recherche sans exécution de JavaScript.
- **FR29 :** *(retiré le 2026-05-13 — mesure d'audience hors scope ; numéro conservé pour ne pas renuméroter FR30+.)*

### G. Expérience visuelle & interactions

- **FR30 :** Un visiteur sur dispositif à pointeur fin voit un curseur personnalisé (point + anneau) ; ce curseur est désactivé sur dispositif tactile/pointeur grossier.
- **FR31 :** Un visiteur voit les blocs de contenu apparaître en fondu à l'entrée dans le viewport au défilement.
- **FR32 :** Un visiteur ayant exprimé une préférence de mouvement réduit (`prefers-reduced-motion`) voit ces animations (curseur personnalisé, fondu au défilement, marquee) désactivées ou neutralisées.
- **FR33 :** Le site reproduit fidèlement la direction visuelle de référence « Technical Minimal » (palette sombre + accent doré, typographies Inter/JetBrains Mono/Cormorant Garamond, grille de fond des sections, cartes style fenêtre-terminal, rangées de KPI, marquee de wordmarks).
- **FR34 :** Le site s'affiche correctement et reste pleinement utilisable du mobile (~375px) au grand écran desktop, sans défilement horizontal parasite.

### H. Accessibilité

- **FR35 :** Un visiteur peut parcourir et activer tous les éléments interactifs au clavier, avec un indicateur de focus visible, et accéder directement au contenu principal via un lien d'évitement.
- **FR36 :** Un visiteur utilisant un lecteur d'écran obtient des libellés et une structure de document cohérents (titres hiérarchisés, repères de page, libellés des liens d'icônes, éléments décoratifs masqués de l'arbre d'accessibilité).

## Non-Functional Requirements

### Performance

- **NFR1 :** Sur la page d'accueil, en conditions mobile simulées (CPU 4×, réseau 4G), **LCP < 2,0 s**, **FCP < 1,5 s**, **CLS < 0,1**, **INP < 200 ms**.
- **NFR2 :** Scores **Lighthouse** (mobile et desktop, page d'accueil) : Performance **≥ 95** (cible 100), Accessibility **= 100**, Best Practices **≥ 95**, SEO **≥ 95**.
- **NFR3 :** Le **JavaScript exécuté au chargement initial** de la page d'accueil reste sous **~150 KB gzip** (hors polices) ; les scripts non critiques (logique du curseur, etc.) sont chargés de façon différée.
- **NFR4 :** Les **polices** sont auto-hébergées (pas de requête tierce au runtime), avec sous-ensembles latins et `display: swap` ; la police critique (Inter) est préchargée. Aucun FOIT visible.
- **NFR5 :** Les **images** sont servies en formats modernes (AVIF/WebP), dimensionnées et `lazy` hors du premier écran ; aucun décalage de mise en page dû au chargement d'images.
- **NFR6 :** Les **animations** (curseur, fondu au défilement, marquee) n'utilisent que `transform`/`opacity`, restent fluides (~60 fps) et n'introduisent pas de jank perceptible.
- **NFR7 :** Le **poids total transféré** de la page d'accueil au premier chargement (HTML + CSS + JS + polices + images above-the-fold) vise **< ~600 KB** (objectif indicatif).

### Accessibility

- **NFR8 :** Conformité **WCAG 2.1 niveau AA** sur l'ensemble du site.
- **NFR9 :** Tout le **texte courant** respecte un ratio de contraste **≥ 4,5:1** (≥ 3:1 pour le grand texte / éléments d'interface) ; les valeurs de gris du design de référence sont auditées et ajustées si nécessaire.
- **NFR10 :** **Navigation clavier** complète, ordre de tabulation logique, focus toujours **visible** (`:focus-visible`), lien d'évitement vers le contenu principal.
- **NFR11 :** La préférence **`prefers-reduced-motion: reduce`** neutralise curseur personnalisé, fondu au défilement et marquee.
- **NFR12 :** Structure sémantique correcte : un seul `<h1>`, hiérarchie de titres cohérente, repères de page (`nav`/`main`/`footer`), libellés accessibles sur les liens d'icônes, éléments décoratifs (marquee) retirés de l'arbre d'accessibilité ; cible **0 erreur** aux audits automatiques (axe / Lighthouse).
- **NFR13 :** Le curseur personnalisé ne masque jamais le curseur système sur les dispositifs où l'utilisateur en dépend (activé uniquement sur pointeurs fins).

### Compatibility

- **NFR14 :** Rendu et fonctionnement complets sur les **2 dernières versions** de Chrome, Edge, Firefox et Safari — desktop et mobile (iOS Safari, Chrome Android). Aucun support d'Internet Explorer ni de navigateurs legacy.
- **NFR15 :** **Dégradation gracieuse** des effets reposant sur des fonctionnalités CSS récentes (`backdrop-filter`, `mix-blend-mode`) : sur navigateur non compatible, l'expérience reste lisible et utilisable.
- **NFR16 :** Aucun défilement horizontal parasite ni élément tronqué de **~320px** de large jusqu'aux grands écrans desktop.

### Reliability & Operability

- **NFR17 :** Site hébergé en **statique sur CDN** (Vercel) ; disponibilité visée **≥ 99,9 %** ; aucune dépendance runtime à un service tiers pour l'affichage du contenu.
- **NFR18 :** **Déploiement automatique** sur `push`, sans intervention manuelle ; un déploiement échoué ne remplace pas la version en production (rollback / déploiement atomique).
- **NFR19 :** Un déploiement courant (mise à jour de contenu) se propage en production en **moins de ~2 minutes**.

### Maintainability

- **NFR20 :** Tout le contenu (textes, métadonnées, données structurées des sections) est **centralisé**, **typé** et **séparé de la présentation** ; ajouter/modifier du contenu ne requiert aucune modification des composants de présentation.
- **NFR21 :** Le contenu existe **intégralement en FR et EN** ; l'absence d'une traduction est détectable (échec de build ou avertissement de lint), aucune chaîne visible n'est codée en dur.
- **NFR22 :** Le code respecte **TypeScript strict** et passe **ESLint** sans erreur en intégration continue ; un contrôle **Lighthouse en CI** signale les régressions de performance/accessibilité (bloquant à terme — souhaitable en MVP).
- **NFR23 :** Les composants sont **portés fidèlement** du design de référence (`Minimal.jsx`) vers React/TS + Tailwind (styles inline remplacés par des classes), avec une référence visuelle permettant de vérifier la non-régression.

### Privacy & Compliance

- **NFR24 :** *(retiré le 2026-05-13 — mesure d'audience hors scope ; numéro conservé.)*
- **NFR25 :** Aucune donnée personnelle de visiteur n'est collectée, stockée ou transmise à des tiers. *(NFR24 retiré — l'absence totale de collecte reste valable par défaut puisque le site ne fait plus aucune mesure d'audience.)*

### SEO & Discoverability (quality targets)

- **NFR26 :** Le contenu principal est **pré-rendu** et présent dans le HTML initial (lisible par les crawlers sans exécution de JavaScript).
- **NFR27 :** Métadonnées complètes : `<title>`/description par langue, **OpenGraph + Twitter Card** avec image, **JSON-LD `Person`** (nom, rôle, lieu, `sameAs` LinkedIn), `sitemap.xml`, `robots.txt`, `hreflang` FR↔EN, URL canonique.
