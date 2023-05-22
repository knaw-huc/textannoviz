import React from "react";
import { CheckboxFacet, FullTextFacet } from "reactions-knaw-huc";
import { ProjectConfig } from "../../model/ProjectConfig";
import {
  FacetValue,
  Facets,
  Indices,
  SearchQuery,
  SearchResult,
} from "../../model/Search";
import { sendSearchQuery } from "../../utils/broccoli";
import { Fragmenter } from "./Fragmenter";
import { SearchItem } from "./SearchItem";
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
    props.projectConfig.initialDateFrom ?? ""
  );
  const [dateTo, setDateTo] = React.useState(
    props.projectConfig.initialDateTo ?? ""
  );
  const [facets, setFacets] = React.useState<Facets>(props.facets);
  const [query, setQuery] = React.useState<SearchQuery>({});
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(0);
  const [sortBy, setSortBy] = React.useState("_score");
  const [sortOrder, setSortOrder] = React.useState("desc");
  const [fullText, setFullText] = React.useState("");
  const [dirty, setDirty] = React.useState(0);
  const [checkboxStates, setCheckBoxStates] = React.useState(
    new Map<string, boolean>()
  );
  // const [searchParams, setSearchParams] = useSearchParams();

  React.useEffect(() => {
    const newMap = new Map<string, boolean>();
    props.facets &&
      getKeywordFacets().map(([facetName, facetValues]) => {
        Object.keys(facetValues).forEach((facetValueName) => {
          const key = `${facetName}-${facetValueName}`;
          newMap.set(key, false);
        });
      });
    setCheckBoxStates(newMap);
  }, [props.facets, props.indexName, props.indices]);

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

    const data = await sendSearchQuery(
      searchQuery,
      fragmenter,
      elasticSize,
      0,
      props.projectConfig,
      sortBy,
      sortOrder
    );

    setSearchResults(data);
    setElasticFrom(0);
    setPageNumber(1);
    setFacets(data.aggs);
    // setSearchParams({
    //   page: pageNumber.toString(),
    //   size: elasticSize.toString(),
    //   from: elasticFrom.toString(),
    //   frag: fragmenter,
    //   sortBy: sortBy,
    //   sortOrder: sortOrder,
    //   query: Base64.toBase64(JSON.stringify(searchQuery)),
    // });
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
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.currentTarget.value === "") return;
    setFragmenter(event.currentTarget.value);

    if (searchResults) {
      refresh();
    }
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
      sortOrder
    );

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
    // setSearchParams((searchParams) => {
    //   searchParams.set("page", prevPage.toString());
    //   searchParams.set("from", newFrom.toString());
    //   return searchParams;
    // });
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
      sortOrder
    );

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
    // setSearchParams((searchParams) => {
    //   searchParams.set("page", nextPage.toString());
    //   searchParams.set("from", newFrom.toString());
    //   return searchParams;
    // });
  }

  const resultsPerPageSelectHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.currentTarget.value === "") return;
    setElasticSize(parseInt(event.currentTarget.value));

    if (searchResults) {
      refresh();
    }
  };

  async function jumpToPageHandler(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newFrom = (parseInt(event.currentTarget.value) - 1) * elasticSize;
    setElasticFrom(newFrom);
    setPageNumber(parseInt(event.currentTarget.value));

    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      newFrom,
      props.projectConfig,
      sortBy,
      sortOrder
    );

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
  }

  React.useEffect(() => {
    if (dirty > 0) {
      doSearch();
    }
  }, [dirty]);

  function getFacets(type: string) {
    return Object.entries(facets).filter(([key]) => {
      return props.indices && props.indices[props.indexName][key] === type;
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
    }

    if (event.currentTarget.value === "dateAsc") {
      setSortBy(facetName);
      setSortOrder("asc");
    }

    if (event.currentTarget.value === "dateDesc") {
      setSortBy(facetName);
      setSortOrder("desc");
    }

    if (searchResults) {
      refresh();
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
                  onChange={(event) =>
                    setCheckBoxStates(
                      new Map(checkboxStates.set(key, event.target.checked))
                    )
                  }
                  checked={checkboxStates.get(key) ?? false}
                />
              );
            }
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
              min={dateFrom}
              max={dateTo}
              onChange={(event) => setDateFrom(event.target.value)}
            />

            <div className="searchFacetTitle" style={{ marginTop: "10px" }}>
              To
            </div>
            <input
              type="date"
              id="end"
              value={dateTo}
              min={dateFrom}
              max={dateTo}
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

  return (
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <div className="searchFacet">
              <div className="searchFacetTitle">Text search</div>
              <FullTextFacet
                valueHandler={handleFullTextFacet}
                enterPressedHandler={fullTextEnterPressedHandler}
              />
              <button onClick={() => refresh()}>Search</button>
            </div>
            <Fragmenter onChange={fragmenterSelectHandler} />
            {facets && renderDateFacets()}
            {checkboxStates.size > 0 && renderKeywordFacets()}
          </div>
          <div className="searchResults">
            <div className="searchResultsHeader">
              <div className="searchResultsHeaderLeft">
                <div className="searchResultsNumbers">
                  {searchResults &&
                    `Showing ${elasticFrom + 1}-${Math.min(
                      elasticFrom + elasticSize,
                      searchResults.total.value
                    )} of ${searchResults.total.value} results`}
                </div>
              </div>
              <div className="searchResultsHeaderRight">
                <SearchSortBy onChange={sortByChangeHandler} />
                <SearchResultsPerPage onChange={resultsPerPageSelectHandler} />
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
                        {facetName}: {facetValueName} {"[x]"}
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
                  searchResults.total.value / elasticSize
                )}`}
                <select onChange={jumpToPageHandler} value={pageNumber}>
                  {Array.from(
                    {
                      length: Math.ceil(
                        searchResults.total.value / elasticSize
                      ),
                    },
                    (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    )
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
