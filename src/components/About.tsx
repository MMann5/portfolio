// Corps de la section « 01 — About » — Server Component (aucune interactivité ⇒ pas de
// `'use client'`). Porté du design `Minimal.jsx` → `TMAbout` (corps 2 colonnes ; la colonne
// mono décorative « JSON bio » est omise — ses valeurs sont du contenu non typé, cf. story 2.2).
// Le `SectionHead` est déjà rendu par `page.tsx` au-dessus ; ce composant n'ajoute que le corps.
// Reçoit le corps en props depuis la page (qui détient le dictionnaire). Toutes les chaînes
// visibles viennent du dictionnaire (FR19).

type AboutProps = {
  body: { left: readonly string[]; right: readonly string[] };
};

function Column({ paragraphs }: { paragraphs: readonly string[] }) {
  return (
    <div>
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={`font-sans text-body text-fg-body leading-relaxed${i === 0 ? "" : " mt-5"}`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

export function About({ body }: AboutProps) {
  return (
    <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12">
      <Column paragraphs={body.left} />
      <Column paragraphs={body.right} />
    </div>
  );
}
