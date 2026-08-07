import { ImageResponse } from "next/og";

export const alt = "PixelUtils — Fast, private browser tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#101014",
        color: "#f4f4f6",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          border: "1px solid #2d2d35",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px",
          width: "100%",
          background:
            "radial-gradient(circle at 18% 8%, #292451 0%, #18181e 38%, #18181e 100%)",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "18px" }}>
          <div
            style={{
              alignItems: "center",
              background: "#897ef5",
              borderRadius: "14px",
              color: "#111116",
              display: "flex",
              fontSize: 30,
              fontWeight: 800,
              height: 58,
              justifyContent: "center",
              width: 58,
            }}
          >
            P
          </div>
          <span style={{ fontSize: 34, fontWeight: 700 }}>PixelUtils</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <span
            style={{
              color: "#9b92fb",
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Fast · Private · No account
          </span>
          <span
            style={{
              fontSize: 64,
              fontWeight: 750,
              letterSpacing: "-0.045em",
              lineHeight: 1.05,
              maxWidth: 880,
            }}
          >
            Free browser tools for everyday tasks.
          </span>
        </div>
      </div>
    </div>,
    size,
  );
}
