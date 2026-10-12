import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { Broccoli, BroccoliTextGeneric } from "../../../../model/Broccoli";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { Terms } from "../../../../model/Search";
import { findViewText } from "../../findViewText";
import { findSearchHits } from "./createSearchHighlightOffsets";
import { createSearchHitAnchor } from "./hitAnchors";
import {
  getMatchedFacet,
  hasSelectedFacets,
  MatchedFacet,
} from "./entityFacetMatch";

export type GetLocationTexts = (
  views: Broccoli["views"],
  config: ProjectConfig,
) => BroccoliTextGeneric[];

/**
 * A place the UI can reveal, paired with the text view(s) it renders.
 * Order is reading order: matches are listed location by location.
 */
export type SearchHitLocation = {
  /** How the caller reveals this location, e.g. a panel name or sidebar tab key */
  name: string;
  /**
   * How the reader reveals this location. Defaults to "panel" (a main-area
   * {@link DetailPanelConfig} toggled through panel visibility); "tab" reveals
   * a sidebar tab through setActiveSidebarTab. The resolver ignores this and
   * echoes the location's {@link SearchHitLocation.name} back on each match.
   */
  kind?: "panel" | "tab";
  /** Which panel holds this tab; only for kind "tab" */
  panel?: string;
  /**
   * The text(s) this location renders, in the order the reader sees them.
   * A view spec resolved by findViewText, or a function for locations whose
   * views are not flat — notes are a map of per-footnote texts.
   */
  view: string | string[] | GetLocationTexts;
};

type MatchBase = {
  /** {@link SearchHitLocation.name} of the location holding the match */
  name: string;
  /**
   * The hit anchor the highlighter puts on the match (see
   * {@link HIT_ANCHORS_ATTRIBUTE}), so it is what the reveal scrolls to.
   * Unique across the list.
   */
  anchor: string;
  /**
   * Character offset within the text holding the match. Only comparable
   * within that one text: a location can render several, as notes render one
   * text per footnote. Ordering across a letter lives in the array order.
   */
  begin: number;
};

/** An entity mention matching the selected facets */
export type EntitySearchHit = MatchBase &
  MatchedFacet & {
    kind: "entity";
    /** Body id of the matching entity, which is also its anchor */
    bodyId: string;
  };

/** A hit of the full-text search, as highlighted in the text */
export type FullTextSearchHit = MatchBase & {
  kind: "fullText";
  /** The text that matched, spelled as the letter spells it */
  value: string;
};

/**
 * One match in the letter: where it lives, so the UI can reveal and scroll to
 * it, and what it matched, so it can be listed.
 */
export type SearchHit = EntitySearchHit | FullTextSearchHit;

/**
 * Find every match of the reader's search, in the order they would meet them
 * reading the letter: location by location, and within a location text by
 * text, earliest offset first. Entity and full-text matches are interleaved,
 * so the first in the list is the first in the letter, whatever its kind.
 *
 * Works purely from data: every view is fetched up front, so matches can be
 * located in panels that are currently closed, without rendering them.
 *
 * @param searchRegex the regex the text is highlighted with, see
 *  {@link createSearchRegex}; undefined when there is no full-text search
 */
export function resolveSearchHits(
  annotations: AnnoRepoAnnotation[],
  views: Broccoli["views"] | undefined,
  terms: Terms,
  config: ProjectConfig,
  locations: SearchHitLocation[],
  searchRegex?: RegExp,
): SearchHit[] {
  if (!views || (!hasSelectedFacets(terms) && !searchRegex)) {
    return [];
  }

  const matchedFacets = new Map<string, MatchedFacet>();
  for (const { body } of annotations) {
    const matched = getMatchedFacet(body, terms, config);
    if (matched) {
      matchedFacets.set(body.id, matched);
    }
  }
  if (!matchedFacets.size && !searchRegex) {
    return [];
  }

  const matches: SearchHit[] = [];
  const listed = new Set<string>();

  for (const { name, view } of locations) {
    for (const text of getLocationTexts(views, view, config)) {
      for (const match of findMatchesInText(
        text,
        name,
        matchedFacets,
        searchRegex,
      )) {
        // An anchor can only ever be scrolled to where it first appears: an
        // entity that surfaces in two locations, or a text that two locations
        // both render. List it once, where the reader can actually be sent.
        if (listed.has(match.anchor)) {
          continue;
        }
        listed.add(match.anchor);
        matches.push(match);
      }
    }
  }
  return matches;
}

/**
 * The texts a location renders, in the order the reader sees them.
 *
 * A view spec names a single flat view. A function covers locations whose
 * views are not flat: the notes panel renders a map of per-footnote texts,
 * a shape {@link findViewText} cannot address. Both forms yield a list, so
 * the resolver can walk a location without knowing which form it was given.
 *
 * Order matters — the caller lists texts in reading order — so a function
 * must list its texts exactly as its panel renders them.
 */
function getLocationTexts(
  views: Broccoli["views"],
  view: SearchHitLocation["view"],
  config: ProjectConfig,
): BroccoliTextGeneric[] {
  if (typeof view === "function") {
    return view(views, config);
  }
  const text = findViewText(views, view);
  return text ? [text] : [];
}

/**
 * Every match in one text, earliest first. Broccoli does not promise its
 * relative annotations come in offset order, and within a single text the
 * offsets do compare, so sort entity and full-text matches together into the
 * order the reader reads them. On a tie, the entity comes first.
 */
function findMatchesInText(
  text: BroccoliTextGeneric,
  name: string,
  matchedFacets: Map<string, MatchedFacet>,
  searchRegex: RegExp | undefined,
): SearchHit[] {
  const matches: SearchHit[] = [];
  for (const { bodyId, begin, end } of text.locations.annotations) {
    const matched = matchedFacets.get(bodyId);
    // Zero-length annotations render as markers, not as highlighted text,
    // so they are never something to scroll to
    if (!matched || begin === end) {
      continue;
    }
    const { facetName, value } = matched;
    matches.push({
      kind: "entity",
      name,
      anchor: bodyId,
      begin,
      bodyId,
      facetName,
      value,
    });
  }
  if (searchRegex) {
    for (const [begin, end] of findSearchHits(text.body, searchRegex)) {
      matches.push({
        kind: "fullText",
        name,
        anchor: createSearchHitAnchor(text, begin),
        begin,
        value: text.body.slice(begin, end),
      });
    }
  }
  return matches.sort((a, b) => a.begin - b.begin);
}
