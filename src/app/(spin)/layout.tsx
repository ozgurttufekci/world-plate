import { Suspense } from "react";
import { SpinProvider } from "@/components/spin/spin-context";
import { SpinPanel, SpinPanelFallback } from "@/components/spin/spin-panel";
import { countries } from "@/data/countries";
import type { SpinCountry } from "@/lib/spin";

// Only what the globe and the picker need crosses to the browser here.
const spinCountries: SpinCountry[] = countries.map((c) => ({
  code: c.code,
  name: c.name,
  dish: c.dish,
  numeric: c.numeric,
  lat: c.lat,
  lng: c.lng,
  region: c.region,
  method: c.method,
  course: c.course,
  difficulty: c.difficulty,
  minutes: c.minutes,
}));

export default function SpinLayout({ children }: LayoutProps<"/">) {
  return (
    <SpinProvider countries={spinCountries}>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          {/* Reads the URL (country and filters), so it renders behind Suspense. */}
          <Suspense fallback={<SpinPanelFallback />}>
            <SpinPanel />
          </Suspense>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </SpinProvider>
  );
}
