import { describe, expect, it } from "vitest";
import { resolveEntityMatchTarget } from "./resolveEntityMatchTarget.ts";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { Broccoli } from "../../../../model/Broccoli.ts";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";
import { Terms } from "../../../../model/Search.ts";

const ALMA = "Alma, Peter";
const GAUGUIN = "Gauguin, Paul";

/**
 * Minimal config: entities carry their own facet values, keeping these tests
 * independent of any project's annotation model
 */
const config = {
  isEntity: (body: { type: string }) => body.type === "Entity",
  getEntityFacetValues: (body: { persons?: string[] }) =>
    body.persons ? { persons: body.persons } : {},
} as unknown as ProjectConfig;

function entity(id: string, ...persons: string[]): AnnoRepoAnnotation {
  return {
    body: { id, type: "Entity", persons },
  } as unknown as AnnoRepoAnnotation;
}

function view(annotations: { bodyId: string; begin: number; end: number }[]) {
  return { body: "irrelevant", locations: { annotations } };
}

function views(entries: Record<string, ReturnType<typeof view>>) {
  return entries as unknown as Broccoli["views"];
}

const terms: Terms = { persons: [ALMA] };

describe(resolveEntityMatchTarget.name, () => {
  it("finds the match in the only location that holds it", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA)],
      views({ text: view([{ bodyId: "a1", begin: 10, end: 14 }]) }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toEqual({ name: "main", bodyId: "a1", begin: 10 });
  });

  it("prefers the earlier location when both hold a match", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA), entity("a2", ALMA)],
      views({
        notes: view([{ bodyId: "a2", begin: 1, end: 5 }]),
        text: view([{ bodyId: "a1", begin: 99, end: 103 }]),
      }),
      terms,
      config,
      [
        { name: "main", view: "text" },
        { name: "notes", view: "notes" },
      ],
    );

    // "main" wins on location priority, despite "notes" matching earlier in its text
    expect(result).toEqual({ name: "main", bodyId: "a1", begin: 99 });
  });

  it("falls through to the next location when earlier ones hold no match", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA), entity("g1", GAUGUIN)],
      views({
        text: view([{ bodyId: "g1", begin: 3, end: 7 }]),
        notes: view([{ bodyId: "a1", begin: 20, end: 24 }]),
      }),
      terms,
      config,
      [
        { name: "main", view: "text" },
        { name: "notes", view: "notes" },
      ],
    );

    expect(result).toEqual({ name: "notes", bodyId: "a1", begin: 20 });
  });

  it("picks the earliest match within a location", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA), entity("a2", ALMA)],
      views({
        text: view([
          { bodyId: "a2", begin: 80, end: 84 },
          { bodyId: "a1", begin: 12, end: 16 },
        ]),
      }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result?.bodyId).toBe("a1");
    expect(result?.begin).toBe(12);
  });

  it("skips zero-length annotations, which render as markers not text", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA), entity("a2", ALMA)],
      views({
        text: view([
          { bodyId: "a1", begin: 5, end: 5 },
          { bodyId: "a2", begin: 30, end: 34 },
        ]),
      }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result?.bodyId).toBe("a2");
  });

  it("resolves a language-suffixed view spec", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA)],
      views({
        text: { nl: view([{ bodyId: "a1", begin: 7, end: 11 }]) } as never,
      }),
      terms,
      config,
      [{ name: "main", view: ["text.fr", "text.nl"] }],
    );

    expect(result).toEqual({ name: "main", bodyId: "a1", begin: 7 });
  });

  it("returns nothing when no facet is selected", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA)],
      views({ text: view([{ bodyId: "a1", begin: 10, end: 14 }]) }),
      { persons: [] },
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toBeUndefined();
  });

  it("returns nothing when the selected entity appears in no view", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA)],
      views({ text: view([{ bodyId: "someone-else", begin: 10, end: 14 }]) }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toBeUndefined();
  });

  it("returns nothing before the views have loaded", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA)],
      undefined,
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toBeUndefined();
  });
});
