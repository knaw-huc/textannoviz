import React from "react";
import "react-calendar/dist/Calendar.css";
import { CheckboxFacet, FullTextFacet } from "reactions-knaw-huc";
import { ProjectConfig } from "../../model/ProjectConfig";
import { FacetType, SearchResult } from "../../model/Search";
import { getFacets, sendSearchQuery } from "../../utils/broccoli";
import { SearchItem } from "./SearchItem";

interface SearchProps {
  project: string;
  projectConfig: ProjectConfig;
}

interface TermsQuery {
  terms: {
    [key: string]: string[];
  };
}

interface FullTextQuery {
  match_phrase_prefix: {
    text: string;
  };
}

interface newQuery {
  text: string;
  terms: {
    [key: string]: string[];
  };
  aggs: string[];
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
  const [facets, setFacets] = React.useState<FacetType[]>([]);
  const [query, setQuery] = React.useState<any>();
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(elasticSize);
  const [sort] = React.useState("_score");
  // const [elasticIndices, setElasticIndices] = React.useState<any>();
  const [weekdayChecked, setWeekdayChecked] = React.useState<string[]>([]);
  const [propositionTypeChecked, setPropositionTypeChecked] = React.useState<
    string[]
  >([]);
  const [bodyTypeChecked, setBodyTypeChecked] = React.useState<string[]>([]);
  const [fullText, setFullText] = React.useState<string>();

  React.useEffect(() => {
    getFacets(props.projectConfig).then((data) => {
      setFacets(data);
    });
  }, [props.projectConfig]);

  // React.useEffect(() => {
  //   getElasticIndices(props.projectConfig).then((data) =>
  //     setElasticIndices(data)
  //   );
  // }, [props.projectConfig]);

  const sessionWeekdays = facets.find((facet) => facet.sessionWeekday);
  const propositionTypes = facets.find((facet) => facet.propositionType);
  const bodyTypes = facets.find((facet) => facet.bodyType);
  let sessionWeekdayQuery: TermsQuery;
  let propositionTypeQuery: TermsQuery;
  let bodyTypeQuery: TermsQuery;
  let fullTextQuery: FullTextQuery;

  const searchQuery: any = {
    bool: {
      must: [
        {
          range: {
            sessionDate: {
              relation: "within",
              gte: `${dateFrom}`,
              lte: `${dateTo}`,
            },
          },
        },
      ],
    },
  };

  const doSearch = async () => {
    if (weekdayChecked) {
      sessionWeekdayQuery = {
        terms: {
          sessionWeekday: weekdayChecked,
        },
      };
    }

    if (propositionTypeChecked) {
      propositionTypeQuery = {
        terms: {
          propositionType: propositionTypeChecked,
        },
      };
    }

    if (bodyTypeChecked) {
      bodyTypeQuery = {
        terms: {
          bodyType: bodyTypeChecked,
        },
      };
    }

    if (fullText) {
      fullTextQuery = {
        match_phrase_prefix: {
          text: fullText,
        },
      };
    }

    sessionWeekdayQuery.terms.sessionWeekday.length >= 1 &&
      searchQuery["bool"]["must"].push(sessionWeekdayQuery);
    propositionTypeQuery.terms.propositionType.length >= 1 &&
      searchQuery["bool"]["must"].push(propositionTypeQuery);
    bodyTypeQuery.terms.bodyType.length >= 1 &&
      searchQuery["bool"]["must"].push(bodyTypeQuery);
    fullTextQuery?.match_phrase_prefix?.text &&
      searchQuery["bool"]["must"].push(fullTextQuery);

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
  };

  const handleFullTextFacet = (value: string) => {
    setFullText(value);
  };

  const fullTextEnterPressedHandler = (pressed: boolean) => {
    if (pressed) {
      doSearch();
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
        Object.keys(sessionWeekdays.sessionWeekday).map((weekday) => {
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
        Object.keys(propositionTypes.propositionType).map((propositionType) => {
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
        Object.keys(bodyTypes.bodyType).map((bodyType) => {
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
              <button onClick={() => doSearch()}>Search</button>
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
                Object.entries(bodyTypes.bodyType).map(
                  ([bodyType, amount], index) => (
                    <CheckboxFacet
                      key={index}
                      id={`${bodyType}-${index}`}
                      name="bodyTypes"
                      value={bodyType}
                      labelName={bodyType}
                      onChange={bodyTypesCheckedHandler}
                      amount={amount}
                    />
                  )
                )}
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
                Object.entries(sessionWeekdays.sessionWeekday).map(
                  ([weekday, amount], index) => (
                    <CheckboxFacet
                      key={index}
                      id={`${weekday}-${index}`}
                      name="weekdays"
                      value={weekday}
                      labelName={weekday}
                      onChange={weekdaysCheckedHandler}
                      amount={amount}
                    />
                  )
                )}
            </div>
            <div className="searchFacet">
              <div className="searchFacetTitle">Proposition type</div>
              {propositionTypes &&
                Object.entries(propositionTypes.propositionType).map(
                  ([propositionType, amount], index) => (
                    <CheckboxFacet
                      key={index}
                      id={`${propositionType}-${index}`}
                      name="propositionTypes"
                      value={propositionType}
                      labelName={propositionType}
                      onChange={propositionTypesCheckedHandler}
                      amount={amount}
                    />
                  )
                )}
            </div>
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
