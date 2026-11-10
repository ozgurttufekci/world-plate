"use client";

import { Dices, SlidersHorizontal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { startTransition, useMemo, useState } from "react";
import { Globe, GlobePlaceholder } from "@/components/globe/globe";
import { Button } from "@/components/ui/button";
import {
  EMPTY_FILTERS,
  activeFilterCount,
  matchesFilters,
  withFilters,
} from "@/lib/filters";
import { countryPath, flagOf } from "@/lib/format";
import { pickCountry } from "@/lib/picker";
import { SPIN_MS } from "@/lib/spin";
import { seenStore, useSeen } from "@/lib/storage";
import { useUrlFilters } from "@/lib/use-url-filters";
import { cn } from "@/lib/utils";
import { FilterBar } from "./filter-bar";
import { useSpin } from "./spin-context";

export function SpinPanel() {
  const { countries, pending, setPending, arrivalRef } = useSpin();
  const params = useParams<{ code?: string }>();
  const router = useRouter();
  const [filters, setFilters] = useUrlFilters();
  const seen = useSeen();
  const [notice, setNotice] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const byCode = useMemo(() => new Map(countries.map((c) => [c.code, c])), [countries]);
  const current = (params.code && byCode.get(params.code.toUpperCase())) || null;
  const currentCode = current?.code ?? null;

  const spinning =
    pending !== null && pending.from === currentCode && pending.code !== currentCode;
  const shown = spinning ? (byCode.get(pending.code) ?? null) : current;

  const pool = useMemo(
    () => countries.filter((c) => matchesFilters(c, filters)),
    [countries, filters],
  );
  const seenInPool = useMemo(() => {
    const seenSet = new Set(seen);
    return pool.filter((c) => seenSet.has(c.code)).length;
  }, [pool, seen]);
  const activeFilters = activeFilterCount(filters);

  function spin() {
    const poolCodes = pool.map((c) => c.code);
    const { code, reset } = pickCountry(poolCodes, new Set(seen), currentCode);
    if (!code) return;
    if (code === currentCode) {
      setNotice("Only one country matches these filters, and you're looking at it.");
      return;
    }
    if (reset) {
      seenStore.removeMany(poolCodes);
      setNotice("You've seen every country that matches, so the list starts over.");
    } else {
      setNotice(null);
    }

    const href = withFilters(countryPath(code), filters);
    const startPath = window.location.pathname;
    router.prefetch(href);

    const land = () => {
      // If the user wandered off mid-spin, don't drag them back.
      if (window.location.pathname !== startPath) {
        setPending(null);
        return;
      }
      // Clearing in the same transition keeps the globe on the picked country
      // until the new page has rendered.
      arrivalRef.current = code;
      startTransition(() => {
        router.push(href);
        setPending(null);
      });
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      land();
      return;
    }
    setPending({ code, from: currentCode });
    window.setTimeout(land, SPIN_MS);
  }

  const poolText =
    pool.length === 0
      ? "No country matches these filters. Loosen one to spin."
      : activeFilters === 0
        ? `${countries.length} countries in the pool`
        : `${pool.length} of ${countries.length} countries ${pool.length === 1 ? "matches" : "match"} your filters`;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-72 sm:max-w-80 lg:max-w-none">
        <Globe
          code={shown?.code ?? null}
          numeric={shown?.numeric ?? null}
          lat={shown?.lat ?? 0}
          lng={shown?.lng ?? 0}
          spin={spinning}
          label={shown ? `Globe showing ${shown.name}` : "Slowly turning globe"}
        />
      </div>

      <p className="h-6 text-center text-base font-medium" aria-hidden={spinning}>
        {spinning ? (
          <span className="text-muted-foreground">Spinning…</span>
        ) : current ? (
          <>
            <span className="mr-1.5">{flagOf(current.code)}</span>
            {current.name}
          </>
        ) : (
          <span className="text-muted-foreground">Where to?</span>
        )}
      </p>

      <Button
        size="lg"
        className="h-12 w-full max-w-80 gap-2 rounded-full text-base"
        onClick={spin}
        disabled={pool.length === 0 || spinning}
      >
        <Dices className="size-5!" aria-hidden />
        {current ? "Spin again" : "Spin the globe"}
      </Button>

      <p
        className={cn(
          "text-center text-sm",
          pool.length === 0 ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {poolText}
      </p>

      <p
        role="status"
        className={cn("text-center text-sm", (spinning || !notice) && "sr-only")}
      >
        {spinning ? "Spinning the globe" : notice}
      </p>

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 lg:hidden"
        aria-expanded={filtersOpen}
        aria-controls="spin-filters"
        onClick={() => setFiltersOpen((open) => !open)}
      >
        <SlidersHorizontal aria-hidden />
        Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
      </Button>

      <div
        id="spin-filters"
        className={cn("w-full lg:block", filtersOpen ? "block" : "hidden")}
      >
        <FilterBar filters={filters} onChange={setFilters} />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            {seenInPool === 0
              ? "Countries you've seen won't come up again until the pool runs out."
              : `Seen ${seenInPool} of ${pool.length}; they won't repeat until the pool runs out.`}
          </span>
          <span className="flex gap-3">
            {activeFilters > 0 && (
              <button
                type="button"
                className="underline underline-offset-4 hover:text-foreground"
                onClick={() => setFilters(EMPTY_FILTERS)}
              >
                Clear filters
              </button>
            )}
            {seen.length > 0 && (
              <button
                type="button"
                className="underline underline-offset-4 hover:text-foreground"
                onClick={() => {
                  seenStore.clear();
                  setNotice("History cleared.");
                }}
              >
                Forget history
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Shown while the URL-dependent panel is not rendered yet. */
export function SpinPanelFallback() {
  return (
    <div className="flex flex-col items-center gap-4" aria-hidden>
      <div className="w-full max-w-72 sm:max-w-80 lg:max-w-none">
        <GlobePlaceholder />
      </div>
      <div className="h-6" />
      <div className="h-12 w-full max-w-80 rounded-full bg-muted" />
    </div>
  );
}
