import { matchPath, Params, useNavigate, useParams } from "react-router-dom";
import {
  cleanUrlParams,
  getUrlParams,
  setUrlParams,
} from "../../utils/UrlParamUtils.ts";
import { SearchResult } from "../../model/Search.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { LAST_SEARCH_RESULT } from "../Search/SearchUrlParams.ts";
import _ from "lodash";
import { detailPath } from "../Text/Annotated/utils/detailPath.ts";

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

type PathName = string;
export type NavigateDetailProps =
  | PathName
  | {
      path: string;
      params: DetailUrlSearchParams;
    };

export function useDetailNavigation() {
  const params = useParams();
  const { searchResults } = useSearchStore();
  const navigate = useNavigate();

  /**
   * Wrapper of useNavigate hook that sets and updates url search params
   * Note: to be used on detail pages
   */
  function navigateDetail(props: NavigateDetailProps) {
    let path: string;
    const nextUrlSearchParams: URLSearchParams = getUrlParams();
    if (_.isString(props)) {
      const url = new URL(props, location.toString());
      path = url.pathname;
    } else {
      path = props.path;
      setUrlParams(nextUrlSearchParams, cleanUrlParams(props.params));
    }

    const nextTier2 = matchPath(detailPath, path)?.params.tier2;
    const currentTier2 = matchPath(detailPath, location.pathname)?.params.tier2;

    updateLastSearchResultParam({
      nextUrlSearchParams,
      nextTier2,
      searchResults,
      currentTier2,
    });

    navigate(`${path}?${nextUrlSearchParams}`);
  }

  function getDetailParams(): DetailParams {
    const tier2 = getTier2Validated(params);
    return {
      tier2,
      highlight: getUrlParams().get("highlight") || undefined,
    };
  }

  function createDetailUrl(
    resultId: string,
    detailParams?: DetailUrlSearchParams,
  ) {
    const path = `/detail/${resultId}`;
    const nextUrlSearchParams = getUrlParams();
    if (detailParams) {
      setUrlParams(nextUrlSearchParams, cleanUrlParams(detailParams));
    }
    return `${path}?${nextUrlSearchParams}`;
  }

  /**
   * @returns
   *  - current search result ID, from tier2 or {@link LAST_SEARCH_RESULT}
   *  - undefined: should only happen when entering page without search query
   */
  function findResultId(): string | undefined {
    if (
      params.tier2 &&
      searchResults &&
      isIdInResults(searchResults, params.tier2)
    ) {
      return params.tier2;
    }

    const lastSearchResultParam = getUrlParams().get(LAST_SEARCH_RESULT);
    if (
      lastSearchResultParam &&
      searchResults &&
      isIdInResults(searchResults, lastSearchResultParam)
    ) {
      return lastSearchResultParam;
    }

    console.debug(
      `No search result found by tier2=${params.tier2}` +
        ` or ${LAST_SEARCH_RESULT}=${lastSearchResultParam}`,
    );
    return undefined;
  }

  return {
    getDetailParams,
    createDetailUrl,
    navigateDetail,
    findResultId,
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
  nextTier2?: string;
  nextUrlSearchParams: URLSearchParams;
  searchResults?: SearchResult;
  currentTier2?: string;
}) {
  const { nextTier2, nextUrlSearchParams, searchResults, currentTier2 } = props;

  const isExitingDetailPage = !nextTier2;
  if (isExitingDetailPage) {
    nextUrlSearchParams.delete(LAST_SEARCH_RESULT);
    return;
  }

  const isOnDetailPage = !!matchPath(detailPath, location.pathname);
  if (!isOnDetailPage) {
    nextUrlSearchParams.delete(LAST_SEARCH_RESULT);
    return;
  }
  if (!searchResults) {
    throw new Error("No search results on detail page");
  }
  const isNavigatingToSearchResult = isIdInResults(searchResults, nextTier2);
  if (isNavigatingToSearchResult) {
    nextUrlSearchParams.delete(LAST_SEARCH_RESULT);
    return;
  }

  const isViewingSearchResult =
    currentTier2 && isIdInResults(searchResults, currentTier2);
  if (isViewingSearchResult && !isNavigatingToSearchResult) {
    nextUrlSearchParams.set(LAST_SEARCH_RESULT, currentTier2);
  }
}

function isIdInResults(results: SearchResult, tier2: string) {
  return results.results.findIndex((r) => r._id === tier2) !== -1;
}
