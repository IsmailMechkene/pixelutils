import { rm } from "node:fs/promises";
import { join } from "node:path";

const outputDirectories = [".next", ".open-next"].map((directory) =>
  join(process.cwd(), directory),
);

await Promise.all(
  outputDirectories.map((directory) => rm(directory, { force: true, recursive: true })),
);

console.log("Removed .next and .open-next production build outputs.");
