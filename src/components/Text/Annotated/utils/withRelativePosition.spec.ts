import { describe, expect, it } from "vitest";
import { withRelativePosition } from "./withRelativePosition.ts";
import dummy from "../test/resources/test-broccoli-session-3248-num-14-resolution-4.json";
import { Broccoli } from "../../../../model/Broccoli.ts";

describe("withRelativePosition", () => {
  it("excludes end character", () => {
    const broccoli: Broccoli = dummy as unknown as Broccoli;
    const result = withRelativePosition(
      broccoli.anno[1],
      broccoli.views.self.locations.annotations,
      broccoli.views.self.lines,
    );
    expect(result.id).toEqual(
      "urn:republic:entity-occurrence:session-3248-num-14-para-6:162-194",
    );
    expect(result.startChar).toEqual(162);
    expect(result.endChar).toEqual(194);
  });
});
