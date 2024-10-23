import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";
import { skipEmptyValues } from "../../../utils/skipEmptyValues.ts";
import { Base64 } from "js-base64";
import { isDateEntity } from "./ProjectAnnotationModel.ts";
import { QUERY } from "../../../components/Search/SearchUrlParams.ts";
import { SearchParams, SearchQuery } from "../../../model/Search.ts";

/**
 * @returns false when not implemented
 */
export function toEntitySearchQuery(
  anno: AnnoRepoBodyBase,
  searchQuery: SearchQuery,
  searchParams: SearchParams,
): URLSearchParams | false {
  if (isDateEntity(anno)) {
    return toDateSearchQuery(anno.metadata.date, searchQuery, searchParams);
  } else {
    // TODO:
    return false;
  }
}

function toDateSearchQuery(
  date: string,
  searchQuery: SearchQuery,
  searchParams: SearchParams,
): URLSearchParams {
  const params = new URLSearchParams();
  Object.entries(searchParams).forEach(([k, v]) => {
    params.set(k, `${v}`);
  });
  const queryWithDate = structuredClone(searchQuery);
  queryWithDate.dateFrom = date;
  queryWithDate.dateTo = date;
  params.set(
    QUERY,
    Base64.encode(JSON.stringify(queryWithDate, skipEmptyValues)),
  );
  return params;
}
