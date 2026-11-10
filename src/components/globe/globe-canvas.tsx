"use client";

import { useEffect, useRef } from "react";
import { createGlobe, type GlobeController } from "./controller";

export interface GlobeCanvasProps {
  /** The country to point at, or null to let the globe drift. */
  code: string | null;
  numeric: string | null;
  lat: number;
  lng: number;
  /** True while a freshly picked country is being travelled to. */
  spin: boolean;
  label: string;
}

export default function GlobeCanvas({
  code,
  numeric,
  lat,
  lng,
  spin,
  label,
}: GlobeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<GlobeController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = createGlobe(canvas);
    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setTarget(
      code === null ? null : { code, numeric, lat, lng },
      { spin },
    );
    // `spin` only describes how to travel to a new target; it turning off
    // afterwards must not restart the movement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, numeric, lat, lng]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="aspect-square w-full rounded-full"
    />
  );
}
