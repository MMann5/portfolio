import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { siteUrl } from "@/lib/site-url";
import { Nav } from "@/components/Nav";
import { GridSection } from "@/components/GridSection";
import { SectionHead } from "@/components/SectionHead";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { FreelanceEngagements } from "@/components/FreelanceEngagements";
import { Projects } from "@/components/Projects";
import { Stack } from "@/components/Stack";
import { Contact } from "@/components/Contact";
import { AI } from "@/components/AI";
import { FadeIn } from "@/components/FadeIn";

// Page d'accueil — Server Component statiquement pré-rendu (`generateStaticParams` +
// `dynamicParams = false` au root layout ; aucun `headers()`/`cookies()`/`fetch` runtime ici).
// Story 1.3 : monte le SHELL (Nav · GridSection « coquilles » par section · Footer). Les corps
// réels des sections (hero, marquee clients, cartes de rôle/projet, etc.) = Epic 2 — ici chaque
// `GridSection` n'expose que son ancre + (pour les 6 sections numérotées) un `SectionHead`.
// Toutes les chaînes visibles viennent du dictionnaire (FR19) ; les glyphes ASCII décoratifs
// (`$`, `→`, `↗`, `·`) sont tolérés en dur.

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const { meta, nav, hero, clients, sections, ai, footer, langSwitcher, a11y } = dict;

  // Ordre de nav = ordre d'insertion des clés de `sections` (préservé par JS).
  const sectionList = Object.values(sections);
  const navSections = sectionList.map((section) => ({
    id: section.id,
    num: section.num,
    navLabel: section.navLabel,
  }));

  // JSON-LD `Person` — émis dans le HTML initial pour Google et tous les crawlers
  // de structured data (cf. Story 4.3 AC#5). Le bloc est inline dans le Server
  // Component (pas de hoisting `<head>` par React 19 pour les scripts sans `src`,
  // ce qui est attendu et accepté par les crawlers).
  //
  // `sameAs` pointe vers l'URL LinkedIn courante du dictionnaire. Cette URL
  // est connue 404 (cf. dette `deferred-work.md` review 9.1) — sera corrigée
  // en Story 9.1 sans aucune modification de ce fichier (le dictionnaire
  // restera la source de vérité).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Michael Mann",
    jobTitle: meta.jobTitle,
    url: `${siteUrl}/${locale}`,
    image: `${siteUrl}/opengraph-image`,
    email: `mailto:${meta.email}`,
    telephone: meta.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ashdod",
      addressCountry: "IL",
    },
    sameAs: [meta.linkedin],
    knowsLanguage: ["fr", "he", "en"],
  };

  return (
    <>
      {/* Escape XSS-safe (pattern Next 16 `json-ld.md`) : `<` → `<` empêche
          qu'une chaîne contenant `</script>` n'échappe du JSON et n'exécute du
          code arbitraire. U+2028 / U+2029 sont traités comme fins de ligne par
          le parser JS dans un `<script>` inline et casseraient le JSON s'ils
          étaient laissés en littéral (cas réel : copié-collé Word / macOS qui
          insère ces séparateurs invisibles). Triple escape obligatoire — le
          payload courant n'en contient pas, mais la précaution reste valable
          pour toute évolution du dictionnaire. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, "\\u003c")
            .replace(new RegExp("\u2028", "g"), "\\u2028")
            .replace(new RegExp("\u2029", "g"), "\\u2029"),
        }}
      />
      <Nav
        locale={locale}
        brandName={nav.brandName}
        versionBadge={nav.versionBadge}
        availabilityLabel={nav.availabilityLabel}
        ctaEmail={nav.ctaEmail}
        email={meta.email}
        ctaCv={nav.ctaCv}
        ctaCvAriaLabel={nav.ctaCvAriaLabel}
        cvPath={meta.cvPath}
        ariaLabel={nav.ariaLabel}
        menuLabel={nav.menuLabel}
        menuClose={nav.menuClose}
        menuAriaLabel={nav.menuAriaLabel}
        menuPanelLabel={nav.menuPanelLabel}
        sections={navSections}
        langLabel={langSwitcher.label}
        langEnglish={langSwitcher.english}
        langFrench={langSwitcher.french}
        langChangedTo={langSwitcher.changedTo}
      />

      {/*
        `id="main-content"` est la cible du `<SkipLink>` monté dans `layout.tsx`.
        Ne PAS renommer ni supprimer cet id sans mettre à jour `SkipLink.tsx` —
        le couplage est purement textuel (pas de typecheck) et silencieusement
        fragile (cf. deferred-work review 4.1).
      */}
      <main id="main-content" className="flex flex-1 flex-col">
        {/* Hero — Story 2.1. Au-dessus du fold, pas de FadeIn. */}
        <GridSection id="hero" idx="00" label="Hero">
          <Hero
            headline={hero.headline}
            sub={hero.sub}
            meta={hero.meta}
            whoami={hero.whoami}
            availabilityLabel={nav.availabilityLabel}
            email={meta.email}
            linkedin={meta.linkedin}
            cvPath={meta.cvPath}
            ctaContact={hero.ctaContact}
            ctaLinkedin={hero.ctaLinkedin}
            ctaCv={hero.ctaCv}
            ctaCvAriaLabel={hero.ctaCvAriaLabel}
            opensInNewTabLabel={a11y.opensInNewTab}
          />
        </GridSection>

        {/* Marquee clients — immédiatement visible ; animation gérée par CSS (Story 3.1). Pas de FadeIn. */}
        <GridSection id="clients" label="Clients" background="alt" padded={false}>
          <Clients
            items={clients.items}
            shippedToLabel={clients.shippedToLabel}
            viaLabel={clients.viaLabel}
          />
        </GridSection>

        {/* Sections numérotées — chaque bloc (SectionHead + corps) wrappé dans FadeIn (Story 3.1). */}
        {sectionList.map((section) => (
          <GridSection key={section.id} id={section.id} idx={section.num} label={section.label}>
            <FadeIn>
              <SectionHead
                idx={section.num}
                label={section.label}
                heading={section.heading}
                sub={section.sub}
              />
              {section.id === "about" && <About body={sections.about.body} />}
              {section.id === "experience" && (
                <Experience roles={sections.experience.roles} />
              )}
              {section.id === "freelance" && (
                <FreelanceEngagements
                  missions={sections.freelance.missions}
                  opensInNewTabLabel={a11y.opensInNewTab}
                />
              )}
              {section.id === "projects" && (
                <Projects
                  items={sections.projects.items}
                  opensInNewTabLabel={a11y.opensInNewTab}
                />
              )}
              {section.id === "stack" && <Stack groups={sections.stack.groups} />}
              {section.id === "contact" && (
                <Contact
                  primaryCtaLabel={sections.contact.primaryCtaLabel}
                  respondWithin={sections.contact.respondWithin}
                  ctaCv={sections.contact.ctaCv}
                  ctaCvAriaLabel={sections.contact.ctaCvAriaLabel}
                  secondaryLinks={sections.contact.secondaryLinks}
                  email={meta.email}
                  cvPath={meta.cvPath}
                  opensInNewTabLabel={a11y.opensInNewTab}
                />
              )}
            </FadeIn>
          </GridSection>
        ))}

        {/* AI & Agentic Engineering — section non numérotée, hors nav (fond `alt2`). */}
        <GridSection id="ai" label={ai.label} background="alt2">
          <FadeIn>
            <SectionHead label={ai.label} heading={ai.heading} sub={ai.body} />
            <AI tools={ai.tools} />
          </FadeIn>
        </GridSection>
      </main>

      <Footer copyright={footer.copyright} tagline={footer.tagline} />
    </>
  );
}
