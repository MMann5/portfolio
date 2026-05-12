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
      "Ingénieur frontend senior — applications SaaS de production pour des marques internationales.",
    email: "michael.mann55@gmail.com",
    linkedin: "https://www.linkedin.com/in/michaelmann-339545149",
    linkedinShort: "linkedin.com/in/michaelmann-339545149",
    phone: "+972 58 422 0567",
    location: "Ashdod, Israël",
    languagesList: "Français · Hébreu · Anglais",
    statusLabel: "Disponible pour de nouvelles opportunités — T2 2026",
    cvPath: "/cv/michael-mann-cv.pdf",
  },

  // ── Shell : barre de navigation persistante ────────────────────────────────
  nav: {
    brandName: "Michael Mann",
    versionBadge: "v2026.1",
    availabilityShort: "disponible",
    availabilityLabel: "disponible — T2 2026",
    ctaEmail: "Me contacter",
    ctaCv: "CV",
    ctaCvAriaLabel: "Télécharger le CV (PDF)",
    ariaLabel: "Principale",
    menuLabel: "Menu",
    menuClose: "Fermer",
    menuAriaLabel: "Afficher / masquer le menu",
  },

  // ── Hero ───────────────────────────────────────────────────────────────────
  hero: {
    badge: "Disponible — T2 2026",
    headline: {
      lead: "Développeur frontend senior, 5 ans d'expérience à construire des plateformes ",
      accent: "SaaS de production",
      tail: " en React/TypeScript. Architecture, design systems, performance, leadership d'équipe",
    },
    sub: "Plus de cinq ans à livrer des applications React/TypeScript utilisées au quotidien par les équipes commerciales de Louis Vuitton, Dior, Tiffany & Co. et Messika — ainsi que des plateformes d'IA au service de plus de 3 000 entreprises. Je construis aujourd'hui mes propres produits SaaS.",
    meta: [
      { label: "Localisation", value: "Ashdod, Israël" },
      { label: "Expérience", value: "5+ ans" },
      { label: "Langues", value: "FR · HE · EN" },
      { label: "Focus", value: "React · TS · Supabase" },
    ],
    whoami: "michael-mann · senior-frontend-engineer · ashdod.il",
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
      heading: "Un ingénieur frontend qui raisonne en systèmes.",
      sub: "Architecture, design systems, performance, leadership d'équipe.",
      body: {
        left: [
          "Je suis développeur frontend senior, spécialisé dans les plateformes SaaS de production bâties sur React, TypeScript, Tailwind et Supabase. Mon travail va de l'architecture de bases de code frontend depuis zéro à la direction d'équipes distribuées sur plusieurs continents.",
          "En cinq ans, je suis passé de junior à team lead — en établissant les standards frontend, en accompagnant les développeurs et en assumant la livraison de bout en bout de projets multi-marques aux contraintes de performance et d'accessibilité strictes.",
        ],
        right: [
          "Je tiens profondément au métier : architecture propre, UI soignée, budgets de performance qui tiennent vraiment, et design systems qui passent à l'échelle au-delà d'une seule équipe. Je pense long terme — dans le code comme dans le produit.",
          "En dehors des missions clients, je construis des produits SaaS indépendants ciblant l'industrie de l'événementiel, en tirant parti d'une position trilingue entre les marchés israélien et français.",
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
          location: "Jérusalem",
          title: "Développeur frontend senior",
          dates: "Déc. 2021 — aujourd'hui",
          duration: "4,5 ans",
          bullets: [
            "Livré des applications React/TypeScript pour des marques de luxe (Louis Vuitton, Dior, Messika, Tiffany & Co.) utilisées chaque jour par les Sales Advisors dans les boutiques du monde entier.",
            "Dirigé une équipe frontend distribuée de 4 développeurs entre Israël, la France et la Chine — en assumant l'architecture, les revues de code et la livraison sur des projets multi-marques.",
            "Construit de zéro une application catalogue complète pour Louis Vuitton, et livré 2 mini-programmes WeChat (Vuitton, Dior) sous la limite stricte de 2 Mo du package principal, via des sous-packages sur mesure, des composants sans dépendances et une optimisation agressive du bundle.",
            "Conçu et développé un back-office interne pour Messika et une carte digitale orientée client pour Tiffany & Co. — de l'architecture au déploiement en production.",
            "Passé de junior à team lead : standards frontend établis, coéquipiers accompagnés, livraison de bout en bout assumée sur des projets interculturels.",
          ],
          tags: [
            "React",
            "TypeScript",
            "Mini-programmes WeChat",
            "Optimisation de bundle",
            "Leadership d'équipe",
          ],
          kpis: [
            { value: "4", label: "Maisons de luxe" },
            { value: "2 Mo", label: "Limite bundle WeChat" },
            { value: "4", label: "Devs dirigés, 3 pays" },
          ],
        },
        {
          company: "Limova.ai",
          location: "France · Remote",
          title: "Développeur frontend senior · Freelance",
          dates: "Mars 2024 — nov. 2025",
          duration: "1,5 an",
          bullets: [
            "Seul développeur frontend les 6 premiers mois : conçu et construit toute l'architecture frontend depuis zéro avec React, TypeScript, Next.js, Vite, Tailwind, React Query, Redux Toolkit et Supabase. Mis en production pour le lancement de la V1.",
            "Mené un pivot produit complet après le lancement — d'un SaaS pour les demandes de subventions associatives à une plateforme d'IA multi-agents pour entrepreneurs et PME, aujourd'hui au service de plus de 3 000 entreprises.",
            "Assumé le rôle de Frontend Team Lead pendant 6+ mois : recruté et intégré 5 développeurs frontend, défini les standards de code, les processus de revue et les workflows de sprint qui ont fait grandir l'équipe sans sacrifier la vélocité.",
            "Traduit des workflows d'IA complexes en interfaces claires et centrées utilisateur (chatbots, dashboards, configuration d'agents, intégration WhatsApp), en collaboration avec les équipes produit, design et IA.",
          ],
          tags: [
            "Next.js",
            "Supabase",
            "IA / LLMs",
            "Redux Toolkit",
            "Mise à l'échelle d'équipe",
          ],
          kpis: [
            { value: "3 000+", label: "Entreprises servies" },
            { value: "5", label: "Devs recrutés & intégrés" },
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
      sub: "Des missions ciblées où j'ai piloté la livraison frontend de bout en bout.",
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
            "Lead développeur frontend sur une mission de 5 mois pour Sayelo, une startup française d'assistant vocal IA qui automatise l'accueil téléphonique des entreprises (prise d'appels, qualification de leads, prise de rendez-vous 24/7).",
            "Configuré l'intégration Google OAuth et Supabase pour l'authentification de la plateforme et le flux de réservation Google Calendar.",
            "Préparé la feuille de route technique de l'intégration Google Calendar — en évaluant la vérification OAuth vs. la séparation des projets Cloud pour passer à l'échelle sur les comptes clients.",
            "Collaboré étroitement avec l'équipe fondatrice et un second développeur frontend sur les décisions d'architecture, les revues de code et la livraison de fonctionnalités.",
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
            "Lead développeur frontend sur une mission de 9 mois pour construire l'application web depuis zéro — profils enfants, mise en relation des correspondants, flux d'échange de lettres et dashboard parent.",
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
          url: "maqom.co",
          status: "En validation",
          tagline: "Un CRM conçu pour les professionnels de l'événementiel.",
          description:
            "Co-fondé avec deux associés sous Maqom Software Ltd (Chypre). Un CRM ciblé pour photographes, vidéastes et wedding planners — facturation Stripe multi-devises (EUR/USD/ILS) avec géolocalisation par IP, KYC Stripe complet pour l'entité, et infrastructure email Google Workspace. PWA d'abord, avec distribution sur les stores mobiles.",
          descriptionTwo: null,
          stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "PWA"],
          featured: true,
          projectMeta: [
            { label: "entité", value: "Maqom Software Ltd. (CY)" },
            { label: "facturation", value: "Stripe · multi-devises" },
            { label: "marchés", value: "EUR · USD · ILS" },
            { label: "distribution", value: "PWA + stores mobiles" },
            { label: "rôle", value: "Co-fondateur · lead frontend" },
            { label: "cible", value: "Photographes · vidéastes · wedding planners" },
          ],
        },
        {
          name: "AI-Driven Development Methodology",
          url: null,
          status: "En production",
          tagline:
            "Un système reproductible pour livrer n'importe quel projet depuis zéro — à la vitesse de l'IA, sans perdre la rigueur d'ingénierie.",
          description:
            "Une méthodologie que j'ai conçue et affinée sur plusieurs bases de code en production — combinant des workflows agentiques structurés (BMAD), une pile de serveurs MCP soigneusement choisie (Context7, Playwright, Sequential Thinking, Brave Search) et une configuration centrée sur Claude Code. Couvre tout le cycle de vie : PRD & architecture, scaffolding, livraison de fonctionnalités, tests, revue de code et refactoring — avec des sorties déterministes à chaque étape.",
          descriptionTwo:
            "Le résultat : un processus éprouvé que je déploie sur chaque nouveau projet — mission client ou mon propre SaaS — qui compresse le temps de livraison d'un ordre de grandeur tout en préservant la qualité du code, la sûreté de typage et la cohérence architecturale. Indépendant de la stack, du framework et du projet.",
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
      sub: "Les technologies vers lesquelles je me tourne pour livrer des frontends fiables et performants.",
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
            "Orval",
          ],
        },
        {
          title: "Outillage & Architecture",
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
      ],
    },
    contact: {
      id: "contact",
      num: "06",
      navLabel: "Contact",
      label: "Contact",
      heading: "Construisons quelque chose qui dure.",
      sub: "Ouvert aux postes de frontend senior, aux opportunités de leadership technique et à des missions freelance sélectionnées. Je réponds sous 24 heures.",
      body: "Ouvert aux postes de frontend senior, aux opportunités de leadership technique et à des missions freelance sélectionnées.",
      primaryCtaLabel: "Écrivez-moi un mot.",
      respondWithin: "Je réponds sous 24 heures.",
      secondaryLinks: [
        { label: "LinkedIn", value: "linkedin.com/in/michaelmann-339545149" },
        { label: "Téléphone", value: "+972 58 422 0567" },
        { label: "Localisation", value: "Ashdod, Israël" },
        { label: "Langues", value: "Français · Hébreu · Anglais" },
      ],
    },
  },

  // ── Section « AI & Agentic Engineering » ───────────────────────────────────
  ai: {
    label: "AI & Agentic Engineering",
    heading: "Livrer avec des agents, pas seulement pour eux.",
    body: "Au-delà de l'intégration de LLMs dans les fonctionnalités produit (chatbots, plateformes multi-agents, dashboards IA chez Limova.ai), j'ai fait des workflows agentiques une part centrale de ma façon d'ingénier les logiciels. Claude Code est mon outil quotidien — couplé à une pile de serveurs MCP soigneusement choisie et à des méthodologies structurées — me permettant de passer du PRD à la production avec des sorties déterministes à chaque étape.",
    tools: [
      {
        name: "Claude Code",
        desc: "IDE agentique principal pour l'architecture, le scaffolding, le refactoring et la revue.",
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
    tagline: "fait avec soin · ashdod ↗ partout",
  },

  // ── Sélecteur de langue ────────────────────────────────────────────────────
  langSwitcher: {
    label: "Langue",
    english: "English",
    french: "Français",
    changedTo: "Langue changée pour {lang}",
  },
} satisfies Dictionary;

export default fr;
