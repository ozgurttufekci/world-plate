"use client";

import { ArrowUp, Check, Link2, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { countryPath } from "@/lib/format";
import { madeStore, seenStore, useMade } from "@/lib/storage";
import { cn } from "@/lib/utils";

/** Records that this country has come up, so later spins skip it. */
export function MarkSeen({ code }: { code: string }) {
  useEffect(() => {
    seenStore.add(code);
  }, [code]);
  return null;
}

export function MadeToggle({ code, dish }: { code: string; dish: string }) {
  const made = useMade().includes(code);
  return (
    <Button
      variant={made ? "default" : "outline"}
      aria-pressed={made}
      className={cn("h-10 gap-2 rounded-full px-4", made && "bg-emerald-700 hover:bg-emerald-700/85")}
      onClick={() => madeStore.toggle(code)}
    >
      <Check aria-hidden className={cn(!made && "opacity-40")} />
      {made ? "Made it" : "Mark as made"}
      <span className="sr-only">: {dish}</span>
    </Button>
  );
}

export function ShareButton({
  code,
  title,
}: {
  code: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    // Share the plain country link, without the sharer's filters.
    const url = new URL(countryPath(code), window.location.origin).toString();
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        // Otherwise fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <Button variant="outline" className="h-10 gap-2 rounded-full px-4" onClick={share}>
      {copied ? <Link2 aria-hidden /> : <Share2 aria-hidden />}
      <span aria-live="polite">{copied ? "Link copied" : "Share"}</span>
    </Button>
  );
}

/** On narrow screens the globe and Spin button sit above the dish; this goes back up. */
export function BackToGlobe() {
  return (
    <Button
      variant="ghost"
      className="mx-auto mt-4 flex h-10 gap-1.5 rounded-full px-4 text-muted-foreground lg:hidden"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      }}
    >
      <ArrowUp aria-hidden />
      Back to the globe
    </Button>
  );
}
