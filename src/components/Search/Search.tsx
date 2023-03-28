import { FullTextFacet } from "reactions";
import mock from "./mock.json";
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
  const handleFullTextFacet = (value: string) => {
    console.log(value);
  };

  return (
    <>
      <div className="appContainer">
        <div className="searchContainer">
          <div className="searchFacets">
            <FullTextFacet valueHandler={handleFullTextFacet} />
          </div>
          <div className="searchResults">
            {mock &&
              mock.map((result, index) => (
                <SearchItem key={index} result={result} />
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
