import type { Course, Difficulty, Method, Region } from "@/data/schema";

/**
 * The slice of a country that the client-side spin controls and globe need.
 * The full entries (descriptions, links) stay on the server.
 */
export interface SpinCountry {
  code: string;
  name: string;
  dish: string;
  numeric: string | null;
  lat: number;
  lng: number;
  region: Region;
  method: Method;
  course: Course;
  difficulty: Difficulty;
  minutes: number;
}

/** How long the globe takes to travel to a freshly picked country. */
export const SPIN_MS = 1800;
/** How long it takes to turn to a country reached by ordinary navigation. */
export const GLIDE_MS = 900;
