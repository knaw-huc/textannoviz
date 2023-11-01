import {MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import {Base64} from "js-base64";
import React, {useEffect} from "react";
import {Button} from "react-aria-components";
import {Link, useSearchParams} from "react-router-dom";
import {toast} from "react-toastify";
import {FullTextFacet} from "reactions-knaw-huc";
import {ProjectConfig} from "../../model/ProjectConfig";
import {Facets, FacetValue, Indices, SearchQuery, SearchResult,} from "../../model/Search";
import {translateSelector, useProjectStore,} from "../../stores/project.ts";
import {useSearchStore} from "../../stores/search";
import {sendSearchQuery} from "../../utils/broccoli";
import {Fragmenter} from "./Fragmenter";
import {SearchQueryHistory} from "./SearchQueryHistory.tsx";
import {KeywordFacet} from "./KeywordFacet.tsx";
import {DateFacet} from "./DateFacet.tsx";
import {SearchResults} from "./SearchResults.tsx";

type SearchProps = {
  project: string;
  projectConfig: ProjectConfig;
  indices: Indices;
  facets: Facets;
  indexName: string;
};

const HIT_PREVIEW_REGEX = new RegExp(/<em>(.*?)<\/em>/g);

export const Search = (props: SearchProps) => {
  const translate = useProjectStore(translateSelector);
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
  const [fullText, setFullText] = React.useState("");
  const [checkboxStates, setCheckBoxStates] = React.useState(
      new Map<string, boolean>(),
  );
  const [queryHistory, setQueryHistory] = React.useState<SearchQuery[]>([]);
  const [historyIsOpen, setHistoryIsOpen] = React.useState(false);
  const [urlParams, setUrlParams] = useSearchParams();
  const {
    searchResults,
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

      if (queryDecoded?.text) {
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
      setSearchResults(data);
      setSearchResults(data);
      setElasticFrom(0);
      setFacets(data!.aggs);
    }

    searchWhenParamsChange();
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
    setFragmenter(event.currentTarget.value);

    setUrlParams((searchParams) => {
      searchParams.set("frag", event.currentTarget.value);
      return searchParams;
    });
  };

  async function getNewSearchResults(newFrom: number) {
    const data = await sendSearchQuery(
        query,
        fragmenter,
        elasticSize,
        newFrom,
        props.projectConfig,
        sortBy,
        sortOrder,
    );
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
    if (pageNumber <= 1) return;
    const prevPage = pageNumber - 1;
    const newFrom = elasticFrom - elasticSize;
    setElasticFrom((prevFrom) => prevFrom - elasticSize);
    setPageNumber(prevPage);
    await getNewSearchResults(newFrom);
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
    await getNewSearchResults(newFrom);
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

  function getFacets(type: string): [string, FacetValue][] {
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
          {type: "info"},
      );
    }

    setSortBy(sortByValue);
    setSortOrder(sortOrderValue);

    setUrlParams((searchParams) => {
      searchParams.set("sortBy", sortByValue);
      searchParams.set("sortOrder", sortOrderValue);
      return searchParams;
    });
  }

  function handleKeywordFacetChange(
      key: string,
      event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setCheckBoxStates(new Map(checkboxStates.set(key, event.target.checked)));
    if (searchResults) {
      refresh();
    }
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

          {props.projectConfig.showSearchQueryHistory && (
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
          )}

          <div className="w-full max-w-[450px]">
            <Fragmenter onChange={fragmenterSelectHandler} value={fragmenter}/>
          </div>
          {props.projectConfig.showDateFacets && (
              getDateFacets().map((_, index) => <DateFacet
                  key={index}
                  dateFrom={dateFrom}
                  dateTo={dateTo}
                  changeDateTo={setDateTo}
                  changeDateFrom={setDateFrom}
              />)
          )}
          {props.projectConfig.showKeywordFacets && checkboxStates.size > 0 && (
              getKeywordFacets().map(([facetName, facetValue], index) => (
                  <KeywordFacet
                      key={index}
                      facetName={facetName}
                      facet={facetValue}
                      onChangeKeywordFacet={handleKeywordFacetChange}
                      checkboxes={checkboxStates}
                  />
              ))
          )}
        </div>

        {searchResults && <SearchResults
            searchResults={searchResults}
            resultStart={elasticFrom + 1}
            pageSize={elasticFrom + elasticSize}
            pageNumber={pageNumber}
            clickPrevPage={prevPageClickHandler}
            clickNextPage={nextPageClickHandler}
            changePageSize={resultsPerPageSelectHandler}
            checkboxes={checkboxStates}
            keywordFacets={getKeywordFacets()}
            removeFacet={removeFacet}
            sortByChangeHandler={sortByChangeHandler}
        />}
      </div>
  );
};

