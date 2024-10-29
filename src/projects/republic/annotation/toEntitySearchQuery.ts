import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";
import { skipEmptyValues } from "../../../utils/skipEmptyValues.ts";
import { Base64 } from "js-base64";
import {
  entityCategoryToFacetName,
  isDateEntity,
  isEntityEntity,
} from "./ProjectAnnotationModel.ts";
import { SearchQuery } from "../../../stores/search/search-query-slice.ts";

export function toEntitySearchQuery(anno: AnnoRepoBodyBase): URLSearchParams {
  if (isDateEntity(anno)) {
    return createSearchQueryParam(toDateEntityQueryParams(anno.metadata.date));
  } else if (isEntityEntity(anno)) {
    return createSearchQueryParam(
      toEntityQueryParam(anno.metadata.category, anno.metadata.entityID),
    );
  } else {
    throw new Error("Unknown entity " + JSON.stringify(anno));
  }
}

function toDateEntityQueryParams(date: string): Partial<SearchQuery> {
  const queryWithDate = {} as Partial<SearchQuery>;
  queryWithDate.dateFrom = date;
  queryWithDate.dateTo = date;
  return queryWithDate;
}

function toEntityQueryParam(
  entityCategory: string,
  entityId: string,
): Partial<SearchQuery> {
  const entityIdFacetName = entityCategoryToFacetName[entityCategory];
  if (!entityCategory) {
    throw new Error("Unknown entity category " + entityCategory);
  }
  return {
    terms: {
      [entityIdFacetName]: [entityId],
    },
  };
}

function createSearchQueryParam(queryWithEntity: Partial<SearchQuery>) {
  const params = new URLSearchParams();
  params.set(
    "query",
    Base64.encode(JSON.stringify(queryWithEntity, skipEmptyValues)),
  );
  return params;
}
