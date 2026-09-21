import { describe, expect, it } from "vitest";
import { resolveEntityMatchTarget } from "./resolveEntityMatchTarget.ts";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { Broccoli, BroccoliTextGeneric } from "../../../../model/Broccoli.ts";
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

/** The list a location's own function hands back, e.g. one text per footnote */
function texts(...entries: ReturnType<typeof view>[]) {
  return entries as unknown as BroccoliTextGeneric[];
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

  it("walks a location's own texts in the order it renders them", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA), entity("a2", ALMA), entity("g1", GAUGUIN)],
      views({}),
      terms,
      config,
      [
        {
          name: "notes",
          view: () =>
            texts(
              view([{ bodyId: "g1", begin: 2, end: 6 }]),
              view([{ bodyId: "a1", begin: 40, end: 44 }]),
              view([{ bodyId: "a2", begin: 1, end: 5 }]),
            ),
        },
      ],
    );

    // The second note wins on render order, even though the third matches
    // earlier within its own text: offsets only compare inside one text
    expect(result).toEqual({ name: "notes", bodyId: "a1", begin: 40 });
  });

  it("falls through to the next location when a function yields no texts", () => {
    const result = resolveEntityMatchTarget(
      [entity("a1", ALMA)],
      views({ text: view([{ bodyId: "a1", begin: 10, end: 14 }]) }),
      terms,
      config,
      [
        // e.g. a letter without notes in the selected language
        { name: "notes", view: () => texts() },
        { name: "main", view: "text" },
      ],
    );

    expect(result).toEqual({ name: "main", bodyId: "a1", begin: 10 });
  });

  it("hands the views and config to a location's function", () => {
    const allViews = views({ text: view([]) });
    let received: unknown[] = [];

    resolveEntityMatchTarget([entity("a1", ALMA)], allViews, terms, config, [
      {
        name: "notes",
        view: (v, c) => {
          received = [v, c];
          return texts();
        },
      },
    ]);

    expect(received).toEqual([allViews, config]);
  });
});
