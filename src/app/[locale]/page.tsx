import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Nav } from "@/components/Nav";
import { GridSection } from "@/components/GridSection";
import { SectionHead } from "@/components/SectionHead";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Clients } from "@/components/Clients";

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
        availabilityShort={nav.availabilityShort}
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
        {/* Hero — Story 2.1. Le composant rend le contenu intérieur de cette `GridSection`. */}
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

        {/* Marquee clients — Story 2.1 (bande statique ; animation = Epic 3 / Story 3.1). */}
        <GridSection id="clients" label="Clients" background="alt" padded={false}>
          <Clients
            items={clients.items}
            shippedToLabel={clients.shippedToLabel}
            viaLabel={clients.viaLabel}
          />
        </GridSection>

        {/* Sections numérotées — `SectionHead` seul ; corps de section : Story 2.x. */}
        {sectionList.map((section) => (
          <GridSection key={section.id} id={section.id} idx={section.num} label={section.label}>
            <SectionHead
              idx={section.num}
              label={section.label}
              heading={section.heading}
              sub={section.sub}
            />
            {/* contenu de section — Epic 2 */}
          </GridSection>
        ))}

        {/* AI & Agentic Engineering — section non numérotée, hors nav (fond `alt2`). */}
        <GridSection id="ai" label={ai.label} background="alt2">
          <SectionHead label={ai.label} heading={ai.heading} sub={ai.body} />
          {/* contenu de section — Epic 2 */}
        </GridSection>
      </main>

      <Footer copyright={footer.copyright} tagline={footer.tagline} />
    </>
  );
}
