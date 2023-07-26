import { Base64 } from "js-base64";
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckboxFacet, FullTextFacet } from "reactions-knaw-huc";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const setGlobalSearchResults = useSearchStore(
    (state) => state.setGlobalSearchResults,
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

    getDateFacets().map(([facetName]) => {
      searchQuery["date"] = {
        name: facetName,
        from: dateFrom,
        to: dateTo,
      };
    });

    setQuery(searchQuery);
    console.log(searchQuery);
    setQueryHistory([searchQuery, ...queryHistory]);

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
    const facetName = getDateFacets()[0][0];

    if (event.currentTarget.value === "_score") {
      setSortBy("_score");
      setSortOrder("desc");
      setInternalSortValue("_score");
      setSearchParams((searchParams) => {
        searchParams.set("sortBy", "_score");
        searchParams.set("sortOrder", "desc");
        return searchParams;
      });
    }

    if (event.currentTarget.value === "dateAsc") {
      setSortBy(facetName);
      setSortOrder("asc");
      setInternalSortValue("dateAsc");
      setSearchParams((searchParams) => {
        searchParams.set("sortBy", facetName);
        searchParams.set("sortOrder", "asc");
        return searchParams;
      });
    }

    if (event.currentTarget.value === "dateDesc") {
      setSortBy(facetName);
      setSortOrder("desc");
      setInternalSortValue("dateDesc");
      setSearchParams((searchParams) => {
        searchParams.set("sortBy", facetName);
        searchParams.set("sortOrder", "desc");
        return searchParams;
      });
    }
  }

  function renderKeywordFacets() {
    return getKeywordFacets().map(([facetName, facetValues], index) => {
      return (
        <div key={index} className="searchFacet">
          <div className="searchFacetTitle">
            {props.searchFacetTitles[facetName] ?? facetName}
          </div>
          {Object.entries(facetValues).map(
            ([facetValueName, facetValueAmount]) => {
              const key = `${facetName}-${facetValueName}`;
              return (
                <CheckboxFacet
                  key={key}
                  id={key}
                  name={facetValueName}
                  value={facetValueName}
                  labelName={facetValueName}
                  amount={facetValueAmount}
                  onChange={(event) => keywordFacetChangeHandler(key, event)}
                  checked={checkboxStates.get(key) ?? false}
                />
              );
            },
          )}
        </div>
      );
    });
  }

  function renderDateFacets() {
    return getDateFacets().map(([facetName], index) => {
      return (
        <div key={index} className="searchFacet">
          <div className="searchFacetTitle">
            {props.searchFacetTitles[facetName] ?? facetName}
          </div>
          <div>
            <div className="searchFacetTitle">From</div>
            <input
              type="date"
              id="start"
              value={dateFrom}
              min={props.projectConfig.initialDateFrom}
              max={props.projectConfig.initialDateTo}
              onChange={(event) => setDateFrom(event.target.value)}
            />

            <div className="searchFacetTitle" style={{ marginTop: "10px" }}>
              To
            </div>
            <input
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
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <div className="searchFacet">
              <div className="searchFacetTitle">Text search</div>
              <div className="hcFacetSearch">
                <FullTextFacet
                  valueHandler={handleFullTextFacet}
                  enterPressedHandler={fullTextEnterPressedHandler}
                  value={fullText}
                />
                <button onClick={() => refresh()}>Search</button>
              </div>
              <Link to={"/search"} reloadDocument>
                New search
              </Link>
            </div>
            <SearchQueryHistory
              historyClickHandler={historyClickHandler}
              historyIsOpen={historyIsOpen}
              queryHistory={queryHistory}
              goToQuery={goToQuery}
              projectConfig={props.projectConfig}
            />
            <Fragmenter onChange={fragmenterSelectHandler} value={fragmenter} />
            {renderDateFacets()}
            {checkboxStates.size > 0 && renderKeywordFacets()}
          </div>
          <div className="searchResults">
            <div className="bg-brand1-500 top-0 z-30 mb-8 flex flex-row items-center justify-between">
              <div className="searchResultsHeaderLeft">
                <div className="searchResultsNumbers">
                  {searchResults &&
                    `Showing ${elasticFrom + 1}-${Math.min(
                      elasticFrom + elasticSize,
                      searchResults.total.value,
                    )} of ${searchResults.total.value} results`}
                </div>
              </div>
              <div className="searchResultsHeaderRight">
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
            <div className="selectedFacetList">
              <div className="searchFacetTitle">Selected facets:</div>
              {getKeywordFacets().map(([facetName, facetValues]) => {
                return Object.keys(facetValues).map((facetValueName, index) => {
                  const key = `${facetName}-${facetValueName}`;

                  if (checkboxStates.get(key)) {
                    return (
                      <div
                        className="selectedFacet"
                        key={index}
                        onClick={() => removeFacet(key)}
                      >
                        {(props.projectConfig.searchFacetTitles &&
                          props.projectConfig.searchFacetTitles[facetName]) ??
                          facetName}
                        : {facetValueName} {"[x]"}
                      </div>
                    );
                  }
                });
              })}
            </div>
            {searchResults && searchResults.results.length >= 1
              ? searchResults.results.map((result, index) => (
                  <SearchItem key={index} result={result} />
                ))
              : "No results"}
            {searchResults && (
              <div className="searchPagination">
                <button onClick={prevPageClickHandler}>Prev</button>
                {`Page: ${pageNumber} of ${Math.ceil(
                  searchResults.total.value / elasticSize,
                )}`}
                <select onChange={jumpToPageHandler} value={pageNumber}>
                  {Array.from(
                    {
                      length: Math.ceil(
                        searchResults.total.value / elasticSize,
                      ),
                    },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ),
                  )}
                </select>
                <button onClick={nextPageClickHandler}>Next</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
