import { describe, expect, it } from "vitest";
import { addPanelOverride } from "./useRevealPanel.tsx";

const panels = [
  { name: "facs", region: "left" as const },
  { name: "text.orig", region: "main" as const },
  { name: "text.trans", region: "main" as const },
  { name: "metadata", region: "right" as const },
];

describe(addPanelOverride.name, () => {
  it("keeps overrides in other regions", () => {
    // A notes hit opened the sidebar; revealing a main text must not close it
    expect(addPanelOverride({ metadata: true }, "text.trans", panels)).toEqual({
      metadata: true,
      "text.trans": true,
    });
  });

  it("replaces an override competing for the same region", () => {
    // Keeping text.orig would leave a single main slot on text.orig
    expect(
      addPanelOverride({ "text.orig": true }, "text.trans", panels),
    ).toEqual({ "text.trans": true });
  });

  it("does both at once", () => {
    expect(
      addPanelOverride(
        { "text.orig": true, metadata: true },
        "text.trans",
        panels,
      ),
    ).toEqual({ metadata: true, "text.trans": true });
  });

  it("starts from no overrides", () => {
    expect(addPanelOverride({}, "metadata", panels)).toEqual({
      metadata: true,
    });
  });
});
