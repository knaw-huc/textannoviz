import { SearchQuery } from "../../../model/Search";
import { encodeObject } from "../../../utils/url/UrlParamUtils";
import {
  Artwork,
  entityCategoryToAgg,
  isArtworkBody,
  isPersonBody,
  PersonTeiRef,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel.ts";

export function toEntitySearchQuery(
  entityBody: PersonTeiRef | Artwork,
  entityCategory: string,
): string {
  if (isPersonBody(entityBody)) {
    return createSearchQueryParam(
      toEntityTerms(entityCategory, entityBody.sortLabel),
    );
  } else if (isArtworkBody(entityBody)) {
    return createSearchQueryParam(toEntityTerms(entityCategory, entityBody.id));
  } else {
    throw new Error("Unknown entity: " + JSON.stringify(entityBody));
  }
}

function toEntityTerms(
  annoCategory: string,
  searchString: string,
): Partial<SearchQuery> {
  const entityAgg = entityCategoryToAgg[annoCategory];

  if (annoCategory === "ART") {
    return {
      terms: {
        [`artworkIds`]: [searchString],
      },
    };
  } else {
    return {
      terms: {
        [entityAgg]: [searchString],
      },
    };
  }
}

function createSearchQueryParam(queryWithEntity: Partial<SearchQuery>): string {
  return encodeObject({ query: queryWithEntity });
}
