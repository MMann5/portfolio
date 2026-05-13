"use client";

import dynamic from "next/dynamic";

// `next/dynamic({ ssr: false })` is forbidden inside a Server Component since Next 15
// (confirmed in `node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md`). This
// wrapper carries the `'use client'` boundary so `layout.tsx` (a Server Component)
// can stay server-rendered. The bundle is split into an async chunk and the cursor
// never appears in the prerendered HTML (AC #6 / NFR3).
const CustomCursor = dynamic(
  () => import("./CustomCursor").then((m) => m.CustomCursor),
  { ssr: false },
);

export function CursorMount() {
  return <CustomCursor />;
}
