import { useEffect, useState } from "react";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { sendSearchQuery } from "../../utils/broccoli";
import { SearchForm } from "./SearchForm.tsx";
import { SearchLoadingSpinner } from "./SearchLoadingSpinner.tsx";
import { SearchResults, SearchResultsColumn } from "./SearchResults.tsx";
import { useSearchResults } from "./useSearchResults.tsx";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";
import { toRequestBody } from "../../stores/search/toRequestBody.ts";
import { filterFacetsByType } from "../../stores/search/filterFacetsByType.ts";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import { useInitSearch } from "./useInitSearch.ts";
import _ from "lodash";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isDirty, setDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isShowingResults, setShowingResults] = useState(false);
  const { searchQuery, searchParams, toFirstPage } = useSearchUrlParams();
  const { isInitSearch, isLoadingSearch, defaultQuery } = useInitSearch();
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
    if (isInitSearch && searchResults) {
      setShowingResults(true);
    }
  }, [isInitSearch, searchResults]);

  useEffect(() => {
    setIsLoading(isLoadingSearch);
  }, [isLoadingSearch]);

  const [prevRequest, setPrevRequest] = useState<SearchQuery & SearchParams>();

  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const nextRequest = { ...searchQuery, ...searchParams };
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
      setShowingResults(true);
      setDirty(false);
    }
  }, [isDirty, searchQuery, searchParams]);

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

  function handleNewSearch() {
    toFirstPage();
    setDirty(true);
  }

  function handlePageChange() {
    setDirty(true);
  }

  const [isDefaultQuery, setIsDefaultQuery] = useState(false);
  useEffect(() => {
    const result = _.isEqual(defaultQuery, searchQuery);
    console.log("isDefaultQuery?", { result, defaultQuery, searchQuery });
    setIsDefaultQuery(result);
  }, [defaultQuery, searchQuery, searchResults]);

  return (
    <div>
      <p>Is default? {`${isDefaultQuery}`}</p>

      {isLoading && <SearchLoadingSpinner />}

      <div
        id="searchContainer"
        className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <SearchForm
          onSearch={handleNewSearch}
          keywordFacets={keywordFacets}
          searchQuery={searchQuery}
          updateAggs={updateAggs}
        />
        <SearchResultsColumn>
          {/* Wait for init, to prevent a flicker of info page before results are shown: */}
          {!isShowingResults && isInitSearch && (
            <projectConfig.components.SearchInfoPage />
          )}
          {isShowingResults && (
            <SearchResults
              onSearch={handleNewSearch}
              onPageChange={handlePageChange}
              query={searchQuery}
            />
          )}
        </SearchResultsColumn>
      </div>
    </div>
  );
};
