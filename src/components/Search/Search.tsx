import React from "react";
import "react-calendar/dist/Calendar.css";
import { DateFacet, FullTextFacet } from "reactions";
import { sendSearchQuery } from "../../utils/broccoli";
import { SearchItem } from "./SearchItem";

export interface mockDataType {
  bodyId: string;
  bodyType: string;
  sessionDate: string;
  sessionDay: number;
  sessionMonth: number;
  sessionYear: number;
  sessionWeekday: string;
  propositionType: string;
  hits: {
    preview: string;
    locations: {
      start: {
        line: number;
        offset: number;
      };
      end: {
        line: number;
        offset: number;
      };
    }[];
  }[];
}
[];

export const Search = () => {
  const [results, setResults] = React.useState([]);
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [dateFrom, setDateFrom] = React.useState("1728-01-01");
  const [dateTo, setDateTo] = React.useState("1728-12-31");

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
          //     sessionMonth: [1, 8, 12],
          //   },
          // },
          {
            term: {
              bodyType: {
                value: "attendancelist",
                // case_insensitive: true,
              },
            },
          },
          {
            match_phrase_prefix: {
              text: `${value}`,
            },
          },
        ],
      },
    };

    const data = await sendSearchQuery(searchQuery, fragmenter, 50);

    setResults(data);
  };

  const handleFullTextFacet = (value: string) => {
    // if (value === "") return;
    doSearch(value);
  };

  const selectHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.currentTarget.value === "") return;
    setFragmenter(event.currentTarget.value);
  };

  const correctDateByTimezone = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 600000);
  };

  const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;

  const calendarFromChangeHandler = (newFromDate: Date) => {
    const timezoneCorrectedNewFromDate = correctDateByTimezone(newFromDate);
    console.log(timezoneCorrectedNewFromDate, newFromDate.toUTCString());

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

  return (
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <FullTextFacet valueHandler={handleFullTextFacet} />
            <label>Fragmenter </label>
            <select onChange={selectHandler}>
              <option>Scan</option>
              <option>Sentence</option>
              <option>None</option>
            </select>{" "}
            <br />
            <br />
            <label>From</label>
            <DateFacet
              className={"calendarFrom"}
              onChange={calendarFromChangeHandler}
              defaultActiveStartDate={new Date(1728, 0, 1)}
              defaultValue={new Date(1728, 0, 1)}
              minDate={new Date(1728, 0, 1)}
              maxDate={new Date(1728, 11, 31)}
            />{" "}
            <br />
            <label>To</label>
            <DateFacet
              className={"calendarTo"}
              onChange={calendarToChangeHandler}
              defaultActiveStartDate={new Date(1728, 11, 31)}
              defaultValue={new Date(1728, 11, 31)}
              minDate={new Date(1728, 0, 1)}
              maxDate={new Date(1728, 11, 31)}
            />
          </div>
          <div className="searchResults">
            {results &&
              results.map((result, index) => (
                <SearchItem key={index} result={result} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
