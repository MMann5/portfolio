import type { Dictionary } from "@/i18n/dictionaries";
import { MaqomCard } from "@/components/MaqomCard";
import { MethodologyCard } from "@/components/MethodologyCard";

// Corps de la section « 04 — Side Projects » — Server Component (aucune interactivité ⇒ pas de
// `'use client'`). Le `SectionHead` est déjà rendu par `page.tsx` au-dessus ; ce composant
// n'empile que les cartes de projet. Les 2 items sont structurellement très différents (l'un est
// une carte « fenêtre-terminal » avec panneau méta, l'autre une carte standard), d'où 2
// sous-composants distincts (`MaqomCard` / `MethodologyCard`) plutôt qu'un `ProjectCard`
// générique. Le dispatch se fait sur `item.featured`. Reçoit le tableau d'items en props depuis
// la page (qui détient le dictionnaire). Clés React par index (listes statiques ; cohérent avec
// le pattern bullets/paragraphes des stories 2.2).

type ProjectsProps = {
  items: Dictionary["sections"]["projects"]["items"];
};

export function Projects({ items }: ProjectsProps) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) =>
        item.featured ? (
          <MaqomCard key={i} item={item} />
        ) : (
          <MethodologyCard key={i} item={item} />
        ),
      )}
    </div>
  );
}
