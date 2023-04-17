import React from "react";
import "react-calendar/dist/Calendar.css";
import { CheckboxFacet, DateFacet, FullTextFacet } from "reactions";
import { ProjectConfig } from "../../model/ProjectConfig";
import { FacetType, SearchResult } from "../../model/Search";
import { getFacets, sendSearchQuery } from "../../utils/broccoli";
import { SearchItem } from "./SearchItem";

interface SearchProps {
  project: string;
  projectConfig: ProjectConfig;
}

export const Search = (props: SearchProps) => {
  const [searchResults, setSearchResults] = React.useState<SearchResult>();
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [dateFrom, setDateFrom] = React.useState("1728-01-01");
  const [dateTo, setDateTo] = React.useState("1728-12-31");
  const [weekdaysChecked, setWeekdaysChecked] = React.useState<string[]>([]);
  const [propositionTypesChecked, setPropositionTypesChecked] = React.useState<
    string[]
  >([]);
  const [bodyTypesChecked, setBodyTypesChecked] = React.useState<string[]>([]);
  const [facets, setFacets] = React.useState<FacetType[]>([]);
  const [query, setQuery] = React.useState<any>();
  const [pageNumber, setPageNumber] = React.useState(1);
  const [elasticSize, setElasticSize] = React.useState(10);
  const [elasticFrom, setElasticFrom] = React.useState(elasticSize);
  const [sort, setSort] = React.useState({
    sessionDate: { order: "asc" },
  });

  React.useEffect(() => {
    getFacets(props.projectConfig).then((data) => {
      setFacets(data);
    });
  }, [props.projectConfig]);

  const sessionWeekdays = facets.find((facet) => facet.sessionWeekday);
  const propositionTypes = facets.find((facet) => facet.propositionType);
  const bodyTypes = facets.find((facet) => facet.bodyType);

  const doSearch = async (value: string) => {
    const searchQuery = {
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

  const correctDateByTimezone = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 600000);
  };

  const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;

  const calendarFromChangeHandler = (newFromDate: Date) => {
    const timezoneCorrectedNewFromDate = correctDateByTimezone(newFromDate);

    const newDateISOString = timezoneCorrectedNewFromDate.toISOString();
    const regexedDate = newDateISOString.match(dateRegex);

    setDateFrom(regexedDate.toString());
  };

  const calendarToChangeHandler = (newToDate: Date) => {
    const timezoneCorrectedNewToDate = correctDateByTimezone(newToDate);

    const newDateISOString = timezoneCorrectedNewToDate.toISOString();
    const regexedDate = newDateISOString.match(dateRegex);

    setDateTo(regexedDate.toString());
  };

  const weekdaysCheckedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.checked === false) {
      setWeekdaysChecked(
        weekdaysChecked.filter(
          (weekday) => weekday !== event.currentTarget.value
        )
      );
    } else {
      Object.keys(sessionWeekdays.sessionWeekday).map((weekday) => {
        weekday === event.currentTarget.value
          ? setWeekdaysChecked([...weekdaysChecked, weekday])
          : weekday;
      });
    }
  };

  const propositionTypesCheckedHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.currentTarget.checked === false) {
      setPropositionTypesChecked(
        propositionTypesChecked.filter(
          (propositionType) => propositionType !== event.currentTarget.value
        )
      );
    } else {
      Object.keys(propositionTypes.propositionType).map((propositionType) => {
        propositionType === event.currentTarget.value
          ? setPropositionTypesChecked([
              ...propositionTypesChecked,
              propositionType,
            ])
          : propositionType;
      });
    }
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

  function bodyTypesCheckedHandler(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.checked === false) {
      setBodyTypesChecked(
        bodyTypesChecked.filter(
          (bodyType) => bodyType !== event.currentTarget.value
        )
      );
    } else {
      Object.keys(bodyTypes.bodyType).map((bodyType) => {
        bodyType === event.currentTarget.value
          ? setBodyTypesChecked([...bodyTypesChecked, bodyType])
          : bodyType;
      });
    }
  }

  return (
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <div className="searchFacet">
              <h4>Text search</h4>
              <FullTextFacet valueHandler={handleFullTextFacet} />
            </div>
            <br />
            <label>Fragmenter </label>
            <select onChange={fragmenterSelectHandler}>
              <option>Scan</option>
              <option>Sentence</option>
              <option>None</option>
            </select>{" "}
            <br />
            <div className="searchFacet">
              <h4>Type</h4>
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
              <h4>From</h4>
              <DateFacet
                className={"calendarFrom"}
                onChange={calendarFromChangeHandler}
                defaultActiveStartDate={new Date(1728, 0, 1)}
                defaultValue={new Date(1728, 0, 1)}
                minDate={new Date(1728, 0, 1)}
                maxDate={new Date(1728, 11, 31)}
              />{" "}
            </div>
            <br />
            <div className="searchFacet">
              <h4>To</h4>
              <DateFacet
                className={"calendarTo"}
                onChange={calendarToChangeHandler}
                defaultActiveStartDate={new Date(1728, 11, 31)}
                defaultValue={new Date(1728, 11, 31)}
                minDate={new Date(1728, 0, 1)}
                maxDate={new Date(1728, 11, 31)}
              />
            </div>
            <div className="searchFacet">
              <h4>Session weekday</h4>
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
              <h4>Proposition type</h4>
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
