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
   * Reference to the last result when a user navigated away from a search result on the detail page
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
      currentSearchResults: searchResults,
      currentPathParams: params,
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
  currentSearchResults?: SearchResult;
  currentPathParams: Params;
}) {
  const {
    nextResultId,
    nextUrlSearchParams,
    currentSearchResults,
    currentPathParams,
  } = props;

  if (!isOnDetailPage()) {
    // Last search result is irrelevant:
    nextUrlSearchParams.delete(LAST_SEARCH_RESULT);
  } else {
    if (!currentSearchResults) {
      throw new Error("No search results on detail page");
    }
    const currentTier2 = getTier2Validated(currentPathParams);

    if (isIdInResults(currentSearchResults, nextResultId)) {
      // Pointing to search result: param is not needed
      nextUrlSearchParams.delete(LAST_SEARCH_RESULT);
    } else {
      if (isIdInResults(currentSearchResults, currentTier2)) {
        /**
         * The user is navigating away from a result, so the last search
         * result is stored in {@link LAST_SEARCH_RESULT} to be able
         * to navigate to the next and prev search result:
         */
        nextUrlSearchParams.set(LAST_SEARCH_RESULT, currentTier2);
      } else {
        /**
         * Current and next detail page are not displaying a search result:
         * lastSearchResult can stay the same
         */
        console.log("lastSearchResult can stay the same");
      }
    }
  }
}

function isOnDetailPage(): boolean {
  return window.location.pathname.includes(detailPrefix);
}

function isIdInResults(results: SearchResult, tier2: string) {
  return results.results.findIndex((r) => r._id === tier2) !== -1;
}
