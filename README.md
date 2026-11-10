# World Plate

Spin a globe, land on a random country, and get that country's one signature dish to cook or bake.

Each country has exactly one dish, so the only random part is which country comes up. Filters (method, course, difficulty, time, region) narrow the pool of countries the spin draws from.

## How the pool is built

- Candidates are the 193 UN member states plus the Vatican, Palestine, Taiwan and Kosovo.
- A country is in the pool if it has at least one dish that is distinctly its own. A national version of a wider family counts.
- A dish belongs to one country only, and contested dishes are avoided where a country has an uncontested alternative.
- Every candidate that is left out is listed with a reason in `src/data/excluded.ts` and on the `/criteria` page.

The dataset was written from general knowledge and checked against Wikipedia, not against a culinary authority. Each entry has a `whyUnique` line explaining the choice.

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # dataset, filter and picker tests
pnpm lint
pnpm typecheck
pnpm build
```

Needs Node 20.9 or later.

## Data

| File | What it holds |
|---|---|
| `src/data/dishes/*.ts` | The hand-written entries: one dish per country |
| `src/data/excluded.ts` | Candidates left out, with reasons |
| `src/data/geo.json` | Generated: names, regions and coordinates of all candidates |
| `src/data/images.json` | Generated: one Wikimedia Commons photo per dish, with author and licence |

Scripts, all run by hand (the build never touches the network):

```bash
pnpm data:geo      # rebuild geo.json from the world-countries package
pnpm data:images   # look up each dish's Wikipedia lead image; reports bad titles and missing photos
pnpm data:report   # how the pool spreads across filter values
```

After changing a dish, run `pnpm data:images` and `pnpm test`. The tests check that every candidate is either included or excluded, that no dish or Wikipedia article is used twice, and that every filter value has at least one country.

## How it works

- Next.js App Router with Cache Components; every page is prerendered, including one page per country at `/country/[code]`.
- The globe is a canvas drawn with `d3-geo` from `world-atlas` shapes. Small states that the 110m map leaves out get a marker instead of a shape.
- Filters live in the query string, so a filtered view can be shared.
- Seen history and "made it" marks are kept in `localStorage`. A spin skips countries you have seen until the matching pool is used up, then starts over.
- Photos are loaded straight from Wikimedia's thumbnail hosts. Credits are on `/credits`.
