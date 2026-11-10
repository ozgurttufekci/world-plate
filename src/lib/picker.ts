/** Returns an integer in [0, n). */
export type RandomInt = (n: number) => number;

/** Uniform integer in [0, n) from the platform CSPRNG, without modulo bias. */
export const cryptoRandomInt: RandomInt = (n) => {
  if (!Number.isInteger(n) || n <= 0) throw new RangeError("n must be a positive integer");
  const range = 0x1_0000_0000;
  const limit = range - (range % n);
  const buf = new Uint32Array(1);
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % n;
};

export interface PickResult {
  /** The chosen country code, or null when nothing can be picked. */
  code: string | null;
  /** True when every country in the pool had been seen, so the pool starts over. */
  reset: boolean;
}

/**
 * Picks one country code uniformly at random.
 *
 * @param pool    Codes that match the current filters.
 * @param seen    Codes already shown; skipped until the pool is used up.
 * @param current The code on screen now, never picked again straight away
 *                unless it is the only one in the pool.
 */
export function pickCountry(
  pool: readonly string[],
  seen: ReadonlySet<string>,
  current: string | null,
  randomInt: RandomInt = cryptoRandomInt,
): PickResult {
  if (pool.length === 0) return { code: null, reset: false };

  const others = pool.filter((code) => code !== current);
  if (others.length === 0) return { code: pool[0], reset: false };

  const unseen = others.filter((code) => !seen.has(code));
  const reset = unseen.length === 0;
  const candidates = reset ? others : unseen;
  return { code: candidates[randomInt(candidates.length)], reset };
}
