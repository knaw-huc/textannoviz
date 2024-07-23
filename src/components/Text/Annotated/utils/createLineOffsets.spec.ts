import { describe, expect, it } from "vitest";
import { createLineOffsets } from "./createLineOffsets.ts";
import { BroccoliViewPosition } from "../../BroccoliViewPosition.ts";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";

describe("createLineOffsets", () => {
  it("excludes end character", () => {
    const annotation = {
      id: "https://annorepo.republic-caf.diginfra.org/w3c/republic-2024.05.17/4406d529-6ed2-45fc-ba99-2f5bc1da6997",
      type: "Annotation",
      body: {
        id: "urn:republic:entity-occurrence:session-3248-num-14-para-6:162-194",
        type: "Entity",
        text: "Collegie ter admt. tot Rotterdam",
        metadata: {},
      },
      target: [
        {
          type: "Text",
          source:
            "https://textrepo.republic-caf.diginfra.org/api/view/versions/7b153053-8460-4460-a72d-adf02dd243e1/segments/index/3208/3208",
        },
        {
          type: "LogicalText",
          source:
            "https://textrepo.republic-caf.diginfra.org/api/rest/versions/1155e95c-19ee-42b0-87e5-5e235cdeef23/contents",
          selector: {
            "@context": "https://knaw-huc.github.io/ns/republic.jsonld",
            type: "urn:republic:TextAnchorSelector",
            start: 208,
            end: 208,
          },
        },
      ],
    } as AnnoRepoAnnotation;
    const positionsRelativeToView: BroccoliViewPosition[] = [
      {
        bodyId:
          "urn:republic:entity-occurrence:session-3248-num-14-para-6:162-194",
        start: {
          line: 0,
          offset: 162,
        },
        end: {
          line: 0,
          offset: 193,
        },
      },
    ];
    const lines = [
      "Synde ter vergaderinge gelesen de requeste van weduwe van wylen den Capn. Willem Bouwensz keert de koe om te hebben betalinge van twee ordonnantien die sy aen t' Collegie ter admt. tot Rotterdam ten achteren staet.",
    ];
    const result = createLineOffsets(
      annotation,
      positionsRelativeToView,
      lines,
    );
    expect(result.body.id).toEqual(
      "urn:republic:entity-occurrence:session-3248-num-14-para-6:162-194",
    );
    expect(result.startChar).toEqual(162);
    expect(result.endChar).toEqual(194);
  });
});
