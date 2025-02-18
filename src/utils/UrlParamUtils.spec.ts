import { describe, expect, it } from "vitest";
import { markDefaultProps } from "./UrlParamUtils.ts";

describe("markDefaultProps", () => {
  it("marks defaults as null", () => {
    const defaultProps = { a: "foo" };
    const result = markDefaultProps({ a: "foo" }, defaultProps);
    expect(result.a).toBe(null);
  });

  it("keeps non-defaults", () => {
    const defaultProps = { a: "foo" };
    const result = markDefaultProps({ a: "bar" }, defaultProps);
    expect(result.a).toBe("bar");
  });

  it("does not touch undefined, 0 or empty string", () => {
    const defaultProps = { a: "", b: "", c: undefined };
    const result = markDefaultProps(
      { a: undefined, b: 0, c: "" },
      defaultProps,
    );
    expect(result.a).toBe(undefined);
    expect(result.b).toBe(0);
    expect(result.c).toBe("");
  });
});
