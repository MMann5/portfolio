import type { Dictionary } from "./index";

// Dictionnaire FR — traduction de `en.ts`.
// `satisfies Dictionary` = garde de complétude : une clé manquante, en trop ou
// mal typée casse `npm run typecheck` (donc la CI). Conserver ce pattern.
//
// Première passe de traduction (registre pro/premium) — la relecture/finition
// finale du contenu FR est cadrée pour la Story 2.4. Les noms propres, marques,
// technos et URLs restent non traduits.

const fr = {
  // ── Métadonnées & coordonnées ──────────────────────────────────────────────
  meta: {
    title: "Michael Mann",
    description:
      "Ingénieur frontend senior — du retail de luxe à l'IA. React/TypeScript, de l'architecture à la prod.",
    // Libellés SEO ajoutés en Story 4.3 — voir `en.ts` pour le détail de l'usage.
    jobTitle: "Développeur frontend senior",
    ogImageAlt:
      "Michael Mann — Développeur frontend senior · 4.5+ ans",
    email: "michael.mann55@gmail.com",
    linkedin: "https://www.linkedin.com/in/michael-mann-339545149",
    linkedinShort: "https://www.linkedin.com/in/michael-mann-339545149",
    phone: "+972 58 422 0567",
    // Lien WhatsApp pour les CTAs nav/hero (le bouton mail du Contact reste `mailto:`).
    whatsapp: "https://wa.me/972584220567",
    languagesList: "Français · Hébreu · Anglais",
    statusLabel: "Disponible pour de nouvelles opportunités — T2 2026",
    cvPath: "/cv/michael-mann-cv.pdf",
  },

  // ── Shell : barre de navigation persistante ────────────────────────────────
  nav: {
    brandName: "Michael Mann",
    versionBadge: "v2026.1",
    availabilityLabel: "disponible — T2 2026",
    ctaEmail: "Me contacter",
    ctaCv: "CV",
    ctaCvAriaLabel: "Télécharger le CV (PDF)",
    ariaLabel: "Principale",
    menuLabel: "Menu",
    menuClose: "Fermer",
    menuAriaLabel: "Afficher / masquer le menu",
    menuPanelLabel: "Navigation mobile",
  },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    badge: "Disponible — T2 2026",
    headline: {
      lead: "Développeur frontend senior, 4.5+ ans, ",
      accent: "du retail de luxe à l'IA",
      tail: " — React/TypeScript, de l'architecture à la prod.",
    },
    sub: "Applications quotidiennes pour les Sales Advisors de Louis Vuitton, Dior, Tiffany & Co. et Messika. Plateforme d'IA multi-agents pour 3 000+ entreprises. Aujourd'hui, je construis mes propres SaaS.",
    meta: [
      { label: "Expérience", value: "4.5+ ans" },
      { label: "Langues", value: "FR · HE · EN" },
      { label: "Focus", value: "React · TS · Supabase" },
    ],
    whoami: "michael-mann · senior-frontend-engineer",
    ctaContact: "Démarrer une conversation",
    ctaLinkedin: "LinkedIn",
    ctaCv: "Télécharger le CV",
    ctaCvAriaLabel: "Télécharger le CV (PDF)",
  },

  // ── Bandeau clients ────────────────────────────────────────────────────────
  clients: {
    shippedToLabel: "// clients.shipped_to",
    viaLabel: "4 maisons · via Balink",
    items: [
      { name: "Louis Vuitton", note: "Application catalogue · Mini-programme WeChat" },
      { name: "Dior", note: "Mini-programme WeChat" },
      { name: "Messika", note: "Back-office interne" },
      { name: "Tiffany & Co.", note: "Carte digitale client" },
    ],
  },

  // ── Sections numérotées & ancrées ──────────────────────────────────────────
  sections: {
    about: {
      id: "about",
      num: "01",
      navLabel: "À propos",
      label: "À propos",
      heading: "Un ingénieur frontend qui raisonne en systèmes — et qui livre.",
      sub: "Architecture, design systems, performance, livraison de bout en bout.",
      body: {
        left: [
          "Ingénieur frontend senior. React, TypeScript, Tailwind, Supabase — et des produits qui partent vraiment en production. Du retail de luxe à l'IA multi-agents, j'architecture des bases de code frontend depuis zéro, sur des projets multi-marques et multi-fuseaux.",
          "Aujourd'hui, je porte des bases de code de l'archi au déploiement, sur des projets aux contraintes strictes de performance et d'accessibilité. J'établis des standards frontend, j'accompagne les coéquipiers — et j'expédie.",
        ],
        right: [
          "Je tiens au métier : architecture propre, UI soignée, budgets de performance qui tiennent vraiment, design systems qui passent à l'échelle au-delà d'une seule équipe. Je pense long terme — dans le code comme dans le produit.",
          "Et au-delà des missions, je construis mes propres SaaS — pensés multi-marchés, multi-langues, multi-devises dès la V1. Mon profil trilingue cesse alors d'être une ligne de CV : il devient un avantage produit.",
        ],
      },
    },
    experience: {
      id: "experience",
      num: "02",
      navLabel: "Expérience",
      label: "Expérience",
      heading: "Rôles sélectionnés.",
      sub: "Du retail de luxe aux plateformes d'IA — livrer des logiciels qui partent en production.",
      roles: [
        {
          company: "Balink",
          location: null,
          url: "www.balink.net",
          title: "Développeur frontend senior",
          dates: "Déc. 2021 — aujourd'hui",
          duration: "4.5 ans",
          bullets: [
            "Livré des applications React/TypeScript pour des marques de luxe (Louis Vuitton, Dior, Messika, Tiffany & Co.) utilisées chaque jour par les Sales Advisors dans les boutiques du monde entier.",
            "Conduit l'architecture frontend, les revues de code et la livraison sur des projets multi-marques portés par une équipe distribuée France ↔ Israël ↔ Chine.",
            "Construit de zéro une application catalogue complète pour Louis Vuitton, et livré 2 mini-programmes WeChat (Vuitton, Dior) sous la limite stricte de 2 Mo du package principal, via des sous-packages sur mesure, des composants sans dépendances et une optimisation agressive du bundle.",
            "Conçu et développé un back-office interne pour Messika et une carte digitale orientée client pour Tiffany & Co. — de l'architecture au déploiement en production.",
            "Standards frontend qui structurent encore l'équipe aujourd'hui, coéquipiers accompagnés en revue de code, livraison de bout en bout assumée sur des projets multi-marques interculturels.",
          ],
          tags: [
            "React",
            "TypeScript",
            "Mini-programmes WeChat",
            "Optimisation de bundle",
            "Architecture frontend",
          ],
          kpis: [
            { value: "4", label: "Maisons de luxe" },
            { value: "2 Mo", label: "Limite bundle WeChat" },
            { value: "5", label: "Apps livrées de zéro à la prod" },
          ],
        },
        {
          company: "Limova.ai",
          location: "France · Remote",
          url: "www.limova.ai",
          title: "Développeur frontend senior · Freelance",
          dates: "Mars 2024 — nov. 2025",
          duration: "1.5 an",
          bullets: [
            "Seul développeur frontend les 6 premiers mois : conçu et construit toute l'architecture frontend depuis zéro avec React, TypeScript, Next.js, Vite, Tailwind, React Query, Redux Toolkit et Supabase. Mis en production pour le lancement de la V1.",
            "Mené un pivot produit complet après le lancement — d'un SaaS pour les demandes de subventions associatives à une plateforme d'IA multi-agents pour entrepreneurs et PME, aujourd'hui au service de plus de 3 000 entreprises.",
            "Posé les fondations qui ont permis à l'équipe frontend de grandir : standards de code, processus de revue, workflows de sprint — et l'intégration de 5 développeurs en 6 mois, sans perte de vélocité.",
            "Traduit des workflows d'IA complexes en interfaces claires et centrées utilisateur (chatbots, dashboards, configuration d'agents, intégration WhatsApp), en collaboration avec les équipes produit, design et IA.",
          ],
          tags: [
            "Next.js",
            "Supabase",
            "IA / LLMs",
            "Redux Toolkit",
            "Architecture de zéro",
          ],
          kpis: [
            { value: "3 000+", label: "Entreprises servies" },
            { value: "1", label: "Pivot produit complet" },
            { value: "V1", label: "Livrée en solo" },
          ],
        },
      ],
    },
    freelance: {
      id: "freelance",
      num: "03",
      navLabel: "Missions freelance",
      label: "Missions freelance",
      heading: "Missions sélectionnées.",
      sub: "Des missions où j'ai porté tout le frontend seul — de l'architecture à la livraison.",
      missions: [
        {
          name: "Sayelo",
          location: "France",
          title: "Lead développeur frontend · Freelance",
          dates: "Janv. 2026 — mai 2026",
          duration: "5 mois",
          status: "Terminée",
          url: "sayelo.ai",
          tagline:
            "Assistant vocal IA pour l'accueil téléphonique des entreprises — répondre, qualifier et prendre des rendez-vous 24/7.",
          bullets: [
            "Construit et livré le frontend seul sur 5 mois — authentification Google OAuth, intégration Supabase, parcours de la prise de rendez-vous au dashboard agent.",
            "Configuré l'intégration Google OAuth et Supabase pour l'authentification de la plateforme et le flux de réservation Google Calendar.",
            "Préparé la feuille de route technique de l'intégration Google Calendar — en évaluant la vérification OAuth vs. la séparation des projets Cloud pour passer à l'échelle sur les comptes clients.",
            "Frontend solo, en lien direct avec l'équipe fondatrice — décisions d'architecture, arbitrages techniques et cadence de livraison.",
          ],
          tags: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Supabase",
            "Google OAuth",
          ],
        },
        {
          name: "Penpaloo",
          location: "Remote",
          title: "Lead développeur frontend · Freelance",
          dates: "Janv. 2025 — sept. 2025",
          duration: "9 mois",
          status: "Mise en production",
          url: "penpaloo.io",
          tagline:
            "Une plateforme de correspondants sûre pour les enfants — développer les compétences linguistiques et la curiosité culturelle par l'échange de lettres.",
          bullets: [
            "Construit l'application web seul, depuis zéro : profils enfants, mise en relation des correspondants, flux d'échange de lettres et dashboard parent.",
            "Assumé l'architecture frontend de bout en bout : bibliothèque de composants, gestion d'état, routing et intégration backend.",
            "Livré une UI soignée et adaptée aux enfants, avec un fort accent sur l'UX, l'accessibilité et les contrôles de sécurité parentaux.",
            "Collaboré directement avec les fondateurs et le design pour traduire la vision produit en interfaces prêtes pour la production. Déployée avec succès en production.",
          ],
          tags: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Supabase",
            "Architecture frontend",
          ],
        },
      ],
    },
    projects: {
      id: "projects",
      num: "04",
      navLabel: "Projets perso",
      label: "Projets perso",
      heading: "Produits indépendants.",
      sub: "Des SaaS et outils que je construis, livre et maintiens en dehors des missions clients.",
      items: [
        {
          name: "Maqom",
          url: "www.maqom.co/fr",
          status: "En validation",
          tagline: "Un CRM conçu pour les professionnels de l'événementiel.",
          description:
            "Co-fondé avec deux associés sous Maqom Software Ltd. Un CRM ciblé pour photographes, vidéastes et wedding planners — facturation Stripe multi-devises (EUR/USD/ILS) avec géolocalisation par IP, KYC Stripe complet pour l'entité, et infrastructure email Google Workspace. Multi-langues dès la V1 (8 langues), PWA web-first.",
          descriptionTwo: null,
          stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "PWA"],
          featured: true,
          projectMeta: [
            { label: "entité", value: "Maqom Software Ltd." },
            { label: "facturation", value: "Stripe · multi-devises" },
            { label: "marchés", value: "EUR · USD · ILS" },
            { label: "langues", value: "8 dès la V1" },
            { label: "distribution", value: "PWA web-first" },
            { label: "rôle", value: "Co-fondateur · lead frontend" },
            { label: "cible", value: "Photographes · vidéastes · wedding planners" },
          ],
        },
        {
          name: "AI-Driven Development Methodology",
          url: null,
          status: "En production",
          tagline:
            "Une méthodologie agentique d'ingénieur, née de la pratique — assemblée et affinée projet après projet sur des bases de code en production.",
          description:
            "Une approche d'ingénieur appliquée à l'agentique, affinée projet après projet sur des bases de code en production. La pile : Claude Code en cockpit, BMAD pour les workflows agentiques structurés, et une sélection de serveurs MCP (Context7, Playwright, Sequential Thinking, Brave Search) connectés à chaque projet. Elle couvre tout le cycle — PRD & architecture, scaffolding, livraison de fonctionnalités, tests, revue de code, refactoring — avec des sorties déterministes à chaque étape.",
          descriptionTwo:
            "Le résultat : un processus éprouvé que je déploie sur chaque nouveau projet — mission client ou mon propre SaaS — qui compresse le temps de livraison d'un ordre de grandeur, sans céder un pouce sur la qualité du code, la sûreté de typage ou la cohérence architecturale. Indépendant de la stack, du framework et du projet.",
          stack: ["Claude Code", "MCP", "BMAD", "Workflows agentiques", "Méthodologie"],
          featured: false,
          projectMeta: [],
        },
      ],
    },
    stack: {
      id: "stack",
      num: "05",
      navLabel: "Stack",
      label: "Stack",
      heading: "Les outils du métier.",
      sub: "Les technologies que je convoque pour livrer des frontends fiables, performants — et qui durent.",
      groups: [
        {
          title: "Frontend",
          items: [
            "React.js",
            "TypeScript",
            "JavaScript ES6+",
            "React Query",
            "Redux Toolkit",
            "Zustand",
            "Tailwind CSS",
            "shadcn/ui",
            "MUI",
            "PWA",
            "i18n",
            "WCAG",
          ],
        },
        {
          title: "Architecture & outillage",
          items: [
            "Architecture frontend",
            "Design systems",
            "Développement orienté composants",
            "Performance (LCP, TTI)",
            "Vite",
            "Vitest",
            "Playwright",
            "Git",
            "GitHub Actions",
          ],
        },
        {
          title: "Backend & Données",
          items: [
            "Supabase",
            "PostgreSQL",
            "RLS",
            "NestJS",
            "MongoDB",
            "API REST",
            "OpenAPI / Orval",
            "Next.js SSR",
          ],
        },
        {
          title: "Agentique & IA",
          items: [
            "Claude Code",
            "BMAD",
            "MCP",
            "Context7",
            "Playwright MCP",
            "Sequential Thinking",
          ],
        },
      ],
    },
    contact: {
      id: "contact",
      num: "06",
      navLabel: "Contact",
      label: "Contact",
      heading: "Construisons quelque chose qui dure.",
      sub: "Ouvert aux postes de frontend senior.",
      primaryCtaLabel: "Écrivez-moi un mot.",
      respondWithin: "Je réponds sous 24 heures.",
      ctaCv: "Télécharger le CV",
      ctaCvAriaLabel: "Télécharger le CV (PDF)",
      secondaryLinks: [
        { label: "LinkedIn", value: "https://www.linkedin.com/in/michael-mann-339545149" },
        { label: "Téléphone", value: "+972 58 422 0567" },
        { label: "Langues", value: "Français · Hébreu · Anglais" },
      ],
    },
  },

  // ── Section « AI & Agentic Engineering » ───────────────────────────────────
  ai: {
    label: "AI & Agentic Engineering",
    heading: "Livrer avec des agents, pas seulement pour eux.",
    body: "Au-delà de l'intégration de LLMs dans des fonctionnalités produit (chatbots, plateformes multi-agents, dashboards IA chez Limova.ai), j'ai fait des workflows agentiques une part centrale de ma façon d'ingénier. Claude Code en cockpit, BMAD pour les workflows structurés, et une sélection de serveurs MCP (Context7, Playwright, Sequential Thinking, Brave Search) connectés à chaque projet — pour des sorties déterministes du PRD à la production.",
    tools: [
      {
        name: "Claude Code",
        desc: "Cockpit agentique pour l'architecture, le scaffolding, le refactoring et la revue.",
      },
      {
        name: "Claude Design",
        desc: "Workflow design-to-code pour une UI haute fidélité et l'itération du design system.",
      },
      {
        name: "BMAD Methodology",
        desc: "Framework agentique structuré pour le PRD, l'architecture et la livraison pilotée par stories.",
      },
      {
        name: "MCP Stack",
        desc: "Context7, Playwright, Sequential Thinking, Brave Search — connectés à chaque projet.",
      },
    ],
  },

  // ── Pied de page ───────────────────────────────────────────────────────────
  footer: {
    copyright: "© 2026 Michael Mann · Tous droits réservés",
    tagline: "fait avec soin ↗ partout",
  },

  // ── Sélecteur de langue ────────────────────────────────────────────────────
  langSwitcher: {
    label: "Langue",
    english: "English",
    french: "Français",
    changedTo: "Langue changée pour {lang}",
  },

  // ── Libellés visually-hidden destinés aux technologies d'assistance (Story 4.1) ─
  a11y: {
    skipToContent: "Aller au contenu",
    opensInNewTab: "(ouvre un nouvel onglet)",
  },
} satisfies Dictionary;

export default fr;
