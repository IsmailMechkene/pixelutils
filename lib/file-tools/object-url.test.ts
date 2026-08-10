import { afterEach, describe, expect, it, vi } from "vitest";

import { createObjectUrlHandle } from "./object-url";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createObjectUrlHandle", () => {
  it("revokes replaced and disposed object URLs", () => {
    const createObjectURL = vi
      .fn()
      .mockReturnValueOnce("blob:one")
      .mockReturnValueOnce("blob:two");
    const revokeObjectURL = vi.fn();
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    const handle = createObjectUrlHandle();
    expect(handle.replace(new Blob(["one"]))).toBe("blob:one");
    expect(handle.replace(new Blob(["two"]))).toBe("blob:two");
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:one");

    handle.dispose();
    expect(revokeObjectURL).toHaveBeenLastCalledWith("blob:two");
  });
});
