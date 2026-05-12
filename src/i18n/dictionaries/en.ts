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
      "Senior frontend engineer building production SaaS for global brands.",
    email: "michael.mann55@gmail.com",
    linkedin: "https://www.linkedin.com/in/michaelmann-339545149",
    linkedinShort: "linkedin.com/in/michaelmann-339545149",
    phone: "+972 58 422 0567",
    location: "Ashdod, Israel",
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
    availabilityShort: "available",
    availabilityLabel: "available — Q2 2026",
    ctaEmail: "Get in touch",
    ctaCv: "CV",
    ctaCvAriaLabel: "Download CV (PDF)",
    ariaLabel: "Primary",
    menuLabel: "Menu",
    menuClose: "Close",
    menuAriaLabel: "Toggle navigation menu",
  },

  // ── Hero (layout réel = Story 2.1 ; ici seulement le contenu typé) ─────────
  hero: {
    badge: "Available — Q2 2026",
    headline: {
      lead: "Senior frontend engineer building ",
      accent: "production SaaS",
      tail: " for global brands.",
    },
    sub: "Five+ years shipping React/TypeScript apps used daily by sales teams at Louis Vuitton, Dior, Tiffany & Co. and Messika — plus AI platforms serving 3,000+ companies. Currently building independent SaaS products.",
    meta: [
      { label: "Location", value: "Ashdod, Israel" },
      { label: "Experience", value: "5+ years" },
      { label: "Languages", value: "FR · HE · EN" },
      { label: "Focus", value: "React · TS · Supabase" },
    ],
    // Ligne décorative `$ whoami → …` du design (le préfixe `$ whoami →` est ajouté
    // par le composant — décoration ASCII ; seule la valeur est du contenu).
    whoami: "michael-mann · senior-frontend-engineer · ashdod.il",
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
      heading: "A frontend engineer who thinks in systems.",
      sub: "Architecture, design systems, performance, team leadership.",
      body: {
        left: [
          "I'm a senior frontend developer specialized in production SaaS platforms built on React, TypeScript, Tailwind and Supabase. My work ranges from architecting frontend codebases from scratch to leading distributed teams across multiple continents.",
          "Over five years, I've gone from junior to team lead — establishing frontend standards, mentoring developers, and owning end-to-end delivery on multi-brand projects with strict performance and accessibility constraints.",
        ],
        right: [
          "I care deeply about craft: clean architecture, refined UI, performance budgets that actually hold, and design systems that scale beyond a single team. I think long-term — both in code and in product.",
          "Outside client work, I build independent SaaS products targeting the event industry, leveraging a trilingual position across Israeli and French markets.",
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
          location: "Jerusalem",
          title: "Senior Frontend Developer",
          dates: "Dec 2021 — Present",
          duration: "4.5 years",
          bullets: [
            "Delivered React/TypeScript apps for luxury brands (Louis Vuitton, Dior, Messika, Tiffany & Co.) used daily by Sales Advisors across global retail stores.",
            "Led a distributed frontend team of 4 developers across Israel, France and China — owning architecture, code reviews and delivery on multi-brand projects.",
            "Built a complete catalog app for Louis Vuitton from scratch, and shipped 2 WeChat Mini Programs (Vuitton, Dior) within the strict 2 MB main-package limit through custom subpackages, zero-dependency components and aggressive bundle optimization.",
            "Designed and developed an internal back-office for Messika and a customer-facing digital card for Tiffany & Co. — from architecture to production rollout.",
            "Grew from junior to team lead: established frontend standards, mentored teammates, owned end-to-end delivery on cross-cultural projects.",
          ],
          tags: [
            "React",
            "TypeScript",
            "WeChat Mini Programs",
            "Bundle optimization",
            "Team leadership",
          ],
          kpis: [
            { value: "4", label: "Luxury maisons" },
            { value: "2 MB", label: "WeChat bundle cap" },
            { value: "4", label: "Devs led, 3 countries" },
          ],
        },
        {
          company: "Limova.ai",
          location: "France · Remote",
          title: "Senior Frontend Developer · Freelance",
          dates: "Mar 2024 — Nov 2025",
          duration: "1.5 years",
          bullets: [
            "Sole frontend developer for the first 6 months: designed and built the entire frontend architecture from scratch with React, TypeScript, Next.js, Vite, Tailwind, React Query, Redux Toolkit and Supabase. Shipped to production for the V1 launch.",
            "Drove a full product pivot post-launch — from a SaaS for non-profit grant applications to a multi-agent AI platform for entrepreneurs and SMBs, now serving 3,000+ companies.",
            "Acted as Frontend Team Lead for 6+ months: hired and onboarded 5 frontend developers, defined coding standards, code review processes and sprint workflows that scaled the team without sacrificing velocity.",
            "Translated complex AI workflows into clean, user-focused interfaces (chatbots, dashboards, agent configuration, WhatsApp integration), collaborating with product, design and AI engineering teams.",
          ],
          tags: [
            "Next.js",
            "Supabase",
            "AI / LLMs",
            "Redux Toolkit",
            "Team scaling",
          ],
          kpis: [
            { value: "3,000+", label: "Companies served" },
            { value: "5", label: "Devs hired & onboarded" },
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
      sub: "Focused engagements where I led frontend delivery end-to-end.",
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
            "Lead frontend developer on a 5-month mission for Sayelo, a French AI voice assistant startup that automates business phone reception (call answering, lead qualification, 24/7 appointment booking).",
            "Configured Google OAuth and Supabase integration for the platform's authentication and Google Calendar booking flow.",
            "Prepared the technical roadmap for Google Calendar integration — evaluating OAuth verification vs. split Cloud projects to scale across customer accounts.",
            "Collaborated closely with the founding team and a second frontend developer on architecture decisions, code reviews and feature delivery.",
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
            "Lead frontend developer on a 9-month mission building the web application from the ground up — child profiles, penpal matching, letter exchange flow and parent dashboard.",
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
          url: "maqom.co",
          status: "In validation",
          tagline: "A CRM built for event industry professionals.",
          description:
            "Co-founded with two partners under Maqom Software Ltd (Cyprus). A focused CRM for photographers, videographers and wedding planners — multi-currency Stripe billing (EUR/USD/ILS) with IP-based geolocation, full Stripe KYC for the entity, and Google Workspace email infrastructure. PWA-first with mobile store distribution.",
          descriptionTwo: null,
          stack: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Stripe", "PWA"],
          featured: true,
          projectMeta: [
            { label: "entity", value: "Maqom Software Ltd. (CY)" },
            { label: "billing", value: "Stripe · multi-currency" },
            { label: "markets", value: "EUR · USD · ILS" },
            { label: "distribution", value: "PWA + App Stores" },
            { label: "role", value: "Co-founder · frontend lead" },
            { label: "target", value: "Photographers · videographers · planners" },
          ],
        },
        {
          name: "AI-Driven Development Methodology",
          url: null,
          status: "In production",
          tagline:
            "A reproducible system for shipping any project from scratch — at AI speed, without losing engineering rigor.",
          description:
            "A methodology I designed and refined across multiple production codebases — combining structured agentic workflows (BMAD), a curated MCP server stack (Context7, Playwright, Sequential Thinking, Brave Search) and a Claude Code-centric setup. Covers the full lifecycle: PRD & architecture, scaffolding, feature delivery, testing, code review and refactoring — with deterministic outputs at every stage.",
          descriptionTwo:
            "The result: a battle-tested process I deploy on every new project — client work or my own SaaS — that compresses delivery time by an order of magnitude while keeping code quality, type safety and architectural coherence intact. Stack-agnostic, framework-agnostic, project-agnostic.",
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
      sub: "The technologies I reach for to ship reliable, performant frontends.",
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
          title: "Tooling & Architecture",
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
      ],
    },
    contact: {
      id: "contact",
      num: "06",
      navLabel: "Contact",
      label: "Contact",
      heading: "Let's build something lasting.",
      sub: "Open to senior frontend roles, technical leadership opportunities and selected freelance engagements. I respond within 24 hours.",
      body: "Open to senior frontend roles, technical leadership opportunities and selected freelance engagements.",
      primaryCtaLabel: "Drop me a line.",
      respondWithin: "I respond within 24 hours.",
      secondaryLinks: [
        { label: "LinkedIn", value: "linkedin.com/in/michaelmann-339545149" },
        { label: "Phone", value: "+972 58 422 0567" },
        { label: "Location", value: "Ashdod, Israel" },
        { label: "Languages", value: "French · Hebrew · English" },
      ],
    },
  },

  // ── Section « AI & Agentic Engineering » (non numérotée, hors nav) ─────────
  ai: {
    label: "AI & Agentic Engineering",
    heading: "Shipping with agents, not just for them.",
    body: "Beyond integrating LLMs into product features (chatbots, multi-agent platforms, AI dashboards at Limova.ai), I've made agentic workflows a core part of how I engineer software. Claude Code is my daily driver — paired with a curated MCP server stack and structured methodologies — letting me move from PRD to production with deterministic outputs at every stage.",
    tools: [
      {
        name: "Claude Code",
        desc: "Primary agentic IDE for architecture, scaffolding, refactoring and review.",
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
    tagline: "built with care · ashdod ↗ everywhere",
  },

  // ── Sélecteur de langue (inchangé depuis 1.2b) ─────────────────────────────
  langSwitcher: {
    label: "Language",
    english: "English",
    french: "Français",
    // `{lang}` est remplacé par le libellé de la langue choisie (annonce aria-live).
    changedTo: "Language changed to {lang}",
  },
};

export default en;
