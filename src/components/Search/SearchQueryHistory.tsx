import { ProjectConfig } from "../../model/ProjectConfig";
import { SearchQuery } from "../../model/Search";
import {translateProjectSelector, translateSelector, useProjectStore} from "../../stores/project.ts";

type SearchQueryHistoryProps = {
  historyClickHandler: () => void;
  historyIsOpen: boolean;
  queryHistory: SearchQuery[];
  goToQuery: (query: SearchQuery) => void;
  projectConfig: ProjectConfig;
  disabled: boolean;
};

export const SearchQueryHistory = (props: SearchQueryHistoryProps) => {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  return (
    <>
      <button
        onClick={props.historyClickHandler}
        className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm"
        disabled={props.disabled}
      >
        {translate('SEARCH_HISTORY')}
      </button>
      {props.historyIsOpen ? (
        <ol className="ml-6 mt-4 list-decimal">
          {props.queryHistory.length > 0 ? (
            props.queryHistory.slice(0, 10).map((query, index) => (
              <li
                key={index}
                onClick={() => props.goToQuery(query)}
                className="mb-4 cursor-pointer hover:underline"
              >
                {query.text ? (
                  <div>
                    <strong>{translate('TEXT')}: </strong> {query.text}
                  </div>
                ) : null}
                {query.date ? (
                  <>
                    <div>
                      <strong>{translate('FROM')}: </strong> {query.date.from}
                    </div>{" "}
                    <div>
                      <strong>{translate('UP_TO_AND_INCLUDING')}: </strong> {query.date.to}
                    </div>
                  </>
                ) : null}
                {query.terms ? (
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
                ) : null}
              </li>
            ))
          ) : (
            <div>{translate('NO_SEARCH_HISTORY')}.</div>
          )}
        </ol>
      ) : null}
    </>
  );
};
