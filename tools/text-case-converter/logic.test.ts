import { describe, expect, it } from "vitest";

import { convertTextCase } from "./logic";

describe("convertTextCase", () => {
  it("converts while retaining punctuation for natural-language modes", () => {
    expect(convertTextCase("hELLO, café WORLD!", "title")).toBe(
      "Hello, Café World!",
    );
    expect(convertTextCase("hELLO WORLD. nEXT sentence!", "sentence")).toBe(
      "Hello world. Next sentence!",
    );
    expect(convertTextCase("Straße", "uppercase")).toBe("STRASSE");
  });

  it("creates common identifier cases", () => {
    expect(convertTextCase("hello HTTP world", "camel")).toBe("helloHttpWorld");
    expect(convertTextCase("hello-world value", "pascal")).toBe(
      "HelloWorldValue",
    );
    expect(convertTextCase("HelloWorld value", "snake")).toBe(
      "hello_world_value",
    );
    expect(convertTextCase("Hello_world value", "kebab")).toBe(
      "hello-world-value",
    );
  });

  it("handles empty and Unicode input", () => {
    expect(convertTextCase("", "camel")).toBe("");
    expect(convertTextCase("CAFÉ AU LAIT", "lowercase")).toBe("café au lait");
  });
});
