import { describe, expect, it } from "vitest";
import { createGetMetadataTexts } from "./getMetadataTexts.ts";
import { Broccoli } from "../../../model/Broccoli.ts";
import { ProjectConfig } from "../../../model/ProjectConfig.ts";

function text(body: string) {
  return { body, locations: { annotations: [] } };
}

const config = { selectedLanguage: "nl" } as unknown as ProjectConfig;

describe(createGetMetadataTexts.name, () => {
  it("lists the texts in the order given, in English", () => {
    const views = {
      remarks: { en: text("remarks"), nl: text("opmerkingen") },
      dating: { en: text("dating") },
    } as unknown as Broccoli["views"];

    const texts = createGetMetadataTexts(["dating", "remarks"])(views, config);

    expect(texts.map((t) => t.body)).toEqual(["dating", "remarks"]);
  });

  it("leaves out missing views and views with an empty body", () => {
    const views = {
      dating: { en: text("") },
      remarks: { en: text("remarks") },
    } as unknown as Broccoli["views"];

    const texts = createGetMetadataTexts([
      "dating",
      "transcrSource",
      "remarks",
    ])(views, config);

    expect(texts.map((t) => t.body)).toEqual(["remarks"]);
  });
});
