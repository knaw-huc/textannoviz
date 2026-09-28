import { describe, expect, it } from "vitest";
import { createEntityHighlightOffsets } from "./createEntityHighlightOffsets.ts";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli.ts";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";
import { Terms } from "../../../../model/Search.ts";

const ALMA = "Alma, Peter";

function config(entityMatchLocations?: unknown) {
  return {
    entityMatchLocations,
    isEntity: (body: { type: string }) => body.type === "Entity",
    getEntityFacetValues: (body: { persons?: string[] }) =>
      body.persons ? { persons: body.persons } : {},
  } as unknown as ProjectConfig;
}

const optedIn = config([{ name: "main", view: "text" }]);

function entity(id: string, ...persons: string[]): AnnoRepoAnnotation {
  return {
    body: { id, type: "Entity", persons },
  } as unknown as AnnoRepoAnnotation;
}

function positions(entries: BroccoliRelativeAnno[]) {
  return new Map(entries.map((e) => [e.bodyId, e]));
}

const annotations = [entity("a1", ALMA)];
const relative = positions([{ bodyId: "a1", begin: 10, end: 14 }]);
const terms: Terms = { persons: [ALMA] };

describe(createEntityHighlightOffsets.name, () => {
  it("highlights a matching entity for a project that opted in", () => {
    const result = createEntityHighlightOffsets(
      annotations,
      relative,
      terms,
      optedIn,
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ start: 10, end: 14 });
  });

  it("highlights nothing for a project without entityMatchLocations", () => {
    // Opting in is what declares a project's entity data checked against its
    // search index; without it a coincidental value match must not highlight
    expect(
      createEntityHighlightOffsets(annotations, relative, terms, config()),
    ).toEqual([]);
  });

  it("highlights nothing when entityMatchLocations is empty", () => {
    expect(
      createEntityHighlightOffsets(annotations, relative, terms, config([])),
    ).toEqual([]);
  });

  it("highlights nothing when no facet is selected", () => {
    expect(
      createEntityHighlightOffsets(annotations, relative, {}, optedIn),
    ).toEqual([]);
  });
});
