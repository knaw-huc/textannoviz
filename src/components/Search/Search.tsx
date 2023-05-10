import React from "react";
import "react-calendar/dist/Calendar.css";
import { CheckboxFacet, FullTextFacet } from "reactions-knaw-huc";
import { ProjectConfig } from "../../model/ProjectConfig";
import { SearchResult } from "../../model/Search";
import { sendSearchQuery } from "../../utils/broccoli";
import { SearchItem } from "./SearchItem";

interface SearchProps {
  project: string;
  projectConfig: ProjectConfig;
  indices: any;
  facets: any;
  indexName: string;
}

interface FacetValue {
  [key: string]: number;
}

interface Facets {
  [key: string]: FacetValue;
}

interface SearchQuery {
  text?: string;
  terms: {
    [key: string]: string[];
  };
  aggs?: string[];
  date: {
    from: string;
    to: string;
    name: string;
  };
}

export const Search = (props: SearchProps) => {
  const [searchResults, setSearchResults] = React.useState<SearchResult>();
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [dateFrom, setDateFrom] = React.useState("1728-01-01");
  const [dateTo, setDateTo] = React.useState("1728-12-31");
  const [facets, setFacets] = React.useState<Facets>(props.facets);
  const [query, setQuery] = React.useState<SearchQuery>();
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(elasticSize);
  const [fullText, setFullText] = React.useState<string>();
  const [dirty, setDirty] = React.useState<number>(0);
  const [checkboxStates, setCheckBoxStates] = React.useState(
    new Map<string, boolean>()
  );

  React.useEffect(() => {
    const newMap = new Map<string, boolean>();
    props.facets &&
      Object.entries(props.facets)
        .filter(([key, _]) => {
          return (
            props.indices && props.indices["resolutions"][key] === "keyword"
          );
        })
        .map(([facetName, facetValues]) => {
          Object.keys(facetValues as FacetValue).forEach((facetValueName) => {
            const key = `${facetName}-${facetValueName}`;
            newMap.set(key, false);
          });
        });
    setCheckBoxStates(newMap);
  }, [props.facets, props.indices]);

  function refresh() {
    setDirty((prev) => prev + 1);
  }

  const doSearch = async () => {
    const searchQuery: SearchQuery = {
      date: {
        name: "sessionDate",
        from: `${dateFrom}`,
        to: `${dateTo}`,
      },
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

    setQuery(searchQuery);
    console.log(searchQuery);

    const data = await sendSearchQuery(
      searchQuery,
      fragmenter,
      elasticSize,
      0,
      props.projectConfig
    );

    setSearchResults(data);
    setElasticFrom(elasticSize);
    setPageNumber(1);
    setFacets(data.aggs);
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
  };

  const calendarFromChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateFrom(event.target.value);
  };

  const calendarToChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateTo(event.target.value);
  };

  async function prevPageClickHandler() {
    setElasticFrom((prevNumber) => prevNumber - elasticSize);
    const from = elasticFrom - elasticSize * 2;
    setPageNumber((prevPageNumber) => prevPageNumber - 1);

    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      from,
      props.projectConfig
    );

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
  }

  async function nextPageClickHandler() {
    if (searchResults && searchResults.total.value < elasticFrom) return;
    setElasticFrom((prevNumber) => prevNumber + elasticSize);
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      elasticFrom,
      props.projectConfig
    );

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
  }

  const resultsPerPageSelectHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.currentTarget.value === "") return;
    setElasticSize(parseInt(event.currentTarget.value));
  };

  async function jumpToPageHandler(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    setElasticFrom(parseInt(event.currentTarget.value) * elasticSize);
    const from =
      parseInt(event.currentTarget.value) * elasticSize - elasticSize;
    setPageNumber(parseInt(event.currentTarget.value));

    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      from,
      props.projectConfig
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

  function getKeywordFacets() {
    return Object.entries(facets).filter(([key, _]) => {
      return props.indices && props.indices[props.indexName][key] === "keyword";
    });
  }

  function renderFacets() {
    return getKeywordFacets().map(([facetName, facetValues], index) => {
      return (
        <div key={index} className="searchFacet">
          <div className="searchFacetTitle">{facetName}</div>
          {Object.entries(facetValues as FacetValue).map(
            ([facetValueName, facetValueAmount]) => {
              const key = `${facetName}-${facetValueName}`;
              return (
                <CheckboxFacet
                  key={key}
                  id={key}
                  name={facetValueName}
                  value={facetValueName}
                  labelName={facetValueName}
                  amount={facetValueAmount as number}
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
            <div className="searchFacet">
              <label>Fragmenter </label>
              <select onChange={fragmenterSelectHandler}>
                <option>Scan</option>
                <option>Sentence</option>
                <option>None</option>
              </select>
            </div>
            <div className="searchFacet">
              <div className="searchFacetTitle">From</div>
              <input
                type="date"
                id="start"
                value={dateFrom}
                min={dateFrom}
                max={dateTo}
                onChange={calendarFromChangeHandler}
              />
            </div>
            <div className="searchFacet">
              <div className="searchFacetTitle">To</div>
              <input
                type="date"
                id="end"
                value={dateTo}
                min={dateFrom}
                max={dateTo}
                onChange={calendarToChangeHandler}
              />
            </div>
            {checkboxStates.size > 0 && renderFacets()}
          </div>
          <div className="searchResults">
            <div className="searchResultsHeader">
              <div className="searchResultsHeaderLeft">
                <div className="searchResultsNumbers">
                  {searchResults &&
                    `Showing ${
                      elasticFrom - elasticSize + 1
                    }-${elasticFrom} of ${searchResults.total.value} results`}
                </div>
              </div>
              <div className="searchResultsHeaderRight">
                <div className="searchResultsPerPage">
                  Results per page
                  <select
                    onChange={resultsPerPageSelectHandler}
                    defaultValue={10}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>
              </div>
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
