import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getSearchParamsFromUrl,
  getSearchQueryFromUrl,
  createUrlParams,
} from "../../utils/UrlParamUtils.ts";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { ProjectConfig } from "../../model/ProjectConfig.ts";

/**
 * The url is our single source of truth.
 * To keep the search params and query in sync with the url:
 * 1. update url with {@link updateSearchQuery}
 * 2. update search query and params with a useEffect
 */
export function useSearchUrlParams() {
  const [urlParams, setUrlParams] = useSearchParams();
  const projectConfig = useProjectStore(projectConfigSelector);

  const [searchQuery, setSearchQuery] = useState<SearchQuery>(
    getSearchQueryFromUrl(getDefaultQuery(projectConfig), urlParams),
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
    console.log("updateSearchParams", update);
    updateUrl({ searchParams: { ...searchParams, ...update } });
  }
  function updateUrl(update: UpdatedUrlProps) {
    const updatedUrlParams = createUrlParams(
      Object.fromEntries(urlParams.entries()),
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

export function getDefaultQuery(projectConfig: ProjectConfig) {
  const configuredSearchQuery = {
    ...blankSearchQuery,
    dateFrom: projectConfig.initialDateFrom,
    dateTo: projectConfig.initialDateTo,
    rangeFrom: projectConfig.initialRangeFrom,
    rangeTo: projectConfig.initialRangeTo,
  };
  if (projectConfig.showSliderFacets) {
    configuredSearchQuery.rangeFacet = "text.tokenCount";
  }
  return configuredSearchQuery;
}

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
  size: 3,
  sortBy: "_score",
  sortOrder: "desc",
};

export type UpdatedUrlProps = Partial<{
  searchQuery: SearchQuery;
  searchParams: SearchParams;
}>;
