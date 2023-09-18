import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import React from "react";
import { Button, Switch } from "react-aria-components";
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
import { useSearchStore } from "../../stores/search";
import { sendSearchQuery } from "../../utils/broccoli";
import { Fragmenter } from "./Fragmenter";
import { KeywordFacet } from "./KeywordFacet";
import { SearchItem } from "./SearchItem";
import { SearchQueryHistory } from "./SearchQueryHistory";
import { SearchResultsPerPage } from "./SearchResultsPerPage";
import { SearchSortBy } from "./SearchSortBy";

type SearchProps = {
  project: string;
  projectConfig: ProjectConfig;
  indices: Indices;
  facets: Facets;
  indexName: string;
  searchFacetTitles: Record<string, string>;
};

export const Search = (props: SearchProps) => {
  const [searchResults, setSearchResults] = React.useState<SearchResult>();
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [dateFrom, setDateFrom] = React.useState(
    props.projectConfig.initialDateFrom ?? "",
  );
  const [dateTo, setDateTo] = React.useState(
    props.projectConfig.initialDateTo ?? "",
  );
  const [facets, setFacets] = React.useState<Facets>(props.facets);
  const [query, setQuery] = React.useState<SearchQuery>({});
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("_score");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [internalSortValue, setInternalSortValue] = React.useState("_score");
  const [fullText, setFullText] = React.useState("");
  const [dirty, setDirty] = React.useState(0);
  const [checkboxStates, setCheckBoxStates] = React.useState(
    new Map<string, boolean>(),
  );
  const [queryHistory, setQueryHistory] = React.useState<SearchQuery[]>([]);
  const [historyIsOpen, setHistoryIsOpen] = React.useState(false);
  const [includeDate, setIncludeDate] = React.useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const setGlobalSearchResults = useSearchStore(
    (state) => state.setGlobalSearchResults,
  );
  const setGlobalSearchQuery = useSearchStore(
    (state) => state.setGlobalSearchQuery,
  );

  React.useEffect(() => {
    const queryEncoded = searchParams.get("query");
    const queryDecoded: SearchQuery =
      queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));

    if (queryDecoded) {
      if (queryDecoded.text) {
        setFullText(queryDecoded.text);
      }
    }
    const newMap = new Map<string, boolean>();
    const selectedFacets: string[] = [];

    if (queryDecoded) {
      Object.entries(queryDecoded.terms).forEach(([facetName, facetValues]) => {
        facetValues.forEach((facetValue) => {
          const key = `${facetName}-${facetValue}`;
          selectedFacets.push(key);
        });
      });
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
  }, [props.facets, props.indexName, props.indices, searchParams]);

  React.useEffect(() => {
    async function search(
      query: SearchQuery,
      frag: string,
      size: string,
      from: number,
      sortBy: string,
      sortOrder: string,
      page: string,
    ) {
      const data = await sendSearchQuery(
        query,
        frag,
        parseInt(size),
        from,
        props.projectConfig,
        sortBy,
        sortOrder,
      );

      setSearchResults(data);
      setGlobalSearchResults(data);
      setElasticFrom(from);
      setPageNumber(parseInt(page));
      setElasticSize(parseInt(size));
      setSortBy(sortBy);
      setSortOrder(sortOrder);
      setFacets(data.aggs);
      setQuery(query);
      setGlobalSearchQuery(query);
      setFragmenter(frag);
      if (query.date) {
        setDateFrom(query.date?.from);
        setDateTo(query.date?.to);
      }

      if (sortBy === "_score") {
        setInternalSortValue("_score");
      }
      if (sortBy === "sessionDate") {
        if (sortOrder === "desc") {
          setInternalSortValue("dateDesc");
        }
        if (sortOrder === "asc") {
          setInternalSortValue("dateAsc");
        }
      }
    }
    if ([...searchParams.keys()].length > 0) {
      const page = searchParams.get("page");
      const size = searchParams.get("size");
      const from =
        parseInt(page ?? "1") * parseInt(size ?? "10") - parseInt(size ?? "10");
      const frag = searchParams.get("frag");
      const sortBy = searchParams.get("sortBy");
      const sortOrder = searchParams.get("sortOrder");
      const queryEncoded = searchParams.get("query");
      const queryDecoded: SearchQuery =
        queryEncoded && JSON.parse(Base64.fromBase64(queryEncoded));
      search(
        queryDecoded,
        frag ?? "",
        size ?? "",
        from,
        sortBy ?? "",
        sortOrder ?? "",
        page ?? "",
      );
    }
  }, [props.projectConfig, searchParams]);

  function refresh() {
    setDirty((prev) => prev + 1);
  }

  const doSearch = async () => {
    const searchQuery: SearchQuery = {
      terms: {},
    };

    if (fullText) {
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

    if (includeDate) {
      getDateFacets().map(([facetName]) => {
        searchQuery["date"] = {
          name: facetName,
          from: dateFrom,
          to: dateTo,
        };
      });
    }

    if (Object.keys(searchQuery.terms).length === 0) {
      toast("Please select a facet or use the full text search.", {
        type: "info",
      });
      return;
    }

    setQuery(searchQuery);
    console.log(searchQuery);
    setQueryHistory([searchQuery, ...queryHistory]);
    setGlobalSearchQuery(searchQuery);

    const data = await sendSearchQuery(
      searchQuery,
      fragmenter,
      elasticSize,
      0,
      props.projectConfig,
      sortBy,
      sortOrder,
    );

    const page = 1;

    setSearchResults(data);
    setGlobalSearchResults(data);
    setElasticFrom(0);
    setPageNumber(page);
    setFacets(data.aggs);
    setSearchParams({
      page: page.toString(),
      size: elasticSize.toString(),
      frag: fragmenter,
      sortBy: sortBy,
      sortOrder: sortOrder,
      query: Base64.toBase64(JSON.stringify(searchQuery)),
    });
  };

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

    setSearchParams((searchParams) => {
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

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
    setGlobalSearchResults(data);
    setSearchParams((searchParams) => {
      searchParams.set("page", prevPage.toString());
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });
  }

  async function nextPageClickHandler() {
    const newFrom = elasticFrom + elasticSize;
    if (searchResults && searchResults.total.value <= newFrom) return;
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

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
    setGlobalSearchResults(data);
    setSearchParams((searchParams) => {
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

    setSearchParams((searchParams) => {
      searchParams.set("size", event.currentTarget.value);
      return searchParams;
    });
  };

  async function jumpToPageHandler(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const newFrom = (parseInt(event.currentTarget.value) - 1) * elasticSize;
    setElasticFrom(newFrom);
    setPageNumber(parseInt(event.currentTarget.value));
    setSearchParams((searchParams) => {
      searchParams.set("page", event.currentTarget.value);
      searchParams.set("from", newFrom.toString());
      return searchParams;
    });

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });
  }

  React.useEffect(() => {
    if (dirty > 0) {
      doSearch();
    }
  }, [dirty]);

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

    setSearchParams((searchParams) => {
      searchParams.set("sortBy", sortByValue);
      searchParams.set("sortOrder", sortOrderValue);
      return searchParams;
    });
  }

  function renderKeywordFacets() {
    return (
      <KeywordFacet
        getKeywordFacets={getKeywordFacets}
        keywordFacetChangeHandler={keywordFacetChangeHandler}
        searchFacetTitles={props.searchFacetTitles}
        projectConfig={props.projectConfig}
        checkboxStates={checkboxStates}
      />
    );
  }

  function renderDateFacets() {
    return getDateFacets().map(([facetName], index) => {
      return (
        <div
          key={index}
          className="flex w-full max-w-[450px] flex-col gap-4 lg:flex-row"
        >
          <div className="flex w-full flex-col">
            <div className="flex items-center"></div>
            <label htmlFor="start" className="font-semibold">
              Van
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
              Tot en met
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

  function keywordFacetChangeHandler(
    key: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    setCheckBoxStates(new Map(checkboxStates.set(key, event.target.checked)));
    if (searchResults) {
      refresh();
    }
  }

  function historyClickHandler() {
    setHistoryIsOpen(!historyIsOpen);
  }

  function goToQuery(query: SearchQuery) {
    setSearchParams((searchParams) => {
      searchParams.set("query", Base64.toBase64(JSON.stringify(query)));
      return searchParams;
    });
  }

  return (
    <div className="mx-auto flex h-full w-full grow flex-row content-stretch items-stretch self-stretch">
      <div className="hidden w-full grow flex-col gap-6 self-stretch bg-white pl-6 pr-10 pt-16 md:flex md:w-3/12 md:gap-10">
        <div className="w-full max-w-[450px]">
          <label htmlFor="fullText" className="font-semibold">
            Vrij zoeken
          </label>
          <div className="flex w-full flex-row">
            <FullTextFacet
              valueHandler={handleFullTextFacet}
              enterPressedHandler={fullTextEnterPressedHandler}
              value={fullText}
              className="border-brand2-700 w-full rounded-l border px-3 py-1 outline-none"
              placeholder="Druk op ENTER om te zoeken"
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
              to="/search"
              reloadDocument
              className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm no-underline"
            >
              Nieuwe zoekopdracht
            </Link>
          </div>
        ) : null}
        <div className="w-full max-w-[450px]">
          <SearchQueryHistory
            historyClickHandler={historyClickHandler}
            historyIsOpen={historyIsOpen}
            queryHistory={queryHistory}
            goToQuery={goToQuery}
            projectConfig={props.projectConfig}
            disabled={queryHistory.length === 0 ? true : false}
          />
        </div>
        <div className="w-full max-w-[450px]">
          <Fragmenter onChange={fragmenterSelectHandler} value={fragmenter} />
        </div>
        <div className="w-full max-w-[450px]">
          <Switch
            onChange={() => setIncludeDate(!includeDate)}
            isSelected={includeDate}
          >
            <div className="indicator" />
            <p>Date facet in query</p>
          </Switch>
        </div>
        {includeDate ? renderDateFacets() : null}
        {checkboxStates.size > 0 && renderKeywordFacets()}
      </div>

      <div className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
        {searchResults ? (
          <div className=" mb-8 flex flex-col items-center justify-between gap-2 md:flex-row">
            <span className="font-semibold">
              {searchResults &&
                `${elasticFrom + 1}-${Math.min(
                  elasticFrom + elasticSize,
                  searchResults.total.value,
                )} van ${searchResults.total.value} resultaten`}
            </span>
            <div className="flex items-center justify-between gap-10">
              <SearchSortBy
                onChange={sortByChangeHandler}
                value={internalSortValue}
              />
              <SearchResultsPerPage
                onChange={resultsPerPageSelectHandler}
                value={elasticSize}
              />
            </div>
          </div>
        ) : null}
        {searchResults ? (
          <div className="border-brand1Grey-100 -mx-10 my-8 flex flex-row flex-wrap items-center justify-start gap-2 border-b px-10 pb-8">
            <span className="text-brand1Grey-600 text-sm">Filters: </span>
            {getKeywordFacets().map(([facetName, facetValues]) => {
              return Object.keys(facetValues).map((facetValueName, index) => {
                const key = `${facetName}-${facetValueName}`;

                if (checkboxStates.get(key)) {
                  return (
                    <div
                      className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 active:bg-brand2-200 flex cursor-pointer flex-row rounded px-1 py-1 text-sm"
                      key={index}
                    >
                      {(props.projectConfig.searchFacetTitles &&
                        props.projectConfig.searchFacetTitles[facetName]) ??
                        facetName}
                      :{" "}
                      {/^[a-z]/.test(facetValueName)
                        ? facetValueName.charAt(0).toUpperCase() +
                          facetValueName.slice(1)
                        : (facetValueName &&
                            props.projectConfig.facetsTranslation &&
                            props.projectConfig.facetsTranslation[
                              facetValueName
                            ]) ??
                          facetValueName}{" "}
                      {
                        <XMarkIcon
                          className="h-5 w-5"
                          onClick={() => removeFacet(key)}
                        />
                      }
                    </div>
                  );
                }
              });
            })}
          </div>
        ) : null}
        {searchResults && searchResults.results.length >= 1 ? (
          searchResults.results.map((result, index) => (
            <SearchItem key={index} result={result} />
          ))
        ) : (
          <div className="italic">Geen resultaten</div>
        )}
        {searchResults && (
          <nav aria-label="Pagination" className="my-6">
            <ul className="list-style-none flex justify-center gap-1">
              <li>
                <Button
                  className={({ isPressed }) =>
                    isPressed
                      ? "bg-brand1Grey-300 text-brand1Grey-800 dark:text-brand1Grey-400 relative block rounded px-3 py-1.5 outline-none"
                      : "text-brand1Grey-800 dark:text-brand1Grey-400 hover:bg-brand1Grey-100 relative block rounded bg-transparent px-3 py-1.5 outline-none transition-all duration-300"
                  }
                  onPress={prevPageClickHandler}
                >
                  Vorige
                </Button>
              </li>
              <li>
                <div className="text-brand1Grey-800 relative block bg-transparent px-3 py-1.5">
                  {`${pageNumber} van ${Math.ceil(
                    searchResults.total.value / elasticSize,
                  )}`}
                </div>
              </li>
              <li>
                <Button
                  className={({ isPressed }) =>
                    isPressed
                      ? "bg-brand1Grey-300 text-brand1Grey-800 dark:text-brand1Grey-400 relative block rounded px-3 py-1.5 outline-none"
                      : "text-brand1Grey-800 dark:text-brand1Grey-400 hover:bg-brand1Grey-100 relative block rounded bg-transparent px-3 py-1.5 outline-none transition-all duration-300"
                  }
                  onPress={nextPageClickHandler}
                >
                  Volgende
                </Button>
              </li>
            </ul>

            {/* <select onChange={jumpToPageHandler} value={pageNumber}>
              {Array.from(
                {
                  length: Math.ceil(searchResults.total.value / elasticSize),
                },
                (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ),
              )}
            </select> */}
          </nav>
        )}
      </div>
    </div>
  );
};
