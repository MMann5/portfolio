// Dictionnaire EN — SOURCE DE VÉRITÉ de la forme ET du contenu.
// `type Dictionary` est dérivé de ce fichier (cf. ./index.ts) ; `fr.ts` doit le
// satisfaire à la lettre (garde de complétude `satisfies Dictionary`).
//
// Modèle de contenu complet (Story 1.3) : meta / nav / hero / clients / sections
// (about · experience · freelance · projects · stack · contact) / ai / footer / langSwitcher.
// Contenu repris de `_bmad-output/planning-artifacts/design/content.md` (autorité) et
// complété par `…/content.js` pour les données structurées (KPI des rôles, project_meta de
// Maqom, listes de la section stack). Numérotation des sections issue de `content.md`.
// Les sections de page réelles (layouts) = Epic 2 — ici on ne livre que le shell.
//
// ⚠️ Pas de `as const` ici : on veut que `typeof en` élargisse les `string` littéraux
// (sinon `fr satisfies Dictionary` exigerait des chaînes FR *identiques* aux chaînes EN).

const en = {
  // ── Métadonnées & coordonnées (point de vérité unique) ─────────────────────
  meta: {
    title: "Michael Mann",
    description:
      "Senior frontend engineer — from luxury retail to AI. React/TypeScript, from architecture to production.",
    // Libellés SEO ajoutés en Story 4.3 — `jobTitle` est consommé par le JSON-LD
    // `Person` et par le `title.default` enrichi ; `ogImageAlt` sert d'`alt`
    // pour la balise `og:image` et la balise `twitter:image:alt`.
    jobTitle: "Senior Frontend Developer",
    ogImageAlt:
      "Michael Mann — Senior Frontend Developer · 5 yrs",
    email: "michael.mann55@gmail.com",
    linkedin: "https://www.linkedin.com/in/michael-mann-339545149",
    linkedinShort: "https://www.linkedin.com/in/michael-mann-339545149",
    phone: "+972 58 422 0567",
    // Lien WhatsApp pour les CTAs nav/hero (le bouton mail du Contact reste `mailto:`).
    // Format `wa.me` international, sans espaces ni `+` — ouvre l'app native ou WhatsApp Web.
    whatsapp: "https://wa.me/972584220567",
    languagesList: "French · Hebrew · English",
    statusLabel: "Available for new opportunities — Q2 2026",
    // Chemin du PDF de CV servi depuis `public/cv/` — MÊME valeur EN/FR. Référencé
    // par la `Nav` (Story 1.3) et réutilisé par les liens CV du hero/contact (Epic 2).
    cvPath: "/cv/michael-mann-cv.pdf",
  },

  // ── Shell : barre de navigation persistante ────────────────────────────────
  nav: {
    brandName: "Michael Mann",
    versionBadge: "v2026.1",
    availabilityLabel: "available — Q2 2026",
    ctaEmail: "Get in touch",
    ctaCv: "CV",
    ctaCvAriaLabel: "Download CV (PDF)",
    ariaLabel: "Primary",
    menuLabel: "Menu",
    menuClose: "Close",
    menuAriaLabel: "Toggle navigation menu",
    menuPanelLabel: "Mobile navigation",
  },

  // ── Hero (layout réel = Story 2.1 ; ici seulement le contenu typé) ─────────
  hero: {
    badge: "Available — Q2 2026",
    headline: {
      lead: "Senior Frontend Developer, 5 years, ",
      accent: "from luxury retail to AI",
      tail: " — React/TypeScript, from architecture to production.",
    },
    sub: "Applications used daily by Sales Advisors at Louis Vuitton, Dior, Tiffany & Co., and Messika. A multi-agent AI platform serving 3,000+ companies. Today, I'm building my own SaaS.",
    meta: [
      { label: "Experience", value: "5 yrs" },
      { label: "Languages", value: "FR · HE · EN" },
      { label: "Focus", value: "React · TS · Supabase" },
    ],
    // Ligne décorative `$ whoami → …` du design (le préfixe `$ whoami →` est ajouté
    // par le composant — décoration ASCII ; seule la valeur est du contenu).
    whoami: "michael-mann · senior-frontend-engineer",
    // Libellés des 3 CTAs du hero (copie distincte de la nav — cf. Story 2.1).
    ctaContact: "Start a conversation",
    ctaLinkedin: "LinkedIn",
    ctaCv: "Download CV",
    ctaCvAriaLabel: "Download CV (PDF)",
  },

  // ── Bandeau clients (marquee animé = Epic 3 ; layout = Epic 2) ─────────────
  clients: {
    shippedToLabel: "// clients.shipped_to",
    viaLabel: "4 houses · via Balink",
    items: [
      { name: "Louis Vuitton", note: "Catalog app · WeChat Mini Program" },
      { name: "Dior", note: "WeChat Mini Program" },
      { name: "Messika", note: "Internal back-office" },
      { name: "Tiffany & Co.", note: "Customer-facing digital card" },
    ],
  },

  // ── Sections numérotées & ancrées (ordre d'insertion = ordre de nav) ───────
  sections: {
    about: {
      id: "about",
      num: "01",
      navLabel: "About",
      label: "About",
      heading: "A frontend engineer who thinks in systems — and ships.",
      sub: "Architecture, design systems, performance, end-to-end delivery.",
      body: {
        left: [
          "Senior frontend engineer. React, TypeScript, Tailwind, Supabase — and products that actually ship. From luxury retail to multi-agent AI, I architect frontend codebases from scratch, across multi-brand and multi-timezone projects.",
          "Today: I take codebases from architecture to deployment, on projects under strict performance and accessibility constraints. I set frontend standards, I mentor teammates — and I ship.",
        ],
        right: [
          "I care about the craft: clean architecture, polished UI, performance budgets that actually hold, design systems that scale beyond a single team. I think long-term — in the code, and in the product.",
          "And beyond client work, I'm building my own SaaS — designed multi-market, multi-language, multi-currency from V1. My trilingual profile stops being a line on a CV: it becomes a product edge.",
        ],
      },
    },
    experience: {
      id: "experience",
      num: "02",
      navLabel: "Experience",
      label: "Experience",
      heading: "Selected roles.",
      sub: "From luxury retail to AI platforms — building software that ships.",
      roles: [
        {
          company: "Balink",
          location: null,
          url: "www.balink.net",
          title: "Senior Frontend Developer",
          dates: "Dec 2021 — Present",
          duration: "4.5 years",
          bullets: [
            "Delivered React/TypeScript apps for luxury brands (Louis Vuitton, Dior, Messika, Tiffany & Co.) used daily by Sales Advisors across global retail stores.",
            "Owned frontend architecture, code reviews, and delivery across multi-brand projects with a distributed team in France ↔ Israel ↔ China.",
            "Built a complete catalog app for Louis Vuitton from scratch, and shipped 2 WeChat Mini Programs (Vuitton, Dior) within the strict 2 MB main-package limit through custom subpackages, zero-dependency components and aggressive bundle optimization.",
            "Designed and developed an internal back-office for Messika and a customer-facing digital card for Tiffany & Co. — from architecture to production rollout.",
            "Frontend standards that still shape the team today, teammates mentored through code review, end-to-end delivery owned across multi-brand, cross-cultural projects.",
          ],
          tags: [
            "React",
            "TypeScript",
            "WeChat Mini Programs",
            "Bundle optimization",
            "Frontend architecture",
          ],
          kpis: [
            { value: "4", label: "Luxury maisons" },
            { value: "2 MB", label: "WeChat bundle cap" },
            { value: "5", label: "Apps shipped from scratch" },
          ],
        },
        {
          company: "Limova.ai",
          location: "France · Remote",
          url: "www.limova.ai",
          title: "Senior Frontend Developer · Freelance",
          dates: "Mar 2024 — Nov 2025",
          duration: "1.5 years",
          bullets: [
            "Sole frontend developer for the first 6 months: designed and built the entire frontend architecture from scratch with React, TypeScript, Next.js, Vite, Tailwind, React Query, Redux Toolkit and Supabase. Shipped to production for the V1 launch.",
            "Drove a full product pivot post-launch — from a SaaS for non-profit grant applications to a multi-agent AI platform for entrepreneurs and SMBs, now serving 3,000+ companies.",
            "Laid the foundations that let the frontend team scale: coding standards, review processes, sprint workflows — and onboarded 5 frontend developers in 6 months, without losing velocity.",
            "Translated complex AI workflows into clean, user-focused interfaces (chatbots, dashboards, agent configuration, WhatsApp integration), collaborating with product, design and AI engineering teams.",
          ],
          tags: [
            "Next.js",
            "Supabase",
            "AI / LLMs",
            "Redux Toolkit",
            "Architecture from scratch",
          ],
          kpis: [
            { value: "3,000+", label: "Companies served" },
            { value: "1", label: "Full product pivot" },
            { value: "V1", label: "Shipped solo" },
          ],
        },
      ],
    },
    freelance: {
      id: "freelance",
      num: "03",
      navLabel: "Freelance Engagements",
      label: "Freelance Engagements",
      heading: "Selected missions.",
      sub: "Engagements where I owned the entire frontend solo — from architecture to delivery.",
      missions: [
        {
          name: "Sayelo",
          location: "France",
          title: "Lead Frontend Developer · Freelance",
          dates: "Jan 2026 — May 2026",
          duration: "5 months",
          status: "Completed",
          url: "sayelo.ai",
          tagline:
            "AI voice assistant for business phone reception — answering, qualifying and booking appointments 24/7.",
          bullets: [
            "Built and shipped the frontend solo over 5 months — Google OAuth, Supabase integration, full user journey from booking flow to agent dashboard.",
            "Configured Google OAuth and Supabase integration for the platform's authentication and Google Calendar booking flow.",
            "Prepared the technical roadmap for Google Calendar integration — evaluating OAuth verification vs. split Cloud projects to scale across customer accounts.",
            "Solo on the frontend, in direct touch with the founding team — architecture decisions, technical trade-offs, and delivery cadence.",
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
          title: "Lead Frontend Developer · Freelance",
          dates: "Jan 2025 — Sep 2025",
          duration: "9 months",
          status: "Shipped to production",
          url: "penpaloo.io",
          tagline:
            "A safe digital penpal platform for kids — building language skills and cultural curiosity through letter exchanges.",
          bullets: [
            "Built the web application solo, from scratch: kids' profiles, pen-pal matching, letter exchange flow, and parent dashboard.",
            "Owned the frontend architecture end-to-end: component library, state management, routing and backend integration.",
            "Shipped a polished, child-friendly UI with strong emphasis on UX, accessibility and parental safety controls.",
            "Collaborated directly with founders and design to translate product vision into production-ready interfaces. Successfully deployed to production.",
          ],
          tags: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Supabase",
            "Frontend architecture",
          ],
        },
      ],
    },
    projects: {
      id: "projects",
      num: "04",
      navLabel: "Side Projects",
      label: "Side Projects",
      heading: "Independent products.",
      sub: "SaaS and tools I build, ship and maintain outside of client work.",
      items: [
        {
          name: "Maqom",
          url: "www.maqom.co/en",
          status: "In validation",
          tagline: "A CRM built for event industry professionals.",
          description:
            "Co-founded with two partners under Maqom Software Ltd. A focused CRM for photographers, videographers and wedding planners — multi-currency Stripe billing (EUR/USD/ILS) with IP-based geolocation, full Stripe KYC for the entity, and Google Workspace email infrastructure. Multi-language from V1 (8 languages), PWA web-first.",
          descriptionTwo: null,
          stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "PWA"],
          featured: true,
          projectMeta: [
            { label: "entity", value: "Maqom Software Ltd." },
            { label: "billing", value: "Stripe · multi-currency" },
            { label: "markets", value: "EUR · USD · ILS" },
            { label: "languages", value: "8 from V1" },
            { label: "distribution", value: "PWA web-first" },
            { label: "role", value: "Co-founder · frontend lead" },
            { label: "target", value: "Photographers · videographers · planners" },
          ],
        },
        {
          name: "AI-Driven Development Methodology",
          url: null,
          status: "In production",
          tagline:
            "An engineer's agentic methodology, born from practice — assembled and refined project after project on production codebases.",
          description:
            "An engineer's approach to the agentic stack, refined project after project on production codebases. The stack: Claude Code as the cockpit, BMAD for structured agentic workflows, and a hand-picked MCP server set (Context7, Playwright, Sequential Thinking, Brave Search) wired into every project. Covers the full lifecycle — PRD & architecture, scaffolding, feature delivery, testing, code review, refactoring — with deterministic outputs at every stage.",
          descriptionTwo:
            "The result: a battle-tested process I deploy on every new project — client work or my own SaaS — that compresses delivery time by an order of magnitude, without giving an inch on code quality, type safety or architectural coherence. Stack-agnostic, framework-agnostic, project-agnostic.",
          stack: ["Claude Code", "MCP", "BMAD", "Agentic workflows", "Methodology"],
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
      heading: "Tools of the trade.",
      sub: "The technologies I summon to ship frontends that are reliable, performant — and built to last.",
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
          title: "Architecture & tooling",
          items: [
            "Frontend architecture",
            "Design systems",
            "Component-driven development",
            "Performance (LCP, TTI)",
            "Vite",
            "Vitest",
            "Playwright",
            "Git",
            "GitHub Actions",
          ],
        },
        {
          title: "Backend & Data",
          items: [
            "Supabase",
            "PostgreSQL",
            "RLS",
            "NestJS",
            "MongoDB",
            "REST APIs",
            "OpenAPI / Orval",
            "Next.js SSR",
          ],
        },
        {
          title: "Agentic & AI",
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
      heading: "Let's build something lasting.",
      sub: "Open to senior frontend roles.",
      primaryCtaLabel: "Drop me a line.",
      respondWithin: "I respond within 24 hours.",
      ctaCv: "Download CV",
      ctaCvAriaLabel: "Download CV (PDF)",
      secondaryLinks: [
        { label: "LinkedIn", value: "https://www.linkedin.com/in/michael-mann-339545149" },
        { label: "Phone", value: "+972 58 422 0567" },
        { label: "Languages", value: "French · Hebrew · English" },
      ],
    },
  },

  // ── Section « AI & Agentic Engineering » (non numérotée, hors nav) ─────────
  ai: {
    label: "AI & Agentic Engineering",
    heading: "Shipping with agents, not just for them.",
    body: "Beyond integrating LLMs into product features (chatbots, multi-agent platforms, AI dashboards at Limova.ai), I've made agentic workflows a central part of how I engineer. Claude Code as the cockpit, BMAD for structured workflows, and a hand-picked MCP server set (Context7, Playwright, Sequential Thinking, Brave Search) wired into every project — for deterministic outputs from PRD to production.",
    tools: [
      {
        name: "Claude Code",
        desc: "Agentic cockpit for architecture, scaffolding, refactoring, and review.",
      },
      {
        name: "Claude Design",
        desc: "Design-to-code workflow for high-fidelity UI and design system iteration.",
      },
      {
        name: "BMAD Methodology",
        desc: "Structured agentic framework for PRD, architecture and story-driven delivery.",
      },
      {
        name: "MCP Stack",
        desc: "Context7, Playwright, Sequential Thinking, Brave Search — connected to every project.",
      },
    ],
  },

  // ── Pied de page ───────────────────────────────────────────────────────────
  footer: {
    copyright: "© 2026 Michael Mann · All rights reserved",
    tagline: "built with care ↗ everywhere",
  },

  // ── Sélecteur de langue (inchangé depuis 1.2b) ─────────────────────────────
  langSwitcher: {
    label: "Language",
    english: "English",
    french: "Français",
    // `{lang}` est remplacé par le libellé de la langue choisie (annonce aria-live).
    changedTo: "Language changed to {lang}",
  },

  // ── Libellés visually-hidden destinés aux technologies d'assistance (Story 4.1) ─
  a11y: {
    skipToContent: "Skip to content",
    opensInNewTab: "(opens in a new tab)",
  },
};

export default en;
