import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FullTextFacet } from "reactions";
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
  const [fragmenter, setFragmenter] = React.useState("");
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
          // {
          //   term: {
          //     sessionWeekday: {
          //       value: "veneris",
          //       // case_insensitive: true,
          //     },
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

    const data = await sendSearchQuery(searchQuery, fragmenter);

    setResults(data);
  };

  const handleFullTextFacet = (value: string) => {
    if (value === "") return;
    doSearch(value);
  };

  const checkboxHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.currentTarget.value === "") return;
    setFragmenter(event.currentTarget.value);
  };

  const calendarFromChangeHandler = (newFromDate: Date) => {
    const timezoneCorrectedNewFromDate = new Date(
      newFromDate.getTime() - newFromDate.getTimezoneOffset() * 600000
    );

    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;

    const newDateISOString = timezoneCorrectedNewFromDate.toISOString();
    const regexedDate = newDateISOString.match(regex);

    setDateFrom(regexedDate.toString());
  };

  const calendarToChangeHandler = (newToDate: Date) => {
    const timezoneCorrectedNewToDate = new Date(
      newToDate.getTime() - newToDate.getTimezoneOffset() * 600000
    );

    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;

    const newDateISOString = timezoneCorrectedNewToDate.toISOString();
    const regexedDate = newDateISOString.match(regex);

    setDateTo(regexedDate.toString());
  };

  return (
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <FullTextFacet valueHandler={handleFullTextFacet} />
            <label>Fragmenter </label>
            <select onChange={checkboxHandler}>
              <option>Scan</option>
              <option>Sentence</option>
              <option>None</option>
            </select>{" "}
            <br />
            <br />
            <label>From</label>
            <Calendar
              className={"calendarFrom"}
              onChange={calendarFromChangeHandler}
              defaultActiveStartDate={new Date(1728, 0, 1)}
              defaultValue={new Date(1728, 0, 1)}
            />{" "}
            <br />
            <label>To</label>
            <Calendar
              className={"calendarTo"}
              onChange={calendarToChangeHandler}
              defaultActiveStartDate={new Date(1728, 11, 31)}
              defaultValue={new Date(1728, 11, 31)}
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
