import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Base64} from "js-base64";
import React, {useEffect} from "react";
import {Button} from "react-aria-components";
import {Link, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {FullTextFacet} from "reactions-knaw-huc";
import {FacetName, FacetOptionName, Facets, SearchQueryBody, SearchResult, Terms} from "../../model/Search";
import {projectConfigSelector, translateSelector, useProjectStore,} from "../../stores/project.ts";
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

const HIT_PREVIEW_REGEX = new RegExp(/<em>(.*?)<\/em>/g);

/**
 * TODO:
 *  - create SearchForm
 *    - Search: contains complex query and url state management
 *    - SearchForm contains simple "before submit"-state and handler props
 *  - use page number or elasticFrom, delete the other
 */
export const Search = () => {
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);
  const [isInit, setInit] = React.useState(false);
  const [isDirty, setDirty] = React.useState(false);
  const [facets, setFacets] = React.useState<Facets>({});
  const [pageNumber, setPageNumber] = React.useState(1);
  const [urlParams, setUrlParams] = useSearchParams();
  const {
    params, setParams,
    query, setQuery,
    searchResult, setSearchResults
  } = useSearchStore();
  const queryBody = useSearchStore(queryBodySelector);
  const queryHistory = useSearchStore(searchHistorySelector);
  const filterFacetsByType = useSearchStore(filterFacetByTypeSelector);
  const setTextToHighlight = useSearchStore(state => state.setTextToHighlight);

  function getTextToHighlight(data: SearchResult) {
    const toHighlight = new Map<string, string[]>();
    if (!data) {
      return toHighlight;
    }

    data.results.forEach((result) => {
      const previews: string[] = [];
      const searchHits = result._hits;
      if (!searchHits) {
        return;
      }
      searchHits.forEach((hit) => {
        const matches = hit.preview
            .match(HIT_PREVIEW_REGEX)
            ?.map((str) => str.substring(4, str.length - 5));
        if (matches) {
          previews.push(...new Set(matches));
        }
      });
      toHighlight.set(result._id, [...new Set(previews)]);
    });

    return toHighlight;
  }

  function getUrlQuery(urlParams: URLSearchParams): SearchQueryParams {
    const queryEncoded = urlParams.get("query");
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  useEffect(() => {
    initSearchQuery();

    async function initSearchQuery() {
      if(isInit) {
        return;
      }
      const update = {...query};

      update.dateFrom = projectConfig.initialDateFrom;
      update.dateTo = projectConfig.initialDateTo;

      const queryDecoded = getUrlQuery(urlParams);
      _.assign(update, queryDecoded);
      setQuery(update);

      const newIndices = await getElasticIndices(projectConfig);
      if(newIndices) {
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
      if(!isDirty) {
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
      if(newFacets) {
        setFacets(newFacets);
      }
      setParams({...params, from: 0});
      setDirty(false);
    }
  }, [isDirty]);

  const handleFullTextFacet = (value: string) => {
    if (value.charAt(value.length - 1).includes("\\")) {
      toast("Please remove trailing backslash from query", {type: "error"});
      return;
    }
    setQuery({...query, fullText: value});
  };

  const fullTextEnterPressedHandler = (pressed: boolean) => {
    if (pressed) {
      setDirty(true);
    }
  };

  const fragmenterSelectHandler = (
      event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (event.currentTarget.value === "") return;
    setParams({...params, fragmenter: event.currentTarget.value});

    setUrlParams((searchParams) => {
      searchParams.set("frag", event.currentTarget.value);
      return searchParams;
    });
  };

  async function getNewSearchResults() {
    const data = await sendSearchQuery(projectConfig, params, queryBody);
    if(!data) {
      return;
    }

    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }

    setSearchResults(data);
    const toHighlight = getTextToHighlight(data);
    setTextToHighlight(toHighlight);
  }

  async function prevPageClickHandler() {
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
      searchParams.set("page", prevPage.toString());
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });
  }

  async function nextPageClickHandler() {
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
      searchParams.set("page", nextPage.toString());
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });
  }

  const resultsPerPageSelectHandler = (
      event: React.ChangeEvent<HTMLSelectElement>,
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

  function sortByChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
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

  function changeSelectedKeywordFacet(
      facetName: string,
      facetOptionName: string,
      selected: boolean,
  ) {
    const update = structuredClone(query.selectedFacets);
    if(!selected) {
      removeSelectedFacet(update, facetName, facetOptionName);
    } else {
      const facet = update[facetName];
      if (facet) {
        facet.push(facetOptionName);
      } else {
        update[facetName] = [facetOptionName];
      }
    }
    setQuery({...query, selectedFacets: update});
    setDirty(true);
  }

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const update = structuredClone(query.selectedFacets);
    removeSelectedFacet(update, facet, option);
    setQuery({...query, selectedFacets: update});
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

  if(!query?.selectedFacets) {
    return null;
  }
  return (
      <div
          id="searchContainer"
          className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch"
      >
        <div className="hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10">
          <div className="w-full max-w-[450px]">
            <label htmlFor="fullText" className="font-semibold">
              Full text search
            </label>
            <div className="flex w-full flex-row">
              <FullTextFacet
                  valueHandler={handleFullTextFacet}
                  enterPressedHandler={fullTextEnterPressedHandler}
                  value={query.fullText}
                  className="border-brand2-700 w-full rounded-l border px-3 py-1 outline-none"
                  placeholder="Press ENTER to search"
              />
              <Button
                  className="bg-brand2-700 border-brand2-700 rounded-r border-b border-r border-t px-3 py-1"
                  aria-label="Click to search"
                  onPress={() => setDirty(true)}
              >
                <MagnifyingGlassIcon className="h-4 w-4 fill-white"/>
              </Button>
            </div>
          </div>
          {searchResult ? (
              <div className="w-full max-w-[450px]">
                <Link
                    to="/"
                    reloadDocument
                    className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm no-underline"
                >
                  {translate("NEW_SEARCH_QUERY")}
                </Link>
              </div>
          ) : null}

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
                onChange={fragmenterSelectHandler}
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
                      selectedFacets={query.selectedFacets}
                      onChangeKeywordFacet={changeSelectedKeywordFacet}
                  />
              ))
          )}
        </div>

        {searchResult && <SearchResults
            searchResults={searchResult}
            resultStart={params.from + 1}
            pageSize={params.from + params.size}
            pageNumber={pageNumber}
            clickPrevPage={prevPageClickHandler}
            clickNextPage={nextPageClickHandler}
            changePageSize={resultsPerPageSelectHandler}
            keywordFacets={filterFacetsByType(facets, "keyword")}
            selectedFacets={query.selectedFacets}
            removeFacet={removeFacet}
            sortByChangeHandler={sortByChangeHandler}
        />}
      </div>
  );
};

function removeSelectedFacet(update: Terms, facetName: string, facetOptionName: string) {
  const facetToUpdate = update[facetName];
  if (facetToUpdate.length > 1) {
    _.pull(facetToUpdate, facetOptionName)
  } else {
    delete update[facetName];
  }
}

