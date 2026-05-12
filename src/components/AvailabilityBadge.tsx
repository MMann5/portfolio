// Indicateur de disponibilité partagé (point `bg-status-available` + libellé mono).
// Extrait du helper local de `Nav` (Story 1.3) pour garantir un rendu IDENTIQUE dans la
// `Nav` et dans le `Hero` (Story 2.1, AC#2). Server Component pur — utilisable aussi bien
// depuis un composant serveur que depuis un composant client (`Nav`).

type Props = {
  /** Libellé affiché à côté du point de statut. */
  text: string;
  /** Classes additionnelles (ex. ajustement d'espacement selon le contexte). */
  className?: string;
};

export function AvailabilityBadge({ text, className = "" }: Props) {
  return (
    <span className={`flex items-center gap-1.5 font-mono text-label text-fg-subtle ${className}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-status-available" />
      {text}
    </span>
  );
}
