// Placeholder minimal — démontre les design tokens « Technical Minimal » et les
// 3 polices auto-hébergées. Le vrai shell (Nav / GridSection / SectionHead /
// Footer) et les sections de contenu arrivent en Story 1.3 puis Epic 2.

const SWATCHES = [
  { name: "bg", className: "bg-bg" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-2", className: "bg-surface-2" },
  { name: "surface-3", className: "bg-surface-3" },
  { name: "accent", className: "bg-accent" },
] as const;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col gap-12 bg-bg px-section-x-mobile py-section-y-mobile sm:px-section-x sm:py-section-y">
      <p className="font-mono text-label tracking-wide text-text-faint uppercase">
        00 ↗ design system · technical minimal
      </p>

      <h1 className="max-w-4xl font-display text-display-2xl text-text-strong">
        Senior frontend engineer building{" "}
        <span className="text-accent">production SaaS</span> for global brands.
      </h1>

      <p className="max-w-xl font-sans text-body-lg text-text-muted">
        Design tokens and self-hosted fonts are wired up. Body copy renders in Inter,
        section labels in JetBrains Mono, display headings in Cormorant Garamond — all
        served from this origin, no runtime requests to Google Fonts.
      </p>

      <div className="flex flex-wrap gap-3">
        {SWATCHES.map((s) => (
          <div
            key={s.name}
            className="flex flex-col gap-2 rounded-lg border border-line bg-surface p-4"
          >
            <span className={`h-10 w-24 rounded-md border border-line-soft ${s.className}`} />
            <span className="font-mono text-label-sm text-text-subtle">{s.name}</span>
          </div>
        ))}
      </div>

      <p className="font-mono text-label-sm text-text-faintest">
        $ next build → static · {new Date().getUTCFullYear()}
      </p>
    </main>
  );
}
