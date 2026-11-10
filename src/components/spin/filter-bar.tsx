"use client";

import { cn } from "@/lib/utils";
import {
  COURSES,
  COURSE_LABELS,
  DIFFICULTIES,
  DIFFICULTY_LABELS,
  METHODS,
  METHOD_HINTS,
  METHOD_LABELS,
  REGIONS,
  TIME_CAPS,
  TIME_CAP_LABELS,
} from "@/data/schema";
import { toggleValue, type Filters } from "@/lib/filters";

function Chip({
  pressed,
  onClick,
  title,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        pressed
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

export function FilterBar({
  filters,
  onChange,
  className,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <Group label="Method">
        {METHODS.map((m) => (
          <Chip
            key={m}
            pressed={filters.methods.includes(m)}
            title={METHOD_HINTS[m]}
            onClick={() =>
              onChange({ ...filters, methods: toggleValue(filters.methods, m) })
            }
          >
            {METHOD_LABELS[m]}
          </Chip>
        ))}
      </Group>
      <Group label="Course">
        {COURSES.map((c) => (
          <Chip
            key={c}
            pressed={filters.courses.includes(c)}
            onClick={() =>
              onChange({ ...filters, courses: toggleValue(filters.courses, c) })
            }
          >
            {COURSE_LABELS[c]}
          </Chip>
        ))}
      </Group>
      <Group label="Difficulty">
        {DIFFICULTIES.map((d) => (
          <Chip
            key={d}
            pressed={filters.difficulties.includes(d)}
            onClick={() =>
              onChange({
                ...filters,
                difficulties: toggleValue(filters.difficulties, d),
              })
            }
          >
            {DIFFICULTY_LABELS[d]}
          </Chip>
        ))}
      </Group>
      <Group label="Time, start to finish">
        <Chip
          pressed={filters.maxMinutes === null}
          onClick={() => onChange({ ...filters, maxMinutes: null })}
        >
          Any
        </Chip>
        {TIME_CAPS.map((cap) => (
          <Chip
            key={cap}
            pressed={filters.maxMinutes === cap}
            onClick={() =>
              onChange({
                ...filters,
                maxMinutes: filters.maxMinutes === cap ? null : cap,
              })
            }
          >
            Up to {TIME_CAP_LABELS[cap]}
          </Chip>
        ))}
      </Group>
      <Group label="Region">
        {REGIONS.map((r) => (
          <Chip
            key={r}
            pressed={filters.regions.includes(r)}
            onClick={() =>
              onChange({ ...filters, regions: toggleValue(filters.regions, r) })
            }
          >
            {r}
          </Chip>
        ))}
      </Group>
    </div>
  );
}
