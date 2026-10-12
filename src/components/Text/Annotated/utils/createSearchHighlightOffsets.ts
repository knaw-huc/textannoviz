import { TextPositions } from "../core";
import { HighlightBody } from "./highlightBodyGuards.ts";
import { BroccoliTextGeneric } from "../../../../model/Broccoli.ts";
import { createSearchHitAnchor } from "./hitAnchors.ts";

export function createSearchHighlightOffsets(
  text: BroccoliTextGeneric,
  regex: RegExp | undefined,
): TextPositions[] {
  const annotations: TextPositions[] = [];
  if (!regex) {
    return annotations;
  }
  annotations.push(...createSearchAnnotation(text, regex));
  return annotations;
}

function createSearchAnnotation(
  text: BroccoliTextGeneric,
  regex: RegExp,
): TextPositions<HighlightBody>[] {
  const matches = findSearchHits(text.body, regex);
  return matches.map(([start, end], i) => {
    return {
      type: "highlight",
      body: {
        id: `search-highlight-${i + 1}`,
        type: "search",
        anchor: createSearchHitAnchor(text, start),
      },
      start,
      end,
    };
  });
}

export type StartEndChar = [number, number];

/**
 * Find start and end character indexes of the search hits in a text.
 *
 * Shared by the highlighting and the list of hits, so the list never
 * disagrees with what is highlighted.
 *
 * Uses matchAll, which steps past empty matches and leaves the regex's
 * lastIndex alone. Empty matches are dropped: a stray empty search term (as
 * in `a||b`) matches between every character, and an empty hit is nothing to
 * highlight or scroll to.
 */
export function findSearchHits(text: string, regex: RegExp): StartEndChar[] {
  const hits: StartEndChar[] = [];
  for (const match of text.matchAll(regex)) {
    if (!match[0]) {
      continue;
    }
    hits.push([match.index, match.index + match[0].length]);
  }
  return hits;
}
