import type { Metadata } from "next";
import { notFound } from "next/navigation";

import FfmpegPrototypeWorkspace from "@/tools/internal-ffmpeg-prototype/workspace";

const enabled = process.env.NEXT_PUBLIC_ENABLE_INTERNAL_FFMPEG_PROTOTYPE === "true";

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: "Internal FFmpeg prototype",
};

export default function InternalFfmpegPrototypePage() {
  if (!enabled) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
      <p className="font-mono text-xs font-medium uppercase tracking-wider text-ink-subtle">
        Internal / unlisted prototype
      </p>
      <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        FFmpeg browser-processing prototype
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">
        This temporary test verifies same-origin FFmpeg WebAssembly loading and a small local video transformation. It is not a public PixelUtils tool.
      </p>
      <section aria-labelledby="ffmpeg-prototype-workspace" className="mt-8 rounded-card border border-line bg-panel p-4 sm:p-6">
        <h2 className="sr-only" id="ffmpeg-prototype-workspace">FFmpeg prototype workspace</h2>
        <FfmpegPrototypeWorkspace />
      </section>
    </div>
  );
}
