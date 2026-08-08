"use client";

const bodyStyle = {
  alignItems: "center",
  background: "#101014",
  color: "#f7f7f8",
  display: "flex",
  fontFamily: "system-ui, sans-serif",
  justifyContent: "center",
  margin: 0,
  minHeight: "100vh",
  padding: "24px",
} as const;

export default function GlobalError({ retry }: { retry: () => void }) {
  return (
    <html lang="en">
      <body style={bodyStyle}>
        <main style={{ maxWidth: 560, textAlign: "center" }}>
          <title>Unexpected error | PixelUtils</title>
          <h1 style={{ fontSize: "2rem", letterSpacing: "-0.03em" }}>
            PixelUtils could not start.
          </h1>
          <p style={{ color: "#b8b8c2", lineHeight: 1.7 }}>
            Reload the application to try again. No tool input was uploaded.
          </p>
          <button
            onClick={retry}
            style={{
              background: "#7c5cff",
              border: 0,
              borderRadius: 12,
              color: "white",
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 700,
              minHeight: 44,
              padding: "0 20px",
            }}
            type="button"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
