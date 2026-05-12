---
title: "Product Brief Distillate: portfolio"
type: llm-distillate
source: "product-brief-portfolio.md"
created: "2026-05-12"
purpose: "Token-efficient context for downstream PRD creation"
---

# Distillat — Portfolio Michael Mann

## Nature du projet
- Le « produit » = site portfolio personnel de Michael Mann, Senior Frontend Engineer (Ashdod, Israël). Projet non commercial : optimiser pour valeur stakeholder + chemin d'adoption (visibilité, contact), pas pour métriques business classiques.
- Construit en solo par Michael, assisté IA, **ASAP** — idéalement live pour la fenêtre « available for new opportunities · Q2 2026 ».
- Contenu rédactionnel déjà figé dans `_bmad-output/planning-artifacts/design/content.md` (source de vérité du contenu : hero, about, expérience, side projects, stack, AI & agentic, contact, footer).

## Objectifs (par priorité)
- Vitrine **mixte** : (1) décrocher rôles senior/leadership salariés, (2) missions freelance sélectives, (3) crédibilité pour les side projects (Maqom).
- Audience = les 4 simultanément : recruteurs/hiring managers tech ; CTO/VP Eng/fondateurs ; clients freelance ; réseau/pairs/communauté.
- **Métrique nord :** hausse du taux de réponse aux candidatures (le site fait passer une candidature de « ignoré » à « entretien »). Non attribuable directement → prévoir instrumentation légère (analytics de base, visites → clics contact).
- Autres signaux : demandes de contact entrantes qualifiées ; mentions qualitatives du site dans les échanges de recrutement.

## Différenciateurs (ordre d'emphase)
1. **Agentic engineering** — « ship *avec* des agents, pas juste *pour* eux » : BMAD, MCP stack (Context7, Playwright, Sequential Thinking, Brave Search), Claude Code daily driver, boilerplate perso affiné de projet en projet. Angle 2026 où il a une longueur d'avance.
2. **Craft luxe sous contraintes dures** — apps quotidiennes LV/Dior/Tiffany/Messika ; 2 WeChat Mini Programs sous limite 2 MB (subpackages custom, optim bundle agressive).
3. **Junior → Lead** — équipes distribuées Israël/France/Chine, standards frontend, mentoring, hiring/onboarding de 5 dev, ownership delivery bout en bout.
4. **Trilingue + builder indépendant** — FR natif / HE courant / EN pro ; fondateur de Maqom (entité Cyprus, billing multi-devises EUR/USD/ILS, KYC Stripe, infra Google Workspace).
5. **Le site est sa propre démo** — perf, a11y, design system, multilingue : le portfolio prouve les standards qu'il prêche.

## Périmètre V1 (IN)
- Site **one-page** fluide, sections de `content.md`. Mobile-first (60 %+ recruteurs sur mobile). CTA contact dans le hero **et** le footer. Liens LinkedIn + email. **CV téléchargeable**.
- **Infra blog prête mais section masquée** jusqu'à publication du 1er article (zéro « blog vide », lancement non bloqué). Sujets prévus : d'abord engineering agentic, puis mix frontend craft / agentic, cadence souple.
- **Multilingue FR + EN** (HE en option, sacrifiable si ça retarde).
- Stack imposée : **React / Vite / Tailwind** (cohérence avec ce qu'il recommande). Voir stack complète dans `content.md` (React Query, Redux Toolkit, Zustand, shadcn/ui, i18n, etc.).
- **Budget perf strict** : Lighthouse ~100, LCP ciblé. HTML sémantique, SEO de base, métadonnées sociales (OpenGraph).
- Side projects présentés via descriptions soignées (produit / stack / challenges). **Lien sortant uniquement vers maqom.co.** Pas de lien Balink (secret pro travail client). Pas de liens repos (tous privés).
- Instrumentation analytics légère.

## Périmètre V1 (OUT — explicite)
- CMS lourd, espace membre, authentification.
- Pages case studies dédiées approfondies (matière dispo dans `content.md` → candidat v1.1).
- Page « méthodologie » dédiée / lead magnet / produit autonome — la méthodo reste une carte side project.
- Liens vers repos (privés) ou projets clients sous secret pro.
- Hébreu si retarde le lancement.
- Analytics avancées / A/B testing.

## Contexte technique / contraintes
- Tout doit pouvoir être livré rapidement en solo + IA → favoriser une stack légère, déploiement simple (cohérent avec territoire Linear/Vercel).
- Multilingue = du site lui-même (i18n FR/EN), pas seulement « je parle 3 langues ».
- Le site doit être *distribué* pour convertir : lié depuis LinkedIn (section Featured), CV, signature email, chaque candidature ; indexable sur « Michael Mann frontend engineer ».
- Ton/visuel : professionnel, premium, minimaliste (Linear/Vercel territory). Langue du contenu : anglais (le site lui-même), même si la communication projet est en français.

## Scénarios utilisateurs (détaillés)
- *Recruteur pressé* : arrive via lien dans une candidature, scanne <30 s sur mobile → doit voir immédiatement séniorité, marques (LV/Dior/Tiffany), stack, statut « available Q2 2026 », et pouvoir cliquer email sans scroller chercher.
- *CTO / VP Eng* : creuse → lit expérience détaillée (Balink, Limova.ai), évalue pensée systémique + leadership + maturité produit ; à terme lit le blog pour juger la profondeur.
- *Client freelance* : cherche preuves de résultats livrés et fiabilité → cartes side projects + impact chiffré des rôles.
- *Pair / communauté* : intéressé par l'angle agentic → blog (futur), partage.

## Intelligence concurrentielle / marché (recherche 2026)
- Recruteurs : <30 s sur première visite ; one-page fluide > multi-pages animés ; éviter animations lourdes et layouts complexes.
- Mobile : 60 %+ des recruteurs consultent sur mobile.
- Senior-specific : ce qui démarque = case studies avec archi/impact, écrits, open-source, talks (Michael n'a pas d'OSS public ni de talks → compense par descriptions produit soignées + futur blog).
- Piège classique 2026 : portfolio « dernier projet 2022 » — l'angle agentic de Michael est l'antidote.
- CTA contact dans hero ET footer = best practice de conversion confirmée.

## Vision (2-3 ans)
- Hub de marque personnelle : corpus d'écrits faisant autorité sur l'engineering agentic + frontend craft ; case studies dédiées (Balink/Limova/Maqom) ; point d'entrée naturel des opportunités (poste senior/leadership, freelance, ou scaling de Maqom). Capital de réputation qui travaille en continu.

## Questions ouvertes / à trancher au stade PRD
- Choix d'hébergement/déploiement et stratégie i18n concrète (lib, routing FR/EN, sous-dossiers vs sous-domaines).
- Trigger précis pour « démasquer » la section blog (1 article ? 2 ?) et pipeline d'écriture des articles.
- HE : in ou out définitif selon le coût réel.
- Outil analytics (privacy-friendly type Plausible vs autre).
- Format CV téléchargeable (PDF généré vs statique) et son maintien à jour.
- Niveau d'animation/motion acceptable vs budget perf (Lighthouse ~100).
