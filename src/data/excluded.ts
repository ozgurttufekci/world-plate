import type { ExcludedEntry } from "./schema";

/**
 * Candidate countries that are not in the pool, with the reason.
 * Leaving a country out says something about this dataset, not about its food.
 */
export const excluded: ExcludedEntry[] = [
  // Europe
  {
    code: "VA",
    kind: "none",
    reason: "A city-state inside Rome with no cuisine of its own.",
  },

  // Oceania
  {
    code: "FM",
    kind: "unverified",
    reason:
      "Island staples (taro, breadfruit, coconut, fish) are shared across the Pacific, and I couldn't confirm a documented dish of its own.",
  },
  {
    code: "KI",
    kind: "unverified",
    reason:
      "Its documented traditional foods are preserves made from coconut sap and pandanus fruit, which can't be made away from the atolls, and I couldn't confirm a dish that can.",
  },
  {
    code: "NR",
    kind: "shared",
    reason:
      "Its one documented traditional dish, raw fish in coconut milk, is the dish listed under Fiji as kokoda.",
  },
  {
    code: "SB",
    kind: "unverified",
    reason:
      "Island staples (taro, breadfruit, cassava, coconut, fish) are shared across the Pacific, and I couldn't confirm a documented dish of its own.",
  },
];
