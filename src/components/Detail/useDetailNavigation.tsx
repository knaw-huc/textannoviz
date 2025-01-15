import {
  matchPath,
  Params,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  cleanUrlParams,
  getUrlParams,
  setUrlParams,
} from "../../utils/UrlParamUtils.ts";
import { SearchResult } from "../../model/Search.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { LAST_SEARCH_RESULT } from "../Search/SearchUrlParams.ts";
import _ from "lodash";
import { detailTier2Path } from "../Text/Annotated/utils/detailPath.ts";

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
  const [urlParams] = useSearchParams();
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

    const nextTier2 = matchPath(detailTier2Path, path)?.params.tier2;
    const currentTier2 = matchPath(detailTier2Path, location.pathname)?.params
      .tier2;

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
      highlight: urlParams.get("highlight") || undefined,
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

  return {
    getDetailParams,
    createDetailUrl,
    navigateDetail,
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

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);
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
