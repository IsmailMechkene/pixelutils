import { describe, expect, it } from "vitest"; import { createSlug } from "./logic";
describe("createSlug", () => it("normalizes accents and separators", () => expect(createSlug("Caf\u00e9 & Browser Tools!")).toBe("cafe-browser-tools")));
