import React from "react";
import "react-calendar/dist/Calendar.css";
import { CheckboxFacet, DateFacet, FullTextFacet } from "reactions";
import { getFacets, sendSearchQuery } from "../../utils/broccoli";
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

interface FacetType {
  sessionWeekday: {
    Veneris: number;
    Lunae: number;
    Martis: number;
    Jovis: number;
    Sabbathi: number;
    Mercurii: number;
  };
  propositionType: {
    missive: number;
    requeste: number;
    rapport: number;
    memorie: number;
    resolutie: number;
    onbekend: number;
    oraal: number;
    voordracht: number;
    rekening: number;
    declaratie: number;
    advies: number;
    conclusie: number;
    instructie: number;
  };
}

export const Search = () => {
  const [results, setResults] = React.useState([]);
  const [fragmenter, setFragmenter] = React.useState("Scan");
  const [dateFrom, setDateFrom] = React.useState("1728-01-01");
  const [dateTo, setDateTo] = React.useState("1728-12-31");
  const [weekdaysChecked, setWeekdaysChecked] = React.useState<string[]>([]);
  const [propositionTypesChecked, setPropositionTypesChecked] = React.useState<
    string[]
  >([]);
  const [facets, setFacets] = React.useState<FacetType[]>([]);

  React.useEffect(() => {
    getFacets().then((data) => {
      setFacets(data);
    });
  }, []);

  const sessionWeekdays = facets.find((facet) => facet.sessionWeekday);
  const propositionTypes = facets.find((facet) => facet.propositionType);

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
          {
            terms: {
              propositionType: propositionTypesChecked,
            },
          },
          // {
          //   term: {
          //     bodyType: {
          //       value: "attendancelist",
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

    const sort = {
      sessionDate: { order: "asc" },
    };

    const data = await sendSearchQuery(searchQuery, fragmenter, 10, 0, sort);

    setResults(data);
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

  return (
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <FullTextFacet valueHandler={handleFullTextFacet} />
            <label>Fragmenter </label>
            <select onChange={fragmenterSelectHandler}>
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
            {sessionWeekdays &&
              Object.keys(sessionWeekdays.sessionWeekday).map(
                (weekday, index) => (
                  <CheckboxFacet
                    key={index}
                    id={weekday}
                    name="weekdays"
                    value={weekday}
                    labelName={weekday}
                    onChange={weekdaysCheckedHandler}
                  />
                )
              )}
            <br />
            {propositionTypes &&
              Object.keys(propositionTypes.propositionType).map(
                (propositionType, index) => (
                  <CheckboxFacet
                    key={index}
                    id={propositionType}
                    name="propositionTypes"
                    value={propositionType}
                    labelName={propositionType}
                    onChange={propositionTypesCheckedHandler}
                  />
                )
              )}
          </div>
          <div className="searchResults">
            {results && results.length >= 1
              ? results.map((result, index) => (
                  <SearchItem key={index} result={result} />
                ))
              : "No results"}
          </div>
        </div>
      </div>
    </>
  );
};
