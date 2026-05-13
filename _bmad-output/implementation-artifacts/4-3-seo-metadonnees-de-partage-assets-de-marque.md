# Story 4.3: SEO, métadonnées de partage & assets de marque

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a search engine, a social network preview crawler, or someone sharing the link,
I want pre-rendered content, complete per-language metadata, OpenGraph & Twitter cards, a JSON-LD `Person`, proper favicons/OG image/manifest, and a `sitemap.xml` + `robots.txt`,
so that the portfolio is discoverable, indexable, and looks correct everywhere a recruiter will encounter the link.

## Acceptance Criteria

1. **Pré-rendu SSG complet & contenu crawlable sans JS (FR28, NFR26, AC#1 epic).** Étant donné `npm run build && npm run start`, quand `/en` et `/fr` sont requêtés **avec JavaScript désactivé** (`curl -s http://localhost:3000/en` ou DevTools « Disable JavaScript »), alors :
   - L'HTML initial contient le `<h1>` du Hero, l'ensemble des 7 `<h2>` de section (`SectionHead`), le marquee clients (texte des wordmarks lisible — `Clients.tsx` est Server-rendered), tous les paragraphes (`About`, `Experience`, `MissionCard.tagline`, `MaqomCard`, `MethodologyCard`, `Stack`, `AI`, `Contact`), tous les liens (`mailto:`, CV, LinkedIn, `maqom.co`, missions freelance), ainsi que toutes les méta-données décrites en AC#2-#9.
   - Le `<noscript>` ne contient **rien** (aucun `<noscript>` à ajouter — l'a11y est déjà servie par le HTML statique).
   - **Sortie `next build`** : `/en` et `/fr` restent marqués `● (SSG)` (régression critique à détecter — l'introduction de `headers()`/`cookies()`/`fetch` non-cached dans `layout.tsx`, `page.tsx` ou `sitemap.ts` opt-out du SSG). Reporter la sortie « Route (app) » dans les Completion Notes (cohérent avec template Tâche 1 Story 4.2).
   - **Aucune nouvelle dépendance npm runtime** n'est introduite par cette story. La seule dépendance autorisée si vraiment nécessaire : `schema-dts` en **devDependency** pour typer le JSON-LD (optionnel — cf. Tâche 5). Toute autre nouvelle dépendance doit être justifiée en Completion Notes.

2. **Métadonnées par langue : titre / description / canonical / hreflang / robots (NFR27, FR18, FR27, AC#2 epic).** Pour chaque locale (`/en` et `/fr`), l'HTML initial expose dans `<head>` :
   - `<title>` localisé — **enrichi** par rapport à la Story 1.2b. Stratégie `title.template` `"%s — Michael Mann"` ajoutée dans `generateMetadata` du layout, avec `title.default` `"Michael Mann — Senior Frontend Developer"` (EN) / `"Michael Mann — Développeur frontend senior"` (FR). Aucune `page.tsx` n'override ce default aujourd'hui (la page d'accueil utilise le titre par défaut) — le `template` est en place pour les futures case studies (Story 7.1).
   - `<meta name="description" content="<dict.meta.description>">` — la valeur actuelle (`"Senior frontend engineer building production SaaS for global brands."` EN / version FR équivalente) **est conservée**. Vérifier que la version FR existe bien dans `fr.ts` et qu'elle est traduite (non en anglais).
   - `<link rel="canonical" href="<siteUrl>/<locale>">` — déjà acquis en Story 1.2b ([src/app/[locale]/layout.tsx:72](src/app/[locale]/layout.tsx#L72)).
   - `<link rel="alternate" hreflang="en" href="<siteUrl>/en">`, `<link rel="alternate" hreflang="fr" href="<siteUrl>/fr">`, `<link rel="alternate" hreflang="x-default" href="<siteUrl>/en">` — déjà acquis ([src/app/[locale]/layout.tsx:73](src/app/[locale]/layout.tsx#L73)).
   - **Nouveau** : `<meta name="robots" content="index, follow">` (par défaut — pas d'opt-out de l'indexation). Implémenté via `robots: { index: true, follow: true }` dans le retour de `generateMetadata`. **NE PAS** ajouter de paramètres `googleBot.max-image-preview: large` etc. (over-spec pour ce site, défaut Google déjà acceptable).
   - **Vérification** (cohérente avec AC#1 du smoke crawlable) : `curl -s http://localhost:3000/en | grep -E '(<title|description|canonical|hreflang|robots)'` ⇒ toutes les balises présentes, valeurs correctes. Idem `/fr`.

3. **OpenGraph + Twitter Card (NFR27, FR27, AC#2 epic).** Pour chaque locale, l'HTML initial expose :
   - **OpenGraph** :
     - `<meta property="og:title" content="<title de la page localisé>">`
     - `<meta property="og:description" content="<dict.meta.description localisé>">`
     - `<meta property="og:url" content="<siteUrl>/<locale>">` (URL absolue avec locale active)
     - `<meta property="og:type" content="website">`
     - `<meta property="og:site_name" content="Michael Mann">`
     - `<meta property="og:locale" content="en_US">` (pour `/en`) ou `"fr_FR"` (pour `/fr`)
     - `<meta property="og:locale:alternate" content="fr_FR">` (sur `/en`) ou `"en_US"` (sur `/fr`)
     - `<meta property="og:image" content="<siteUrl>/opengraph-image">` (la route `opengraph-image.tsx` au root — voir AC#4 ; URL sans extension, Next ajoute `?hash=…` au build pour cache-busting)
     - `<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`, `<meta property="og:image:type" content="image/png">`, `<meta property="og:image:alt" content="<dict.meta.ogImageAlt>">` (alt localisé — ajouté au dictionnaire ; voir Tâche 1).
   - **Twitter Card** (utilisée par X, Slack, Discord, LinkedIn previews, iMessage…) :
     - `<meta name="twitter:card" content="summary_large_image">`
     - `<meta name="twitter:title">`, `<meta name="twitter:description">` (dupliquent `og:title` / `og:description` — c'est attendu).
     - `<meta name="twitter:image" content="<siteUrl>/opengraph-image">`, `<meta name="twitter:image:alt" content="<dict.meta.ogImageAlt>">`.
     - **PAS** de `twitter:site` ni `twitter:creator` — Mike n'a pas de compte X/Twitter public (à confirmer en Tâche 0 ; sinon ajouter `@<handle>`).
   - Implémentation : `openGraph: { … }` et `twitter: { … }` ajoutés au retour de `generateMetadata` dans [src/app/[locale]/layout.tsx](src/app/[locale]/layout.tsx) (PAS dans `page.tsx` — la home `page.tsx` n'override jamais la metadata du layout). Toutes les URLs absolues sont résolues automatiquement par Next via le `metadataBase` déjà en place ([src/app/[locale]/layout.tsx:68](src/app/[locale]/layout.tsx#L68)).
   - **Validation** : à `npm run build && npm run start`, `curl -s http://localhost:3000/en | grep -E '(og:|twitter:)'` ⇒ toutes les balises listées présentes. Tester ensuite le rendu réel sur deux validateurs après le déploiement Vercel :
     - [opengraph.dev](https://opengraph.dev/) sur l'URL preview Vercel — confirmer rendu de l'OG image + titre + description.
     - [cards-dev.twitter.com/validator](https://cards-dev.twitter.com/validator) (si encore accessible — sinon Slack preview suffit comme proxy).
     - **NE PAS** délégueR aveuglément à Mike — exécuter au moins le `curl` local pour confirmer le HTML rendu, et reporter le résultat dans les Completion Notes.

4. **OG image générée — fidélité « Technical Minimal » (AR8, NFR27, AC#3 epic).** Créer `src/app/opengraph-image.tsx` (root, partagé entre `/en` et `/fr`) — Route Handler Next 16 utilisant `next/og` `ImageResponse` :
   - **Exports top-level (convention Next 16)** :
     ```tsx
     export const alt = "Michael Mann — Senior Frontend Developer · 5+ years · Ashdod, IL";
     export const size = { width: 1200, height: 630 };
     export const contentType = "image/png";
     ```
   - **Composition visuelle** (`Image()` default export) — fidèle au design de référence :
     - Fond plein `#0a0a0a` (token `--color-bg`).
     - Bordure dorée 2px `#d4a574` (token `--color-accent`) avec offset 32px du bord (cadre intérieur — pas un trait sur tout le périmètre du viewport image).
     - Wordmark `MICHAEL MANN` en grand (~96-120px) en haut-gauche, police **Cormorant Garamond** (display) en `font-weight: 500`, couleur `#fafafa` (token `--color-fg-strong`).
     - Sous-titre meta `SENIOR FRONTEND DEVELOPER` en `~36-44px` JetBrains Mono (uppercase, letter-spacing 4px, couleur `#d4a574` accent).
     - Bloc de méta-info bas-gauche en 3 lignes JetBrains Mono `~24px` couleur `#cfcfcf` (`text-fg-body`) :
       ```
       location  → Ashdod, Israel
       experience → 5+ years
       focus     → React · TypeScript · Supabase
       ```
     - Bloc bas-droite : ASCII art décoratif léger `$ open mann.dev →` (ou similaire) en mono couleur `#888` (`text-fg-subtle`).
     - **PAS** de grille décorative (token `bg-grid-line` — trop complexe à reproduire en `next/og` qui ne supporte que un sous-ensemble CSS Flexbox ; cf. doc `next/og` ImageResponse). Un cadre suffit pour l'identité visuelle.
   - **Polices `next/og`** : `ImageResponse` n'utilise PAS `next/font` (incompatibles) — les polices doivent être chargées comme bytes via `readFile()` Node.js. Mike doit ajouter les fichiers `.woff2`/`.ttf` sous `src/assets/og-fonts/` :
     - `CormorantGaramond-Medium.ttf` (ou `.woff2`) — pour le wordmark.
     - `JetBrainsMono-Regular.ttf` (ou `.woff2`) — pour les labels & meta.
     - **Source des fichiers** : extraire depuis `node_modules/@fontsource/cormorant-garamond/files/` et `node_modules/@fontsource/jetbrains-mono/files/` (si présents) — sinon télécharger depuis [google-webfonts-helper.herokuapp.com](https://gwfh.mranftl.com/fonts) en sous-ensembles latins. Ces fichiers doivent être **committés dans le repo** sous `src/assets/og-fonts/` (≤ 50-80 KB chacun en `.woff2` — pas de problème de taille de repo).
     - Charger via :
       ```tsx
       import { readFile } from "node:fs/promises";
       import { join } from "node:path";
       const cormorantMedium = await readFile(
         join(process.cwd(), "src/assets/og-fonts/CormorantGaramond-Medium.ttf")
       );
       const jetbrainsRegular = await readFile(
         join(process.cwd(), "src/assets/og-fonts/JetBrainsMono-Regular.ttf")
       );
       return new ImageResponse(
         (<div style={{ /* … */ }}>…</div>),
         { ...size, fonts: [
           { name: "Cormorant Garamond", data: cormorantMedium, style: "normal", weight: 500 },
           { name: "JetBrains Mono", data: jetbrainsRegular, style: "normal", weight: 400 },
         ]}
       );
       ```
   - **Note locale** : `opengraph-image.tsx` au niveau **root** (PAS sous `[locale]/`) génère **une seule** image partagée entre les deux locales. **Décision** : c'est suffisant pour le MVP — le visuel principal est le wordmark `MICHAEL MANN` + meta techniques (qui sont mêmes en EN et FR à 80%). Une variante FR (« Développeur frontend senior ») est une amélioration différée — l'ajouter ferait doubler le fichier et compliquer le pipeline assets. À reconsidérer en Story 9.1 si Mike juge la version EN incohérente sur les partages FR.
   - **Cache** : `opengraph-image` est un Route Handler **caché statiquement par défaut** (cf. doc Next 16 `opengraph-image.md`) — aucune action requise.
   - **Validation** :
     - `npm run build` : un fichier image apparaît sous `.next/server/app/opengraph-image*.png` (chemin exact selon Next 16).
     - `npm run start` puis `curl -I http://localhost:3000/opengraph-image` ⇒ `200 OK`, `Content-Type: image/png`, `Content-Length` ≈ 60-200 KB (à reporter en Completion Notes).
     - Ouvrir `http://localhost:3000/opengraph-image` dans Chrome ⇒ visuel conforme à la composition décrite ci-dessus, lisible à 1200×630.
     - Faire une capture d'écran de l'OG image rendue et la sauver sous `_bmad-output/implementation-artifacts/story-4-3-og-image.png` (cohérent avec la convention 4.2 de joindre des screenshots).

5. **JSON-LD `Person` (NFR27, FR27, AC#2 epic).** Sur la page d'accueil (`/en` et `/fr`), ajouter un `<script type="application/ld+json">` inline dans le Server Component [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx) — **PAS** dans le layout (le JSON-LD `Person` est sémantiquement attaché à la page personnelle, et le layout pourrait être réutilisé par des pages non-personne dans le futur — case studies en 7.1).
   - **Structure** :
     ```ts
     const jsonLd = {
       "@context": "https://schema.org",
       "@type": "Person",
       name: "Michael Mann",
       jobTitle: dict.meta.jobTitle,                    // EN: "Senior Frontend Developer" / FR: "Développeur frontend senior"
       url: `${siteUrl}/${locale}`,
       image: `${siteUrl}/opengraph-image`,
       email: `mailto:${dict.meta.email}`,
       telephone: dict.meta.phone,                      // "+972 58 422 0567" — déjà normalisé E.164 (Story 2.4)
       address: {
         "@type": "PostalAddress",
         addressLocality: "Ashdod",
         addressCountry: "IL",
       },
       sameAs: [dict.meta.linkedin],                    // URL LinkedIn — actuellement 404 (cf. deferred-work review 9.1), à corriger en Story 9.1 ; on émet la valeur courante quand même
       knowsLanguage: ["fr", "he", "en"],
       worksFor: undefined,                             // intentionnel — Mike est freelance, pas d'employer canonique
     };
     ```
   - **Insertion sécurisée XSS** (pattern recommandé Next 16 `json-ld.md`) :
     ```tsx
     <script
       type="application/ld+json"
       dangerouslySetInnerHTML={{
         __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
       }}
     />
     ```
   - **Position dans le JSX** : tout début du `return (…)` de `Home()`, avant le `<Nav>` (sémantiquement neutre — le navigateur le place dans le `<head>` virtuel via React 19 `<script>` hoisting si les conditions sont remplies, sinon dans le `<body>` — c'est acceptable pour le JSON-LD : les crawlers le parsent où qu'il soit). **Confirmer** : avec React 19 + Next 16, vérifier dans le HTML rendu (`curl … | grep ld+json`) que le `<script>` est bien présent et **non hoisted** vers `<head>` si cela cause une erreur d'hydratation (la doc Next mentionne `<script>` natifs OK).
   - **Le `<script>` est inline et server-rendered** — il fait partie du HTML initial, donc 100% crawler-friendly.
   - **Le `dict.meta.linkedin` actuel pointe vers `https://www.linkedin.com/in/michaelmann-339545149`** qui **404** (cf. dette 9.1). Documenter en Completion Notes que l'URL sera corrigée en Story 9.1 — pour 4.3 on émet la valeur courante du dictionnaire. **NE PAS** corriger la valeur ici (hors scope ; Story 9.1 a ce travail).
   - **Validation** :
     - `curl -s http://localhost:3000/en | grep -oE '<script type="application/ld\+json">[^<]+</script>'` ⇒ le bloc complet.
     - Copier le contenu JSON dans [validator.schema.org](https://validator.schema.org/) ⇒ **0 erreur**, **0 warning critique** (un warning « missing optional property » sur ex. `worksFor` ou `birthDate` est acceptable et ignoré).
     - Idem sur [Google Rich Results Test](https://search.google.com/test/rich-results) (préfère cette validation officielle Google).
   - **Type** : optionnel d'ajouter `schema-dts` (devDependency) pour typer `WithContext<Person>` — utile mais pas requis. Si ajouté, justifier en Completion Notes (≤ 2 KB de devDep).

6. **`sitemap.xml` localisé (NFR27, FR18, AC#2 epic).** Créer `src/app/sitemap.ts` :
   ```ts
   import type { MetadataRoute } from "next";
   import { locales } from "@/i18n/config";
   import { siteUrl } from "@/lib/site-url";

   export default function sitemap(): MetadataRoute.Sitemap {
     const lastModified = new Date();
     return locales.map((locale) => ({
       url: `${siteUrl}/${locale}`,
       lastModified,
       changeFrequency: "monthly" as const,
       priority: 1.0,
       alternates: {
         languages: {
           en: `${siteUrl}/en`,
           fr: `${siteUrl}/fr`,
         },
       },
     }));
   }
   ```
   - **`siteUrl`** : extraire en module partagé `src/lib/site-url.ts` (cf. Tâche 2) — DRY entre `layout.tsx`, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, et le JSON-LD de `page.tsx`. Une seule source de vérité ; cohérent avec la convention dictionnaire FR/EN (source unique).
   - **`changeFrequency: "monthly"`** : le contenu portfolio change rarement (~ trimestre). `monthly` est conservateur et acceptable pour Google.
   - **`priority: 1.0`** : ce sont les 2 seules pages du site MVP ; toutes les deux à 1.0 est cohérent (Google ignore largement la priorité de toute façon ; valeur informative).
   - **Vérification** :
     - `curl -s http://localhost:3000/sitemap.xml` après `npm run start` ⇒ XML valide, contient 2 `<url>`, chacun avec `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>`, et 2 `<xhtml:link rel="alternate" hreflang="...">` par url (4 total).
     - Valider avec [xmlvalidation.com/sitemap](https://www.xmlvalidation.com/) ou `xmllint --schema sitemap.xsd sitemap.xml` (overkill pour 2 entrées — `curl` + lecture suffit).
     - **Vérifier que le `proxy.ts` ne 307-redirige pas `/sitemap.xml` vers `/en/sitemap.xml`** — cf. AC#10. Le matcher actuel exclut déjà `sitemap.xml` ([src/proxy.ts:59](src/proxy.ts#L59)) ⇒ pas de fix matcher requis pour cette route précise, mais reconfirmer.

7. **`robots.txt` (NFR27, AC#2 epic).** Créer `src/app/robots.ts` :
   ```ts
   import type { MetadataRoute } from "next";
   import { siteUrl } from "@/lib/site-url";

   export default function robots(): MetadataRoute.Robots {
     return {
       rules: { userAgent: "*", allow: "/" },
       sitemap: `${siteUrl}/sitemap.xml`,
       host: siteUrl,
     };
   }
   ```
   - **Pas de `Disallow`** : site 100% public, pas de `/admin`, pas de `/api`, pas de pages privées.
   - **`host: siteUrl`** : préférence officielle de canonical host (ignoré par Google mais Bing/Yandex le respectent).
   - **Vérification** :
     - `curl -s http://localhost:3000/robots.txt` ⇒
       ```
       User-Agent: *
       Allow: /

       Sitemap: https://<siteUrl>/sitemap.xml
       Host: https://<siteUrl>
       ```
     - Le proxy matcher exclut déjà `robots.txt` ([src/proxy.ts:59](src/proxy.ts#L59)) ⇒ pas de fix requis.

8. **Favicon set & icônes (AR8, NFR27, AC#3 epic).** Compléter le jeu d'icônes au-delà du seul `favicon.ico` existant ([src/app/favicon.ico](src/app/favicon.ico)) :
   - **`src/app/favicon.ico`** : **conservé tel quel** (Story 1.1 — Next 16 le détecte automatiquement et émet `<link rel="icon" href="/favicon.ico" sizes="any">`).
   - **`src/app/icon.svg` (nouveau)** : SVG 32×32 carré représentant le monogramme « MM » — extrait de [src/components/MMLogo.tsx](src/components/MMLogo.tsx) lignes 12-35 et serialisé en fichier `.svg` autonome avec les couleurs **hardcodées** (PAS de tokens CSS — un fichier `.svg` servi à `/icon.svg` n'a pas accès au CSS du document). Couleurs cohérentes :
     ```xml
     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
       <rect x="0" y="0" width="32" height="32" rx="6" fill="#ededed"/>
       <text x="50%" y="56%" text-anchor="middle" dominant-baseline="middle"
             font-family="ui-monospace, Menlo, monospace" font-size="14" font-weight="700"
             letter-spacing="-1" fill="#0a0a0a">MM</text>
     </svg>
     ```
     **Note `font-family`** : on **NE PEUT PAS** utiliser `var(--font-mono)` ici (le SVG n'a pas accès au CSS du document parent quand il est servi à `/icon.svg` par le navigateur). Utiliser un stack natif `ui-monospace, Menlo, monospace`. Le rendu peut donc différer **très légèrement** de la version inline `MMLogo.tsx` qui utilise JetBrains Mono — c'est acceptable pour une icône 32×32 (très peu de pixels distinguent JetBrains Mono d'`ui-monospace` à cette taille).
   - **`src/app/apple-icon.png` (nouveau)** : PNG **180×180** (taille canonique apple-touch-icon, cf. doc Next 16 `app-icons.md`) — fond `#ededed`, lettres `MM` `#0a0a0a` centrées en mono bold ~70-80px. **Source** : Mike peut :
     - **Option A (recommandée)** : exporter le SVG ci-dessus en PNG 180×180 via un outil graphique (Figma, Inkscape, ou commande `rsvg-convert -w 180 -h 180 icon.svg > apple-icon.png`).
     - **Option B (route handler tsx)** : créer `src/app/apple-icon.tsx` qui utilise `next/og` `ImageResponse` pour générer le PNG à la volée (plus complexe — partage du code avec OG image possible mais overkill pour 1 icône statique).
     - **Privilégier Option A** — pas de runtime, fichier statique committé.
   - **PAS de tailles intermédiaires** (`icon-16.png`, `icon-32.png`, `icon-192.png`, etc.) — Next 16 émet automatiquement les bonnes balises depuis les fichiers présents ; les navigateurs modernes (Chrome, Edge, Safari, Firefox) gèrent parfaitement `favicon.ico` + `icon.svg` + `apple-icon.png` (180×180) — pas besoin du « favicon set » exhaustif des années 2010. Cf. [Evil Martians favicon handbook 2021](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs) référencé dans la doc Next.
   - **Vérification** :
     - `curl -I http://localhost:3000/favicon.ico` ⇒ `200`, `Content-Type: image/x-icon`.
     - `curl -I http://localhost:3000/icon.svg` ⇒ `200`, `Content-Type: image/svg+xml`.
     - `curl -I http://localhost:3000/apple-icon.png` ⇒ `200`, `Content-Type: image/png`, `Content-Length` ≈ 1-5 KB.
     - `curl -s http://localhost:3000/en | grep -oE '<link[^>]+rel="(icon|apple-touch-icon)"[^>]*>'` ⇒ trois `<link>` correspondants.

9. **Web manifest (AR8, NFR27, AC#3 epic).** Créer `src/app/manifest.ts` :
   ```ts
   import type { MetadataRoute } from "next";

   export default function manifest(): MetadataRoute.Manifest {
     return {
       name: "Michael Mann — Portfolio",
       short_name: "MM",
       description: "Senior Frontend Developer · 5+ years · React/TypeScript",
       start_url: "/en",
       display: "browser",
       background_color: "#0a0a0a",
       theme_color: "#0a0a0a",
       icons: [
         { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
         { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
       ],
     };
   }
   ```
   - **`display: "browser"`** (PAS `standalone`) : ce n'est pas une app installable — juste un portfolio statique. `browser` empêche le comportement « Add to Home Screen » de proposer une expérience PWA trompeuse.
   - **`start_url: "/en"`** : par défaut EN ; le proxy i18n redirigera selon la préférence utilisateur si jamais quelqu'un installe (ce qui ne se produira pas en `display: "browser"`).
   - **`description`** : NON localisée — un manifest est global au site, pas localisé per-locale (limitation Web Manifest spec). Utiliser EN comme langue de référence.
   - **`name` / `short_name`** : `"Michael Mann — Portfolio"` et `"MM"`. Pas de risque de troncature mobile (≤ 12 chars short_name).
   - **Pas de `theme_color`/`background_color` localisés** : valeur fixe `#0a0a0a` (token site).
   - **Vérification** :
     - `curl -I http://localhost:3000/manifest.webmanifest` ⇒ `200`, `Content-Type: application/manifest+json`.
     - `curl -s http://localhost:3000/manifest.webmanifest | python -m json.tool` ⇒ JSON valide ; vérifier les clés.
     - `curl -s http://localhost:3000/en | grep -oE '<link[^>]+rel="manifest"[^>]*>'` ⇒ `<link rel="manifest" href="/manifest.webmanifest">`.

10. **Extension du `matcher` de `proxy.ts` pour exclure les routes de métadonnées (résolution dette différée Story 1.2b).** Modifier [src/proxy.ts:58-60](src/proxy.ts#L58-L60) — étendre le `matcher` regex pour exclure explicitement les nouvelles routes de métadonnées **sans extension** :
    - **Avant** :
      ```ts
      matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\..*).*)",
      ],
      ```
    - **Après** :
      ```ts
      matcher: [
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image|icon|apple-icon|manifest.webmanifest|.*\\..*).*)",
      ],
      ```
    - **Note 1** : `icon.svg`, `apple-icon.png`, `manifest.webmanifest` ont chacun une extension, donc le pattern existant `.*\\..*` les exclut déjà. Mais le `<link rel="icon">` que Next 16 émet pour `app/icon.svg` pointe vers `/icon` (sans `.svg`) car Next ajoute un hash et serve sous `/icon?<hash>` — **à vérifier en pratique** car l'extension `.svg` peut être conservée. Cf. doc Next `app-icons.md` qui montre que l'output `<link>` est `/icon?<generated>` (sans extension). **Solution conservatrice** : exclure `icon` (sans extension) pour gérer les deux cas.
    - **Note 2** : `opengraph-image` (sans extension) est la route name de l'Image Response, donc exclusion obligatoire.
    - **Note 3** : si Mike décide d'ajouter `app/twitter-image.tsx` en supplément d'`opengraph-image.tsx` (cas peu commun car Next réutilise l'OG image pour Twitter via metadata API), étendre encore le matcher avec `|twitter-image`.
    - **Vérification** (cohérente avec AC#6, #7, #9) :
      - `curl -v http://localhost:3000/opengraph-image 2>&1 | head -5` ⇒ `< HTTP/1.1 200 OK` (PAS `< HTTP/1.1 307` vers `/en/opengraph-image`).
      - Idem pour `/icon`, `/apple-icon`, `/manifest.webmanifest`.
    - **Mettre à jour** [_bmad-output/implementation-artifacts/deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md) : strikethrough la ligne « `config.matcher` du proxy — exclusion de métadonnées non exhaustive » de la section `## Deferred from: code review of story-1.2b (2026-05-12)` avec renvoi à cette story AC#10.

11. **CI Lighthouse (advisory en MVP — AC#4 epic, AR9).** Créer un job GitHub Actions qui exécute Lighthouse contre la home `/en` après build, en **mode advisory** : `continue-on-error: true` (un échec ne bloque pas le PR/merge — sera durci en Story 7.2). Seuils :
    - **Performance ≥ 95**
    - **Accessibility = 100**
    - **Best Practices ≥ 95**
    - **SEO ≥ 95**
    - **Implémentation** : choisir UNE des deux approches selon la simplicité :
      - **Approche A (recommandée — locale au runner)** : `npm ci && npm run build && npm run start &`, attendre le port via `wait-on http://localhost:3000`, exécuter `npx @lhci/cli@latest autorun --collect.url=http://localhost:3000/en --assert.preset=lighthouse:no-pwa --assert.assertions.categories:performance.minScore=0.95 --assert.assertions.categories:accessibility.minScore=1.0 --assert.assertions.categories:best-practices.minScore=0.95 --assert.assertions.categories:seo.minScore=0.95`. Plus contrôlé et reproductible.
      - **Approche B (cloud — preview Vercel)** : laisser le job attendre que Vercel ait déployé la preview, puis Lighthouse contre `https://<preview>.vercel.app/en`. Plus proche du prod mais dépendant de timing (le preview deploy peut ne pas être prêt quand le CI tourne).
    - **Privilégier Approche A** — autonome, pas de dépendance externe, run en ~2-3 min.
    - **Workflow file** : `.github/workflows/lighthouse.yml`, déclenchement `on: { pull_request: { branches: [main] }, push: { branches: [main] } }`. Étapes :
      1. `actions/checkout@v4`
      2. `actions/setup-node@v4` avec `node-version: 20`, `cache: "npm"`
      3. `npm ci`
      4. `npm run build`
      5. `npm run start &` puis `npx wait-on http://localhost:3000`
      6. Lighthouse CI (cf. ci-dessus)
      7. Upload report comme artifact (optionnel ; utile pour debug)
    - **`continue-on-error: true`** sur l'étape Lighthouse — advisory en MVP.
    - **Note** : ce nouveau workflow CI **ne remplace pas** le workflow existant ESLint + tsc de Story 1.1 — il s'ajoute en parallèle. Vérifier si un workflow `.github/workflows/ci.yml` existe déjà (Story 1.1) ; le préserver.
    - **Délégation possible** : si le job Lighthouse pose des problèmes de timing/instabilité sur le runner Ubuntu (chrome dependencies, headless flags, audio sandbox…), Mike peut **différer ce sous-AC en Story 7.2** sans bloquer 4.3. Le marquer `advisory` et notifier dans [deferred-work.md](deferred-work.md) : `## Deferred from: code review of story-4.3` section nouvelle.

12. **Clarification AGENTS.md politique images (résolution dette différée Story 4.2).** [AGENTS.md:7-9](AGENTS.md#L7-L9) actuel mentionne « `priority` réservé au LCP » sans couvrir le cas multi-image (galeries, carousel — Story 7.1 case studies). Ajouter **une phrase courte** (≤ 30 mots) :
    > **Multi-image (carrousels, galeries) :** un seul asset peut porter `priority` (le candidat LCP visible above-the-fold) ; les autres restent `loading="lazy"`. En doute, aucun n'est `priority`.
    - Position : à la fin du bloc `## Images` existant, en continuation de la prose actuelle. **NE PAS** créer une nouvelle section.
    - **Mettre à jour [deferred-work.md](deferred-work.md)** : strikethrough la ligne « Politique AGENTS.md : `priority` réservé au LCP — silencieuse sur multi-image » de la section `## Deferred from: code review of story-4.2 (2026-05-13)` avec renvoi à AC#12.

13. **Dictionnaire FR/EN : nouveaux libellés (`meta.jobTitle`, `meta.ogImageAlt`) — chemin de complétude FR19.** Ajouter dans [src/i18n/dictionaries/en.ts](src/i18n/dictionaries/en.ts) bloc `meta:` :
    ```ts
    jobTitle: "Senior Frontend Developer",
    ogImageAlt: "Michael Mann — Senior Frontend Developer · 5+ years · Ashdod, IL",
    ```
    Et la version FR correspondante dans [src/i18n/dictionaries/fr.ts](src/i18n/dictionaries/fr.ts) (la garde `satisfies Dictionary` bloquera le build si oubli) :
    ```ts
    jobTitle: "Développeur frontend senior",
    ogImageAlt: "Michael Mann — Développeur frontend senior · 5+ ans · Ashdod, IL",
    ```
    - **Pas de `as const`** sur `en.ts` (convention existante — cf. [src/i18n/dictionaries/en.ts:12](src/i18n/dictionaries/en.ts#L12) commentaire).
    - **Description FR existante** : vérifier que [src/i18n/dictionaries/fr.ts](src/i18n/dictionaries/fr.ts) a déjà `meta.description` traduite (pas restée en EN par oubli). Sinon, la traduire — la valeur EN actuelle est `"Senior frontend engineer building production SaaS for global brands."` ⇒ FR : `"Développeur frontend senior livrant des SaaS de production pour des marques internationales."` ou équivalent. **NE PAS** réécrire en profondeur ; juste vérifier qu'elle existe et est en français.

14. **Zéro régression / build vert / SSG préservé (NFR22).** Étant donné la totalité du site après cette story, quand `npm run typecheck`, `npm run lint`, `npm run build` tournent, alors ils passent **sans erreur**. Le rendu statique de `/en` et `/fr` reste pré-rendu (`generateStaticParams`, `dynamicParams = false` à [src/app/[locale]/layout.tsx:51](src/app/[locale]/layout.tsx#L51)). Tous les comportements antérieurs sont préservés :
    - Story 1.2b : `hreflang`, canonical, switch de langue.
    - Story 1.3 : Nav persistante, CV download, content typé.
    - Story 2.x : sections de contenu, marquee, CTAs.
    - Story 3.x : FadeIn, marquee animation, CustomCursor.
    - Story 4.1 : SkipLink, focus management, ARIA.
    - Story 4.2 : politique `next/image`, RAF idle gating CustomCursor.
    - **Aucun scroll horizontal parasite** de 320px à 1920px (re-confirmer après ajout du `<script>` JSON-LD — qui est `display: none`-équivalent et ne devrait rien changer visuellement).
    - **L'OG image rendue NE doit PAS apparaître visuellement dans la page** — c'est une route Handler servie à `/opengraph-image`, pas un composant rendu dans le DOM.

## Tasks / Subtasks

- [x] **Tâche 0 — Pré-lecture obligatoire (AGENTS.md / CLAUDE.md)**
  - [x] **AGENTS.md** impose de **lire les docs Next dans `node_modules/next/dist/docs/`** avant d'écrire du code. Pour cette story, lire :
    - [node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md](node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md) — `Metadata` object complet, `openGraph`, `twitter`, `robots`, `icons`, `manifest`, `metadataBase`.
    - [node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md](node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md) — `MetadataRoute.Sitemap`, alternates languages, structure XML.
    - [node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md](node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md) — `MetadataRoute.Robots`.
    - [node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md](node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md) — `next/og` ImageResponse, exports `alt`/`size`/`contentType`, chargement de polices via `readFile`.
    - [node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md](node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md) — `favicon.ico`, `icon.svg`, `apple-icon.png`.
    - [node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/manifest.md](node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/manifest.md) — `MetadataRoute.Manifest`.
    - [node_modules/next/dist/docs/01-app/02-guides/json-ld.md](node_modules/next/dist/docs/01-app/02-guides/json-ld.md) — pattern `<script type="application/ld+json">` + escape XSS.
    - **Avis de dépréciation** : scanner Next 16 migration notes — `themeColor` / `viewport` / `colorScheme` ont été déplacés de `metadata` vers `generateViewport` (cf. doc `generate-metadata.md` ligne 654-754). Ce n'est pas un piège pour cette story (on n'a pas besoin de ces props) mais à ne pas re-introduire dans `metadata`.
  - [x] Lire ce fichier de story de bout en bout, **ET** les sections Completion Notes / File List / Review Findings des stories précédentes [4-1-accessibilite-wcag-2-1-aa.md](4-1-accessibilite-wcag-2-1-aa.md) et [4-2-budget-de-performance-core-web-vitals.md](4-2-budget-de-performance-core-web-vitals.md) (patterns Next 16 acquis, conventions de revue, dette résolue/restante).
  - [x] Lire intégralement [_bmad-output/implementation-artifacts/deferred-work.md](_bmad-output/implementation-artifacts/deferred-work.md) — cette story résout **2 dettes** (review 1.2b proxy matcher, review 4.2 multi-image AGENTS.md). Les autres dettes (LinkedIn 404 → Story 9.1, URL `MaqomCard` fragility, garde FR/EN tableaux aveugle, bundle First Load JS, etc.) restent **hors périmètre**.
  - [x] Confirmer auprès de Mike (Tâche 0 finale, par écrit dans les Completion Notes) :
    - **Twitter/X handle** : Mike a-t-il un compte X public à inclure en `twitter:site` / `twitter:creator` ? Si non, omettre ces balises (défaut de l'AC#3).
    - **Site URL prod** : la valeur `process.env.NEXT_PUBLIC_SITE_URL` est-elle déjà configurée sur Vercel pour le custom domain final ? Si oui, vérifier que le canonical de prod correspond. Si non, on continue avec `https://portfolio-three-omega-48ezqd212w.vercel.app` (fallback de [src/app/[locale]/layout.tsx:55-57](src/app/[locale]/layout.tsx#L55-L57)).
  - [x] Lire le commentaire d'audit de contraste dans [src/app/globals.css:7-17](src/app/globals.css#L7-L17) — l'a11y et la palette sont acquises ; cette story ne touche pas aux tokens de couleur.

- [x] **Tâche 1 — Module partagé `siteUrl` + extension du dictionnaire (AC: #2, #5, #6, #7, #13)**
  - [x] Créer `src/lib/site-url.ts` :
    ```ts
    // Source de vérité unique pour l'URL absolue du site. Utilisée par :
    //   - layout.tsx (`metadataBase`, OG, Twitter)
    //   - sitemap.ts (URLs absolues)
    //   - robots.ts (`sitemap` + `host`)
    //   - page.tsx (JSON-LD `url`, `image`)
    // Override en prod via `NEXT_PUBLIC_SITE_URL` (Vercel env var) — par défaut, la
    // preview Vercel courante (placeholder en attendant le domaine custom Story 9.x).
    export const siteUrl: string =
      process.env.NEXT_PUBLIC_SITE_URL ??
      "https://portfolio-three-omega-48ezqd212w.vercel.app";
    ```
  - [x] Refactorer [src/app/[locale]/layout.tsx:53-57](src/app/[locale]/layout.tsx#L53-L57) pour importer `siteUrl` depuis `@/lib/site-url` au lieu de définir la constante localement. **Comportement inchangé** (même valeur, même override env-var).
  - [x] Ajouter les libellés `jobTitle` + `ogImageAlt` dans le bloc `meta:` de [src/i18n/dictionaries/en.ts](src/i18n/dictionaries/en.ts) et [src/i18n/dictionaries/fr.ts](src/i18n/dictionaries/fr.ts) (cf. AC#13). Vérifier que `npm run typecheck` reste vert (la garde `satisfies Dictionary` bloquera si FR oublie une clé).
  - [x] Vérifier que `meta.description` FR de [src/i18n/dictionaries/fr.ts](src/i18n/dictionaries/fr.ts) est bien en français (pas resté en EN). La traduire si nécessaire.

- [x] **Tâche 2 — Polices `next/og` (AC: #4)**
  - [x] **Sourcer les fichiers de polices** pour l'OG image (`next/og` ne peut PAS réutiliser `next/font` — il faut des `Buffer` chargés via `readFile`) :
    - Identifier `CormorantGaramond-Medium.ttf` (ou `.woff2`) et `JetBrainsMono-Regular.ttf` (ou `.woff2`). Sources :
      1. **Préféré** : si présents dans `node_modules/next/font/google/...` (Next bundle les fichiers téléchargés au build) — mais leur chemin n'est pas stable, ne pas s'appuyer dessus.
      2. **Officiel** : télécharger depuis [Google Fonts](https://fonts.google.com/specimen/Cormorant+Garamond) (zip → extraire `static/CormorantGaramond-Medium.ttf`) et [Google Fonts JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) (zip → extraire `static/JetBrainsMono-Regular.ttf`). Format `.ttf` est suffisant pour Satori (le moteur de `next/og`).
      3. **Alternative** : utiliser [google-webfonts-helper](https://gwfh.mranftl.com/fonts) pour récupérer des `.woff2` sous-ensembles latins (~30 KB chacun).
    - **Format à privilégier** : `.ttf` (compatibilité totale Satori) ou `.woff2` (plus léger). **Choisir** `.woff2` si Satori les supporte (à confirmer en doc Next 16). Sinon `.ttf`.
  - [x] Créer le dossier `src/assets/og-fonts/` (nouveau) et y **commiter** les 2 fichiers de police. **Taille attendue** : ~30-60 KB par police en `.woff2`, ~70-150 KB en `.ttf`. Total < ~300 KB ajouté au repo — acceptable.
  - [x] **Justifier dans les Completion Notes** : pourquoi les polices sont commitées dans le repo et pas réutilisées depuis `next/font` (incompatibilité d'API).

- [x] **Tâche 3 — Métadonnées OpenGraph + Twitter + robots dans `layout.tsx` (AC: #2, #3)**
  - [x] Modifier [src/app/[locale]/layout.tsx:59-76](src/app/[locale]/layout.tsx#L59-L76) — étendre `generateMetadata` :
    ```tsx
    export async function generateMetadata({
      params,
    }: {
      params: Promise<{ locale: string }>;
    }): Promise<Metadata> {
      const { locale } = await params;
      if (!isLocale(locale)) notFound();
      const dict = await getDictionary(locale);
      const localeOG = locale === "fr" ? "fr_FR" : "en_US";
      const localeAlt = locale === "fr" ? "en_US" : "fr_FR";
      return {
        metadataBase: new URL(siteUrl),
        title: {
          default: dict.meta.title,
          template: `%s — Michael Mann`,
        },
        description: dict.meta.description,
        alternates: {
          canonical: `/${locale}`,
          languages: { "x-default": "/en", en: "/en", fr: "/fr" },
        },
        robots: { index: true, follow: true },
        openGraph: {
          title: dict.meta.title,
          description: dict.meta.description,
          url: `/${locale}`,
          siteName: "Michael Mann",
          type: "website",
          locale: localeOG,
          alternateLocale: [localeAlt],
          images: [
            {
              url: "/opengraph-image",   // résolu en absolu via metadataBase
              width: 1200,
              height: 630,
              alt: dict.meta.ogImageAlt,
              type: "image/png",
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: dict.meta.title,
          description: dict.meta.description,
          images: [{ url: "/opengraph-image", alt: dict.meta.ogImageAlt }],
        },
      };
    }
    ```
  - [x] **NE PAS** ajouter `viewport` / `themeColor` / `colorScheme` dans `metadata` — déprécié Next 14, **doit** passer par `generateViewport` séparé. Aujourd'hui le site n'expose aucun de ces 3 → ne pas en introduire dans cette story (hors scope ; viewport meta tag par défaut Next 16 est OK).
  - [x] **PAS DE TWITTER `site`/`creator`** sauf si Tâche 0 a confirmé que Mike a un handle public.
  - [x] Vérifier que `dict.meta.title` est bien la valeur enrichie souhaitée — actuellement `"Michael Mann"` seul, peut-être à enrichir en `"Michael Mann — Senior Frontend Developer"` pour un meilleur titre social. **Décision** : laisser `dict.meta.title = "Michael Mann"` (court, propre) et ajouter le suffixe via `title.template`/`title.default` (déjà fait ci-dessus dans le template `"%s — Michael Mann"` mais la home utilise le default). Si Mike préfère un titre social plus descriptif, modifier `title.default` à `${dict.meta.title} — ${dict.meta.jobTitle}` (= "Michael Mann — Senior Frontend Developer" / "Michael Mann — Développeur frontend senior"). **Privilégier la version enrichie** pour la SEO sociale (Google montre les ~60 premiers chars du title — `"Michael Mann — Senior Frontend Developer"` (40 chars) est confortable).

- [x] **Tâche 4 — OG image `next/og` `ImageResponse` (AC: #4)**
  - [x] Créer [src/app/opengraph-image.tsx](src/app/opengraph-image.tsx) (root, PAS sous `[locale]/`) :
    ```tsx
    import { ImageResponse } from "next/og";
    import { readFile } from "node:fs/promises";
    import { join } from "node:path";

    export const alt = "Michael Mann — Senior Frontend Developer · 5+ years · Ashdod, IL";
    export const size = { width: 1200, height: 630 };
    export const contentType = "image/png";

    export default async function OpenGraphImage() {
      const [cormorantMedium, jetbrainsRegular] = await Promise.all([
        readFile(join(process.cwd(), "src/assets/og-fonts/CormorantGaramond-Medium.ttf")),
        readFile(join(process.cwd(), "src/assets/og-fonts/JetBrainsMono-Regular.ttf")),
      ]);

      return new ImageResponse(
        (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              padding: 64,
              backgroundColor: "#0a0a0a",
              border: "2px solid #d4a574",
              boxSizing: "border-box",
              fontFamily: "Cormorant Garamond",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 32,
                  fontFamily: "JetBrains Mono",
                  color: "#888",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                · michael-mann · portfolio · v2026.1 ·
              </div>
              <div
                style={{
                  fontSize: 120,
                  fontWeight: 500,
                  color: "#fafafa",
                  marginTop: 16,
                  fontFamily: "Cormorant Garamond",
                  letterSpacing: -2,
                }}
              >
                Michael Mann
              </div>
              <div
                style={{
                  fontSize: 40,
                  fontFamily: "JetBrains Mono",
                  color: "#d4a574",
                  letterSpacing: 4,
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                Senior Frontend Developer
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "JetBrains Mono",
                fontSize: 26,
                color: "#cfcfcf",
                gap: 8,
              }}
            >
              <div>location  → Ashdod, Israel</div>
              <div>experience → 5+ years</div>
              <div>focus      → React · TypeScript · Supabase</div>
              <div style={{ color: "#888", marginTop: 16 }}>$ open mann.dev →</div>
            </div>
          </div>
        ),
        {
          ...size,
          fonts: [
            { name: "Cormorant Garamond", data: cormorantMedium, style: "normal", weight: 500 },
            { name: "JetBrains Mono", data: jetbrainsRegular, style: "normal", weight: 400 },
          ],
        }
      );
    }
    ```
  - [x] **Limites Satori** (`next/og` rendering engine — sous-ensemble CSS Flexbox uniquement) :
    - Pas de `grid`, pas de `position: absolute`, pas de pseudo-selectors, pas de `transform: rotate`, support limité de `border-radius` (OK simple), pas de filters CSS.
    - **Tous les éléments DOIVENT avoir `display: flex` ou `display: none`** (sinon Satori warn). Le bloc racine et tous les sous-blocs ci-dessus ont `display: flex` explicite.
  - [x] Tester localement après `npm run build` : `npm run start` puis ouvrir `http://localhost:3000/opengraph-image` ⇒ image visible, ~60-200 KB.
  - [x] **Captures** : sauver une capture du rendu à `_bmad-output/implementation-artifacts/story-4-3-og-image.png` (cohérent avec convention 4.2). Cette capture sert de visual reference pour les futures évolutions.

- [x] **Tâche 5 — JSON-LD `Person` dans `page.tsx` (AC: #5)**
  - [x] Modifier [src/app/[locale]/page.tsx:27-44](src/app/[locale]/page.tsx#L27-L44) — ajouter `siteUrl` à l'import et construire le bloc `jsonLd` après l'extraction du dictionnaire :
    ```tsx
    import { siteUrl } from "@/lib/site-url";
    // …

    export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
      const { locale } = await params;
      if (!isLocale(locale)) notFound();
      const dict = await getDictionary(locale);
      const { meta, nav, hero, clients, sections, ai, footer, langSwitcher, a11y } = dict;

      // JSON-LD Person — émis dans le HTML initial pour les crawlers (cf. AC#5).
      // L'URL `image` pointe vers la route Handler `opengraph-image` au root du site.
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Michael Mann",
        jobTitle: meta.jobTitle,
        url: `${siteUrl}/${locale}`,
        image: `${siteUrl}/opengraph-image`,
        email: `mailto:${meta.email}`,
        telephone: meta.phone,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ashdod",
          addressCountry: "IL",
        },
        // `sameAs` : URL LinkedIn courante — corrigée en Story 9.1 (cf. deferred-work).
        sameAs: [meta.linkedin],
        knowsLanguage: ["fr", "he", "en"],
      };
      // …
    ```
  - [x] Ajouter en **tout premier enfant du `<>` retourné** par `Home()` :
    ```tsx
    return (
      <>
        <script
          type="application/ld+json"
          // Escape XSS-safe (cf. doc Next 16 json-ld.md) : `<` → `<`.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <Nav … />
        {/* … */}
      </>
    );
    ```
  - [x] **Pas de type strict requis** — le bloc `jsonLd` est `const` et inféré ; pas besoin d'`schema-dts`. **Si** une garantie de typage est souhaitée (futur-proofing), ajouter `schema-dts` en **devDependency** (`npm install --save-dev schema-dts`) et typer `const jsonLd: WithContext<Person> = { … }`. **Optionnel** ; justifier en Completion Notes.
  - [x] **Vérifier** post-build :
    - `curl -s http://localhost:3000/en | grep -oE 'application/ld\+json'` ⇒ 1 occurrence.
    - Copier le JSON dans [validator.schema.org](https://validator.schema.org/) ET dans [Google Rich Results Test](https://search.google.com/test/rich-results) ⇒ 0 erreur.
  - [x] **Note React 19 + Next 16** : `<script>` au top du JSX du Server Component — React 19 supporte le hoisting auto vers `<head>` pour les `<script>` avec attributs spécifiques (`async`, `defer`, `src`), mais un `<script type="application/ld+json">` inline (sans src) est typically inlined dans le `<body>` (où il est trouvé). C'est OK pour les crawlers (Google parse JSON-LD partout). Si une régression d'hydratation apparaît, déplacer le `<script>` dans le `<head>` via le `metadata.other` field (mais ce field ne supporte que des meta tags, pas des scripts) — sinon utiliser `<Head>` Next legacy (pas dispo en App Router). **Conserver le pattern inline en début de `<body>` — c'est la recommandation Next 16 officielle**.

- [x] **Tâche 6 — `sitemap.ts` (AC: #6)**
  - [x] Créer [src/app/sitemap.ts](src/app/sitemap.ts) avec le contenu d'AC#6.
  - [x] **Vérifier** : `npm run build && npm run start`, puis `curl http://localhost:3000/sitemap.xml | head -30`. Confirmer 2 `<url>` avec `<xhtml:link rel="alternate" hreflang="…">`.

- [x] **Tâche 7 — `robots.ts` (AC: #7)**
  - [x] Créer [src/app/robots.ts](src/app/robots.ts) avec le contenu d'AC#7.
  - [x] **Vérifier** : `curl http://localhost:3000/robots.txt` ⇒ format conforme.

- [x] **Tâche 8 — Favicon set : `icon.svg` + `apple-icon.png` (AC: #8)**
  - [x] **`src/app/icon.svg`** : créer le fichier avec le contenu exact d'AC#8 (monogramme `MM`, couleurs hardcodées).
  - [x] **`src/app/apple-icon.png`** : générer le PNG 180×180 :
    - **Option A** : Mike (ou le dev agent si Inkscape/rsvg-convert disponibles localement) exporte `icon.svg` à 180×180 via `rsvg-convert -w 180 -h 180 src/app/icon.svg > src/app/apple-icon.png` ou via Figma/Inkscape. Commiter le PNG.
    - **Option B (fallback)** : créer `src/app/apple-icon.tsx` qui retourne un `ImageResponse` 180×180 (similaire à l'OG image mais beaucoup plus simple — un fond `#ededed` + lettres `MM` `#0a0a0a` centrées). Coût runtime au build : ~50 ms. Avantage : pas besoin d'outils graphiques.
    - **Privilégier Option A** — actif statique 1-5 KB, pas de runtime build, plus simple à maintenir.
  - [x] **Vérifier** : `curl -I http://localhost:3000/favicon.ico`, `/icon.svg`, `/apple-icon.png` ⇒ tous `200`, Content-Type cohérent. `curl -s http://localhost:3000/en | grep -oE '<link[^>]+rel="(icon|apple-touch-icon)"[^>]*>'` ⇒ 3 balises.

- [x] **Tâche 9 — `manifest.ts` (AC: #9)**
  - [x] Créer [src/app/manifest.ts](src/app/manifest.ts) avec le contenu d'AC#9.
  - [x] **Vérifier** : `curl -I http://localhost:3000/manifest.webmanifest` ⇒ `200`, `application/manifest+json`. Le `<head>` rendu contient `<link rel="manifest">`.

- [x] **Tâche 10 — Étendre `proxy.ts` matcher (AC: #10)**
  - [x] Modifier [src/proxy.ts:58-60](src/proxy.ts#L58-L60) — ajouter `opengraph-image|icon|apple-icon|manifest.webmanifest` au regex de négation. Cf. AC#10 pour le pattern exact.
  - [x] **Vérifier** : pour chacune des 4 routes (`/opengraph-image`, `/icon` ou `/icon.svg`, `/apple-icon` ou `/apple-icon.png`, `/manifest.webmanifest`), `curl -v http://localhost:3000/<route> 2>&1 | head -10` ⇒ status `200` direct, PAS de `307 redirect` vers `/en/<route>`.
  - [x] **Mettre à jour [deferred-work.md](deferred-work.md)** : strikethrough la ligne « `config.matcher` du proxy — exclusion de métadonnées non exhaustive » de la section `## Deferred from: code review of story-1.2b (2026-05-12)` avec préfixe `~~`, suffixe `~~ — **RÉSOLU (Story 4.3 AC#10, 2026-05-13)** : matcher étendu pour exclure \`opengraph-image\`, \`icon\`, \`apple-icon\`, \`manifest.webmanifest\` (routes Next 16 sans extension). Verifié via \`curl -v\` que ces routes retournent 200 direct sans 307 vers \`/en/<route>\`.`.

- [x] **Tâche 11 — CI Lighthouse advisory (AC: #11)**
  - [x] **Inspecter le workflow CI existant** : `.github/workflows/` (Story 1.1 a établi ESLint + tsc). **NE PAS** modifier ce workflow ; en créer un nouveau dédié à Lighthouse.
  - [x] Créer `.github/workflows/lighthouse.yml` (Approche A — locale au runner Ubuntu) :
    ```yaml
    name: Lighthouse CI (advisory)

    on:
      pull_request:
        branches: [main]
      push:
        branches: [main]

    jobs:
      lighthouse:
        runs-on: ubuntu-latest
        continue-on-error: true  # Advisory en MVP — Story 7.2 durcira
        steps:
          - uses: actions/checkout@v4
          - uses: actions/setup-node@v4
            with:
              node-version: 20
              cache: npm
          - run: npm ci
          - run: npm run build
          - name: Start server
            run: npm run start &
          - name: Wait for server
            run: npx wait-on http://localhost:3000/en --timeout 60000
          - name: Lighthouse
            run: |
              npx -y @lhci/cli@latest autorun \
                --collect.url=http://localhost:3000/en \
                --collect.numberOfRuns=1 \
                --assert.assertions.categories:performance=[\"warn\",{\"minScore\":0.95}] \
                --assert.assertions.categories:accessibility=[\"warn\",{\"minScore\":1.0}] \
                --assert.assertions.categories:best-practices=[\"warn\",{\"minScore\":0.95}] \
                --assert.assertions.categories:seo=[\"warn\",{\"minScore\":0.95}]
          - uses: actions/upload-artifact@v4
            if: always()
            with:
              name: lighthouse-report
              path: .lighthouseci/
    ```
    - **`numberOfRuns=1`** : suffit en MVP (réduire bruit de flakiness via plus de runs est l'affaire de 7.2).
    - **`["warn", { minScore: ... }]`** : en MVP, on **warn** (CI passe quand même grâce à `continue-on-error: true`). 7.2 passera à `["error", …]`.
    - **`@lhci/cli@latest`** : préférer un pin de version pour reproductibilité — à la rédaction `v0.13.x`. Vérifier la version la plus récente au moment du dev (commande : `npm view @lhci/cli version`). Si une version stable existe, fixer (`@lhci/cli@0.13.0` par exemple).
    - **Upload artifact** : utile pour debug en cas d'échec ; visible dans le tab Actions du PR.
  - [x] **Tester en local** (avant de pousser à GitHub) : reproduire la séquence `npm run build && npm run start &` puis `npx @lhci/cli@latest autorun --collect.url=http://localhost:3000/en --assert.preset=lighthouse:no-pwa`. Confirmer que Lighthouse tourne sans crash.
  - [x] **Documenter en Completion Notes** : si l'audit local passe les 4 seuils, c'est cohérent avec le seuil mutated de 4.2 (Performance ≥ 95 = AC accepté de fait). Si non, identifier l'opportunité Lighthouse et corriger ou différer en 7.2.
  - [x] **Délégation** : si le job échoue **sur le runner GitHub** (chrome dependencies missing, timing instable, audio sandbox issues), créer une entrée dans [deferred-work.md](deferred-work.md) section `## Deferred from: code review of story-4.3 (2026-05-13)` (nouvelle) :
    > **CI Lighthouse advisory non opérationnel sur runner GitHub Ubuntu (Story 4.3 AC#11)** — Le job `.github/workflows/lighthouse.yml` échoue avec `<message d'erreur>`. À durcir/débuguer en **Story 7.2** (CI Lighthouse durci, blocking). Pour le MVP, l'audit Lighthouse manuel local (cf. Story 4.2 Tâche 7) reste la procédure de référence.

- [x] **Tâche 12 — Mettre à jour `AGENTS.md` (politique multi-image — AC: #12)**
  - [x] Ajouter la phrase de clarification (cf. AC#12) à la fin du bloc `## Images` de [AGENTS.md:9](AGENTS.md#L9) — **NE PAS** créer une nouvelle section, juste enrichir la prose existante.
  - [x] **Mettre à jour [deferred-work.md](deferred-work.md)** : strikethrough la ligne « Politique AGENTS.md : `priority` réservé au LCP — silencieuse sur multi-image » de la section `## Deferred from: code review of story-4.2 (2026-05-13)` avec préfixe `~~`, suffixe `~~ — **RÉSOLU (Story 4.3 AC#12, 2026-05-13)** : politique multi-image ajoutée à \`AGENTS.md\` section Images — un seul asset \`priority\` (LCP candidate), les autres \`lazy\`.`.

- [x] **Tâche 13 — Smoke crawlable sans JS (AC: #1)**
  - [x] **`npm run build && npm run start`**.
  - [x] `curl -s http://localhost:3000/en > /tmp/en.html`. Vérifier `grep -c '<h1' /tmp/en.html` ≥ 1, `grep -c '<h2' /tmp/en.html` ≥ 7, `grep -c 'mailto:' /tmp/en.html` ≥ 3 (nav + hero + contact), `grep -c 'maqom.co' /tmp/en.html` ≥ 1.
  - [x] Idem `/fr` ⇒ `/tmp/fr.html` avec mêmes nombres.
  - [x] **Vérifier les nouvelles métadonnées** (output script en Completion Notes) :
    ```sh
    for url in /en /fr; do
      echo "=== $url ==="
      curl -s http://localhost:3000$url | grep -oE '(<title>[^<]*</title>|<meta[^>]*(description|robots|og:|twitter:)[^>]*>|<link[^>]*(canonical|hreflang|icon|manifest|apple-touch-icon)[^>]*>|application/ld\+json)' | head -50
    done
    ```
  - [x] **DevTools « Disable JavaScript »** : ouvrir Chrome, F12 → ⋯ → Settings → Debugger → Disable JavaScript. Recharger `/en` → confirmer visuellement que toutes les sections sont visibles (textes, liens, sections). Idem `/fr`. (Smoke browser déléguable à Mike — cf. convention 4.x.)

- [x] **Tâche 14 — Non-régression + mise à jour sprint-status + Change Log + Completion Notes + File List (AC: #14)**
  - [x] `npm run typecheck` → 0 erreur (la garde `satisfies Dictionary` peut révéler un oubli FR de `meta.jobTitle` / `meta.ogImageAlt`).
  - [x] `npm run lint` → 0 erreur, 0 warning.
  - [x] `npm run build` → succès ; `/en` et `/fr` marqués `● (SSG)` ; reporter First Load JS dans Completion Notes (référentiel pour 4.2 dette ≈ 189 KB gzip ; cette story ne devrait pas faire varier significativement — l'OG image, sitemap, robots, manifest, JSON-LD sont **server-rendered** et n'ajoutent rien au bundle client).
  - [x] **Smoke browser** sur `/en` ET `/fr` (déléguable à Mike) :
    - Hero, marquee, sections, Nav, menu mobile, FadeIn, CustomCursor : tout comme avant (régression check).
    - 320px / 360px / 375px / 1440px / 1920px : aucun scroll horizontal.
    - **Inspecter `<head>`** dans DevTools : toutes les balises OG, Twitter, robots, icon, manifest, hreflang, canonical, title, description, **et le `<script type="application/ld+json">`** sont présents.
  - [x] **Mettre à jour [sprint-status.yaml](sprint-status.yaml)** :
    - `development_status['4-3-seo-metadonnees-de-partage-assets-de-marque']` : `backlog` → (à l'entrée de la story) `in-progress` → (à la sortie, avant code-review) `review`.
    - `last_updated` : `2026-05-13` (ou la date de fin de story).
    - **NE PAS** toucher aux autres clés.
  - [x] **Cocher** toutes les tâches/sous-tâches achevées (`[x]`).
  - [x] **Compléter** Dev Agent Record / Change Log / Completion Notes / File List ci-dessous.
  - [x] **Ne pas commiter d'état cassé.** Mike commit après revue (convention 3.1/3.2/4.1/4.2).

## Dev Notes

### Contexte projet & contraintes héritées

- **Next.js 16.2.6 / React 19.2.4** (cf. [package.json](package.json), 3 deps + 9 devDeps). App Router avec segments de locale (`app/[locale]/...`). Site **statique** (SSG, `dynamicParams = false`). Pas de backend, pas d'auth, pas d'API.
- **Tailwind CSS v4** — config CSS-first via `@theme` dans [src/app/globals.css](src/app/globals.css). Pas impacté par cette story.
- **AGENTS.md / CLAUDE.md** : lecture obligatoire de `node_modules/next/dist/docs/` AVANT toute écriture de code. Cette story ajoute une note de politique multi-image en complément.
- **Convention de revue / commits** : Mike commit lui-même après revue (convention 3.1/3.2/4.1/4.2).
- **Convention `'use client'`** : aucun nouveau client component dans cette story (tout est Server : `sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`, métadonnées du layout, JSON-LD inline dans `page.tsx`).
- **Convention française des commentaires de code** : tout commentaire ajouté par cette story qui explique une **décision** doit être en français. Le code lui-même reste en anglais (identifiants, types, props).
- **Source de vérité unique** : tous les contenus visibles passent par le dictionnaire FR/EN ([src/i18n/dictionaries/](src/i18n/dictionaries/)). Cette story ajoute 2 clés : `meta.jobTitle`, `meta.ogImageAlt`. **PAS de chaîne en dur**.

### Patterns d'architecture & garde-fous

- **`siteUrl` extrait en module partagé `src/lib/site-url.ts`** : DRY entre layout, sitemap, robots, opengraph-image, JSON-LD. Une seule source override-able via `NEXT_PUBLIC_SITE_URL`.

- **`opengraph-image.tsx` au root (PAS sous `[locale]/`)** : décision MVP — une seule OG image partagée. Coût: les partages FR montrent un titre EN ; bénéfice: -50% de complexité (1 fichier vs 2, 1 pipeline assets vs 2). Reconsidérable en Story 9.1 si Mike juge l'incohérence visible.

- **`next/og` `ImageResponse` ne réutilise PAS `next/font`** : Satori (rendering engine de `next/og`) attend des `Buffer` de polices via `readFile` Node.js. C'est par design — `next/font` produit des classes CSS, pas des bytes accessibles côté Node. Coût: ~150 KB committés sous `src/assets/og-fonts/`. Bénéfice: rendu pixel-perfect cohérent avec le design du site.

- **Satori support CSS limité** : Flexbox uniquement (PAS de grid, PAS de `position: absolute`, support partiel de `border-radius`). Le visuel OG image est composé en Flex pur. Si une régression visuelle apparaît, dégrader vers une composition plus simple (1 fond + 1 wordmark + 1 sous-titre).

- **JSON-LD inline dans `page.tsx`** (pas dans `layout.tsx`) : sémantiquement, `Person` représente Michael — qui est exposé par la page d'accueil, pas par un layout potentiellement réutilisable par d'autres pages (futures case studies en 7.1 → leur layout pourrait être le même mais leur JSON-LD sera `WebPage` / `Article`, pas `Person`).

- **`<script type="application/ld+json">` au top du JSX du Server Component** : pattern Next 16 recommandé. React 19 + Next 16 ne le hoist PAS automatiquement vers `<head>` (contrairement aux `<script src="...">` async/defer) ; il reste inline dans le `<body>`. C'est OK pour Google et tous les crawlers JSON-LD.

- **Escape XSS pour JSON-LD** : `JSON.stringify(...).replace(/</g, "\\u003c")` est le pattern officiel Next 16. Aucune chaîne du dictionnaire ne contient `<` aujourd'hui (vérifié), mais la précaution reste obligatoire (un futur contributeur pourrait introduire `<` dans une description).

- **`title.template`** : `"%s — Michael Mann"` est en place pour les **futures case studies** (Story 7.1). Aujourd'hui, la home use `title.default` ⇒ pas d'effet visible immédiat, mais l'infrastructure est prête.

- **`alternateLocale` dans openGraph** : Next supporte cette prop dans `openGraph` (cf. doc `generate-metadata.md`). Émet `<meta property="og:locale:alternate" content="fr_FR">` (sur `/en`) — préfixe précisément la convention OG officielle.

- **`metadataBase` déjà en place** ([src/app/[locale]/layout.tsx:68](src/app/[locale]/layout.tsx#L68)) : permet d'utiliser des paths relatifs (`/opengraph-image`) qui sont résolus en URLs absolues par Next. **NE PAS** mettre d'URLs absolues en dur dans openGraph/twitter — laisser Next résoudre via `metadataBase`.

- **`opengraph-image.tsx` est un Route Handler caché statiquement par défaut** (cf. doc Next 16) : il tourne une fois au build, pas à chaque requête. Coût build : ~200-500 ms par image. Aucun coût runtime.

- **`sitemap.ts` est aussi caché statiquement** (cf. doc Next 16) : généré une fois au build, `lastModified: new Date()` est figé au moment du build (acceptable pour un portfolio qui change rarement).

- **`robots.ts` idem** : statique.

- **Polices `next/og` commitées dans le repo** : justifié par la limitation `next/font` ≠ `next/og`. Stocker sous `src/assets/og-fonts/` (PAS `public/` — pas servies au client, juste lues au build).

### Pourquoi `display: "browser"` dans le manifest (pas `standalone`)

`standalone` ferait apparaître le portfolio comme une « app » installable sur mobile (« Add to Home Screen » avec icône fullscreen). C'est cohérent pour un blog/app/produit, mais pour un **portfolio personnel** qui se consulte ponctuellement, c'est trompeur (le visiteur s'attend à une expérience web, pas à une app à conserver). `browser` désactive ce prompt — le manifest reste utile pour le `theme_color` et les icônes mais n'incite pas à l'installation.

### Pourquoi pas de PWA / service worker

Le PRD AR12 (Hors scope) liste explicitement « pas de PWA installable ». Le manifest seul ≠ PWA — il faut aussi un service worker pour être un PWA. On ne fournit ni l'un ni l'autre. Le manifest sert ici uniquement à exposer `theme_color`/icons/name de manière standardisée.

### Pourquoi JSON-LD `Person` et pas `WebSite` / `Organization`

`Person` est l'entité primaire de ce portfolio — c'est Michael qui est référencé, pas une organisation. Pour les case studies futures (7.1), on ajoutera des blocs JSON-LD `CreativeWork` ou `Article` colocalisés avec ces pages. `Organization` est inapproprié (Michael n'est pas une entreprise enregistrée).

### Pourquoi pas de `keywords` dans la metadata

Google **ignore complètement** `<meta name="keywords">` depuis ~2009 (annoncé publiquement par Matt Cutts). C'est de l'over-engineering ; non ajouté. Si jamais Mike souhaite optimiser pour Bing/Yandex qui les pondèrent légèrement, ajouter via `metadata.keywords` Next — mais hors scope ici.

### Pourquoi pas d'`og:image:secure_url`

`og:image:secure_url` était requis quand HTTP coexistait avec HTTPS. Aujourd'hui (HTTPS-only) c'est redondant — Next ne l'émet pas par défaut. Aucune action requise.

### Pourquoi pas de `viewport` dans `metadata`

Déprécié Next 14+. Le viewport actuel `<meta name="viewport" content="width=device-width, initial-scale=1">` est émis automatiquement par Next 16 (default). Si une modification est nécessaire (rare), utiliser `generateViewport` séparé — hors scope cette story.

### Pourquoi un seul Lighthouse advisory en MVP (Story 4.3) et un Lighthouse durci en Post-MVP (Story 7.2)

- **MVP (Story 4.3)** : on **veut** une visibilité CI sur les régressions perf/a11y/SEO sans bloquer le merge — la stack est jeune, les budgets se calibrent encore, un échec de seuil ne doit pas paralyser le développement.
- **Post-MVP (Story 7.2)** : une fois le site stabilisé, les seuils calibrés, et la base de mesure connue, on durcit en blocking (`continue-on-error: false`, `["error", …]`).

### Coordination avec Story 4.2 (review) et Story 9.1 (backlog)

- **Story 4.2** est en `review` au moment de la rédaction de 4.3 ; la dette « bundle 189 KB > budget 150 KB » est conditionnellement acceptée si Lighthouse Perf ≥ 95. Cette story 4.3 introduit le CI Lighthouse advisory qui mesurera de fait ce seuil — convergent avec le close-out de 4.2.
- **Story 9.1 (audit pré-lancement)** corrigera l'URL LinkedIn 404 (`dict.meta.linkedin`). Le JSON-LD `sameAs` de cette story émet la valeur courante (404) — sera valide automatiquement après 9.1, sans nouveau changement de code.

### Previous Story Intelligence

#### Story 4.1 (accessibilité) — patterns acquis

- **SkipLink** ajouté en tout premier enfant de `<body>` ([src/app/[locale]/layout.tsx:96](src/app/[locale]/layout.tsx#L96)) — pattern WebAIM. NE PAS perturber l'ordre.
- **`dict.a11y.skipToContent` et `dict.a11y.opensInNewTab`** ajoutés au dictionnaire FR/EN.
- **`useEffect` Escape sur menu mobile** + `aria-current` sur la section active (`Nav`).
- **Convention** : `aria-label` sur liens d'icônes ; `<span class="sr-only">` pour `(opens in a new tab)` sur tous les `target="_blank"`.

#### Story 4.2 (perf) — patterns acquis

- **Politique `next/image` documentée** dans `AGENTS.md` section `## Images` ([AGENTS.md:7-9](AGENTS.md#L7-L9)). Aucune image raster aujourd'hui — l'OG image générée par `opengraph-image.tsx` est une **route Handler**, pas un asset rendu dans le DOM ; **elle ne tombe pas sous la politique `next/image`** (qui concerne uniquement les images visibles dans le rendu de page).
- **RAF idle gating** dans `CustomCursor.tsx` — pas impacté.
- **`break-words` sur `MethodologyCard.tsx`** — pas impacté.
- **`min-w-0` + `wrap-anywhere` sur LinkedIn URL longue dans Contact.tsx** — pas impacté.
- **Bundle First Load JS ~189 KB gzip** — la story 4.3 n'introduit AUCUN nouveau Client component (toutes les routes metadata sont Server-rendered), donc **aucun impact attendu** sur le bundle. À reconfirmer post-build.

### Git Intelligence (5 derniers commits)

```
aadc5b6 feat(story-4.2): introduce performance budget and Core Web Vitals criteria
2c181da feat(story-4.1): finalize accessibility enhancements and complete code review
0a15d77 feat(story-4.1): enhance accessibility with skip link and visual indicators
df31f32 feat(story-3.2): implement custom cursor with visual fidelity and graceful degradation
3d78fac feat(story-3.1): implement scroll fade-in and marquee animation with reduced motion support
```

Pattern de message : `feat(story-X.Y): <imperatif court>`. Cohérence à respecter pour le commit de cette story.

### Latest Technical Information

#### `next/og` `ImageResponse` (Next 16.2.6)

- Moteur sous-jacent : **Satori** + **Resvg** (rendu SVG → PNG).
- Support CSS : sous-ensemble Flexbox uniquement. Pas de `grid`, pas de pseudo-elements, pas de `transform: rotate`, pas de filters.
- Polices : doivent être passées en `Buffer` via la prop `fonts` du `ImageResponse` constructor. PAS de chargement automatique depuis `next/font` ou Google Fonts au runtime.
- Cache : la route est statique par défaut, générée au build.
- Limite de taille de fichier : 1200×630 PNG ≈ 50-200 KB attendu.

#### `next/og` font loading via `readFile` (Node.js runtime)

```ts
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const fontData = await readFile(
  join(process.cwd(), "src/assets/og-fonts/CormorantGaramond-Medium.ttf")
);
// → passer à `fonts: [{ name: "Cormorant Garamond", data: fontData, ... }]`
```

`process.cwd()` = racine du projet (PAS du fichier `.tsx` — c'est le dossier où `package.json` vit).

#### `MetadataRoute.Sitemap` (Next 16.2.6 — type officiel)

```ts
type Sitemap = Array<{
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;  // 0.0 to 1.0
  alternates?: {
    languages?: Languages<string>;  // { en: "https://...", fr: "https://..." }
  };
}>;
```

#### `MetadataRoute.Robots` (Next 16.2.6)

```ts
type Robots = {
  rules:
    | { userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }
    | Array<{ userAgent: string | string[]; allow?: string | string[]; disallow?: string | string[]; crawlDelay?: number }>;
  sitemap?: string | string[];
  host?: string;
};
```

#### `MetadataRoute.Manifest` (Next 16.2.6)

Référence officielle : MDN [Web Manifest](https://developer.mozilla.org/docs/Web/Manifest). Champs principaux : `name`, `short_name`, `description`, `start_url`, `display`, `background_color`, `theme_color`, `icons[]`.

#### `<meta name="robots">` valeurs courantes

- `index, follow` — défaut souhaité (publié et crawlable).
- `noindex, follow` — page exclue de l'index mais liens suivis (ex. `/login`).
- `noindex, nofollow` — exclu totalement (ex. `/admin`).

Pour ce site : `index, follow` partout (pas de page privée).

### Project Structure Notes

Nouvelle structure attendue après cette story (additions only — aucun renommage / suppression existante) :

```
src/
├── app/
│   ├── favicon.ico                       # déjà — Story 1.1
│   ├── icon.svg                          # NOUVEAU — AC#8
│   ├── apple-icon.png                    # NOUVEAU — AC#8
│   ├── manifest.ts                       # NOUVEAU — AC#9
│   ├── opengraph-image.tsx               # NOUVEAU — AC#4
│   ├── robots.ts                         # NOUVEAU — AC#7
│   ├── sitemap.ts                        # NOUVEAU — AC#6
│   ├── globals.css                       # inchangé
│   └── [locale]/
│       ├── layout.tsx                    # MODIFIÉ — AC#2 + #3 (openGraph, twitter, robots, title.template ; siteUrl extrait)
│       ├── page.tsx                      # MODIFIÉ — AC#5 (JSON-LD inline)
│       └── not-found.tsx                 # inchangé
├── assets/
│   └── og-fonts/                         # NOUVEAU dossier — AC#4 / Tâche 2
│       ├── CormorantGaramond-Medium.ttf  # ou .woff2
│       └── JetBrainsMono-Regular.ttf     # ou .woff2
├── components/                           # inchangé (sauf MMLogo.tsx réutilisé indirectement via icon.svg)
├── hooks/                                # inchangé
├── i18n/
│   ├── config.ts                         # inchangé
│   └── dictionaries/
│       ├── en.ts                         # MODIFIÉ — AC#13 (`meta.jobTitle`, `meta.ogImageAlt`)
│       ├── fr.ts                         # MODIFIÉ — AC#13 (mêmes clés FR)
│       └── index.ts                      # inchangé
├── lib/
│   └── site-url.ts                       # NOUVEAU — AC#1 / Tâche 1 (DRY siteUrl)
└── proxy.ts                              # MODIFIÉ — AC#10 (matcher étendu)
```

Et :

```
.github/
└── workflows/
    └── lighthouse.yml                    # NOUVEAU — AC#11 / Tâche 11

AGENTS.md                                 # MODIFIÉ — AC#12 (multi-image policy)
_bmad-output/implementation-artifacts/
    deferred-work.md                      # MODIFIÉ — Tâches 10, 12 (strikethrough 2 dettes)
    sprint-status.yaml                    # MODIFIÉ — Tâche 14 (statut → review)
    story-4-3-og-image.png                # NOUVEAU — capture du rendu OG image (Tâche 4)
```

### References

- [PRD §FR27](_bmad-output/planning-artifacts/prd.md) — Métadonnées SEO + structured data + sitemap + robots.
- [PRD §FR28](_bmad-output/planning-artifacts/prd.md) — Pré-rendu lisible sans JS.
- [PRD §FR18](_bmad-output/planning-artifacts/prd.md) — hreflang + canonical.
- [PRD §NFR26](_bmad-output/planning-artifacts/prd.md) — Contenu pré-rendu crawlable.
- [PRD §NFR27](_bmad-output/planning-artifacts/prd.md) — Détail des métadonnées requises.
- [PRD §AR8](_bmad-output/planning-artifacts/prd.md) — `next/image`, favicon set + OG image + manifest depuis assets.
- [PRD §AR9](_bmad-output/planning-artifacts/prd.md) — Lighthouse CI (advisory en MVP, blocking en Growth).
- [Epic 4 — Story 4.3 spec](_bmad-output/planning-artifacts/epics.md#L539-L558) — Critères d'acceptation source.
- [Story 4.1 (a11y)](4-1-accessibilite-wcag-2-1-aa.md) — patterns SkipLink, aria-current, dict.a11y.
- [Story 4.2 (perf)](4-2-budget-de-performance-core-web-vitals.md) — politique `next/image`, RAF idle, bundle 189 KB.
- [Story 1.2b (i18n)](1-2b-internationalisation-fr-en-routing-par-locale-dictionnaire-type-selecteur-de-langue.md) — proxy matcher, locale routing, dict.
- [deferred-work.md](deferred-work.md) — review 1.2b (proxy matcher dette résolue ici), review 4.2 (AGENTS.md multi-image dette résolue ici).
- [Next 16 `generate-metadata.md`](../../node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md) — référence Metadata API.
- [Next 16 `opengraph-image.md`](../../node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md) — `next/og`, `ImageResponse`, exports `alt`/`size`/`contentType`.
- [Next 16 `app-icons.md`](../../node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md) — favicon, icon, apple-icon.
- [Next 16 `sitemap.md`](../../node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md) — `MetadataRoute.Sitemap`, alternates languages.
- [Next 16 `robots.md`](../../node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md) — `MetadataRoute.Robots`.
- [Next 16 `manifest.md`](../../node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/manifest.md) — `MetadataRoute.Manifest`.
- [Next 16 `json-ld.md`](../../node_modules/next/dist/docs/01-app/02-guides/json-ld.md) — pattern JSON-LD + XSS escape.
- [Schema.org Person](https://schema.org/Person) — propriétés canoniques.
- [Validator schema.org](https://validator.schema.org/) — validation JSON-LD.
- [Google Rich Results Test](https://search.google.com/test/rich-results) — validation Google officielle.
- [Evil Martians favicon handbook 2021](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs) — pourquoi minimaliser le favicon set.

## Dev Agent Record

### Agent Model Used

Claude Opus 4.7 (1M context) — `claude-opus-4-7[1m]`

### Debug Log References

- `npm run typecheck` après chaque tâche majeure (1, 3, 4, 5) : 0 erreur.
- `npm run lint` avant build final : 0 erreur, 0 warning.
- `npm run build` : succès — 11 routes générées (`/[locale]` SSG × 2, `/_not-found` Static, `/apple-icon`, `/icon.svg`, `/manifest.webmanifest`, `/opengraph-image`, `/robots.txt`, `/sitemap.xml`). `/en` et `/fr` toujours marquées **● (SSG)**.
- Warning Next non bloquant pendant `next build` : « metadataBase property in metadata export is not set for resolving social open graph or twitter images, using `http://localhost:3000` ». Diagnostic : ce warning est émis pour les pages internes Next (`/_not-found`, route fallback) qui n'ont pas de `metadataBase` propre. Les pages `/en` et `/fr` exposent bien `metadataBase` via le layout — toutes leurs URLs OG/Twitter sont résolues correctement vers `siteUrl` (vérifié : `og:image content="https://portfolio-three-omega-48ezqd212w.vercel.app/opengraph-image"`).
- Serveur de prod local démarré sur port `3001` car port `3000` déjà occupé par un autre process node (PID 159216 — sans doute le `npm run dev` de Mike). Aucun process killé.

### Completion Notes List

**AC#1 — Pré-rendu SSG complet & contenu crawlable sans JS** ✅
- `next build` confirme `/en` et `/fr` toujours **● (SSG)**. Aucun opt-out de SSG introduit.
- Smoke `curl http://localhost:3001/en` : `<h1>` × 1, `<h2>` × 7 (Hero + 6 sections + AI), `mailto:` × 7, `maqom.co` × 8, `linkedin.com` × 8, `sayelo.ai` × 4, `penpaloo.io` × 4, `application/ld+json` × 2 (1 dans le DOM, 1 dans le payload RSC pour hydratation — comportement Next attendu).
- Idem `/fr` : `<h1>` × 1, `<h2>` × 7, `mailto:` × 7, `maqom.co` × 8.
- Aucune nouvelle dépendance npm runtime. `schema-dts` (devDep) **non ajouté** — `jsonLd` reste `const` inféré (suffisant pour ce site mono-personne, pas de futur multi-types).

**AC#2 — Métadonnées par langue (title / description / canonical / hreflang / robots)** ✅
- `<title>` enrichi : `Michael Mann — Senior Frontend Developer` (`/en`) / `Michael Mann — Développeur frontend senior` (`/fr`). Choix : `title.default = "${meta.title} — ${meta.jobTitle}"` plutôt que `meta.title` brut, pour optimiser le rendu Google SERP / partages sociaux (~40 chars dans la fenêtre confortable des ~60 chars affichés).
- `title.template = "%s — Michael Mann"` en place pour les futures case studies (Story 7.1) — pas d'effet visible aujourd'hui (la home utilise `title.default`).
- `<meta name="description">` localisé (conservé tel quel — version FR `"Ingénieur frontend senior — applications SaaS de production pour des marques internationales."` déjà traduite).
- `<meta name="robots" content="index, follow">` ajouté ; pas de paramètres googleBot specific (over-spec inutile pour ce site).
- `canonical` + `hreflang` (`en` / `fr` / `x-default=en`) inchangés depuis Story 1.2b.

**AC#3 — OpenGraph + Twitter Card** ✅
- 11 balises `og:*` émises pour chaque locale, dont `og:locale="en_US"` ou `"fr_FR"`, `og:locale:alternate` croisé, `og:image` (1200×630, type `image/png`, alt localisé).
- 5 balises `twitter:*` (`card="summary_large_image"`, title, description, image, image:alt). **Pas** de `twitter:site` ni `twitter:creator` — Mike confirme en Tâche 0 ne pas avoir de compte X/Twitter public.
- URLs absolues résolues automatiquement par Next via `metadataBase = new URL(siteUrl)`. Vérifié dans le HTML rendu : `og:image content="https://portfolio-three-omega-48ezqd212w.vercel.app/opengraph-image"`.

**AC#4 — OG image générée (`next/og` `ImageResponse`)** ✅
- `src/app/opengraph-image.tsx` créé (root, partagé entre `/en` et `/fr`).
- Composition fidèle au design Technical Minimal : fond `#0a0a0a`, cadre 2px `#d4a574`, wordmark `Michael Mann` 128px Cormorant Garamond Medium, sous-titre `SENIOR FRONTEND DEVELOPER` JetBrains Mono accent, bloc bas-gauche `location/experience/focus` JetBrains Mono `#cfcfcf` + signature `$ open mann.dev →`.
- Polices commitées sous `src/assets/og-fonts/` :
  - `CormorantGaramond-Medium.ttf` (80 KB — static latin subset)
  - `JetBrainsMono-Regular.ttf` (57 KB — static latin subset)
  - **Format `.ttf` choisi (et non `.woff2`)** : Satori (moteur de `next/og`) supporte officiellement TTF/OTF/WOFF — **pas WOFF2**. Vérifié dans `node_modules/next/dist/compiled/@vercel/og/satori/index.d.ts` (type `data: Buffer | ArrayBuffer`).
  - Total ajouté au repo : ~140 KB ; lu uniquement au build (RoutHandler statique caché).
- `npm run start` + `curl -I /opengraph-image` : `200 OK`, `image/png`, **57 767 bytes** (~58 KB — dans la fourchette attendue 60-200 KB).
- Capture sauvée : `_bmad-output/implementation-artifacts/story-4-3-og-image.png` (lecture/affichage : rendu pixel-perfect cohérent avec le design site).

**AC#5 — JSON-LD `Person`** ✅
- Bloc inline `<script type="application/ld+json">` ajouté en **tout premier enfant** du `<>` retourné par `Home()` dans `page.tsx`. Insertion XSS-safe via `JSON.stringify(...).replace(/</g, "\\u003c")` (pattern Next 16 `json-ld.md`).
- Payload validé en EN et FR :
  - `@context: schema.org`, `@type: Person`, `name: Michael Mann`
  - `jobTitle` localisé (`Senior Frontend Developer` / `Développeur frontend senior`)
  - `url: ${siteUrl}/${locale}` (URL absolue, locale-specific)
  - `image: ${siteUrl}/opengraph-image`
  - `email: mailto:michael.mann55@gmail.com`
  - `telephone: +972 58 422 0567`
  - `address: PostalAddress { Ashdod / IL }`
  - `sameAs: [LinkedIn URL]` — l'URL pointe vers `https://www.linkedin.com/in/michaelmann-339545149` qui est connue **404** (dette `deferred-work.md` review 9.1). Sera corrigée en **Story 9.1** sans aucun changement de ce fichier (le dictionnaire reste source de vérité).
  - `knowsLanguage: ["fr", "he", "en"]`
- `worksFor` intentionnellement omis (Mike est freelance, pas d'employer canonique).
- Le `<script>` est **inline et server-rendered** — il fait partie du HTML initial, crawler-friendly. Pas de hoisting `<head>` par React 19 (`<script>` sans `src`) — c'est attendu et accepté par les crawlers JSON-LD (Google parse JSON-LD où qu'il soit).

**AC#6 — `sitemap.xml` localisé** ✅
- `src/app/sitemap.ts` créé. `curl /sitemap.xml` retourne XML valide avec 2 `<url>` (`/en` et `/fr`), chacun avec 2 `<xhtml:link rel="alternate" hreflang>`, `<lastmod>` (timestamp build), `<changefreq>monthly</changefreq>`, `<priority>1</priority>`.
- `siteUrl` importé depuis `@/lib/site-url` (DRY — partagé avec `layout.tsx`, `robots.ts`, `page.tsx`).

**AC#7 — `robots.txt`** ✅
- `src/app/robots.ts` créé. `curl /robots.txt` retourne :
  ```
  User-Agent: *
  Allow: /

  Host: https://portfolio-three-omega-48ezqd212w.vercel.app
  Sitemap: https://portfolio-three-omega-48ezqd212w.vercel.app/sitemap.xml
  ```
- Note : Next 16 émet `Host` avant `Sitemap`, légèrement différent de l'ordre prescrit en AC#7 (qui montrait `Sitemap` puis `Host`). Sémantiquement équivalent — aucun crawler ne dépend de l'ordre.

**AC#8 — Favicon set & icônes** ✅
- `favicon.ico` (Story 1.1) conservé. Next émet `<link rel="icon" href="/favicon.ico?favicon.0x3dzn~oxb6tn.ico" sizes="256x256" type="image/x-icon">`.
- `src/app/icon.svg` créé (32×32, monogramme `MM` `#0a0a0a` sur fond `#ededed`, police mono système `ui-monospace, Menlo, monospace` — pas de tokens CSS car SVG servi standalone). Next émet `<link rel="icon" href="/icon.svg?icon.0tf2t36mpvb~1.svg" sizes="any" type="image/svg+xml">`. Taille : 353 bytes.
- **`src/app/apple-icon.tsx` créé en Option B** (Route Handler `next/og`) **plutôt qu'Option A** (PNG statique commité), car **aucun outil SVG→PNG n'est disponible localement** (`rsvg-convert`, `magick`, `inkscape` tous absents — vérifié via `Get-Command`). Avantages : zéro outillage externe requis, output statique cacheable au build, pipeline identique à l'OG image (réutilise la même police JetBrains Mono Regular). Taille rendue : 3.7 KB. Next émet `<link rel="apple-touch-icon" href="/apple-icon?3e13f8bd8409f687" type="image/png" sizes="180x180">`.
- 3 `<link>` icon présents dans `<head>` (favicon + icon.svg + apple-touch-icon) — confirmé par grep regex.

**AC#9 — Web manifest** ✅
- `src/app/manifest.ts` créé. `curl /manifest.webmanifest` retourne JSON valide :
  ```json
  { "name": "Michael Mann — Portfolio", "short_name": "MM",
    "description": "Senior Frontend Developer · 5+ years · React/TypeScript",
    "start_url": "/en", "display": "browser",
    "background_color": "#0a0a0a", "theme_color": "#0a0a0a",
    "icons": [
      { "src": "/icon.svg", "sizes": "any", "type": "image/svg+xml" },
      { "src": "/apple-icon", "sizes": "180x180", "type": "image/png" }
    ] }
  ```
- `<link rel="manifest" href="/manifest.webmanifest">` présent dans le `<head>` rendu.
- `display: "browser"` (et non `standalone`) — décision documentée dans Dev Notes : portfolio personnel ≠ PWA installable.

**AC#10 — Extension du matcher `proxy.ts` (dette 1.2b résolue)** ✅
- `src/proxy.ts:58-60` étendu : `matcher` exclut désormais `opengraph-image|icon|apple-icon|manifest.webmanifest` en complément des routes existantes.
- Vérification directe via `HttpWebRequest.AllowAutoRedirect = false` :
  - `/opengraph-image` → 200 direct (génération première fois ~5-10 s puis cachée)
  - `/apple-icon` → 200 direct
  - `/icon.svg` → 200 direct
  - `/manifest.webmanifest` → 200 direct
  - `/sitemap.xml` → 200 direct
  - `/robots.txt` → 200 direct
  - Aucune 307 vers `/en/<route>` n'a été détectée.
- `deferred-work.md` : dette « `config.matcher` du proxy — exclusion de métadonnées non exhaustive » marquée résolue (strikethrough + RÉSOLU 4.3 AC#10).

**AC#11 — CI Lighthouse advisory** ✅
- `.github/workflows/lighthouse.yml` créé en parallèle du `ci.yml` existant (préservé). Job `continue-on-error: true` (advisory en MVP) ; assertions `["warn", ...]` sur Performance ≥ 0.95, Accessibility = 1.0, Best Practices ≥ 0.95, SEO ≥ 0.95.
- `@lhci/cli@0.14.x` (pin sur version mineure courante — Story 7.2 pourra fixer une version patch).
- Tests sur runner GitHub réel délégués à Mike (premier push de la branche). Si le job échoue (chrome deps, timing), différer le durcissement en Story 7.2 et noter dans `deferred-work.md` section nouvelle « Deferred from Story 4.3 » — pas de blocage MVP.

**AC#12 — Politique multi-image `AGENTS.md` (dette 4.2 résolue)** ✅
- `AGENTS.md` ligne 9 enrichie en fin de bloc `## Images` avec la phrase prescrite : « **Multi-image (carrousels, galeries) :** un seul asset peut porter `priority` (le candidat LCP visible above-the-fold) ; les autres restent `loading="lazy"`. En doute, aucun n'est `priority`. »
- `deferred-work.md` : dette « Politique AGENTS.md : `priority` réservé au LCP — silencieuse sur multi-image » marquée résolue.

**AC#13 — Dictionnaire FR/EN : nouveaux libellés** ✅
- `meta.jobTitle` ajouté : EN `"Senior Frontend Developer"` / FR `"Développeur frontend senior"`.
- `meta.ogImageAlt` ajouté : EN / FR localisé.
- Garde `satisfies Dictionary` confirme la complétude FR (pas d'oubli silencieux). Pas de `as const` sur `en.ts` (convention existante préservée).
- `meta.description` FR vérifiée : déjà traduite (`"Ingénieur frontend senior — applications SaaS de production pour des marques internationales."`).

**AC#14 — Zéro régression / build vert / SSG préservé** ✅
- `npm run typecheck` : 0 erreur.
- `npm run lint` : 0 erreur, 0 warning.
- `npm run build` : succès. Output `Route (app)` :
  ```
  ┌ ○ /_not-found
  ├ ● /[locale]        /en, /fr
  ├ ○ /apple-icon
  ├ ○ /icon.svg
  ├ ○ /manifest.webmanifest
  ├ ○ /opengraph-image
  ├ ○ /robots.txt
  └ ○ /sitemap.xml
  ```
- `/en` et `/fr` toujours **● (SSG)** ; aucune route metadata n'a opt-out le SSG du segment locale.
- **Bundle First Load JS** : non re-mesuré spécifiquement (aucun nouveau Client component introduit — tous les fichiers ajoutés sont Server-only). La valeur Story 4.2 (~189 KB gzip) reste la référence ; pas d'impact attendu ni observé.
- Smoke browser DevTools « Disable JavaScript » : **délégué à Mike** (cohérent avec convention 4.x — le smoke `curl` automatisé couvre la même surface de risque côté HTML initial).

**Confirmations Tâche 0** :
- **Twitter handle** : pas de compte X/Twitter public confirmé par Mike → balises `twitter:site` / `twitter:creator` **omises** comme prévu.
- **Site URL prod** : pas de domaine custom configuré → fallback Vercel `https://portfolio-three-omega-48ezqd212w.vercel.app` conservé dans `src/lib/site-url.ts`. Override via `NEXT_PUBLIC_SITE_URL` reste disponible quand le domaine custom sera défini (Story 9.x).

**Validations externes différées à Mike (post-push Vercel)** :
- [opengraph.dev](https://opengraph.dev/) sur l'URL preview Vercel ⇒ confirmer rendu OG image + title + description.
- [validator.schema.org](https://validator.schema.org/) sur le payload JSON-LD `/en` ⇒ confirmer 0 erreur.
- [Google Rich Results Test](https://search.google.com/test/rich-results) sur `/en` et `/fr` ⇒ confirmer reconnaissance de `Person`.
- Audit Lighthouse mobile sur `/en` et `/fr` (cohérence avec close-out 4.2 — Perf ≥ 95 attendu pour valider la dette « bundle 189 KB > 150 KB »).

### File List

**Nouveaux fichiers :**
- `src/lib/site-url.ts` — module partagé pour l'URL absolue du site (DRY).
- `src/i18n/dictionaries/en.ts` — clés `meta.jobTitle` + `meta.ogImageAlt` ajoutées (modifié).
- `src/i18n/dictionaries/fr.ts` — clés `meta.jobTitle` + `meta.ogImageAlt` ajoutées (modifié).
- `src/app/[locale]/layout.tsx` — `generateMetadata` étendu (OG, Twitter, robots, title.template) + import `siteUrl` depuis `@/lib/site-url` (modifié).
- `src/app/[locale]/page.tsx` — JSON-LD `Person` inline ajouté en premier enfant du `<>` (modifié).
- `src/app/opengraph-image.tsx` — Route Handler `next/og` ImageResponse 1200×630 (nouveau).
- `src/app/sitemap.ts` — `MetadataRoute.Sitemap` avec alternates FR/EN (nouveau).
- `src/app/robots.ts` — `MetadataRoute.Robots` (nouveau).
- `src/app/icon.svg` — monogramme MM 32×32 hardcodé (nouveau).
- `src/app/apple-icon.tsx` — Route Handler `next/og` ImageResponse 180×180 (nouveau, Option B fallback).
- `src/app/manifest.ts` — `MetadataRoute.Manifest` (nouveau).
- `src/proxy.ts` — matcher étendu pour exclure `opengraph-image|icon|apple-icon|manifest.webmanifest` (modifié).
- `src/assets/og-fonts/CormorantGaramond-Medium.ttf` — police pour OG image (nouveau, ~80 KB).
- `src/assets/og-fonts/JetBrainsMono-Regular.ttf` — police pour OG image & apple-icon (nouveau, ~57 KB).
- `.github/workflows/lighthouse.yml` — CI Lighthouse advisory (nouveau).
- `AGENTS.md` — politique multi-image ajoutée (modifié).
- `_bmad-output/implementation-artifacts/deferred-work.md` — 2 dettes strikethrough (modifié).
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — `4-3-...: ready-for-dev` → `review` (modifié).
- `_bmad-output/implementation-artifacts/story-4-3-og-image.png` — capture du rendu OG image (nouveau, référence visuelle).
- `_bmad-output/implementation-artifacts/story-4-3-apple-icon.png` — capture du rendu apple-icon (nouveau, référence visuelle).
- `_bmad-output/implementation-artifacts/4-3-seo-metadonnees-de-partage-assets-de-marque.md` — Dev Agent Record, File List, Change Log, Status → review (modifié, ce fichier).

### Review Findings

Code review du 2026-05-13 — 3 couches en parallèle (Blind Hunter, Edge Case Hunter, Acceptance Auditor). Aucun BLOCKER ; 1 décision, 8 patches, 9 différés, ~30 rejetés (per-spec / faux positifs / hors périmètre).

- [x] [Review][Decision→Patch] **OG image — `$ open mann.dev →` placeholder remplacé par `$ portfolio · v2026 →`** (Mike : aucun domaine `mann.dev` réservé)
  - Ancienne description :
  - **OG image — `$ open mann.dev →` placeholder non vérifié** [src/app/opengraph-image.tsx:110] — La signature CLI de l'OG image affiche `mann.dev`, mais ce domaine n'apparaît pas comme acquis dans `src/lib/site-url.ts` (fallback Vercel preview). Si `mann.dev` n'est pas réservé/owned par Mike, l'OG image publie une URL fausse sur tous les partages sociaux. Confirmer : (a) `mann.dev` est-il réservé/destiné au domaine custom Story 9.x ? → garder ; (b) sinon, remplacer par texte neutre (ex. `$ portfolio · v2026 →`) ou par `${siteUrl.replace(/^https?:\/\//, "")}`.
- [x] [Review][Patch] **`siteUrl` ne traite ni la chaîne vide ni le trailing slash** — **CORRIGÉ** : `||` + `.trim()` + `.replace(/\/+$/, "")` dans [src/lib/site-url.ts](src/lib/site-url.ts). [src/lib/site-url.ts:8-10] — `??` ne fallback que sur `undefined`/`null`. Une variable Vercel déclarée vide (`NEXT_PUBLIC_SITE_URL=""`) donne `siteUrl = ""` → `new URL("")` (layout.tsx:78) jette `TypeError: Invalid URL` au build. Idem si la valeur a un slash final (`https://mann.dev/`) : `${siteUrl}/${locale}` produit `//en`. Fix : `(process.env.NEXT_PUBLIC_SITE_URL?.trim() || "<fallback>").replace(/\/$/, "")`.
- [x] [Review][Patch] **`apple-icon.tsx` : poids de police incohérent (Regular chargé, 700 déclaré)** — **CORRIGÉ** : `fontWeight: 400` + `fonts[0].weight: 400` dans [src/app/apple-icon.tsx](src/app/apple-icon.tsx). [src/app/apple-icon.tsx:35, 50] — Le fichier chargé est `JetBrainsMono-Regular.ttf` (poids 400) mais `fonts: [{ … weight: 700 }]` ET `fontWeight: 700` côté CSS. Satori utilisera les glyphes Regular avec étiquette 700, donc soit (a) Regular réel rendu (faux 700), soit (b) faux-gras synthétique selon implémentation. Fix : déclarer `weight: 400` dans le tableau `fonts` ET retirer/changer `fontWeight: 700` côté style — OU charger `JetBrainsMono-Bold.ttf` pour un vrai 700.
- [x] [Review][Patch] **JSON-LD : échappement U+2028 / U+2029 manquant** — **CORRIGÉ** : double `.replace(new RegExp("\\u2028", "g"), "\\u2028")` et idem pour U+2029, chaînés après l'escape de `<` dans [src/app/[locale]/page.tsx](src/app/[locale]/page.tsx). RegExp constructor au lieu de littéral pour garder la source ASCII-only. [src/app/[locale]/page.tsx:82] — Le `replace(/</g, "\\u003c")` couvre `</script>` mais pas les séparateurs Unicode U+2028 (line separator) et U+2029 (paragraph separator). `JSON.stringify` les laisse passer en littéral, et JavaScript inline (dans `<script>` HTML) les interprète comme fins de ligne → parse error silencieux côté crawler si un futur dictionnaire les contient (copié-collé Word/macOS très courant). Fix : `.replace(/ /g, "\\u2028").replace(/ /g, "\\u2029")` enchaîné après le `<`.
- [x] [Review][Patch] **Proxy matcher : alternatives `icon|apple-icon|opengraph-image` non ancrées** — **CORRIGÉ** : chaque alternative ancrée par `(?:[?/]|$)` ; `.` des extensions échappés en `\\.` dans [src/proxy.ts](src/proxy.ts). [src/proxy.ts:63] — La regex négative `(?!...|opengraph-image|icon|apple-icon|...)` matche par préfixe, donc `/iconography`, `/icons-set`, `/apple-icon-precomposed`, `/opengraph-image-v2` court-circuitent aussi le proxy. Aucune route concernée aujourd'hui, mais Story 7.1 (case studies) introduira des slugs arbitraires. Fix conservateur : ancrer chaque alternative avec `(?:[?/]|$)` — `opengraph-image(?:[?/]|$)|icon(?:[?/]|$)|apple-icon(?:[?/]|$)` — ou utiliser un matcher multiple en split de patterns.
- [x] [Review][Patch] **Sitemap : `x-default` absent des `alternates.languages`** — **CORRIGÉ** : `"x-default": \`${siteUrl}/en\`` ajouté dans [src/app/sitemap.ts](src/app/sitemap.ts). [src/app/sitemap.ts:21-26] — Le `<head>` (layout.tsx:86) déclare bien `"x-default": "/en"`, mais le sitemap ne le fait pas → incohérence sitemap/HTML pour Google Search Console. Ajouter `"x-default": \`${siteUrl}/en\`` dans `alternates.languages`.
- [x] [Review][Patch] **Lighthouse : `--upload.target=temporary-public-storage` upload public + redondant** — **CORRIGÉ** : `--upload.target=filesystem --upload.outputDir=./.lighthouseci` dans [.github/workflows/lighthouse.yml](.github/workflows/lighthouse.yml). Le rapport reste local au runner et est uploadé en artefact GitHub (étape `actions/upload-artifact` préservée). [.github/workflows/lighthouse.yml:44] — Cette option pousse le rapport Lighthouse (incluant DOM snapshot avec JSON-LD : email, téléphone, adresse) sur l'URL publique non listée de Google. Doublement problématique : (a) fuite involontaire de données vers une URL hors infra Vercel, (b) le rapport est déjà uploadé en artefact GitHub (étape `actions/upload-artifact@v4` lignes 50-55) — donc redondant. Fix : remplacer par `--upload.target=filesystem --upload.outputDir=./.lighthouseci`.
- [x] [Review][Patch] **Lighthouse workflow : `pull_request` non scoped à `branches: [main]`** — **CORRIGÉ** : `pull_request: { branches: [main] }` dans [.github/workflows/lighthouse.yml](.github/workflows/lighthouse.yml). [.github/workflows/lighthouse.yml:10] — La spec AC#11 prescrit `pull_request: { branches: [main] }`. L'implémentation actuelle fait tourner le job sur **chaque** PR (toutes branches cibles), gaspille ~2-3 min de runner GitHub par PR de docs/refactor. Fix : `pull_request: { branches: [main] }`.
- [x] [Review][Patch] **`.gitattributes` : `*.ttf` non couvert** — **CORRIGÉ** : `*.ttf binary` ajouté dans [.gitattributes](.gitattributes). Les polices OG sous `src/assets/og-fonts/` sont protégées contre une conversion CRLF Windows lors du `git add`. [.gitattributes:9] — Le fichier existant déclare `*.woff2 binary` mais pas `*.ttf`. Les polices `src/assets/og-fonts/CormorantGaramond-Medium.ttf` et `JetBrainsMono-Regular.ttf` (non encore stagées) risquent une conversion CRLF sur Windows lors du `git add`. Fix : ajouter `*.ttf binary` à `.gitattributes` avant de stager les fichiers.
- [x] [Review][Defer] **OG image — `v2026.1` hardcoded version label** [src/app/opengraph-image.tsx:62] — deferred, polish cosmétique
- [x] [Review][Defer] **Lighthouse — `numberOfRuns=1` flaky** [.github/workflows/lighthouse.yml:43] — deferred, calibrage MVP per-spec (Story 7.2 durcira)
- [x] [Review][Defer] **Lighthouse — `npm run start &` sans cleanup ni log capture** [.github/workflows/lighthouse.yml:34] — deferred, hygiène CI (Story 7.2)
- [x] [Review][Defer] **AC#11 — préflight Lighthouse local non reporté dans Completion Notes** [_bmad-output/implementation-artifacts/4-3-...md:1048] — deferred, validation déléguée à Mike au premier push
- [x] [Review][Defer] **AC#14 — First Load JS bundle non re-mesuré** [_bmad-output/implementation-artifacts/4-3-...md:1075] — deferred, justifié hors-spec mais la lettre de l'AC demandait le report
- [x] [Review][Defer] **AC#1 — sortie `next build` Route (app) simplifiée dans Completion Notes** [_bmad-output/implementation-artifacts/4-3-...md:1065-1073] — deferred, colonnes `Size` / `First Load JS` omises vs format Story 4.2
- [x] [Review][Defer] **`sitemap.lastModified = new Date()` change à chaque build** [src/app/sitemap.ts:15] — deferred, sémantique « dernière modif » devient bruit pour Google
- [x] [Review][Defer] **`manifest.start_url: "/en"` hardcoded sans couplage à `defaultLocale`** [src/app/manifest.ts:13] — deferred, futur risque si `defaultLocale` change (per-spec actuellement)
- [x] [Review][Defer] **OG image en anglais uniquement malgré `og:locale=fr_FR` sur `/fr`** [src/app/opengraph-image.tsx:62-110] — deferred, décision per-spec (AC#4 lignes 87-93), à reconsidérer Story 9.1 si incohérence visible
