import { matchPath, Params, useNavigate, useParams } from "react-router-dom";
import { getUrlParams } from "../../utils/UrlParamUtils.ts";
import { SearchParams, SearchResult } from "../../model/Search.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { LAST_SEARCH_RESULT } from "../Search/SearchUrlParams.ts";
import _ from "lodash";
import { detailTier2Path } from "../Text/Annotated/utils/detailPath.ts";
import { useUrlSearchParamsStore } from "../Search/useSearchUrlParamsStore.ts";

export type DetailParams = {
  highlight?: string;
  tier2: string;
};

type PathName = string;
export type NavigateDetailProps =
  | PathName
  | {
      path: string;
      searchParams?: Pick<SearchParams, "from">;
      // When result update is not yet synced to store:
      nextSearchResult?: SearchResult;
    };

export function useDetailNavigation() {
  const params = useParams();
  const { searchResults } = useSearchStore();
  const navigate = useNavigate();
  const { updateSearchParams, searchQuery } = useUrlSearchParamsStore();

  /**
   * Wrapper of useNavigate hook that sets and updates url search params
   * Note: to be used on detail pages
   */
  function navigateDetail(props: NavigateDetailProps) {
    let path: string;
    let nextSearchResult;
    if (_.isString(props)) {
      const url = new URL(props, location.toString());
      path = url.pathname;
      nextSearchResult = searchResults;
    } else {
      path = props.path;
      nextSearchResult = props.nextSearchResult ?? searchResults;
      if (props.searchParams) {
        updateSearchParams(props.searchParams);
      }
    }
    const nextUrlSearchParams = getUrlParams();

    updateLastSearchResultParam(nextUrlSearchParams, path, nextSearchResult);

    navigate(`${path}?${nextUrlSearchParams}`);
  }

  function getDetailParams(): DetailParams {
    const tier2 = getTier2Validated(params);
    return {
      tier2,
      highlight: searchQuery.fullText,
    };
  }

  function createDetailUrl(resultId: string) {
    return `/detail/${resultId}?${getUrlParams()}`;
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

    console.warn("findResultId: No last search result found");
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

function updateLastSearchResultParam(
  nextUrlSearchParams: URLSearchParams,
  path: string,
  searchResults: SearchResult | undefined,
) {
  const nextTier2 = matchPath(detailTier2Path, path)?.params.tier2;
  const currentTier2 = matchPath(detailTier2Path, location.pathname)?.params
    .tier2;

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
