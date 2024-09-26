import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";
import { skipEmptyValues } from "../../../utils/skipEmptyValues.ts";
import { Base64 } from "js-base64";
import { SearchStore } from "../../../stores/search/search-store.ts";
import { isDateEntity } from "./ProjectAnnotationModel.ts";

/**
 * @returns false when not implemented
 */
export function toEntitySearchQuery(
  anno: AnnoRepoBodyBase,
  searchStore: SearchStore,
): URLSearchParams | false {
  if (isDateEntity(anno)) {
    return toDateSearchQuery(anno.metadata.date, searchStore);
  } else {
    return false;
  }
}

function toDateSearchQuery(
  date: string,
  searchStore: SearchStore,
): URLSearchParams {
  const { searchQuery, searchUrlParams } = searchStore;
  const params = new URLSearchParams();
  Object.entries(searchUrlParams).forEach(([k, v]) => {
    params.set(k, `${v}`);
  });
  const queryWithDate = structuredClone(searchQuery);
  queryWithDate.dateFrom = date;
  queryWithDate.dateTo = date;
  params.set(
    "query",
    Base64.encode(JSON.stringify(queryWithDate, skipEmptyValues)),
  );
  return params;
}
