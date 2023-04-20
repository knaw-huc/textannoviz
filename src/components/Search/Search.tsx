import React from "react";
import "react-calendar/dist/Calendar.css";
import { CheckboxFacet, FullTextFacet } from "reactions-knaw-huc";
import { ProjectConfig } from "../../model/ProjectConfig";
import { SearchResult } from "../../model/Search";
import {
  getElasticIndices,
  getFacets,
  sendSearchQuery,
} from "../../utils/broccoli";
import { SearchItem } from "./SearchItem";

interface SearchProps {
  project: string;
  projectConfig: ProjectConfig;
}

export const Search = (props: SearchProps) => {
  const [searchResults, setSearchResults] = React.useState<SearchResult>();
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [facets, setFacets] = React.useState<any>([]);
  const [query, setQuery] = React.useState<any>();
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(elasticSize);
  const [sort, setSort] = React.useState("_score");
  const [elasticIndices, setElasticIndices] = React.useState<any>();

  React.useEffect(() => {
    getFacets(props.projectConfig).then((data) => {
      setFacets(data);
    });
  }, [props.projectConfig]);

  React.useEffect(() => {
    getElasticIndices(props.projectConfig).then((data) =>
      setElasticIndices(data)
    );
  }, [props.projectConfig]);

  const doSearch = async (value: string) => {
    const searchQuery = {
      bool: {
        must: [
          // {
          //   range: {
          //     sessionDate: {
          //       relation: "within",
          //       gte: `${dateFrom}`,
          //       lte: `${dateTo}`,
          //     },
          //   },
          // },
          // {
          //   terms: {
          //     sessionWeekday: weekdaysChecked,
          //   },
          // },
          // {
          //   terms: {
          //     propositionType: propositionTypesChecked,
          //   },
          // },
          // {
          //   term: {
          //     bodyType: {
          //       value: "attendancelist",
          //       // case_insensitive: true,
          //     },
          //   },
          // },
          // {
          //   terms: {
          //     bodyType: bodyTypesChecked,
          //   },
          // },
          {
            match_phrase_prefix: {
              text: `${value}`,
            },
          },
        ],
      },
    };

    setQuery(searchQuery);

    const data = await sendSearchQuery(
      searchQuery,
      fragmenter,
      elasticSize,
      0,
      sort,
      props.projectConfig
    );

    setSearchResults(data);
    setElasticFrom(elasticSize);
    setPageNumber(1);
  };

  const handleFullTextFacet = (value: string) => {
    doSearch(value);
  };

  const fragmenterSelectHandler = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.currentTarget.value === "") return;
    setFragmenter(event.currentTarget.value);
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
      sort,
      props.projectConfig
    );

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
  }

  async function nextPageClickHandler() {
    if (searchResults.total.value < elasticFrom) return;
    setElasticFrom((prevNumber) => prevNumber + elasticSize);
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
    const data = await sendSearchQuery(
      query,
      fragmenter,
      elasticSize,
      elasticFrom,
      sort,
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
      sort,
      props.projectConfig
    );

    // const target = document.getElementsByClassName("searchContainer")[0];
    // target.scrollIntoView({ behavior: "smooth" });

    setSearchResults(data);
  }

  function tempChangeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
  }

  function renderFacets() {
    return Object.entries(elasticIndices).map(([_, values]) => {
      return Object.entries(values).map(([indicesKey, indicesValue], index) => {
        if (indicesValue === "keyword") {
          return Object.entries(facets).map(([_, facetsValues]) => {
            return Object.entries(facetsValues).map(
              ([facetsKey, facetsValue]) => {
                if (facetsKey === indicesKey) {
                  return (
                    <div key={index} className="searchFacet">
                      <div className="searchFacetTitle">{facetsKey}</div>
                      {Object.entries(facetsValue).map(([key, value]) => {
                        return (
                          <CheckboxFacet
                            key={index}
                            id={`${key}-${index}`}
                            name={key}
                            value={key}
                            labelName={key}
                            amount={value as number}
                            onChange={tempChangeHandler}
                          />
                        );
                      })}
                    </div>
                  );
                }
              }
            );
          });
        }
      });
    });
  }

  return (
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <div className="searchFacet">
              <div className="searchFacetTitle">Text search</div>
              <FullTextFacet valueHandler={handleFullTextFacet} />
            </div>
            <div className="searchFacet">
              <label>Fragmenter </label>
              <select onChange={fragmenterSelectHandler}>
                <option>Scan</option>
                <option>Sentence</option>
                <option>None</option>
              </select>
            </div>
            {console.time("facets")}
            {elasticIndices && renderFacets()}
            {console.timeEnd("facets")}
          </div>
          <div className="searchResults">
            <div className="searchResultsHeader">
              <div>
                {searchResults &&
                  `Showing ${elasticFrom - elasticSize + 1}-${elasticFrom} of ${
                    searchResults.total.value
                  } results`}
              </div>
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
