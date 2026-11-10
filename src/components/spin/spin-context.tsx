"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import type { SpinCountry } from "@/lib/spin";

/** A pick that the globe is still travelling to. */
export interface PendingSpin {
  /** The country that was picked. */
  code: string;
  /** The country on screen when the spin started, or null on the home page. */
  from: string | null;
}

interface SpinContextValue {
  countries: SpinCountry[];
  pending: PendingSpin | null;
  setPending: (pending: PendingSpin | null) => void;
  /** Code of the country a spin has just navigated to, until its page picks it up. */
  arrivalRef: RefObject<string | null>;
}

const SpinContext = createContext<SpinContextValue | null>(null);

export function SpinProvider({
  countries,
  children,
}: {
  countries: SpinCountry[];
  children: ReactNode;
}) {
  const [pending, setPending] = useState<PendingSpin | null>(null);
  const arrivalRef = useRef<string | null>(null);
  const value = useMemo(
    () => ({ countries, pending, setPending, arrivalRef }),
    [countries, pending],
  );
  return <SpinContext.Provider value={value}>{children}</SpinContext.Provider>;
}

export function useSpin(): SpinContextValue {
  const value = useContext(SpinContext);
  if (!value) throw new Error("useSpin must be used inside SpinProvider");
  return value;
}
