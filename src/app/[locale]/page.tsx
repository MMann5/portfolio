import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Nav } from "@/components/Nav";
import { GridSection } from "@/components/GridSection";
import { SectionHead } from "@/components/SectionHead";
import { Footer } from "@/components/Footer";

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
        {/* Hero — contenu réel : Story 2.1. Ici : ancre + ligne `$ whoami →` décorative. */}
        <GridSection id="hero" idx="00" label="Hero">
          <p className="flex flex-wrap items-center gap-3 font-mono text-label text-fg-subtle">
            <span aria-hidden="true">$ whoami</span>
            <span aria-hidden="true" className="text-fg-faintest">
              →
            </span>
            <span>{hero.whoami}</span>
          </p>
        </GridSection>

        {/* Marquee clients — animation : Epic 3 ; layout : Epic 2. Ici : ancre + libellé décoratif. */}
        <GridSection id="clients" label="Clients" background="alt" padded={false}>
          <div className="flex flex-wrap items-center justify-between gap-3 px-section-x-mobile py-8 font-mono text-label text-fg-subtle sm:px-section-x">
            <span aria-hidden="true">{clients.shippedToLabel}</span>
            <span>{clients.viaLabel}</span>
          </div>
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
