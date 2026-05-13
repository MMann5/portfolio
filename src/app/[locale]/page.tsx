import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
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
  const { meta, nav, hero, clients, sections, ai, footer, langSwitcher } = dict;

  // Ordre de nav = ordre d'insertion des clés de `sections` (préservé par JS).
  const sectionList = Object.values(sections);
  const navSections = sectionList.map((section) => ({
    id: section.id,
    num: section.num,
    navLabel: section.navLabel,
  }));

  return (
    <>
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
        sections={navSections}
        langLabel={langSwitcher.label}
        langEnglish={langSwitcher.english}
        langFrench={langSwitcher.french}
        langChangedTo={langSwitcher.changedTo}
      />

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
                <FreelanceEngagements missions={sections.freelance.missions} />
              )}
              {section.id === "projects" && <Projects items={sections.projects.items} />}
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
