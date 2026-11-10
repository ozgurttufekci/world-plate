import type { ExcludedEntry } from "./schema";

/**
 * Candidate countries that are not in the pool, with the reason.
 * Leaving a country out says something about this dataset, not about its food.
 */
export const excluded: ExcludedEntry[] = [
  // Africa
  {
    code: "BI",
    kind: "shared",
    reason:
      "Everyday dishes (beans, plantain, maize porridge) are shared across the Great Lakes region.",
  },
  {
    code: "CF",
    kind: "unverified",
    reason:
      "Cassava and peanut staples are shared with its neighbours, and I couldn't confirm a dish that is distinctly Central African.",
  },
  {
    code: "CG",
    kind: "shared",
    reason:
      "Its national dish, moambe chicken, is listed under DR Congo, and its other staples are the same.",
  },
  {
    code: "GQ",
    kind: "unverified",
    reason: "I couldn't confirm a distinctive, documented dish.",
  },
  {
    code: "SZ",
    kind: "shared",
    reason:
      "Staples such as maize porridge and sour milk are shared with South Africa.",
  },
  {
    code: "GA",
    kind: "shared",
    reason:
      "Its national dish, poulet nyembwe, is the same palm-nut chicken as DR Congo's moambe.",
  },
  {
    code: "GM",
    kind: "shared",
    reason:
      "Its national dish, domoda, is the peanut stew listed under Mali, and the rest of its kitchen is shared with Senegal.",
  },
  {
    code: "GN",
    kind: "unverified",
    reason: "I couldn't confirm a distinctive, documented dish.",
  },
  {
    code: "GW",
    kind: "unverified",
    reason: "I couldn't confirm a distinctive, documented dish.",
  },
  {
    code: "LS",
    kind: "shared",
    reason:
      "Staples such as maize porridge and cooked greens are shared with South Africa.",
  },
  {
    code: "MR",
    kind: "shared",
    reason: "Its national dish, thieboudienne, is listed under Senegal.",
  },
  {
    code: "RW",
    kind: "shared",
    reason:
      "Cassava-leaf stew, maize porridge and grilled skewers are shared across the Great Lakes region.",
  },
  {
    code: "SL",
    kind: "shared",
    reason:
      "Cassava-leaf stew and groundnut stew are shared with Liberia and Guinea.",
  },
  {
    code: "SS",
    kind: "shared",
    reason: "Its staples, such as kisra, are shared with Sudan.",
  },
  {
    code: "TG",
    kind: "shared",
    reason: "Ewe and Mina dishes are shared with Ghana and Benin.",
  },

  // Asia
  {
    code: "AE",
    kind: "shared",
    reason:
      "Its signature dishes (machboos, harees, balaleet) are cooked all around the Gulf.",
  },
  {
    code: "QA",
    kind: "shared",
    reason:
      "Its signature dishes (machboos, harees, balaleet) are cooked all around the Gulf.",
  },

  // Europe
  {
    code: "LI",
    kind: "shared",
    reason:
      "Its national dish, Käsknöpfle, is the cheese spätzle of the wider Alemannic region.",
  },
  {
    code: "ME",
    kind: "shared",
    reason:
      "Its best-known dishes (kačamak, smoked ham, ćevapi) are shared across the western Balkans.",
  },
  {
    code: "VA",
    kind: "none",
    reason: "A city-state inside Rome with no cuisine of its own.",
  },

  // North America
  {
    code: "DM",
    kind: "shared",
    reason:
      "Its former national dish, 'mountain chicken', is a critically endangered frog. Its replacement, callaloo soup, is shared across the Caribbean.",
  },
  {
    code: "KN",
    kind: "shared",
    reason:
      "Its national plate (stewed saltfish, plantain, dumplings, breadfruit) is assembled from staples shared across the Caribbean.",
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
      "Island staples (taro, breadfruit, coconut, fish) are shared across the Pacific, and I couldn't confirm a documented dish of its own.",
  },
  {
    code: "MH",
    kind: "unverified",
    reason:
      "Island staples (taro, breadfruit, coconut, fish) are shared across the Pacific, and I couldn't confirm a documented dish of its own.",
  },
  {
    code: "NR",
    kind: "unverified",
    reason:
      "Island staples (taro, breadfruit, coconut, fish) are shared across the Pacific, and I couldn't confirm a documented dish of its own.",
  },
  {
    code: "PW",
    kind: "unverified",
    reason:
      "Its best-known dish is fruit bat soup, which isn't one to send people off to cook, and I couldn't confirm another.",
  },
  {
    code: "SB",
    kind: "unverified",
    reason:
      "Island staples (taro, breadfruit, coconut, fish) are shared across the Pacific, and I couldn't confirm a documented dish of its own.",
  },
  {
    code: "TV",
    kind: "unverified",
    reason:
      "Island staples (taro, breadfruit, coconut, fish) are shared across the Pacific, and I couldn't confirm a documented dish of its own.",
  },
];
