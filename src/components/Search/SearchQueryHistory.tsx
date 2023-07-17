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
    <div className="searchFacet">
      <button onClick={props.historyClickHandler}>Search history</button>
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
    </div>
  );
};
