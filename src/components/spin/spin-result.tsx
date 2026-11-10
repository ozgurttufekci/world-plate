"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSpin } from "./spin-context";

/**
 * Wraps the page content next to the globe. While a spin that started from
 * this page is in the air, the old content fades back. On narrow screens,
 * where the content sits below the globe, a spin that lands here scrolls to it.
 */
export function SpinResult({
  code,
  children,
}: {
  /** The country this page shows, or null for the home page. */
  code: string | null;
  children: ReactNode;
}) {
  const { pending, arrivalRef } = useSpin();
  const ref = useRef<HTMLDivElement>(null);
  const leaving = pending !== null && pending.from === code && pending.code !== code;

  useEffect(() => {
    if (code === null || arrivalRef.current !== code) return;
    arrivalRef.current = null;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [code, arrivalRef]);

  return (
    <div
      ref={ref}
      data-spin-result
      aria-busy={leaving}
      className={cn(
        "scroll-mt-4 transition-opacity duration-300 motion-reduce:transition-none",
        leaving && "opacity-35",
      )}
    >
      {children}
    </div>
  );
}
