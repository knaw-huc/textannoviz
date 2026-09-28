import { AnnoRepoBodyBase } from "../../../../model/AnnoRepoAnnotation";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { FacetName, FacetOptionName, Terms } from "../../../../model/Search";

/**
 * Why an entity counts as a match: which selected facet it matched, and on
 * which of that facet's selected values.
 */
export type MatchedFacet = {
  facetName: FacetName;
  /**
   * The selected value the entity matched, spelled as the search UI spells
   * it. It is the aggregated index value, so it doubles as a label: listing
   * matches needs no second lookup into the annotation model.
   */
  value: FacetOptionName;
};

/**
 * Whether this project opts in to entity-facet matching.
 *
 * {@link ProjectConfig.entityMatchLocations} names where a match can be
 * revealed, and doubles as the opt-in: a project that has not declared any
 * has not had its entity data checked against its search index, so neither
 * the highlighter nor the scroll-target resolver should act on it.
 */
export function hasEntityMatching(config: ProjectConfig): boolean {
  return !!config.entityMatchLocations?.length && !!config.getEntityFacetValues;
}

/**
 * Whether the query filters on any facet at all
 */
export function hasSelectedFacets(terms: Terms): boolean {
  return Object.values(terms).some((selected) => selected.length > 0);
}

/**
 * Match an entity against the facets selected in the search query.
 * Shared by the highlighter and the match resolver so that both agree on
 * what counts as a match.
 *
 * @returns the first selected facet the entity matches, and the value it
 *          matched on
 * @returns undefined when the body is not an entity, or matches nothing
 *          selected
 */
export function getMatchedFacet(
  body: AnnoRepoBodyBase,
  terms: Terms,
  config: ProjectConfig,
): MatchedFacet | undefined {
  if (!config.getEntityFacetValues || !config.isEntity(body)) {
    return;
  }
  const facetValues = config.getEntityFacetValues(body);
  for (const [facetName, selected] of Object.entries(terms)) {
    if (!selected.length) {
      continue;
    }
    const value = facetValues[facetName]?.find((v) => selected.includes(v));
    if (value !== undefined) {
      return { facetName, value };
    }
  }
}
