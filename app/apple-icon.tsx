import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#1a1c1b",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", height: 99, width: 99 }}>
        <div
          style={{
            background: "#e7e5ff",
            height: 66,
            width: 66,
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", height: 99, width: 33 }}>
          <div style={{ background: "#8f89ff", height: 33, width: 33 }} />
          <div style={{ height: 33, width: 33 }} />
          <div style={{ background: "#5e54ff", height: 33, width: 33 }} />
        </div>
      </div>
    </div>,
    size,
  );
}
