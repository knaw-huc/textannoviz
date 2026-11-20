import { SearchQuery } from "../../../model/Search";
import { encodeObject } from "../../../utils/url/UrlParamUtils";
import {
  Artwork,
  isArtworkBody,
  isPersonBody,
  PersonTeiRef,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

export function toEntitySearchQuery(
  entityBody: PersonTeiRef | Artwork,
  entityCategory: string,
): string {
  if (isPersonBody(entityBody)) {
    return createSearchQueryParam(toEntityTerms(entityCategory, entityBody.id));
  } else if (isArtworkBody(entityBody)) {
    return createSearchQueryParam(toEntityTerms(entityCategory, entityBody.id));
  } else {
    throw new Error("Unknown entity: " + JSON.stringify(entityBody));
  }
}

const entityCategoryToIdFacet: Record<string, string> = {
  PER: "personIds",
  ART: "artworkIds",
};

function toEntityTerms(
  annoCategory: string,
  entityId: string,
): Partial<SearchQuery> {
  const facet = entityCategoryToIdFacet[annoCategory];
  if (!facet) {
    throw new Error(`No id facet for entity category: ${annoCategory}`);
  }
  return { terms: { [facet]: [entityId] } };
}

function createSearchQueryParam(queryWithEntity: Partial<SearchQuery>): string {
  return encodeObject({ query: queryWithEntity });
}
