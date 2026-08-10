import { describe, expect, it } from "vitest"; import { calculateDiscount } from "./logic";
describe("calculateDiscount", () => { it("calculates saving and sale price", () => expect(calculateDiscount(80, 25)).toEqual({ ok: true, saving: 20, salePrice: 60 })); it("rejects invalid percentages", () => expect(calculateDiscount(10, 101).ok).toBe(false)); });
