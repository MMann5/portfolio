import "server-only";

import type { Locale } from "../config";

// `import 'server-only'` : garantit que les dictionnaires ne sont jamais embarqués
// dans le bundle client (ils sont lus uniquement dans des Server Components ; le
// LanguageSwitcher client ne reçoit que les quelques libellés dont il a besoin, en props).
//
// Contrat de complétude des traductions (FR19 / AC#1) :
//   - `en.ts` est la SOURCE DE VÉRITÉ (forme + contenu de référence).
//   - `Dictionary` est dérivé de `en.ts` ci-dessous.
//   - `fr.ts` fait `… satisfies Dictionary` → toute clé manquante / en trop / mal
//     typée dans `fr` casse `tsc --noEmit` → `npm run typecheck` rouge → CI rouge.
// Le modèle de contenu complet (toutes les sections, FR + EN) est rempli depuis la
// Story 1.3 ; les sections de page réelles arrivent en Epic 2 sans changer ce pattern.

export type Dictionary = (typeof import("./en"))["default"];

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./en").then((m) => m.default),
  fr: () => import("./fr").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
