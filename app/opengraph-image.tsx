import { ImageResponse } from "next/og";

export const alt = "PixelUtils — Fast, private browser tools";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#faf9f7",
        color: "#1a1c1b",
        display: "flex",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "52px",
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #ffffff 0%, #ffffff 72%, #e2dfff 72%, #e2dfff 100%)",
          border: "1px solid #e2e2e2",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "64px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "18px" }}>
          <div style={{ alignItems: "flex-start", background: "#1a1c1b", display: "flex", height: 58, padding: 6, width: 58 }}>
            <div style={{ background: "#e7e5ff", height: 28, width: 28 }} />
            <div style={{ display: "flex", flexDirection: "column", height: 42, width: 14 }}>
              <div style={{ background: "#8f89ff", height: 14, width: 14 }} />
              <div style={{ height: 14, width: 14 }} />
              <div style={{ background: "#5e54ff", height: 14, width: 14 }} />
            </div>
          </div>
          <span style={{ fontSize: 34, fontWeight: 700 }}>PixelUtils</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          <span
            style={{
              color: "#3a31e7",
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
            Free browser tools for the tasks you need done now.
          </span>
        </div>
      </div>
    </div>,
    size,
  );
}
