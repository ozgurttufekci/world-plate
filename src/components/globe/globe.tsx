"use client";

import dynamic from "next/dynamic";
import type { GlobeCanvasProps } from "./globe-canvas";

export function GlobePlaceholder() {
  return (
    <div
      aria-hidden
      className="aspect-square w-full rounded-full border border-[#c3dbe6] bg-[#dcebf2]"
    />
  );
}

// The globe draws on a canvas and pulls in map data, so it loads in the browser only.
const GlobeCanvas = dynamic(() => import("./globe-canvas"), {
  ssr: false,
  loading: () => <GlobePlaceholder />,
});

export function Globe(props: GlobeCanvasProps) {
  return <GlobeCanvas {...props} />;
}
