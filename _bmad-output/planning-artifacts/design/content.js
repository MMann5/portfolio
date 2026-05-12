// Portfolio content — Michael Mann
// Exposed on window so each variation's JSX can pull from the same source.

window.MM_CONTENT = {
  meta: {
    name: "Michael Mann",
    role: "Senior Frontend Engineer",
    location: "Ashdod, Israel",
    email: "michael.mann55@gmail.com",
    phone: "+972 58 422 0567",
    linkedin: "https://www.linkedin.com/in/michaelmann-339545149",
    linkedinShort: "linkedin.com/in/michaelmann-339545149",
    languages: "French · Hebrew · English",
    status: "Available for new opportunities — Q2 2026",
  },

  hero: {
    badge: "Available — Q2 2026",
    headline:
      "Senior frontend engineer building production SaaS for global brands.",
    sub:
      "Five+ years shipping React/TypeScript apps used daily by sales teams at Louis Vuitton, Dior, Tiffany & Co. and Messika — plus AI platforms serving 3,000+ companies. Currently building independent SaaS products.",
    meta: [
      ["Location", "Ashdod, Israel"],
      ["Experience", "5+ years"],
      ["Languages", "FR · HE · EN"],
      ["Focus", "React · TS · Supabase"],
    ],
  },

  // Brand names — used as typographic wordmarks (Didone serif treatment),
  // not as official logos. Each entry is paired with a discipline tag.
  clients: [
    { name: "Louis Vuitton", note: "Catalog app · WeChat Mini Program" },
    { name: "Dior", note: "WeChat Mini Program" },
    { name: "Messika", note: "Internal back-office" },
    { name: "Tiffany & Co.", note: "Customer-facing digital card" },
  ],

  about: {
    label: "01 — About",
    heading: "A frontend engineer who thinks in systems.",
    sub: "Architecture, design systems, performance, team leadership.",
    left: [
      "I'm a senior frontend developer specialized in production SaaS platforms built on React, TypeScript, Tailwind and Supabase. My work ranges from architecting frontend codebases from scratch to leading distributed teams across multiple continents.",
      "Over five years, I've gone from junior to team lead — establishing frontend standards, mentoring developers, and owning end-to-end delivery on multi-brand projects with strict performance and accessibility constraints.",
    ],
    right: [
      "I care deeply about craft: clean architecture, refined UI, performance budgets that actually hold, and design systems that scale beyond a single team. I think long-term — both in code and in product.",
      "Outside client work, I build independent SaaS products targeting the event industry, leveraging a trilingual position across Israeli and French markets.",
    ],
  },

  experience: {
    label: "02 — Experience",
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
          ["4", "Luxury maisons"],
          ["2 MB", "WeChat bundle cap"],
          ["4", "Devs led, 3 countries"],
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
          ["3,000+", "Companies served"],
          ["5", "Devs hired & onboarded"],
          ["V1", "Shipped solo"],
        ],
      },
    ],
  },

  projects: {
    label: "03 — Side Projects",
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
        stack: ["React 19", "Vite 7", "Tailwind v4", "Supabase", "Stripe", "PWA"],
        featured: true,
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
        stack: [
          "Claude Code",
          "MCP",
          "BMAD",
          "Agentic workflows",
          "Methodology",
        ],
        featured: false,
      },
    ],
  },

  stack: {
    label: "04 — Stack",
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

  ai: {
    label: "AI & Agentic Engineering",
    heading: "Shipping with agents, not just for them.",
    body:
      "Beyond integrating LLMs into product features (chatbots, multi-agent platforms, AI dashboards at Limova.ai), I've made agentic workflows a core part of how I engineer software. Claude Code is my daily driver — paired with a curated MCP server stack and structured methodologies — letting me move from PRD to production with deterministic outputs at every stage.",
    tools: [
      {
        name: "Claude Code",
        desc:
          "Primary agentic IDE for architecture, scaffolding, refactoring and review.",
      },
      {
        name: "Claude Design",
        desc:
          "Design-to-code workflow for high-fidelity UI and design system iteration.",
      },
      {
        name: "BMAD Methodology",
        desc:
          "Structured agentic framework for PRD, architecture and story-driven delivery.",
      },
      {
        name: "MCP Stack",
        desc:
          "Context7, Playwright, Sequential Thinking, Brave Search — connected to every project.",
      },
    ],
  },

  contact: {
    label: "05 — Contact",
    heading: "Let's build something lasting.",
    sub:
      "Open to senior frontend roles, technical leadership opportunities and selected freelance engagements. I respond within 24 hours.",
  },

  footer: "© 2026 Michael Mann · All rights reserved",
};
