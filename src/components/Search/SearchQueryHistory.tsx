import {ProjectConfig} from "../../model/ProjectConfig";
import {translateProjectSelector, translateSelector, useProjectStore} from "../../stores/project.ts";
import {useState} from "react";
import {SearchQuery} from "../../stores/search/search-query-slice.ts";

type SearchQueryHistoryProps = {
  queryHistory: SearchQuery[];
  goToQuery: (query: SearchQuery) => void;
  projectConfig: ProjectConfig;
  disabled: boolean;
};

export const SearchQueryHistory = (props: SearchQueryHistoryProps) => {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!isOpen)}
        className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm"
        disabled={props.disabled}
      >
        {translate('SEARCH_HISTORY')}
      </button>
      {isOpen && (
        <ol className="ml-6 mt-4 list-decimal">
          {props.queryHistory.length > 0 ? (
            props.queryHistory.slice(0, 10).map((query, index) => (
              <li
                key={index}
                onClick={() => props.goToQuery(query)}
                className="mb-4 cursor-pointer hover:underline"
              >
                {query.fullText && (
                  <div>
                    <strong>{translate('TEXT')}: </strong> {query.fullText}
                  </div>
                )}
                {query.dateFacet && (
                  <>
                    <div>
                      <strong>{translate('FROM')}: </strong> {query.dateFrom}
                    </div>{" "}
                    <div>
                      <strong>{translate('UP_TO_AND_INCLUDING')}: </strong> {query.dateTo}
                    </div>
                  </>
                )}
                {query.terms && (
                  <div>
                    {Object.keys(query.terms).length > 0 ? (
                      <strong>{translate('SELECTED_FACETS')}:</strong>
                    ) : null}
                    {Object.entries(query.terms).map(([key, value], index) => (
                      <div key={index}>
                        {`${translateProject(key)}: ${translateProject(value[0])}`}
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))
          ) : (
            <div>{translate('NO_SEARCH_HISTORY')}.</div>
          )}
        </ol>
      )}
    </>
  );
};
