import _ from "lodash";
import React, { useEffect, useState } from "react";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { toRequestBody } from "../../stores/search/toRequestBody.ts";
import { sendSearchQuery } from "../../utils/broccoli";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { SearchForm } from "./SearchForm.tsx";
import { SearchLoadingSpinner } from "./SearchLoadingSpinner.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { useInitSearch } from "./useInitSearch.ts";
import { useSearchResults } from "./useSearchResults.tsx";
import { useIsDefaultQuery } from "./useIsDefaultQuery.ts";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isDirty, setDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { searchQuery, searchParams, updateSearchParams } =
    useUrlSearchParamsStore();
  const { isInitSearch, isLoadingSearch } = useSearchStore();

  useInitSearch();

  const { getSearchResults } = useSearchResults();
  const {
    setSearchResults,
    searchFacetTypes,
    setKeywordFacets,
    keywordFacets,
    addToHistory,
    searchResults,
  } = useSearchStore();

  useEffect(() => {
    setIsLoading(isLoadingSearch);
  }, [isLoadingSearch]);

  const [prevRequest, setPrevRequest] = useState<SearchQuery & SearchParams>();

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    /*
      - using a shallow clone ({ ...searchQuery, ...searchParams }) causes prevRequest to be the same as nextRequest once the first request is done, i.e., in every request after the first request, prevRequest and nextRequest are equal to each other.
      - using a deep clone fixes this issue; now both top-level and nested objects and arrays are rebuild every time, so no more old references
    */
    const nextRequest = _.cloneDeep({ ...searchQuery, ...searchParams });

    if (_.isEqual(prevRequest, nextRequest)) {
      return;
    }
    setPrevRequest(nextRequest);

    const aborter = new AbortController();
    searchWhenDirty().catch(handleAbort);
    return () => {
      setIsLoading(false);
      aborter.abort();
    };

    async function searchWhenDirty() {
      setIsLoading(true);
      const searchResults = await getSearchResults(
        searchFacetTypes,
        searchParams,
        searchQuery,
        aborter.signal,
      );
      setIsLoading(false);

      if (searchResults) {
        setSearchResults(searchResults.results);
        setKeywordFacets(searchResults.facets);
      }

      addToHistory(searchQuery);
      setDirty(false);
    }
  }, [
    isDirty,
    searchQuery,
    searchParams,
    prevRequest,
    getSearchResults,
    searchFacetTypes,
    setSearchResults,
    setKeywordFacets,
    addToHistory,
  ]);

  async function updateAggs(query: SearchQuery) {
    setIsLoading(true);
    const newParams = {
      ...searchParams,
      indexName: projectConfig.elasticIndexName,
      size: 0,
    };

    const searchResults = await sendSearchQuery(
      projectConfig,
      newParams,
      toRequestBody(query),
    );

    setIsLoading(false);

    if (searchResults) {
      setKeywordFacets(
        filterFacetsByType(searchFacetTypes, searchResults.aggs, "keyword"),
      );
    }
  }

  function handleNewSearch(toFirstPage: boolean = true) {
    if (toFirstPage) {
      updateSearchParams({ from: 0 });
    }
    setDirty(true);
  }

  function handlePageChange() {
    setDirty(true);
  }

  const { isDefaultQuery } = useIsDefaultQuery();

  return (
    <React.Fragment>
      {isLoading && <SearchLoadingSpinner />}
      <div
        id="searchContainer"
        className="mx-auto flex w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <SearchForm
          variant="desktop"
          onSearch={handleNewSearch}
          keywordFacets={keywordFacets}
          searchQuery={searchQuery}
          updateAggs={updateAggs}
        />
        <SearchResultsColumn>
          {/* Wait for init, to prevent a flicker of info page before results are shown: */}
          {isInitSearch && isDefaultQuery && (
            <projectConfig.components.SearchInfoPage />
          )}
          {isInitSearch && searchResults && (
            <SearchResults
              onSearch={handleNewSearch}
              onPageChange={handlePageChange}
              searchQuery={searchQuery}
              onToggleFilters={() => setIsFiltersOpen((prev) => !prev)}
            />
          )}
        </SearchResultsColumn>
      </div>

      {isFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/40 lg:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="h-full w-full max-w-[400px] overflow-y-auto bg-white">
            <div className="flex items-center justify-end border-b px-4 py-3">
              <button
                type="button"
                className="text-sm underline"
                onClick={() => setIsFiltersOpen(false)}
              >
                &#10006;
              </button>
            </div>
            <div className="px-2 pb-4 pt-2">
              <SearchForm
                variant="mobile"
                onSearch={handleNewSearch}
                keywordFacets={keywordFacets}
                searchQuery={searchQuery}
                updateAggs={updateAggs}
              />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};
