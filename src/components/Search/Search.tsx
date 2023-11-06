import {Base64} from "js-base64";
import React, {ChangeEvent, useEffect} from "react";
import {useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {FacetName, FacetOptionName, Facets, SearchQueryBody} from "../../model/Search";
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
  SearchQueryParams
} from "../../stores/search/search-query-slice.ts";
import {createHighlights} from "./util/createHighlights.ts";
import {removeTerm} from "./util/removeTerm.ts";
import {FullTextSearchBar} from "./FullTextSearchBar.tsx";
import {NewSearchButton} from "./NewSearchButton.tsx";

/**
 * TODO:
 *  - create SearchForm
 *    - Search: contains complex query and url state management
 *    - SearchForm contains simple "before submit"-state and handler props
 *  - use page number or elasticFrom, delete the other
 */
export const PAGE = "page";
export const FROM = "from";
export const FRAGMENTER = "frag";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = React.useState(false);
  const [isDirty, setDirty] = React.useState(false);
  const [facets, setFacets] = React.useState<Facets>({});
  const [pageNumber, setPageNumber] = React.useState(1);
  const [urlParams, setUrlParams] = useSearchParams();
  const {
    params, setParams,
    query, setQuery,
    searchResult, setSearchResults,
    setTextToHighlight
  } = useSearchStore();
  const queryBody = useSearchStore(queryBodySelector);
  const queryHistory = useSearchStore(searchHistorySelector);
  const filterFacetsByType = useSearchStore(filterFacetByTypeSelector);

  function getUrlQuery(urlParams: URLSearchParams): SearchQueryParams {
    const queryEncoded = urlParams.get("query");
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  useEffect(() => {
    initSearch();

    async function initSearch() {
      if (isInit) {
        return;
      }
      const update = {...query};

      update.dateFrom = projectConfig.initialDateFrom;
      update.dateTo = projectConfig.initialDateTo;

      const queryDecoded = getUrlQuery(urlParams);
      _.assign(update, queryDecoded);
      setQuery(update);

      const newIndices = await getElasticIndices(projectConfig);
      if (newIndices) {
        update.index = newIndices[projectConfig.elasticIndexName];
      }

      setInit(true);
      setDirty(true);
    }

  }, []);

  useEffect(() => {
    syncUrlWithSearchParams();

    function syncUrlWithSearchParams() {
      setUrlParams(prev => {
        const cleanQuery = JSON.stringify(query, skipEmptyValues);

        return {
          ...Object.fromEntries(prev.entries()),
          ..._.mapValues(params, v => `${v}`),
          query: Base64.toBase64(cleanQuery),
        };

        function skipEmptyValues(_: string, v: any) {
          return [null, ""].includes(v) ? undefined : v;
        }
      });

    }
  }, [params, query]);

  useEffect(() => {
    searchWhenDirty();

    async function searchWhenDirty() {
      if (!isDirty) {
        return;
      }
      if (!queryBody.terms) {
        return;
      }
      const data = await sendSearchQuery(projectConfig, params, queryBody);
      if (!data) {
        return;
      }
      setSearchResults(data);
      const newFacets = data?.aggs;
      if (newFacets) {
        setFacets(newFacets);
      }
      setParams({...params, from: 0});
      setDirty(false);
    }
  }, [isDirty]);

  const updateFragmenter = (
      event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.currentTarget.value === "") return;
    setParams({...params, fragmenter: event.currentTarget.value});

    setUrlParams((searchParams) => {
      searchParams.set(FRAGMENTER, event.currentTarget.value);
      return searchParams;
    });
  };

  async function getNewSearchResults() {
    const data = await sendSearchQuery(projectConfig, params, queryBody);
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
    if (pageNumber <= 1) {
      return;
    }
    const newFrom = params.from - params.size;
    const prevPage = pageNumber - 1;
    setParams({
      ...params,
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
    const newFrom = params.from + params.size;
    if (searchResult && searchResult.total.value <= newFrom) {
      return;
    }
    const nextPage = pageNumber + 1;
    setParams({
      ...params,
      from: newFrom
    });
    setPageNumber(nextPage);
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
    setParams({
      ...params,
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
    setParams({
      ...params,
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
    const update = structuredClone(query.terms);
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
    setQuery({...query, terms: update});
    setDirty(true);
  }

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const update = structuredClone(query.terms);
    removeTerm(update, facet, option);
    setQuery({...query, terms: update});
    if (searchResult) {
      setDirty(true);
    }
  }

  function goToQuery(query: SearchQueryBody) {
    setUrlParams((searchParams) => {
      searchParams.set("query", Base64.toBase64(JSON.stringify(query)));
      return searchParams;
    });
  }

  if (!query?.terms) {
    return null;
  }
  return (
      <div
          id="searchContainer"
          className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <div className="hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10">
          <FullTextSearchBar
              fullText={query.fullText}
              onSubmit={() => setDirty(true)}
              updateFullText={(value) => setQuery({...query, fullText: value})}
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
                value={params.fragmenter}
            />
          </div>

          {projectConfig.showDateFacets && (
              filterFacetsByType(facets, "date").map((_, index) => <DateFacet
                  key={index}
                  dateFrom={query.dateFrom}
                  dateTo={query.dateTo}
                  changeDateTo={update => setQuery({...query, dateTo: update})}
                  changeDateFrom={update => setQuery({...query, dateFrom: update})}
              />)
          )}

          {projectConfig.showKeywordFacets && !_.isEmpty(facets) && (
              filterFacetsByType(facets, "keyword").map(([facetName, facetValue], index) => (
                  <KeywordFacet
                      key={index}
                      facetName={facetName}
                      facet={facetValue}
                      selectedFacets={query.terms}
                      onChangeKeywordFacet={updateSelectedKeywordFacet}
                  />
              ))
          )}
        </div>

        {searchResult && <SearchResults
            searchResults={searchResult}
            resultStart={params.from + 1}
            pageSize={params.from + params.size}
            pageNumber={pageNumber}
            clickPrevPage={selectPrevPage}
            clickNextPage={selectNextPage}
            changePageSize={updateResultsPerPage}
            keywordFacets={filterFacetsByType(facets, "keyword")}
            selectedFacets={query.terms}
            removeFacet={removeFacet}
            sortByChangeHandler={updateSorting}
        />}
      </div>
  );
};

