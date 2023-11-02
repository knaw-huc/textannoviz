import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Base64} from "js-base64";
import React, {useEffect} from "react";
import {Button} from "react-aria-components";
import {Link, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {FullTextFacet} from "reactions-knaw-huc";
import {Facets, Indices, SearchQuery, SearchResult,} from "../../model/Search";
import {projectConfigSelector, translateSelector, useProjectStore,} from "../../stores/project.ts";
import {useSearchStore} from "../../stores/search/search-store.ts";
import {sendSearchQuery} from "../../utils/broccoli";
import {Fragmenter} from "./Fragmenter";
import {SearchQueryHistory} from "./SearchQueryHistory.tsx";
import {KeywordFacet} from "./KeywordFacet.tsx";
import {DateFacet} from "./DateFacet.tsx";
import {SearchResults} from "./SearchResults.tsx";
import {SearchParams, SortOrder} from "../../stores/search/search-params-slice.ts";
import * as _ from "lodash";
import {buildFacetFilter} from "./util/filterFacets.ts";

type SearchProps = {
  project: string;
  indices: Indices;
};

const HIT_PREVIEW_REGEX = new RegExp(/<em>(.*?)<\/em>/g);

/**
 * TODO:
 *  - add SearchParams to store
 *  - move query to store, remove from Search
 *  - create SearchForm
 *    - Search: contains complex query and url state management
 *    - SearchForm contains simple "before submit"-state and handler props
 */

export const Search = (props: SearchProps) => {
  const translate = useProjectStore(translateSelector);
  const projectConfig = useProjectStore(projectConfigSelector);
  const filterFacets = buildFacetFilter(props.indices, projectConfig.elasticIndexName);

  const [dirty, setDirty] = React.useState(0);
  const [dateFrom, setDateFrom] = React.useState(
      projectConfig.initialDateFrom ?? "",
  );
  const [dateTo, setDateTo] = React.useState(
      projectConfig.initialDateTo ?? "",
  );
  const [facets, setFacets] = React.useState<Facets>({});
  const [facetCheckboxes, setFacetCheckboxes] = React.useState(
      new Map<string, boolean>(),
  );
  const [query, setQuery] = React.useState<SearchQuery>({});
  // TODO: use page number or elasticFrom, delete the other:
  const [pageNumber, setPageNumber] = React.useState(1);
  const [fullText, setFullText] = React.useState("");

  const [queryHistory, setQueryHistory] = React.useState<SearchQuery[]>([]);
  const [historyIsOpen, setHistoryIsOpen] = React.useState(false);
  const [urlParams, setUrlParams] = useSearchParams();
  const params: SearchParams = useSearchStore(store => store.params);
  const setParams = useSearchStore(store => store.setParams);

  const {
    searchResult,
    setSearchResults
  } = useSearchStore(state => state);
  const setTextToHighlight = useSearchStore(
      (state) => state.setTextToHighlight,
  );

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

  function refresh() {
    setDirty((prev) => prev + 1);
  }

  useEffect(() => {
    updateSearchQueryWhenDirty();

    function updateSearchQueryWhenDirty() {
      if (!dirty) {
        return;
      }
      const searchQuery: SearchQuery = {
        terms: {},
      };

      if (fullText) {
        if (fullText.charAt(fullText.length - 1).includes("\\")) {
          toast(
              "Please remove the trailing backslash from your search query.",
              {
                type: "error",
              },
          );
          return;
        }
        searchQuery["text"] = fullText;
      }

      filterFacets(facets, "keyword").map(([name, values]) => {
        Object.keys(values).map(facetValueName => {
          const key = `${name}-${facetValueName}`;
          if (facetCheckboxes.get(key)) {
            if (searchQuery["terms"][name]) {
              searchQuery["terms"][name].push(facetValueName);
            } else {
              searchQuery["terms"][name] = [facetValueName];
            }
          }
        });
      });

      filterFacets(facets, "date").map(([facetName]) => {
        searchQuery["date"] = {
          name: facetName,
          from: dateFrom,
          to: dateTo,
        };
      });

      setQuery(searchQuery);
      setQueryHistory([searchQuery, ...queryHistory]);
    }
  }, [dirty]);

  function getUrlParams(urlParams: URLSearchParams): SearchQuery {
    const queryEncoded = urlParams.get("query");
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  useEffect(() => {
    initQueryFromUrlParams();

    function initQueryFromUrlParams() {
      const queryDecoded = getUrlParams(urlParams);

      if (queryDecoded) {
        if (queryDecoded.text) {
          setFullText(queryDecoded.text);
        }
      }
      if (queryDecoded?.text) {
        setQuery(queryDecoded);
      }
    }
  }, []);

  useEffect(() => {
    initFacetCheckboxesFromQueryTerms();

    function initFacetCheckboxesFromQueryTerms() {

      const newCheckboxes = new Map<string, boolean>();
      const selectedFacets: string[] = [];

      const terms = query?.terms;
      if (!terms || !facets) {
        return;
      }
      Object.entries(terms).forEach(
          ([facetName, facetValues]) => {
            facetValues.forEach((facetValue) => {
              const key = `${facetName}-${facetValue}`;
              selectedFacets.push(key);
            });
          },
      );
      filterFacets(facets, "keyword").map(([facetName, facetValues]) => {
        Object.keys(facetValues).forEach((facetValueName) => {
          const key = `${facetName}-${facetValueName}`;
          newCheckboxes.set(key, false);
          if (selectedFacets.includes(key)) {
            newCheckboxes.set(key, true);
          }
        });
      });
      setFacetCheckboxes(newCheckboxes);
    }
  }, [query?.terms, facets]);

  useEffect(() => {
    syncUrlWithSearchParams();
    function syncUrlWithSearchParams() {
      setUrlParams((prev) => ({
        ...Object.fromEntries(prev.entries()),
        ..._.mapValues(params, v => `${v}`),
        query: Base64.toBase64(JSON.stringify(query)),
      }));
    }
  }, [pageNumber, params, query]);

  useEffect(() => {
    searchWhenParamsChange();

    async function searchWhenParamsChange() {
      if (!query.terms) {
        return;
      }

      const data = await sendSearchQuery(projectConfig, params, query);
      if (!data) {
        return;
      }
      setSearchResults(data);
      setParams({...params, from: 0});
      setFacets(data.aggs);
    }
  }, [query]);

  const handleFullTextFacet = (value: string) => {
    setFullText(value);
  };

  const fullTextEnterPressedHandler = (pressed: boolean) => {
    if (pressed) {
      refresh();
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
    const data = await sendSearchQuery(projectConfig, params, query);
    if(!data) {
      return;
    }

    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({behavior: "smooth"});
    }

    setSearchResults(data);
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

    if (filterFacets(facets, "date") && (filterFacets(facets, "date"))[0]) {
      const facetName = (filterFacets(facets, "date"))[0][0];

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

  function handleKeywordFacetChange(
      key: string,
      event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setFacetCheckboxes(new Map(facetCheckboxes.set(key, event.target.checked)));
    if (searchResult) {
      refresh();
    }
  }

  function removeFacet(key: string) {
    setFacetCheckboxes(new Map(facetCheckboxes.set(key, false)));
    if (searchResult) {
      refresh();
    }
  }

  function historyClickHandler() {
    setHistoryIsOpen(!historyIsOpen);
  }

  function goToQuery(query: SearchQuery) {
    setUrlParams((searchParams) => {
      searchParams.set("query", Base64.toBase64(JSON.stringify(query)));
      return searchParams;
    });
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
                  value={fullText}
                  className="border-brand2-700 w-full rounded-l border px-3 py-1 outline-none"
                  placeholder="Press ENTER to search"
              />
              <Button
                  className="bg-brand2-700 border-brand2-700 rounded-r border-b border-r border-t px-3 py-1"
                  aria-label="Click to search"
                  onPress={() => refresh()}
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
                    historyClickHandler={historyClickHandler}
                    historyIsOpen={historyIsOpen}
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
              filterFacets(facets, "date").map((_, index) => <DateFacet
                  key={index}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  changeDateTo={setDateTo}
                  changeDateFrom={setDateFrom}
              />)
          )}
          {projectConfig.showKeywordFacets && facetCheckboxes.size > 0 && (
              filterFacets(facets, "keyword").map(([facetName, facetValue], index) => (
                  <KeywordFacet
                      key={index}
                      facetName={facetName}
                      facet={facetValue}
                      onChangeKeywordFacet={handleKeywordFacetChange}
                      checkboxes={facetCheckboxes}
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
            checkboxes={facetCheckboxes}
            keywordFacets={filterFacets(facets, "keyword")}
            removeFacet={removeFacet}
            sortByChangeHandler={sortByChangeHandler}
        />}
      </div>
  );
};

