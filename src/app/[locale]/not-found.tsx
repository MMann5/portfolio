import { defaultLocale } from "@/i18n/config";

// 404 minimal, style « Technical Minimal ». Note : `not-found.tsx` (App Router) ne
// reçoit pas de `params` → décision pragmatique : libellés en EN en dur (page technique,
// pas du contenu portfolio), mais charte respectée et lien retour vers une locale valide.

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col gap-8 bg-bg px-section-x-mobile py-section-y-mobile sm:px-section-x sm:py-section-y">
      <p className="font-mono text-label tracking-wide text-fg-faint uppercase">
        404 ↗ not found
      </p>
      <h1 className="max-w-3xl font-display text-display-md text-fg-strong sm:text-display-2xl">
        This page doesn’t exist.
      </h1>
      <p className="max-w-xl font-sans text-body text-fg-muted">
        The page you’re looking for may have been moved, renamed, or never existed.
      </p>
      <a
        href={`/${defaultLocale}`}
        className="inline-flex w-fit items-center font-mono text-ui text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        ← Back to home
      </a>
    </main>
  );
}
