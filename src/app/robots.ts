import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// `robots.txt` MVP — site 100 % public (pas de `/admin`, pas de `/api`, pas de
// pages privées) → aucun `Disallow`. `host` est une préférence de canonical host
// pour Bing/Yandex ; Google l'ignore mais ça ne nuit pas.
// Route Handler caché statiquement par défaut (cf. doc Next 16 `robots.md`).

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
