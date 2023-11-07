import {Base64} from "js-base64";
import React, {ChangeEvent, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {FacetName, FacetOptionName, Facets, SearchQueryRequestBody} from "../../model/Search";
import {projectConfigSelector, useProjectStore,} from "../../stores/project.ts";
import {useSearchStore} from "../../stores/search/search-store.ts";
import {getElasticIndices, sendSearchQuery} from "../../utils/broccoli";
import {Fragmenter} from "./Fragmenter";
import {SearchQueryHistory} from "./SearchQueryHistory.tsx";
import {KeywordFacet} from "./KeywordFacet.tsx";
import {DateFacet} from "./DateFacet.tsx";
import {SearchResults} from "./SearchResults.tsx";
import {SortOrder} from "../../stores/search/search-params-slice.ts";
import * as _ from "lodash";
import {
  filterFacetByTypeSelector,
  queryBodySelector,
  searchHistorySelector,
  SearchQuery
} from "../../stores/search/search-query-slice.ts";
import {createHighlights} from "./util/createHighlights.ts";
import {removeTerm} from "./util/removeTerm.ts";
import {FullTextSearchBar} from "./FullTextSearchBar.tsx";
import {NewSearchButton} from "./NewSearchButton.tsx";
import {toPageNumber} from "./util/toPageNumber.ts";
import {FRAGMENTER, FROM, PAGE, QUERY} from "./SearchUrlParams.ts";
import {useDebounce} from "../../utils/useDebounce.tsx";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isDirty, setDirty] = React.useState(false);
  const [facets, setFacets] = React.useState<Facets>({});
  const [urlParams, setUrlParams] = useSearchParams();
  const {
    searchUrlParams, setSearchUrlParams,
    searchQuery, setSearchQuery,
    searchResult, setSearchResults,
    setTextToHighlight
  } = useSearchStore();
  const searchQueryRequestBody = useSearchStore(queryBodySelector);
  const queryHistory = useSearchStore(searchHistorySelector);
  const filterFacetsByType = useSearchStore(filterFacetByTypeSelector);
  const debouncedFullText = useDebounce<string>(searchQuery.fullText);

  useEffect(() => {
    initSearch();

    async function initSearch() {
      const queryDecoded = getUrlQuery(urlParams);

      const update = {
        ...searchQuery,
        dateFrom: projectConfig.initialDateFrom,
        dateTo: projectConfig.initialDateTo,
        ...queryDecoded
      };
      setSearchQuery(update);

      const newIndices = await getElasticIndices(projectConfig);
      if (newIndices) {
        update.index = newIndices[projectConfig.elasticIndexName];
      }

      setDirty(true);
    }
  }, []);

  useEffect(() => {
    syncUrlWithSearchParams();

    function syncUrlWithSearchParams() {
      setUrlParams(prev => {
        const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);

        return {
          ...Object.fromEntries(prev.entries()),
          ..._.mapValues(searchUrlParams, v => `${v}`),
          query: Base64.toBase64(cleanQuery),
        };

        function skipEmptyValues(_: string, v: any) {
          return [null, ""].includes(v) ? undefined : v;
        }
      });
    }
  }, [searchUrlParams, searchQuery]);

  useEffect(() => {
    searchWhenDirty();

    async function searchWhenDirty() {
      if (!isDirty) {
        return;
      }
      if (!searchQueryRequestBody.terms) {
        return;
      }
      const data = await sendSearchQuery(projectConfig, searchUrlParams, searchQueryRequestBody);
      if (!data) {
        return;
      }
      setSearchResults(data);
      const newFacets = data?.aggs;
      if (newFacets) {
        setFacets(newFacets);
      }
      setSearchUrlParams({...searchUrlParams, from: 0});
      setDirty(false);
    }
  }, [isDirty]);

  useEffect(() => {
    setDirty(true);
  }, [debouncedFullText])

  function getUrlQuery(urlParams: URLSearchParams): Partial<SearchQuery> {
    const queryEncoded = urlParams.get(QUERY);
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  const updateFragmenter = (
      event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.currentTarget.value === "") return;
    setSearchUrlParams({...searchUrlParams, fragmenter: event.currentTarget.value});

    setUrlParams((searchParams) => {
      searchParams.set(FRAGMENTER, event.currentTarget.value);
      return searchParams;
    });
  };

  async function getNewSearchResults() {
    const data = await sendSearchQuery(projectConfig, searchUrlParams, searchQueryRequestBody);
    if (!data) {
      return;
    }

    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }

    setSearchResults(data);
    const toHighlight = createHighlights(data);
    setTextToHighlight(toHighlight);
  }

  async function selectPrevPage() {
    if (searchUrlParams.from <= 0) {
      return;
    }
    const pageNumber = toPageNumber(searchUrlParams.from, searchUrlParams.size);
    const newFrom = searchUrlParams.from - searchUrlParams.size;
    const prevPage = pageNumber - 1;
    setSearchUrlParams({
      ...searchUrlParams,
      from: newFrom
    });
    await getNewSearchResults();
    setUrlParams((searchParams) => {
      searchParams.set(PAGE, prevPage.toString());
      searchParams.set(FROM, newFrom.toString());
      return searchParams;
    });
  }

  async function selectNextPage() {
    const newFrom = searchUrlParams.from + searchUrlParams.size;
    if (searchResult && searchResult.total.value <= newFrom) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      from: newFrom
    });
    const nextPage = toPageNumber(searchUrlParams.from, searchUrlParams.size) + 1;
    await getNewSearchResults();
    setUrlParams((searchParams) => {
      searchParams.set(PAGE, nextPage.toString());
      searchParams.set(FROM, newFrom.toString());
      return searchParams;
    });
  }

  const updateResultsPerPage = (
      event: ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.currentTarget.value === "") return;
    const newSize = event.currentTarget.value;
    setSearchUrlParams({
      ...searchUrlParams,
      size: parseInt(newSize)
    });
    setUrlParams(searchParams => ({
      ...searchParams,
      size: newSize,
    }));
  };

  function updateSorting(event: ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.currentTarget.value;

    let sortBy = "_score";
    let sortOrder: SortOrder = "desc";

    if (filterFacetsByType(facets, "date") && (filterFacetsByType(facets, "date"))[0]) {
      const facetName = (filterFacetsByType(facets, "date"))[0][0];

      if (selectedValue === "dateAsc" || selectedValue === "dateDesc") {
        sortBy = facetName;
        sortOrder = selectedValue === "dateAsc" ? "asc" : "desc";
      }
    } else {
      toast(
          "Sorting on date is not possible with the current search results.",
          {type: "info"},
      );
    }
    setSearchUrlParams({
      ...searchUrlParams,
      sortBy,
      sortOrder
    })

    setUrlParams(searchParams => ({
      ...searchParams,
      sortBy,
      sortOrder
    }));
  }

  function updateSelectedKeywordFacet(
      facetName: string,
      facetOptionName: string,
      selected: boolean,
  ) {
    const update = structuredClone(searchQuery.terms);
    if (!selected) {
      removeTerm(update, facetName, facetOptionName);
    } else {
      const facet = update[facetName];
      if (facet) {
        facet.push(facetOptionName);
      } else {
        update[facetName] = [facetOptionName];
      }
    }
    setSearchQuery({...searchQuery, terms: update});
    setDirty(true);
  }

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const update = structuredClone(searchQuery.terms);
    removeTerm(update, facet, option);
    setSearchQuery({...searchQuery, terms: update});
    if (searchResult) {
      setDirty(true);
    }
  }

  function goToQuery(query: SearchQueryRequestBody) {
    setUrlParams((searchParams) => {
      searchParams.set(QUERY, Base64.toBase64(JSON.stringify(query)));
      return searchParams;
    });
  }

  if (!searchQuery?.terms) {
    return null;
  }
  return (
      <div
          id="searchContainer"
          className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <div className="hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10">
          <FullTextSearchBar
              fullText={searchQuery.fullText}
              onSubmit={() => setDirty(true)}
              updateFullText={(value) => setSearchQuery({...searchQuery, fullText: value})}
          />

          {searchResult && (
              <NewSearchButton/>
          )}

          {projectConfig.showSearchQueryHistory && (
              <div className="w-full max-w-[450px]">
                <SearchQueryHistory
                    queryHistory={queryHistory}
                    goToQuery={goToQuery}
                    projectConfig={projectConfig}
                    disabled={queryHistory.length === 0}
                />
              </div>
          )}

          <div className="w-full max-w-[450px]">
            <Fragmenter
                onChange={updateFragmenter}
                value={searchUrlParams.fragmenter}
            />
          </div>

          {projectConfig.showDateFacets && (
              filterFacetsByType(facets, "date").map((_, index) => <DateFacet
                  key={index}
                  dateFrom={searchQuery.dateFrom}
                  dateTo={searchQuery.dateTo}
                  changeDateTo={update => setSearchQuery({...searchQuery, dateTo: update})}
                  changeDateFrom={update => setSearchQuery({...searchQuery, dateFrom: update})}
              />)
          )}

          {projectConfig.showKeywordFacets && !_.isEmpty(facets) && (
              filterFacetsByType(facets, "keyword").map(([facetName, facetValue], index) => (
                  <KeywordFacet
                      key={index}
                      facetName={facetName}
                      facet={facetValue}
                      selectedFacets={searchQuery.terms}
                      onChangeKeywordFacet={updateSelectedKeywordFacet}
                  />
              ))
          )}
        </div>

        {searchResult && <SearchResults
            searchResults={searchResult}
            resultsStart={searchUrlParams.from + 1}
            pageSize={searchUrlParams.size}
            pageNumber={toPageNumber(searchUrlParams.from, searchUrlParams.size)}
            clickPrevPage={selectPrevPage}
            clickNextPage={selectNextPage}
            changePageSize={updateResultsPerPage}
            keywordFacets={filterFacetsByType(facets, "keyword")}
            selectedFacets={searchQuery.terms}
            removeFacet={removeFacet}
            sortByChangeHandler={updateSorting}
        />}
      </div>
  );
};

