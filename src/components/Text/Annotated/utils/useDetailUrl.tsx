import { Params, useParams, useSearchParams } from "react-router-dom";
import {
  cleanUrlParams,
  getUrlParams,
  setUrlParams,
} from "../../../../utils/UrlParamUtils.ts";
import { SearchResult } from "../../../../model/Search.ts";
import { useSearchStore } from "../../../../stores/search/search-store.ts";
import { LAST_SEARCH_RESULT } from "../../../Search/SearchUrlParams.ts";

export const detailPrefix = `detail/`;

export type DetailUrlSearchParams = {
  highlight?: string;
  from?: number;

  /**
   * Remember last search result when navigating away from a search result
   * on the detail page, to be able to navigate to next/prev search result
   */
  lastSearchResult?: string;
};

export type DetailParams = DetailUrlSearchParams & {
  tier2: string;
};

export function useDetailUrl() {
  const params = useParams();
  const [urlParams] = useSearchParams();
  const { searchResults } = useSearchStore();

  function getDetailUrlParams(): DetailParams {
    const tier2 = getTier2Validated(params);
    return {
      tier2,
      ...getDetailUrlSearchParams(),
    };
  }

  function getDetailUrlSearchParams(): DetailUrlSearchParams {
    return {
      highlight: urlParams.get("highlight") || undefined,
    };
  }

  function createDetailUrl(
    resultId: string,
    detailParams?: DetailUrlSearchParams,
  ) {
    const nextUrlSearchParams = getUrlParams();
    if (detailParams) {
      setUrlParams(nextUrlSearchParams, cleanUrlParams(detailParams));
    }

    updateLastSearchResultParam({
      nextUrlSearchParams,
      nextResultId: resultId,
      searchResults,
      pathParams: params,
    });

    return `/detail/${resultId}?${nextUrlSearchParams}`;
  }

  return {
    getDetailUrlParams,
    createDetailUrl,
  };
}

function getTier2Validated(params: Params) {
  const tier2 = params.tier2;
  if (!tier2) {
    throw new Error("No tier2 found in url");
  }
  return tier2;
}

function updateLastSearchResultParam(props: {
  nextResultId: string;
  nextUrlSearchParams: URLSearchParams;
  searchResults?: SearchResult;
  pathParams: Params;
}) {
  const { nextResultId, nextUrlSearchParams, searchResults, pathParams } =
    props;

  const isOnDetailPage = location.pathname.includes(detailPrefix);
  if (!isOnDetailPage) {
    nextUrlSearchParams.delete(LAST_SEARCH_RESULT);
    return;
  }
  if (!searchResults) {
    throw new Error("No search results on detail page");
  }
  const isNavigatingToSearchResult = isIdInResults(searchResults, nextResultId);
  if (isNavigatingToSearchResult) {
    nextUrlSearchParams.delete(LAST_SEARCH_RESULT);
    return;
  }

  const currentTier2 = getTier2Validated(pathParams);
  const isViewingSearchResult = isIdInResults(searchResults, currentTier2);
  if (isViewingSearchResult && !isNavigatingToSearchResult) {
    nextUrlSearchParams.set(LAST_SEARCH_RESULT, currentTier2);
  }
}

function isIdInResults(results: SearchResult, tier2: string) {
  return results.results.findIndex((r) => r._id === tier2) !== -1;
}
