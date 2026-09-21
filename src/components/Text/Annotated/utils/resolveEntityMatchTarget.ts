import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import {
  Broccoli,
  BroccoliRelativeAnno,
  BroccoliTextGeneric,
} from "../../../../model/Broccoli";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { Terms } from "../../../../model/Search";
import { findViewText } from "../../findViewText";
import { getMatchedFacet, hasSelectedFacets } from "./entityFacetMatch";

export type GetLocationTexts = (
  views: Broccoli["views"],
  config: ProjectConfig,
) => BroccoliTextGeneric[];

/**
 * A place the UI can reveal, paired with the text view(s) it renders.
 * Order is priority: the first location containing a match wins.
 */
export type EntityMatchLocation = {
  /** How the caller reveals this location, e.g. a panel name or sidebar tab key */
  name: string;
  /**
   * How the reader reveals this location. Defaults to "panel" (a main-area
   * {@link DetailPanelConfig} toggled through panel visibility); "tab" reveals
   * a sidebar tab through setActiveSidebarTab. The resolver ignores this and
   * echoes the location's {@link EntityMatchLocation.name} back on the target.
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
 * Where the first entity match lives, so the UI can reveal and scroll to it
 */
export type EntityMatchTarget = {
  /** {@link EntityMatchLocation.name} of the location holding the match */
  name: string;
  /** Body id of the first matching entity in that location */
  bodyId: string;
  /**
   * Character offset within the text holding the match, ordering matches
   * inside that text. Only comparable within that one text: a location can
   * render several, as notes render one text per footnote.
   */
  begin: number;
};

/**
 * Find where to send the reader for the entities they filtered on.
 *
 * Works purely from data: every view is fetched up front, so a match can be
 * located in a panel that is currently closed, without rendering it.
 */
export function resolveEntityMatchTarget(
  annotations: AnnoRepoAnnotation[],
  views: Broccoli["views"] | undefined,
  terms: Terms,
  config: ProjectConfig,
  locations: EntityMatchLocation[],
): EntityMatchTarget | undefined {
  if (!views || !hasSelectedFacets(terms)) {
    return;
  }

  const matchedBodyIds = new Set(
    annotations
      .filter(({ body }) => getMatchedFacet(body, terms, config))
      .map(({ body }) => body.id),
  );
  if (!matchedBodyIds.size) {
    return;
  }

  for (const { name, view } of locations) {
    for (const text of getLocationTexts(views, view, config)) {
      const earliest = findEarliestMatch(
        text.locations.annotations,
        matchedBodyIds,
      );
      if (earliest) {
        return { name, bodyId: earliest.bodyId, begin: earliest.begin };
      }
    }
  }
}

/**
 * The texts a location renders, in the order the reader sees them.
 *
 * A view spec names a single flat view. A function covers locations whose
 * views are not flat: the notes panel renders a map of per-footnote texts,
 * a shape {@link findViewText} cannot address. Both forms yield a list, so
 * the resolver can walk a location without knowing which form it was given.
 *
 * Order matters — the caller takes the first text holding a match — so a
 * function must list its texts exactly as its panel renders them.
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

function findEarliestMatch(
  relativeAnnotations: BroccoliRelativeAnno[],
  matchedBodyIds: Set<string>,
): BroccoliRelativeAnno | undefined {
  let earliest: BroccoliRelativeAnno | undefined;
  for (const relative of relativeAnnotations) {
    if (!matchedBodyIds.has(relative.bodyId)) {
      continue;
    }
    // Zero-length annotations render as markers, not as highlighted text,
    // so they are never something to scroll to
    if (relative.begin === relative.end) {
      continue;
    }
    if (!earliest || relative.begin < earliest.begin) {
      earliest = relative;
    }
  }
  return earliest;
}
