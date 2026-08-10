import { describe, expect, it } from "vitest";
import { cleanText } from "./logic";
describe("cleanText", () => it("normalizes selected whitespace without changing line order", () => expect(cleanText("  hello\t  world \r\n\r\n next ", { trimLines: true, collapseSpaces: true, removeEmptyLines: true })).toBe("hello world\nnext")));
