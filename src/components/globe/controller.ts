import {
  geoDistance,
  geoGraticule10,
  geoOrthographic,
  geoPath,
  type GeoPermissibleObjects,
} from "d3-geo";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { feature, mesh } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldJson from "world-atlas/countries-110m.json";
import { GLIDE_MS, SPIN_MS } from "@/lib/spin";

export interface GlobeTarget {
  code: string;
  numeric: string | null;
  lat: number;
  lng: number;
}

type CountryFeature = Feature<Geometry, { name: string }>;

const topology = worldJson as unknown as Topology<{
  countries: GeometryCollection<{ name: string }>;
  land: GeometryCollection;
}>;
const land = feature(topology, topology.objects.land);
const countryFeatures = (
  feature(topology, topology.objects.countries) as FeatureCollection<
    Geometry,
    { name: string }
  >
).features;
const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);
const graticule = geoGraticule10();
const sphere: GeoPermissibleObjects = { type: "Sphere" };

const featureByNumeric = new Map<string, CountryFeature>();
for (const f of countryFeatures) {
  if (f.id !== undefined) featureByNumeric.set(String(f.id), f);
}
// Kosovo has no ISO numeric code, so the atlas leaves its id empty.
const kosovo = countryFeatures.find((f) => f.properties.name === "Kosovo");

function shapeOf(target: GlobeTarget): CountryFeature | undefined {
  if (target.numeric) return featureByNumeric.get(target.numeric);
  return target.code === "XK" ? kosovo : undefined;
}

const COLORS = {
  ocean: "#dcebf2",
  oceanEdge: "#c3dbe6",
  graticule: "rgba(70, 110, 130, 0.14)",
  land: "#efe3c8",
  border: "rgba(120, 95, 60, 0.38)",
  rim: "rgba(90, 70, 50, 0.3)",
  highlight: "#c2502f",
  highlightSoft: "rgba(194, 80, 47, 0.2)",
  markerCore: "#ffffff",
};

const IDLE_TILT = -18;
const IDLE_DEG_PER_MS = 0.006;

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

interface Animation {
  from: [number, number];
  to: [number, number];
  start: number;
  duration: number;
}

export interface GlobeController {
  /**
   * Points the globe at a country, or lets it drift when given null.
   * The first call jumps straight there; later calls animate.
   */
  setTarget(target: GlobeTarget | null, options?: { spin?: boolean }): void;
  destroy(): void;
}

export function createGlobe(canvas: HTMLCanvasElement): GlobeController {
  const context = canvas.getContext("2d");
  const projection = geoOrthographic().clipAngle(90).precision(0.3);
  const path = geoPath(projection, context);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  let size = 0;
  let rotation: [number, number] = [20, IDLE_TILT];
  let target: GlobeTarget | null = null;
  let targetShape: CountryFeature | undefined;
  let animation: Animation | null = null;
  let frame = 0;
  let lastTick = 0;
  let initialized = false;
  let destroyed = false;

  function draw() {
    if (!context || size === 0) return;
    const dpr = window.devicePixelRatio || 1;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, size, size);

    const radius = size / 2 - 2;
    projection
      .translate([size / 2, size / 2])
      .scale(radius)
      .rotate([rotation[0], rotation[1], 0]);

    const ocean = context.createRadialGradient(
      size * 0.38,
      size * 0.32,
      radius * 0.1,
      size / 2,
      size / 2,
      radius,
    );
    ocean.addColorStop(0, COLORS.ocean);
    ocean.addColorStop(1, COLORS.oceanEdge);
    context.beginPath();
    path(sphere);
    context.fillStyle = ocean;
    context.fill();

    context.beginPath();
    path(graticule);
    context.strokeStyle = COLORS.graticule;
    context.lineWidth = 0.6;
    context.stroke();

    context.beginPath();
    path(land);
    context.fillStyle = COLORS.land;
    context.fill();

    context.beginPath();
    path(borders);
    context.strokeStyle = COLORS.border;
    context.lineWidth = 0.5;
    context.stroke();

    if (target) {
      if (targetShape) {
        context.beginPath();
        path(targetShape);
        context.fillStyle = COLORS.highlight;
        context.fill();
      }
      const centre: [number, number] = [-rotation[0], -rotation[1]];
      const facingUs = geoDistance(centre, [target.lng, target.lat]) < Math.PI / 2;
      const point = facingUs ? projection([target.lng, target.lat]) : null;
      if (point) {
        // A ring around the spot, so small countries and islands are findable.
        context.beginPath();
        context.arc(point[0], point[1], Math.max(9, size * 0.035), 0, Math.PI * 2);
        context.fillStyle = COLORS.highlightSoft;
        context.fill();
        context.strokeStyle = COLORS.highlight;
        context.lineWidth = 1.5;
        context.stroke();
        if (!targetShape) {
          context.beginPath();
          context.arc(point[0], point[1], 3.5, 0, Math.PI * 2);
          context.fillStyle = COLORS.highlight;
          context.fill();
          context.strokeStyle = COLORS.markerCore;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    }

    context.beginPath();
    path(sphere);
    context.strokeStyle = COLORS.rim;
    context.lineWidth = 1;
    context.stroke();
  }

  function tick(now: number) {
    frame = 0;
    if (destroyed) return;
    const dt = lastTick ? Math.min(now - lastTick, 64) : 16;
    lastTick = now;

    if (animation) {
      const t = Math.min(Math.max((now - animation.start) / animation.duration, 0), 1);
      const e = easeInOutCubic(t);
      rotation = [
        animation.from[0] + (animation.to[0] - animation.from[0]) * e,
        animation.from[1] + (animation.to[1] - animation.from[1]) * e,
      ];
      if (t >= 1) {
        rotation = [((animation.to[0] + 540) % 360) - 180, animation.to[1]];
        animation = null;
      }
    } else if (!target && !reducedMotion.matches) {
      rotation = [rotation[0] + IDLE_DEG_PER_MS * dt, rotation[1]];
    }

    draw();
    schedule();
  }

  function schedule() {
    const moving = animation !== null || (!target && !reducedMotion.matches);
    if (moving && !frame && !destroyed) frame = requestAnimationFrame(tick);
    if (!moving) lastTick = 0;
  }

  function resize() {
    const next = Math.round(canvas.clientWidth);
    if (next === 0 || next === size) return;
    size = next;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    draw();
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();

  return {
    setTarget(next, options) {
      const previous = target;
      target = next;
      targetShape = next ? shapeOf(next) : undefined;

      if (!next) {
        // Ease the tilt back towards the idle angle and start drifting.
        animation =
          initialized && !reducedMotion.matches && previous
            ? {
                from: rotation,
                to: [rotation[0] + 30, IDLE_TILT],
                start: performance.now(),
                duration: GLIDE_MS,
              }
            : null;
        if (!animation) rotation = [rotation[0], IDLE_TILT];
      } else {
        const to: [number, number] = [-next.lng, -next.lat];
        if (!initialized || reducedMotion.matches) {
          animation = null;
          rotation = to;
        } else {
          // Take the short way round, plus one full turn when spinning.
          let delta = ((((to[0] - rotation[0]) % 360) + 540) % 360) - 180;
          if (options?.spin) delta += delta < 0 ? -360 : 360;
          animation = {
            from: rotation,
            to: [rotation[0] + delta, to[1]],
            start: performance.now(),
            duration: options?.spin ? SPIN_MS : GLIDE_MS,
          };
        }
      }

      initialized = true;
      draw();
      schedule();
    },
    destroy() {
      destroyed = true;
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    },
  };
}
