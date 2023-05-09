import React from "react";
import "react-calendar/dist/Calendar.css";
import { CheckboxFacet, FullTextFacet } from "reactions-knaw-huc";
import { ProjectConfig } from "../../model/ProjectConfig";
import { SearchResult } from "../../model/Search";
import { getElasticIndices, sendSearchQuery } from "../../utils/broccoli";
import { SearchItem } from "./SearchItem";

interface SearchProps {
  project: string;
  projectConfig: ProjectConfig;
}

interface Facet {
  [key: string]: number;
}

interface newQuery {
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
  const [facets, setFacets] = React.useState<any>([]);
  const [query, setQuery] = React.useState<any>();
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(elasticSize);
  const [sort, setSort] = React.useState<any>("_score");
  const [weekdayChecked, setWeekdayChecked] = React.useState<string[]>([]);
  const [propositionTypeChecked, setPropositionTypeChecked] = React.useState<
    string[]
  >([]);
  const [bodyTypeChecked, setBodyTypeChecked] = React.useState<string[]>([]);
  const [fullText, setFullText] = React.useState<string>();
  const [dirty, setDirty] = React.useState<number>(0);
  const [elasticIndices, setElasticIndices] = React.useState<any>();

  React.useEffect(() => {
    sendSearchQuery({}, fragmenter, 0, 0, props.projectConfig).then((data) => {
      setFacets(data.aggs);
    });
  }, [elasticSize, fragmenter, props.projectConfig]);

  React.useEffect(() => {
    getElasticIndices(props.projectConfig).then((data) =>
      setElasticIndices(data)
    );
  }, [props.projectConfig]);

  console.log(elasticIndices);

  function refresh() {
    setDirty((prev) => prev + 1);
  }

  const bodyTypes: Facet = facets["bodyType"];

  const sessionWeekdays: Facet = facets["sessionWeekday"];

  const propositionTypes: Facet = facets["propositionType"];

  const doSearch = async () => {
    const searchQuery: newQuery = {
      date: {
        name: "sessionDate",
        from: `${dateFrom}`,
        to: `${dateTo}`,
      },
      terms: {},
    };

    if (weekdayChecked.length) {
      searchQuery["terms"]["sessionWeekday"] = weekdayChecked;
    }

    if (propositionTypeChecked.length) {
      searchQuery["terms"]["propositionType"] = propositionTypeChecked;
    }

    if (bodyTypeChecked.length) {
      searchQuery["terms"]["bodyType"] = bodyTypeChecked;
    }

    if (fullText) {
      searchQuery["text"] = fullText;
    }

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

  const weekdaysCheckedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.checked === false) {
      setWeekdayChecked(
        weekdayChecked.filter(
          (weekday) => weekday !== event.currentTarget.value
        )
      );
    } else {
      if (sessionWeekdays) {
        Object.keys(sessionWeekdays).map((weekday) => {
          if (weekday === event.currentTarget.value) {
            setWeekdayChecked([...weekdayChecked, weekday]);
          }
        });
      }
    }
  };

  const propositionTypesCheckedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.checked === false) {
      setPropositionTypeChecked(
        propositionTypeChecked.filter(
          (propositionType) => propositionType !== event.currentTarget.value
        )
      );
    } else {
      if (propositionTypes) {
        Object.keys(propositionTypes).map((propositionType) => {
          if (propositionType === event.currentTarget.value) {
            setPropositionTypeChecked([
              ...propositionTypeChecked,
              propositionType,
            ]);
          }
        });
      }
    }
  };

  function bodyTypesCheckedHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked === false) {
      setBodyTypeChecked(
        bodyTypeChecked.filter(
          (bodyType) => bodyType !== event.currentTarget.value
        )
      );
    } else {
      if (bodyTypes) {
        Object.keys(bodyTypes).map((bodyType) => {
          if (bodyType === event.currentTarget.value) {
            setBodyTypeChecked([...bodyTypeChecked, bodyType]);
          }
        });
      }
    }
  }

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

  function removeFacet(value: string) {
    setPropositionTypeChecked(
      propositionTypeChecked.filter(
        (propositionType) => propositionType !== value
      )
    );

    refresh();
  }

  React.useEffect(() => {
    if (dirty > 0) {
      doSearch();
    }
  }, [dirty]);

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
              <div className="searchFacetTitle">Type</div>
              {bodyTypes &&
                Object.entries(bodyTypes).map(([bodyType, amount], index) => (
                  <CheckboxFacet
                    key={index}
                    id={bodyType}
                    name="bodyTypes"
                    value={bodyType}
                    labelName={bodyType}
                    onChange={bodyTypesCheckedHandler}
                    amount={amount as number}
                    checked={bodyTypeChecked.includes(bodyType)}
                  />
                ))}
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
            <div className="searchFacet">
              <div className="searchFacetTitle">Session weekday</div>
              {sessionWeekdays &&
                Object.entries(sessionWeekdays).map(
                  ([sessionWeekday, amount], index) => (
                    <CheckboxFacet
                      key={index}
                      id={`${sessionWeekday}-${index}`}
                      name="sessionWeekdays"
                      value={sessionWeekday}
                      labelName={sessionWeekday}
                      onChange={weekdaysCheckedHandler}
                      amount={amount as number}
                      checked={weekdayChecked.includes(sessionWeekday)}
                    />
                  )
                )}
            </div>
            <div className="searchFacet">
              <div className="searchFacetTitle">Proposition type</div>
              {propositionTypes &&
                Object.entries(propositionTypes).map(
                  ([propositionType, amount], index) => (
                    <CheckboxFacet
                      key={index}
                      id={`${propositionType}-${index}`}
                      name="propositionTypes"
                      value={propositionType}
                      labelName={propositionType}
                      onChange={propositionTypesCheckedHandler}
                      amount={amount as number}
                      checked={propositionTypeChecked.includes(propositionType)}
                    />
                  )
                )}
            </div>
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
                <div className="selectedFacets">
                  Selected facets:
                  {propositionTypeChecked.map((checked, index) => (
                    <div key={index} onClick={() => removeFacet(checked)}>
                      {checked}
                    </div>
                  ))}
                </div>
              </div>
              <div className="searchResultsHeaderRight">
                {/* <div className="sortBy">
                  Sort by:{" "}
                  <select>
                    <option>Relevance</option>
                    <option>Session date (asc)</option>
                    <option>Session date (dsc)</option>
                  </select>
                </div> */}
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
