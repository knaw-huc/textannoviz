import { describe, expect, it } from "vitest";
import { EntityMatch, resolveEntityMatches } from "./resolveEntityMatches.ts";
import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation.ts";
import { Broccoli, BroccoliTextGeneric } from "../../../../model/Broccoli.ts";
import { ProjectConfig } from "../../../../model/ProjectConfig.ts";
import { Terms } from "../../../../model/Search.ts";

const ALMA = "Alma, Peter";
const GAUGUIN = "Gauguin, Paul";
const SUNFLOWERS = "Van Gogh, Sunflowers (1888)";

/**
 * Minimal config: entities carry their own facet values, keeping these tests
 * independent of any project's annotation model
 */
const config = {
  isEntity: (body: { type: string }) => body.type === "Entity",
  getEntityFacetValues: (body: {
    persons?: string[];
    artworksEN?: string[];
  }) => ({
    ...(body.persons ? { persons: body.persons } : {}),
    ...(body.artworksEN ? { artworksEN: body.artworksEN } : {}),
  }),
} as unknown as ProjectConfig;

function entity(id: string, ...persons: string[]): AnnoRepoAnnotation {
  return {
    body: { id, type: "Entity", persons },
  } as unknown as AnnoRepoAnnotation;
}

function artwork(id: string, ...artworksEN: string[]): AnnoRepoAnnotation {
  return {
    body: { id, type: "Entity", artworksEN },
  } as unknown as AnnoRepoAnnotation;
}

function view(
  annotations: { bodyId: string; begin: number; end: number }[],
  body = "irrelevant",
  bodyId = "text-body",
) {
  return {
    body,
    locations: { relativeTo: { bodyId, bodyType: "Text" }, annotations },
  };
}

function views(entries: Record<string, ReturnType<typeof view>>) {
  return entries as unknown as Broccoli["views"];
}

/** The list a location's own function hands back, e.g. one text per footnote */
function texts(...entries: ReturnType<typeof view>[]) {
  return entries as unknown as BroccoliTextGeneric[];
}

/** What a list in the UI would show, so assertions read like that list */
function listed(matches: EntityMatch[]) {
  return matches.map(({ name, anchor, value }) => `${name}:${anchor}:${value}`);
}

/** Matches the way createSearchRegex builds them */
const zee = /zee/gi;

const terms: Terms = { persons: [ALMA] };

