import type { Dictionary } from "@/i18n/dictionaries";
import { RoleCard } from "@/components/RoleCard";

// Corps de la section « 02 — Experience » — Server Component. Empile une `RoleCard` par rôle
// (cf. design `Minimal.jsx` → `TMExperience`). Le `SectionHead` est déjà rendu par `page.tsx`.
// Reçoit le tableau de rôles en props depuis la page (qui détient le dictionnaire).

type ExperienceProps = {
  roles: Dictionary["sections"]["experience"]["roles"];
};

export function Experience({ roles }: ExperienceProps) {
  return (
    <div className="flex flex-col gap-4">
      {roles.map((role, i) => (
        <RoleCard key={role.company} role={role} idx={i} total={roles.length} />
      ))}
    </div>
  );
}
