import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import {
  Broccoli,
  BroccoliRelativeAnno,
  BroccoliTextGeneric,
} from "../../../../model/Broccoli";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { Terms } from "../../../../model/Search";
import { findViewText } from "../../findViewText";
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
export type EntityMatchLocation = {
  /** How the caller reveals this location, e.g. a panel name or sidebar tab key */
  name: string;
  /**
   * How the reader reveals this location. Defaults to "panel" (a main-area
   * {@link DetailPanelConfig} toggled through panel visibility); "tab" reveals
   * a sidebar tab through setActiveSidebarTab. The resolver ignores this and
   * echoes the location's {@link EntityMatchLocation.name} back on each match.
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

/**
 * One entity mention matching the selected facets: where it lives, so the UI
 * can reveal and scroll to it, and what it matched, so it can be listed.
 */
export type EntityMatch = MatchedFacet & {
  /** {@link EntityMatchLocation.name} of the location holding the match */
  name: string;
  /**
   * Body id of the matching entity. Doubles as the id of the DOM anchor the
   * highlighter puts on the mention, so it is what the reveal scrolls to.
   */
  bodyId: string;
  /**
   * Character offset within the text holding the match. Only comparable
   * within that one text: a location can render several, as notes render one
   * text per footnote. Ordering across a letter lives in the array order.
   */
  begin: number;
};

/**
 * Find every entity the reader filtered on, in the order they would meet them
 * reading the letter: location by location, and within a location text by
 * text, earliest offset first.
 *
 * Works purely from data: every view is fetched up front, so matches can be
 * located in panels that are currently closed, without rendering them.
 */
export function resolveEntityMatches(
  annotations: AnnoRepoAnnotation[],
  views: Broccoli["views"] | undefined,
  terms: Terms,
  config: ProjectConfig,
  locations: EntityMatchLocation[],
): EntityMatch[] {
  if (!views || !hasSelectedFacets(terms)) {
    return [];
  }

  const matchedFacets = new Map<string, MatchedFacet>();
  for (const { body } of annotations) {
    const matched = getMatchedFacet(body, terms, config);
    if (matched) {
      matchedFacets.set(body.id, matched);
    }
  }
  if (!matchedFacets.size) {
    return [];
  }

  const matches: EntityMatch[] = [];
  const listed = new Set<string>();

  for (const { name, view } of locations) {
    for (const text of getLocationTexts(views, view, config)) {
      for (const { bodyId, begin, facetName, value } of findMatchesInText(
        text,
        matchedFacets,
      )) {
        // The anchor the reveal scrolls to is keyed by body id, so a body
        // that surfaces in two locations can only ever be scrolled to in the
        // first. List it once, where the reader can actually be sent.
        if (listed.has(bodyId)) {
          continue;
        }
        listed.add(bodyId);
        matches.push({ name, bodyId, begin, facetName, value });
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
  view: EntityMatchLocation["view"],
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
 * offsets do compare, so sort them into the order the reader reads them.
 */
function findMatchesInText(
  text: BroccoliTextGeneric,
  matchedFacets: Map<string, MatchedFacet>,
): (BroccoliRelativeAnno & MatchedFacet)[] {
  const matches: (BroccoliRelativeAnno & MatchedFacet)[] = [];
  for (const relative of text.locations.annotations) {
    const matched = matchedFacets.get(relative.bodyId);
    // Zero-length annotations render as markers, not as highlighted text,
    // so they are never something to scroll to
    if (!matched || relative.begin === relative.end) {
      continue;
    }
    matches.push({ ...relative, ...matched });
  }
  return matches.sort((a, b) => a.begin - b.begin);
}
