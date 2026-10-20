import { describe, expect, it } from "vitest";
import { toLetterDetailPath, toLetterLinkPath } from "./toLetterDetailPath";

describe("toLetterLinkPath", () => {
  const letterPath = toLetterDetailPath("let011", "vangogh");

  it("links to the letter of a reference without anchor", () => {
    expect(toLetterLinkPath("let011.xml", "vangogh")).toBe(letterPath);
  });

  it("keeps the anchor, so the letter opens on a note", () => {
    expect(toLetterLinkPath("let011.xml#note-t-8", "vangogh")).toBe(
      `${letterPath}#note-t-8`,
    );
  });

  it("keeps an anchor containing dots", () => {
    expect(toLetterLinkPath("let011.xml#p.orig.21", "vangogh")).toBe(
      `${letterPath}#p.orig.21`,
    );
  });
});
