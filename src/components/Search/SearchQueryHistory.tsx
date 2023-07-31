import { ProjectConfig } from "../../model/ProjectConfig";
import { SearchQuery } from "../../model/Search";

type SearchQueryHistoryProps = {
  historyClickHandler: () => void;
  historyIsOpen: boolean;
  queryHistory: SearchQuery[];
  goToQuery: (query: SearchQuery) => void;
  projectConfig: ProjectConfig;
};

export const SearchQueryHistory = (props: SearchQueryHistoryProps) => {
  return (
    <>
      <button
        onClick={props.historyClickHandler}
        className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm"
        // disabled
      >
        Search history
      </button>
      {props.historyIsOpen ? (
        <ol>
          {props.queryHistory.length > 0 ? (
            props.queryHistory.slice(0, 10).map((query, index) => (
              <li
                key={index}
                onClick={() => props.goToQuery(query)}
                className="queryHistoryLi"
              >
                {query.text ? (
                  <div>
                    <strong>Full text: </strong> {query.text}
                  </div>
                ) : null}
                {query.date ? (
                  <>
                    <div>
                      <strong>From: </strong> {query.date.from}
                    </div>{" "}
                    <div>
                      <strong>To: </strong> {query.date.to}
                    </div>
                  </>
                ) : null}
                {query.terms ? (
                  <div>
                    {Object.keys(query.terms).length > 0 ? (
                      <strong>Selected facets:</strong>
                    ) : null}
                    {Object.entries(query.terms).map(([key, value], index) => (
                      <div key={index}>{`${
                        (props.projectConfig.searchFacetTitles &&
                          props.projectConfig.searchFacetTitles[key]) ??
                        key
                      }: ${
                        (props.projectConfig.annotationTypesTitles &&
                          props.projectConfig.annotationTypesTitles[
                            value[0]
                          ]) ??
                        value
                      }`}</div>
                    ))}
                  </div>
                ) : null}
              </li>
            ))
          ) : (
            <div>No search history.</div>
          )}
        </ol>
      ) : null}
    </>
  );
};
