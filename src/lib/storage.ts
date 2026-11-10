"use client";

import { useSyncExternalStore } from "react";

const EMPTY: readonly string[] = Object.freeze([]);

/**
 * A set of country codes kept in localStorage and shared between components
 * and browser tabs. Reads go through useSyncExternalStore, so the server
 * render and the first client render both see an empty set.
 */
function createCodeStore(key: string) {
  const listeners = new Set<() => void>();
  let cachedRaw: string | null | undefined;
  let cachedValue: readonly string[] = EMPTY;

  function read(): readonly string[] {
    let raw: string | null;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cachedValue;
    }
    if (raw === cachedRaw) return cachedValue;
    cachedRaw = raw;
    cachedValue = EMPTY;
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          cachedValue = parsed.filter((v): v is string => typeof v === "string");
        }
      } catch {
        // Corrupt value: treat as empty.
      }
    }
    return cachedValue;
  }

  function write(next: readonly string[]) {
    const raw = JSON.stringify(next);
    cachedRaw = raw;
    cachedValue = next;
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // Storage unavailable or full: keep the in-memory value for this session.
    }
    listeners.forEach((l) => l());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return {
    subscribe,
    getSnapshot: read,
    getServerSnapshot: () => EMPTY,
    add(code: string) {
      const current = read();
      if (!current.includes(code)) write([...current, code]);
    },
    remove(code: string) {
      const current = read();
      if (current.includes(code)) write(current.filter((c) => c !== code));
    },
    removeMany(codes: readonly string[]) {
      const drop = new Set(codes);
      const current = read();
      const next = current.filter((c) => !drop.has(c));
      if (next.length !== current.length) write(next);
    },
    toggle(code: string) {
      const current = read();
      write(
        current.includes(code)
          ? current.filter((c) => c !== code)
          : [...current, code],
      );
    },
    clear() {
      if (read().length > 0) write([]);
    },
  };
}

/** Countries that have already come up, so a spin doesn't repeat them. */
export const seenStore = createCodeStore("world-plate:seen");
/** Countries whose dish the user has marked as made. */
export const madeStore = createCodeStore("world-plate:made");

type CodeStore = ReturnType<typeof createCodeStore>;

function useCodes(store: CodeStore): readonly string[] {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

export const useSeen = () => useCodes(seenStore);
export const useMade = () => useCodes(madeStore);
