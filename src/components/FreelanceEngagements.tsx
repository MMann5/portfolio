import type { Dictionary } from "@/i18n/dictionaries";
import { MissionCard } from "@/components/MissionCard";

// Corps de la section « 03 — Freelance Engagements » — Server Component. Empile une `MissionCard`
// par mission. Le `SectionHead` est déjà rendu par `page.tsx`. Reçoit le tableau de missions en
// props depuis la page (qui détient le dictionnaire).

type FreelanceEngagementsProps = {
  missions: Dictionary["sections"]["freelance"]["missions"];
};

export function FreelanceEngagements({ missions }: FreelanceEngagementsProps) {
  return (
    <div className="flex flex-col gap-4">
      {missions.map((m, i) => (
        <MissionCard key={m.name} mission={m} idx={i} total={missions.length} />
      ))}
    </div>
  );
}
