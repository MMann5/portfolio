"use client";

import type { ReactNode } from "react";
import { useScrollFadeIn } from "@/hooks/useScrollFadeIn";

type Props = {
  children: ReactNode;
  className?: string;
};

export function FadeIn({ children, className = "" }: Props) {
  const { ref, visible } = useScrollFadeIn<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } ${className}`}
    >
      {children}
    </div>
  );
}
