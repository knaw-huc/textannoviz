import React from "react";
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

  const doSearch = async (value: string) => {
    const searchQuery = {
      bool: {
        must: [
          {
            range: {
              sessionDate: {
                relation: "within",
                gte: "1728-01-01",
                lte: "1728-12-31",
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
            </select>
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
