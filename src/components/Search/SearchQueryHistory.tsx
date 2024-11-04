import { useState } from "react";
import { Button } from "react-aria-components";
import { ProjectConfig } from "../../model/ProjectConfig";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SearchQuery } from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";

type SearchQueryHistoryProps = {
  goToQuery: (query: SearchQuery) => void;
  projectConfig: ProjectConfig;
};

const MAX_DISPLAY = 10;

export const SearchQueryHistory = (props: SearchQueryHistoryProps) => {
  const { searchQueryHistory, removeFromHistory } = useSearchStore();
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const [isOpen, setOpen] = useState(false);

  const moreThanDisplayable = searchQueryHistory.length >= MAX_DISPLAY;
  const lastQueries = searchQueryHistory
    .slice(moreThanDisplayable ? -MAX_DISPLAY : 0)
    .reverse();

  return (
    <>
      <Button
        onPress={() => setOpen(!isOpen)}
        className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 disabled:bg-brand2-50 active:bg-brand2-200 disabled:text-brand2-200 rounded px-2 py-2 text-sm outline-none"
        isDisabled={!searchQueryHistory.length}
      >
        {translate("SEARCH_HISTORY")}
      </Button>
      {isOpen && (
        <ul className="list ml-6 mt-4">
          {lastQueries.length ? (
            lastQueries.map((entry, index) => {
              const query = entry.query;
              return (
                <li key={index} className="mb-4">
                  <span className="query-date">
                    {formatQueryDate(entry.date)}
                  </span>
                  <span
                    className="query-delete"
                    onClick={() => removeFromHistory(entry.date)}
                  >
                    [x]
                  </span>
                  <div
                    onClick={() => props.goToQuery(query)}
                    className="search-query cursor-pointer hover:underline"
                  >
                    {query.fullText && (
                      <div>
                        <strong>{translate("TEXT")}: </strong> {query.fullText}
                      </div>
                    )}
                    {query.dateFacet && (
                      <>
                        <div>
                          <strong>{translate("DATE_FROM")}: </strong>{" "}
                          {query.dateFrom}
                        </div>{" "}
                        <div>
                          <strong>{translate("UP_TO_AND_INCLUDING")}: </strong>{" "}
                          {query.dateTo}
                        </div>
                      </>
                    )}
                    {query.terms && (
                      <div>
                        {Object.keys(query.terms).length > 0 ? (
                          <strong>{translate("SELECTED_FACETS")}:</strong>
                        ) : null}
                        {Object.entries(query.terms).map(
                          ([key, value], index) => (
                            <div key={index}>
                              {`${translateProject(key)}: ${translateProject(
                                value[0],
                              )}`}
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })
          ) : (
            <div>{translate("NO_SEARCH_HISTORY")}.</div>
          )}
        </ul>
      )}
    </>
  );
};

/**
 * TODO: Wait for temporal, or introduce moment?
 */
function formatQueryDate(timestamp: number): string {
  const date = new Date(timestamp);

  const HH = doubleDigit(date.getHours());
  const mm = doubleDigit(date.getMinutes());
  const time = `${HH}:${mm}`;

  if (isToday(date)) {
    return time;
  }
  const YYYY = date.getFullYear();
  const MM = date.getMonth() + 1;
  const DD = date.getDate();
  return `${YYYY}-${MM}-${DD} ${time}`;

  function isToday(toTest: Date) {
    const today = new Date();
    return (
      toTest.getDate() === today.getDate() &&
      toTest.getMonth() === today.getMonth() &&
      toTest.getFullYear() === today.getFullYear()
    );
  }

  function doubleDigit(n: number) {
    return n.toString().padStart(2, "0");
  }
}