describe(resolveEntityMatches.name, () => {
  it("finds the match in the only location that holds it", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA)],
      views({ text: view([{ bodyId: "a1", begin: 10, end: 14 }]) }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toEqual([
      {
        kind: "entity",
        name: "main",
        anchor: "a1",
        begin: 10,
        bodyId: "a1",
        facetName: "persons",
        value: ALMA,
      },
    ]);
  });

  it("lists matches location by location, in location order", () => {
    const result = resolveEntityMatches(
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

    // "main" comes first on location order, despite "notes" matching earlier
    // in its own text: offsets only compare inside one text
    expect(listed(result)).toEqual([`main:a1:${ALMA}`, `notes:a2:${ALMA}`]);
  });

  it("skips locations that hold no match", () => {
    const result = resolveEntityMatches(
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

    expect(listed(result)).toEqual([`notes:a1:${ALMA}`]);
  });

  it("orders matches within a text by offset, whatever order they arrive in", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA), entity("a2", ALMA), entity("a3", ALMA)],
      views({
        text: view([
          { bodyId: "a2", begin: 80, end: 84 },
          { bodyId: "a1", begin: 12, end: 16 },
          { bodyId: "a3", begin: 40, end: 44 },
        ]),
      }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result.map((m) => m.anchor)).toEqual(["a1", "a3", "a2"]);
    expect(result.map((m) => m.begin)).toEqual([12, 40, 80]);
  });

  it("lists a body once, in the first location that can scroll to it", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA)],
      views({
        text: view([{ bodyId: "a1", begin: 10, end: 14 }]),
        trans: view([{ bodyId: "a1", begin: 30, end: 34 }]),
      }),
      terms,
      config,
      [
        { name: "main", view: "text" },
        { name: "translation", view: "trans" },
      ],
    );

    // Both locations anchor on the same body id, so only the first is reachable
    expect(listed(result)).toEqual([`main:a1:${ALMA}`]);
  });

  it("reports which facet each match was found on, and on which value", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA), artwork("w1", SUNFLOWERS)],
      views({
        text: view([
          { bodyId: "w1", begin: 5, end: 9 },
          { bodyId: "a1", begin: 50, end: 54 },
        ]),
      }),
      { persons: [ALMA], artworksEN: [SUNFLOWERS] },
      config,
      [{ name: "main", view: "text" }],
    );

    expect(
      result.map((m) => [m.kind === "entity" && m.facetName, m.value]),
    ).toEqual([
      ["artworksEN", SUNFLOWERS],
      ["persons", ALMA],
    ]);
  });

  it("matches on the selected value, not on every value the entity carries", () => {
    const result = resolveEntityMatches(
      [entity("a1", "Alma, P.", ALMA)],
      views({ text: view([{ bodyId: "a1", begin: 10, end: 14 }]) }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result[0].value).toBe(ALMA);
  });

  it("skips zero-length annotations, which render as markers not text", () => {
    const result = resolveEntityMatches(
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

    expect(result.map((m) => m.anchor)).toEqual(["a2"]);
  });

  it("resolves a language-suffixed view spec", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA)],
      views({
        text: { nl: view([{ bodyId: "a1", begin: 7, end: 11 }]) } as never,
      }),
      terms,
      config,
      [{ name: "main", view: ["text.fr", "text.nl"] }],
    );

    expect(listed(result)).toEqual([`main:a1:${ALMA}`]);
  });

  it("returns nothing when no facet is selected", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA)],
      views({ text: view([{ bodyId: "a1", begin: 10, end: 14 }]) }),
      { persons: [] },
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toEqual([]);
  });

  it("returns nothing when the selected entity appears in no view", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA)],
      views({ text: view([{ bodyId: "someone-else", begin: 10, end: 14 }]) }),
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toEqual([]);
  });

  it("returns nothing before the views have loaded", () => {
    const result = resolveEntityMatches(
      [entity("a1", ALMA)],
      undefined,
      terms,
      config,
      [{ name: "main", view: "text" }],
    );

    expect(result).toEqual([]);
  });

  it("walks a location's own texts in the order it renders them", () => {
    const result = resolveEntityMatches(
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

    // The second note comes first on render order, even though the third
    // matches earlier within its own text
    expect(result.map((m) => m.anchor)).toEqual(["a1", "a2"]);
  });

  it("carries on to the next location when a function yields no texts", () => {
    const result = resolveEntityMatches(
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

    expect(listed(result)).toEqual([`main:a1:${ALMA}`]);
  });

  it("hands the views and config to a location's function", () => {
    const allViews = views({ text: view([]) });
    let received: unknown[] = [];

    resolveEntityMatches([entity("a1", ALMA)], allViews, terms, config, [
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

  describe("with a full-text search", () => {
    it("lists full-text hits without any facet selected", () => {
      const result = resolveEntityMatches(
        [],
        views({ text: view([], "De Zee, de zee", "orig") }),
        {},
        config,
        [{ name: "main", view: "text" }],
        zee,
      );

      expect(result).toEqual([
        {
          kind: "fullText",
          name: "main",
          anchor: "search:orig:3",
          begin: 3,
          value: "Zee",
        },
        {
          kind: "fullText",
          name: "main",
          anchor: "search:orig:11",
          begin: 11,
          value: "zee",
        },
      ]);
    });

    it("interleaves entity and full-text matches by offset", () => {
      const result = resolveEntityMatches(
        [entity("a1", ALMA)],
        views({
          text: view([{ bodyId: "a1", begin: 5, end: 9 }], "zee, Alma, zee"),
        }),
        terms,
        config,
        [{ name: "main", view: "text" }],
        zee,
      );

      expect(result.map((m) => [m.kind, m.begin])).toEqual([
        ["fullText", 0],
        ["entity", 5],
        ["fullText", 11],
      ]);
    });

    it("lists the first in the letter first, whatever its kind", () => {
      const result = resolveEntityMatches(
        [entity("a1", ALMA)],
        views({
          text: view([], "zee", "orig"),
          notes: view([{ bodyId: "a1", begin: 0, end: 4 }]),
        }),
        terms,
        config,
        [
          { name: "main", view: "text" },
          { name: "notes", view: "notes" },
        ],
        zee,
      );

      expect(listed(result)).toEqual([
        "main:search:orig:0:zee",
        `notes:a1:${ALMA}`,
      ]);
    });

    it("lists a text's hits once when two locations render that text", () => {
      const translation = view([], "zee", "en");
      const result = resolveEntityMatches(
        [],
        views({ text: { en: translation } as never }),
        {},
        config,
        [
          // the original falling back to the translation, as Van Gogh's does
          { name: "text.orig", view: ["text.nl", "text.en"] },
          { name: "text.trans", view: "text.en" },
        ],
        zee,
      );

      expect(listed(result)).toEqual(["text.orig:search:en:0:zee"]);
    });

    it("keeps hits apart that sit at the same offset in different texts", () => {
      const result = resolveEntityMatches(
        [],
        views({
          text: view([], "zee", "orig"),
          trans: view([], "zee", "trans"),
        }),
        {},
        config,
        [
          { name: "main", view: "text" },
          { name: "translation", view: "trans" },
        ],
        zee,
      );

      expect(result.map((m) => m.anchor)).toEqual([
        "search:orig:0",
        "search:trans:0",
      ]);
    });
  });
});
