import { Base64 } from "js-base64";
import { SearchQuery } from "../../../stores/search/search-query-slice";
import { QUERY } from "../SearchUrlParams.ts";

export function getUrlQuery(urlParams: URLSearchParams): Partial<SearchQuery> {
  const queryEncoded = urlParams.get(QUERY);
  return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
}
