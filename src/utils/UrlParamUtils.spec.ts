import { describe, expect, it } from "vitest";
import { cleanUrlParams, UrlSearchParamRecord } from "./UrlParamUtils.ts";

describe("cleanUrlParams", () => {
  it("removes null and undefined values", () => {
    const result = cleanUrlParams({
      foo: undefined,
      bar: null,
    } as unknown as UrlSearchParamRecord);
    expect(result).toEqual({});
  });
  it("converts to string", () => {
    const result = cleanUrlParams({
      foo: 0,
      bar: false,
      baz: "",
    } as unknown as UrlSearchParamRecord);
    expect(result).toEqual({
      foo: "0",
      bar: "false",
      baz: "",
    });
  });
});
