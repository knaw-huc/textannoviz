import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSearchParamsFromUrl,
  getSearchQueryFromUrl,
  updateUrlParams,
} from "../../utils/UrlParamUtils.ts";
import { SearchParams, SearchQuery } from "../../model/Search.ts";

export const defaultSearchQuery: SearchQuery = {
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

export function useSearchUrlParams() {
  const [urlParams, setUrlParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(defaultSearchQuery, urlParams),
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
    const updatedUrlParams = updateUrlParams(
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
