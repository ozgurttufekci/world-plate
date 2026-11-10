import { ImageResponse } from "next/og";
import { countries } from "@/data/countries";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME}: spin the globe, cook what it lands on`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#fbf9f4",
          color: "#2a211c",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              background: "#c2502f",
              display: "flex",
            }}
          />
          <div style={{ fontSize: 40, fontWeight: 600 }}>{SITE_NAME}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 700, lineHeight: 1.05, letterSpacing: -3 }}>
            Spin the globe.
          </div>
          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -3,
              color: "#c2502f",
            }}
          >
            Cook what it lands on.
          </div>
        </div>
        <div style={{ fontSize: 34, color: "#6b5d52" }}>
          {`${countries.length} countries, one signature dish each`}
        </div>
      </div>
    ),
    size,
  );
}
