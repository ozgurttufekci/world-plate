export const SITE_NAME = "World Plate";
export const SITE_TAGLINE = "Spin the globe, cook what it lands on";

/** Canonical origin: the production domain on Vercel, localhost otherwise. */
export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";
