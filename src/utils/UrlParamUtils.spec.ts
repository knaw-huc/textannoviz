import { describe, expect, it } from "vitest";
import { markDefaultParamProps } from "./UrlParamUtils.ts";

describe("markDefaultProps", () => {
  it("marks default param as a param to remove", () => {
    const defaultProps = { a: "foo" };
    const result = markDefaultParamProps({ a: "foo" }, defaultProps);
    expect(result.toRemove).toEqual(["a"]);
  });

  it("keeps non-defaults", () => {
    const defaultProps = { a: "foo" };
    const result = markDefaultParamProps({ a: "bar" }, defaultProps);
    expect(result.toUpdate?.a).toBe("bar");
  });

  it("compares strict", () => {
    const defaultProps = { a: "", b: "", c: "", d: "" };
    const result = markDefaultParamProps(
      { a: undefined, b: 0, c: null, d: "" },
      defaultProps,
    );
    expect(result.toUpdate?.a).toBe(undefined);
    expect(result.toUpdate?.b).toBe(0);
    expect(result.toUpdate?.c).toBe(null);
    expect(result.toRemove).toEqual(["d"]);
  });
});
