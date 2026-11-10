"use client";

import { Check, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterBar } from "@/components/spin/filter-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  COURSE_LABELS,
  DIFFICULTY_LABELS,
  METHOD_LABELS,
  REGIONS,
  type Course,
  type Difficulty,
  type Method,
  type Region,
} from "@/data/schema";
import { EMPTY_FILTERS, activeFilterCount, matchesFilters } from "@/lib/filters";
import { countryPath, formatMinutes } from "@/lib/format";
import { useMade } from "@/lib/storage";
import { useUrlFilters } from "@/lib/use-url-filters";
import { cn } from "@/lib/utils";

export interface BrowseItem {
  code: string;
  name: string;
  flag: string;
  region: Region;
  dish: string;
  localName?: string;
  method: Method;
  course: Course;
  difficulty: Difficulty;
  minutes: number;
  thumb: { url: string; width: number; height: number } | null;
}

/** Lower-cases and strips accents, so "pao" finds "Pão de queijo". */
function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function Card({ item, made }: { item: BrowseItem; made: boolean }) {
  return (
    <li className="min-w-0">
      <Link
        href={countryPath(item.code)}
        className="group flex h-full gap-3 rounded-2xl border bg-card p-2.5 transition-colors outline-none hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          {item.thumb ? (
            <Image
              src={item.thumb.url}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex size-full items-center justify-center text-3xl" aria-hidden>
              {item.flag}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 py-0.5">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span aria-hidden>{item.flag}</span>
            <span className="truncate">{item.name}</span>
            {made && (
              <span className="ml-auto inline-flex shrink-0 items-center gap-0.5 rounded-full bg-emerald-700 px-1.5 py-0.5 text-xs font-medium text-white">
                <Check className="size-3" aria-hidden />
                Made
              </span>
            )}
          </p>
          <p className="truncate font-semibold group-hover:text-primary">{item.dish}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {METHOD_LABELS[item.method]} · {COURSE_LABELS[item.course]} ·{" "}
            {DIFFICULTY_LABELS[item.difficulty]} · {formatMinutes(item.minutes)}
          </p>
        </div>
      </Link>
    </li>
  );
}

export function BrowseList({ items }: { items: BrowseItem[] }) {
  const [filters, setFilters] = useUrlFilters();
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const made = useMade();

  const madeSet = useMemo(() => new Set(made), [made]);
  const madeCount = items.filter((i) => madeSet.has(i.code)).length;
  const activeFilters = activeFilterCount(filters);

  const visible = useMemo(() => {
    const q = fold(query.trim());
    return items.filter(
      (i) =>
        matchesFilters(i, filters) &&
        (q === "" ||
          fold(i.name).includes(q) ||
          fold(i.dish).includes(q) ||
          (i.localName !== undefined && fold(i.localName).includes(q))),
    );
  }, [items, filters, query]);

  const groups = REGIONS.map((region) => ({
    region,
    items: visible.filter((i) => i.region === region),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a country or dish"
          aria-label="Search a country or dish"
          className="h-10 sm:max-w-xs"
        />
        <Button
          variant="outline"
          className="h-10 gap-1.5 self-start"
          aria-expanded={filtersOpen}
          aria-controls="browse-filters"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <SlidersHorizontal aria-hidden />
          Filters{activeFilters > 0 ? ` (${activeFilters})` : ""}
        </Button>
        <p className="text-sm text-muted-foreground sm:ml-auto" role="status">
          {visible.length === items.length
            ? `${items.length} countries`
            : `${visible.length} of ${items.length} countries`}
          {madeCount > 0 && ` · you've made ${madeCount}`}
        </p>
      </div>

      <div
        id="browse-filters"
        className={cn("rounded-2xl border bg-card p-4", !filtersOpen && "hidden")}
      >
        <FilterBar filters={filters} onChange={setFilters} />
        {activeFilters > 0 && (
          <button
            type="button"
            className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            onClick={() => setFilters(EMPTY_FILTERS)}
          >
            Clear filters
          </button>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
          Nothing matches. Try a different search or loosen a filter.
        </p>
      ) : (
        groups.map((group) => (
          <section key={group.region} aria-labelledby={`region-${group.region}`}>
            <h2
              id={`region-${group.region}`}
              className="mb-3 text-lg font-semibold tracking-tight"
            >
              {group.region}{" "}
              <span className="text-sm font-normal text-muted-foreground">
                {group.items.length}
              </span>
            </h2>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <Card key={item.code} item={item} made={madeSet.has(item.code)} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
