import { describe, expect, it } from "vitest";
import { getNotesTexts } from "./getNotesTexts.ts";
import { Broccoli, BroccoliTextGeneric } from "../../../model/Broccoli.ts";
import { ProjectConfig } from "../../../model/ProjectConfig.ts";
import { LanguageCode } from "../../../model/Language.ts";

function text(body: string) {
  return {
    body,
    locations: { annotations: [] },
  } as unknown as BroccoliTextGeneric;
}

function views(entries: object) {
  return entries as unknown as Broccoli["views"];
}

function config(selectedLanguage: LanguageCode) {
  return { selectedLanguage } as unknown as ProjectConfig;
}

const bodies = (texts: BroccoliTextGeneric[]) => texts.map((t) => t.body);

describe(getNotesTexts.name, () => {
  it("renders the ogtNotes block before the footnotes", () => {
    const result = getNotesTexts(
      views({
        ogtNotes: { en: text("ogt") },
        textNotes: { en: { 1: text("note 1"), 2: text("note 2") } },
      }),
      config("en"),
    );

    expect(bodies(result)).toEqual(["ogt", "note 1", "note 2"]);
  });

  it("takes the footnotes in the selected language", () => {
    const result = getNotesTexts(
      views({
        textNotes: { en: { 1: text("english") }, nl: { 1: text("dutch") } },
      }),
      config("nl"),
    );

    expect(bodies(result)).toEqual(["dutch"]);
  });

  it("keeps ogtNotes in English whatever the selected language", () => {
    const result = getNotesTexts(
      views({
        ogtNotes: { en: text("ogt en"), nl: text("ogt nl") },
        textNotes: { nl: { 1: text("dutch") } },
      }),
      config("nl"),
    );

    expect(bodies(result)).toEqual(["ogt en", "dutch"]);
  });

  it("leaves out an ogtNotes block with an empty body, as NotesPanel does", () => {
    const result = getNotesTexts(
      views({
        ogtNotes: { en: text("") },
        textNotes: { en: { 1: text("note 1") } },
      }),
      config("en"),
    );

    expect(bodies(result)).toEqual(["note 1"]);
  });

  it("returns nothing for a letter without notes in the selected language", () => {
    const result = getNotesTexts(
      views({ textNotes: { en: { 1: text("english") } } }),
      config("nl"),
    );

    expect(result).toEqual([]);
  });

  it("returns nothing when the letter has no notes at all", () => {
    expect(getNotesTexts(views({}), config("en"))).toEqual([]);
  });
});
