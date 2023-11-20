import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import React, { useEffect } from "react";
import { Button } from "react-aria-components";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FullTextFacet } from "reactions-knaw-huc";
import { ProjectConfig } from "../../model/ProjectConfig";
import {
  FacetValue,
  Facets,
  Indices,
  SearchQuery,
  SearchResult,
} from "../../model/Search";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search";
import { sendSearchQuery } from "../../utils/broccoli";
import { Fragmenter } from "./Fragmenter";
import { SearchItem } from "./SearchItem";
import { SearchPagination } from "./SearchPagination";
import { SearchQueryHistory } from "./SearchQueryHistory.tsx";
import { SearchResultsPerPage } from "./SearchResultsPerPage";
import { SearchSortBy } from "./SearchSortBy";

type SearchProps = {
  project: string;
  projectConfig: ProjectConfig;
  indices: Indices;
  facets: Facets;
  indexName: string;
};

const HIT_PREVIEW_REGEX = new RegExp(/<em>(.*?)<\/em>/g);

type SearchParams = any;

export const Search = (props: SearchProps) => {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const [searchResults, setSearchResults] = React.useState<SearchResult>();
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [dateFrom, setDateFrom] = React.useState(
    props.projectConfig.initialDateFrom ?? "",
  );
  const [dateTo, setDateTo] = React.useState(
    props.projectConfig.initialDateTo ?? "",
  );
  const [facets, setFacets] = React.useState<Facets>(props.facets);
  const [dirty, setDirty] = React.useState(0);
  const [query, setQuery] = React.useState<SearchQuery>({});
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("_score");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [internalSortValue, setInternalSortValue] = React.useState("_score");
  const [fullText, setFullText] = React.useState("");
  const [checkboxStates, setCheckBoxStates] = React.useState(
    new Map<string, boolean>(),
  );
  const [queryHistory, setQueryHistory] = React.useState<SearchQuery[]>([]);
  const [historyIsOpen, setHistoryIsOpen] = React.useState(false);
  const [urlParams, setUrlParams] = useSearchParams();
  const [searchParams, setSearchParams] = React.useState<SearchParams>();
  const setGlobalSearchResults = useSearchStore(
    (state) => state.setGlobalSearchResults,
  );
  const setGlobalSearchQuery = useSearchStore(
    (state) => state.setGlobalSearchQuery,
  );
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
    function updateSearchParamsWhenDirty() {
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

      getKeywordFacets().map(([facetName, facetValues]) => {
        Object.keys(facetValues as FacetValue).map((facetValueName) => {
          const key = `${facetName}-${facetValueName}`;
          if (checkboxStates.get(key)) {
            if (searchQuery["terms"][facetName]) {
              searchQuery["terms"][facetName].push(facetValueName);
            } else {
              searchQuery["terms"][facetName] = [facetValueName];
            }
          }
        });
      });

      getDateFacets().map(([facetName]) => {
        searchQuery["date"] = {
          name: facetName,
          from: dateFrom,
          to: dateTo,
        };
      });

      setQuery(searchQuery);
      setQueryHistory([searchQuery, ...queryHistory]);
      setGlobalSearchQuery(searchQuery);

      setSearchParams({
        page: pageNumber.toString(),
        size: elasticSize.toString(),
        frag: fragmenter,
        sortBy: sortBy,
        sortOrder: sortOrder,
        query: Base64.toBase64(JSON.stringify(query)),
      });
    }

    updateSearchParamsWhenDirty();
  }, [dirty]);

  function getUrlParams(urlParams: URLSearchParams): SearchQuery {
    const queryEncoded = urlParams.get("query");
    return queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
  }

  useEffect(() => {
    function initSearchFromUrlParams() {
      const queryDecoded = getUrlParams(urlParams);

      if (queryDecoded) {
        if (queryDecoded.text) {
          setFullText(queryDecoded.text);
        }
      }
      const newMap = new Map<string, boolean>();
      const selectedFacets: string[] = [];

      if (queryDecoded && queryDecoded.terms) {
        Object.entries(queryDecoded.terms).forEach(
          ([facetName, facetValues]) => {
            facetValues.forEach((facetValue) => {
              const key = `${facetName}-${facetValue}`;
              selectedFacets.push(key);
            });
          },
        );
      }

      getKeywordFacets().map(([facetName, facetValues]) => {
        Object.keys(facetValues).forEach((facetValueName) => {
          const key = `${facetName}-${facetValueName}`;
          newMap.set(key, false);
          if (selectedFacets.includes(key)) {
            newMap.set(key, true);
          }
        });
      });
      setCheckBoxStates(newMap);

      if (!searchParams && queryDecoded?.text) {
        const fromUrl = {
          page: urlParams.get("page") ?? "1",
          size: urlParams.get("size") ?? "10",
          frag: urlParams.get("frag") ?? "Scan",
          sortBy: urlParams.get("sortBy") ?? "_score",
          sortOrder: urlParams.get("sortOrder") ?? "desc",
          query: queryDecoded,
        };
        setSearchParams(fromUrl);
        setQuery(queryDecoded);
      }
    }

    initSearchFromUrlParams();
  }, []);

  useEffect(() => {
    function syncUrlWithSearchParams() {
      setUrlParams((prev) => {
        return {
          ...Object.fromEntries(prev.entries()),
          page: pageNumber.toString(),
          size: elasticSize.toString(),
          frag: fragmenter,
          sortBy: sortBy,
          sortOrder: sortOrder,
          query: Base64.toBase64(JSON.stringify(query)),
        };
      });
    }

    syncUrlWithSearchParams();
  }, [pageNumber, elasticSize, fragmenter, sortBy, sortOrder, query]);

  useEffect(() => {
    async function searchWhenParamsChange() {
      if (!query.terms) {
        return;
      }

      const data = await sendSearchQuery(
        query,
        fragmenter,
        elasticSize,
        0,
        props.projectConfig,
        sortBy,
        sortOrder,
      );
      if (!data) {
        return;
      }
      const toHighlight = getTextToHighlight(data);
      setTextToHighlight(toHighlight);
      setSearchResults(data);
      setGlobalSearchResults(data);
      setElasticFrom(0);
      setFacets(data!.aggs);
    }

    searchWhenParamsChange();
  }, [query, searchParams]);

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
    setFragmenter(event.currentTarget.value);

    setUrlParams((searchParams) => {
      searchParams.set("frag", event.currentTarget.value);
      return searchParams;
    });
  };

  async function prevPageClickHandler() {
    if (pageNumber <= 1) return;
    const prevPage = pageNumber - 1;
    const newFrom = elasticFrom - elasticSize;
    setElasticFrom((prevFrom) => prevFrom - elasticSize);
    setPageNumber(prevPage);

    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      newFrom,
      props.projectConfig,
      sortBy,
      sortOrder,
    );

    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }

    setSearchResults(data);
    setGlobalSearchResults(data);
    const toHighlight = getTextToHighlight(data);
    setTextToHighlight(toHighlight);
    setUrlParams((searchParams) => {
      searchParams.set("page", prevPage.toString());
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });
  }

  async function nextPageClickHandler() {
    const newFrom = elasticFrom + elasticSize;
    if (searchResults && searchResults.total.value <= newFrom) {
      return;
    }
    const nextPage = pageNumber + 1;
    setElasticFrom(newFrom);
    setPageNumber(nextPage);
    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      newFrom,
      props.projectConfig,
      sortBy,
      sortOrder,
    );

    const target = document.getElementById("searchContainer");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }

    setSearchResults(data);
    setGlobalSearchResults(data);
    const toHighlight = getTextToHighlight(data);
    setTextToHighlight(toHighlight);
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
    setElasticSize(parseInt(event.currentTarget.value));

    setUrlParams((searchParams) => {
      searchParams.set("size", event.currentTarget.value);
      return searchParams;
    });
  };

  function getFacets(type: string) {
    return Object.entries(facets).filter(([key]) => {
      return props.indices[props.indexName][key] === type;
    });
  }

  function getKeywordFacets() {
    return getFacets("keyword");
  }

  function getDateFacets() {
    return getFacets("date");
  }

  function sortByChangeHandler(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.currentTarget.value;

    let sortByValue = "_score";
    let sortOrderValue = "desc";

    if (getDateFacets() && getDateFacets()[0]) {
      const facetName = getDateFacets()[0][0];

      if (selectedValue === "dateAsc" || selectedValue === "dateDesc") {
        sortByValue = facetName;
        sortOrderValue = selectedValue === "dateAsc" ? "asc" : "desc";
      }
    } else {
      toast(
        "Sorting on date is not possible with the current search results.",
        { type: "info" },
      );
    }

    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);
    setInternalSortValue(selectedValue);

    setUrlParams((searchParams) => {
      searchParams.set("sortBy", sortByValue);
      searchParams.set("sortOrder", sortOrderValue);
      return searchParams;
    });
  }

  function renderKeywordFacets() {
    return getKeywordFacets().map(([facetName, facetValues], index) => {
      return (
        <div key={index} className="w-full max-w-[450px]">
          <div className="font-semibold">{translateProject(facetName)}</div>
          {Object.entries(facetValues).map(
            ([facetValueName, facetValueAmount]) => {
              const key = `${facetName}-${facetValueName}`;
              return (
                <div
                  key={key}
                  className="mb-2 flex w-full flex-row items-center justify-between gap-2"
                >
                  <div className="flex flex-row items-center">
                    <input
                      className="text-brand1-700 focus:ring-brand1-700 mr-2 h-5 w-5 rounded border-gray-300"
                      type="checkbox"
                      id={key}
                      name={facetValueName}
                      value={facetValueName}
                      onChange={(event) =>
                        keywordFacetChangeHandler(key, event)
                      }
                      checked={checkboxStates.get(key) ?? false}
                    />
                    <label htmlFor={key}>
                      {/^[a-z]/.test(facetValueName)
                        ? facetValueName.charAt(0).toUpperCase() +
                          facetValueName.slice(1)
                        : facetValueName && translateProject(facetValueName)}
                    </label>
                  </div>
                  <div className="text-sm text-neutral-500">
                    {facetValueAmount}
                  </div>
                </div>
              );
            },
          )}
        </div>
      );
    });
  }

  function keywordFacetChangeHandler(
    key: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setCheckBoxStates(new Map(checkboxStates.set(key, event.target.checked)));
    if (searchResults) {
      refresh();
    }
  }

  function renderDateFacets() {
    return getDateFacets().map((_, index) => {
      return (
        <div
          key={index}
          className="flex w-full max-w-[450px] flex-col gap-4 lg:flex-row"
        >
          <div className="flex w-full flex-col">
            <label htmlFor="start" className="font-semibold">
              {translate("FROM")}
            </label>
            <input
              className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
              type="date"
              id="start"
              value={dateFrom}
              min={props.projectConfig.initialDateFrom}
              max={props.projectConfig.initialDateTo}
              onChange={(event) => setDateFrom(event.target.value)}
            />
          </div>
          <div className="flex w-full flex-col">
            <label htmlFor="end" className="font-semibold">
              {translate("UP_TO_AND_INCLUDING")}
            </label>
            <input
              className="w-full rounded border border-neutral-700 px-3 py-1 text-sm"
              type="date"
              id="end"
              value={dateTo}
              min={props.projectConfig.initialDateFrom}
              max={props.projectConfig.initialDateTo}
              onChange={(event) => setDateTo(event.target.value)}
            />
          </div>
        </div>
      );
    });
  }

  function removeFacet(key: string) {
    setCheckBoxStates(new Map(checkboxStates.set(key, false)));
    if (searchResults) {
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
            {translate("FULL_TEXT_SEARCH")}
          </label>
          <div className="flex w-full flex-row">
            <FullTextFacet
              valueHandler={handleFullTextFacet}
              enterPressedHandler={fullTextEnterPressedHandler}
              value={fullText}
              className="border-brand2-700 w-full rounded-l border px-3 py-1 outline-none"
              placeholder={translate("PRESS_ENTER_TO_SEARCH")}
            />
            <Button
              className="bg-brand2-700 border-brand2-700 rounded-r border-b border-r border-t px-3 py-1"
              aria-label="Click to search"
              onPress={() => refresh()}
            >
              <MagnifyingGlassIcon className="h-4 w-4 fill-white" />
            </Button>
          </div>
        </div>
        {searchResults ? (
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

        {props.projectConfig.showSearchQueryHistory ? (
          <div className="w-full max-w-[450px]">
            <SearchQueryHistory
              historyClickHandler={historyClickHandler}
              historyIsOpen={historyIsOpen}
              queryHistory={queryHistory}
              goToQuery={goToQuery}
              projectConfig={props.projectConfig}
              disabled={queryHistory.length === 0}
            />
          </div>
        ) : null}

        <div className="w-full max-w-[450px]">
          <Fragmenter onChange={fragmenterSelectHandler} value={fragmenter} />
        </div>
        {props.projectConfig.showDateFacets ? renderDateFacets() : null}
        {props.projectConfig.showKeywordFacets
          ? checkboxStates.size > 0 && renderKeywordFacets()
          : null}
      </div>

      <div className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
        {searchResults ? (
          <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <span className="font-semibold">
              {searchResults &&
                `${elasticFrom + 1}-${Math.min(
                  elasticFrom + elasticSize,
                  searchResults.total.value,
                )} ${translate("FROM").toLowerCase()} ${
                  searchResults.total.value
                } ${translate("RESULTS").toLowerCase()}`}
            </span>
            <div className="flex items-center justify-between gap-10">
              {props.projectConfig.showSearchSortBy ? (
                <SearchSortBy
                  onChange={sortByChangeHandler}
                  value={internalSortValue}
                />
              ) : null}

              <SearchResultsPerPage
                onChange={resultsPerPageSelectHandler}
                value={elasticSize}
              />
            </div>
          </div>
        ) : null}
        {searchResults ? (
          <div className="border-brand1Grey-100 -mx-10 mb-8 flex flex-row flex-wrap items-center justify-end gap-2 border-b px-10">
            {props.projectConfig.showSelectedFilters ? (
              <>
                <span className="text-brand1Grey-600 text-sm">
                  {translate("FILTERS")}:{" "}
                </span>
                {getKeywordFacets().map(([facetName, facetValues]) => {
                  return Object.keys(facetValues).map(
                    (facetValueName, index) => {
                      const key = `${facetName}-${facetValueName}`;

                      if (checkboxStates.get(key)) {
                        return (
                          <div
                            className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 active:bg-brand2-200 flex cursor-pointer flex-row rounded px-1 py-1 text-sm"
                            key={index}
                          >
                            {translateProject(facetName)}:{" "}
                            {/^[a-z]/.test(facetValueName)
                              ? facetValueName.charAt(0).toUpperCase() +
                                facetValueName.slice(1)
                              : translateProject(facetValueName)}{" "}
                            {
                              <XMarkIcon
                                className="h-5 w-5"
                                onClick={() => removeFacet(key)}
                              />
                            }
                          </div>
                        );
                      }
                    },
                  );
                })}
              </>
            ) : null}

            <SearchPagination
              prevPageClickHandler={prevPageClickHandler}
              nextPageClickHandler={nextPageClickHandler}
              pageNumber={pageNumber}
              searchResults={searchResults}
              elasticSize={elasticSize}
            />
          </div>
        ) : null}
        {searchResults && searchResults.results.length >= 1 ? (
          searchResults.results.map((result, index) => (
            <SearchItem key={index} result={result} />
          ))
        ) : (
          <props.projectConfig.components.SearchInfoPage />
        )}
        {searchResults ? (
          <SearchPagination
            prevPageClickHandler={prevPageClickHandler}
            nextPageClickHandler={nextPageClickHandler}
            pageNumber={pageNumber}
            searchResults={searchResults}
            elasticSize={elasticSize}
          />
        ) : null}
      </div>
    </div>
  );
};
