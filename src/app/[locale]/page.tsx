import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

// Placeholder minimal — démontre les design tokens « Technical Minimal », les 3 polices
// auto-hébergées et la machinerie i18n (toutes les chaînes visibles viennent du dico).
// Le vrai shell (Nav / GridSection / SectionHead / Footer) et les sections de contenu
// arrivent en Story 1.3 puis Epic 2. Le `<LanguageSwitcher>` est ici à titre provisoire —
// il sera relocalisé dans la `Nav` en Story 1.3.

const SWATCHES = [
  { name: "bg", className: "bg-bg" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-2", className: "bg-surface-2" },
  { name: "surface-3", className: "bg-surface-3" },
  { name: "accent", className: "bg-accent" },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return (
    <main className="flex flex-1 flex-col gap-12 bg-bg px-section-x-mobile py-section-y-mobile sm:px-section-x sm:py-section-y">
      <p className="font-mono text-label tracking-wide text-fg-subtle uppercase">
        {dict.demo.label}
      </p>

      <h1 className="max-w-4xl font-display text-display-md text-fg-strong sm:text-display-2xl">
        {dict.demo.headline.lead}
        <span className="text-accent">{dict.demo.headline.accent}</span>
        {dict.demo.headline.tail}
      </h1>

      <p className="max-w-xl font-sans text-body-lg text-fg-muted">{dict.demo.body}</p>

      <LanguageSwitcher
        locale={locale}
        label={dict.langSwitcher.label}
        english={dict.langSwitcher.english}
        french={dict.langSwitcher.french}
        changedTo={dict.langSwitcher.changedTo}
      />

      <div className="flex flex-wrap gap-3">
        {SWATCHES.map((s) => (
          <div
            key={s.name}
            className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4"
          >
            <span className={`h-10 w-24 rounded-md border border-line-soft ${s.className}`} />
            <span className="font-mono text-label-sm text-fg-subtle">{s.name}</span>
          </div>
        ))}
      </div>

      <p className="font-mono text-label-sm text-fg-faintest">
        {dict.demo.buildLine}
        {new Date().getUTCFullYear()}
      </p>
    </main>
  );
}
