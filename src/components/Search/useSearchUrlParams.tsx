import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSearchParamsFromUrl,
  getSearchQueryFromUrl,
  createUrlParams,
} from "../../utils/UrlParamUtils.ts";
import { SearchParams, SearchQuery } from "../../model/Search.ts";

export const blankSearchQuery: SearchQuery = {
  dateFrom: "",
  dateTo: "",
  rangeFrom: "",
  rangeTo: "",
  fullText: "",
  terms: {},
};

export const defaultSearchParams: SearchParams = {
  indexName: "",
  fragmentSize: 100,
  from: 0,
  size: 10,
  sortBy: "_score",
  sortOrder: "desc",
};

export type UpdatedUrlProps = Partial<{
  searchQuery: SearchQuery;
  searchParams: SearchParams;
}>;

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useSearchUrlParams() {
  const [urlParams, setUrlParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(blankSearchQuery, urlParams),
  );
  const [searchParams, setSearchParams] = useState<SearchParams>(
    getSearchParamsFromUrl(defaultSearchParams, urlParams),
  );

  useEffect(() => {
    setSearchParams(getSearchParamsFromUrl(searchParams, urlParams));
    setSearchQuery(getSearchQueryFromUrl(searchQuery, urlParams));
  }, [urlParams]);

  function updateSearchQuery(update: Partial<SearchQuery>): void {
    updateUrl({ searchQuery: { ...searchQuery, ...update } });
  }

  function updateSearchParams(update: Partial<SearchParams>): void {
    updateUrl({ searchParams: { ...searchParams, ...update } });
  }

  function updateUrl(update: UpdatedUrlProps) {
    const updatedUrlParams = createUrlParams(
      urlParams,
      update.searchParams || searchParams,
      update.searchQuery || searchQuery,
    );
    if (
      new URLSearchParams(updatedUrlParams).toString() === urlParams.toString()
    ) {
      return;
    }
    setUrlParams(updatedUrlParams);
  }

  function toFirstPage() {
    updateSearchParams({ from: 0 });
  }

  return {
    searchQuery,
    updateSearchQuery,
    searchParams,
    updateSearchParams,
    toFirstPage,
  };
}
