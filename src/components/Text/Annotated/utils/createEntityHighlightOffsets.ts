import { AnnoRepoAnnotation } from "../../../../model/AnnoRepoAnnotation";
import { BroccoliRelativeAnno } from "../../../../model/Broccoli";
import { ProjectConfig } from "../../../../model/ProjectConfig";
import { Terms } from "../../../../model/Search";
import { TextPositions } from "../core";
import { getMatchedFacet, hasSelectedFacets } from "./entityFacetMatch";
import { HighlightBody } from "./highlightBodyGuards";

export function createEntityHighlightOffsets(
  annotations: AnnoRepoAnnotation[],
  relativePositionMap: Map<string, BroccoliRelativeAnno>,
  terms: Terms,
  config: ProjectConfig,
): TextPositions<HighlightBody>[] {
  const result: TextPositions<HighlightBody>[] = [];

  if (!hasSelectedFacets(terms)) {
    return result;
  }

  let i = 0;
  for (const { body } of annotations) {
    const matchedFacet = getMatchedFacet(body, terms, config);
    if (!matchedFacet) continue;

    const relative = relativePositionMap.get(body.id);
    if (!relative || relative.begin === relative.end) continue;

    result.push({
      type: "highlight",
      body: {
        id: `entity-highlight-${i++}`,
        type: "entity-match",
        facetName: matchedFacet,
        bodyId: body.id,
      },
      start: relative.begin ?? 0,
      end: relative.end,
    });
  }
  return result;
}
