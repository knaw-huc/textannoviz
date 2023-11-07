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
import {QUERY} from "./SearchUrlParams.ts";

export const Search = () => {
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = React.useState(false);
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

  useEffect(() => {
    initSearch();

    async function initSearch() {
      if(isInit) {
        return;
      }
      const queryDecoded = getUrlQuery(urlParams);

      const queryUpdate: SearchQuery = {
        ...searchQuery,
        dateFrom: projectConfig.initialDateFrom,
        dateTo: projectConfig.initialDateTo,
        ...queryDecoded
      };
      const newIndices = await getElasticIndices(projectConfig);
      if (newIndices) {
        queryUpdate.index = newIndices[projectConfig.elasticIndexName];
      }

      // const paramUpdate = Object.fromEntries(
      //     Object.entries(searchUrlParams).map(
      //         ([k, v]) => [k, urlParams.get(k) ?? v]
      //     )
      // ) as SearchUrlParams;
      // setSearchUrlParams(paramUpdate);
      setSearchQuery(queryUpdate);
      setInit(true);
      setDirty(true);
    }
  }, []);

  useEffect(() => {
    syncUrlWithSearchParams();

    function syncUrlWithSearchParams() {
      const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);
      const newUrlParams = {
        ...Object.fromEntries(urlParams),
        ..._.mapValues(searchUrlParams, v => `${v}`),
        query: Base64.toBase64(cleanQuery),
      };
      setUrlParams(newUrlParams);

      function skipEmptyValues(_: string, v: any) {
        return [null, ""].includes(v) ? undefined : v;
      }
    }
  }, [searchUrlParams, searchQuery]);

  useEffect(() => {
    searchWhenDirty();

    async function searchWhenDirty() {
      if (!isDirty) {
        return;
      }
      if (!searchQueryRequestBody.date?.from) {
        return;
      }
      const data = await sendSearchQuery(projectConfig, searchUrlParams, searchQueryRequestBody);
      if (!data) {
        return;
      }

      const target = document.getElementById("searchContainer");
      if (target) {
        target.scrollIntoView({behavior: "smooth"});
      }

      const toHighlight = createHighlights(data);
      const newFacets = data?.aggs;

      setFacets(newFacets);
      setTextToHighlight(toHighlight);
      setSearchResults(data);
      setSearchUrlParams({...searchUrlParams});
      setDirty(false);
    }
  }, [isDirty]);

  function getUrlQuery(urlParams: URLSearchParams): Partial<SearchQuery> {
    const queryEncoded = urlParams.get(QUERY);
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  const updateFragmenter = (
      event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!event.currentTarget.value) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      fragmenter: event.currentTarget.value
    });
  };

  async function selectPrevPage() {
    const newFrom = searchUrlParams.from - searchUrlParams.size;
    if (!searchResult || newFrom <= 0) {
      return;
    }
    await selectPage(newFrom);
  }

  async function selectNextPage() {
    const newFrom = searchUrlParams.from + searchUrlParams.size;
    if (!searchResult || newFrom >= searchResult.total.value) {
      return;
    }
    selectPage(newFrom)
  }

  async function selectPage(newFrom: number) {
    setSearchUrlParams({
      ...searchUrlParams,
      from: newFrom
    });
    setDirty(true);
  }

  const updateResultsPerPage = (
      event: ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!event.currentTarget.value) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      size: parseInt(event.currentTarget.value)
    });
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
    setSearchUrlParams({...searchUrlParams, from: 0});
    setDirty(true);
  }

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const newTerms = structuredClone(searchQuery.terms);
    removeTerm(newTerms, facet, option);
    setSearchQuery({...searchQuery, terms: newTerms});
    setSearchUrlParams({...searchUrlParams, from: 0});
    setDirty(true);
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
                    disabled={!queryHistory.length}
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

