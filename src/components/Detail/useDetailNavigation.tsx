import { matchPath, Params, useNavigate, useParams } from "react-router-dom";
import { decodeObject, getUrlParams } from "../../utils/UrlParamUtils.ts";
import { SearchResult } from "../../model/Search.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { LAST_SEARCH_RESULT } from "../Search/SearchUrlParams.ts";
import { isNumber, isString } from "lodash";
import { detailTier2Path } from "../Text/Annotated/utils/detailPath.ts";
import { useUrlSearchParamsStore } from "../Search/useSearchUrlParamsStore.ts";

export type DetailTierAndParams = {
  highlight?: string;
  tier2: string;
};

type PathName = string;
export type NavigateDetailProps =
  | PathName
  | {
      path: string;
      from?: number;
      // When result update is not yet synced to store:
      nextSearchResults?: SearchResult;
    };

export function useDetailNavigation() {
  const params = useParams();
  const { searchResults } = useSearchStore();
  const navigate = useNavigate();
  const { updateSearchParams, updateDetailParams, searchQuery, detailParams } =
    useUrlSearchParamsStore();

  /**
   * Wrapper of useNavigate hook that sets and updates url search params
   * Note: to be used on detail pages
   */
  function navigateDetail(props: NavigateDetailProps) {
    let path: string;
    let nextSearchResults = searchResults;
    if (isString(props)) {
      path = new URL(props, location.toString()).pathname;
    } else {
      path = props.path;
      if (isNumber(props.from)) {
        updateSearchParams({ from: props.from });
      }
      if (props.nextSearchResults) {
        nextSearchResults = props.nextSearchResults;
      }
    }
    updateDetailParams({
      lastSearchResult: createLastSearchResultParam(
        path,
        nextSearchResults,
        detailParams.lastSearchResult,
      ),
    });

    navigate(`${path}${getUrlParams()}`);
  }

  function getDetailParams(): DetailTierAndParams {
    const tier2 = getTier2Validated(params);
    return {
      tier2,
      highlight: searchQuery.fullText,
    };
  }

  function createDetailUrl(resultId: string) {
    return `/detail/${resultId}${getUrlParams()}`;
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

    const lastSearchResultParam = decodeObject(getUrlParams())[
      LAST_SEARCH_RESULT
    ] as string;
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

/**
 * @return last result ID when needed
 * @return empty string otherwise
 */
function createLastSearchResultParam(
  path: string,
  searchResults: SearchResult | undefined,
  currentLastResultId: string,
): string {
  const nextTier2 = matchPath(detailTier2Path, path)?.params.tier2;
  const currentTier2 = matchPath(detailTier2Path, location.pathname)?.params
    .tier2;

  const isExitingDetailPage = !nextTier2;
  if (isExitingDetailPage) {
    return "";
  }

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);
  if (!isOnDetailPage) {
    return "";
  }
  if (!searchResults) {
    throw new Error("No search results on detail page");
  }
  const isNavigatingToSearchResult = isIdInResults(searchResults, nextTier2);
  if (isNavigatingToSearchResult) {
    return "";
  }
  const isViewingSearchResult =
    currentTier2 && isIdInResults(searchResults, currentTier2);
  if (isViewingSearchResult && !isNavigatingToSearchResult) {
    return currentTier2;
  }
  if (!isViewingSearchResult && !isNavigatingToSearchResult) {
    return currentLastResultId;
  }
  console.warn("Could not determine lastResultId");
  return "";
}

function isIdInResults(results: SearchResult, tier2: string) {
  return results.results.findIndex((r) => r._id === tier2) !== -1;
}
