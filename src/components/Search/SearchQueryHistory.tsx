import { Button } from "react-aria-components";
import { ProjectConfig } from "../../model/ProjectConfig";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { SearchQuery } from "../../model/Search.ts";
import { useTranslate, useTranslateProject } from "../../stores/project.ts";

type SearchQueryHistoryProps = {
  goToQuery: (query: SearchQuery) => void;
  projectConfig: ProjectConfig;
};

const MAX_DISPLAY = 10;

export const SearchQueryHistory = (props: SearchQueryHistoryProps) => {
  const searchQueryHistory = useSearchStore(
    (state) => state.searchQueryHistory,
  );
  const removeFromHistory = useSearchStore((state) => state.removeFromHistory);
  const translate = useTranslate();
  const translateProject = useTranslateProject();

  const moreThanDisplayable = searchQueryHistory.length >= MAX_DISPLAY;
  const lastQueries = searchQueryHistory
    .slice(moreThanDisplayable ? -MAX_DISPLAY : 0)
    .reverse();

  return (
    <ul className="list-none">
      {lastQueries.length ? (
        lastQueries.map((entry, index) => {
          const query = entry.query;
          return (
            <li key={index} className="mb-4">
              <span className="query-date text-neutral-500">
                {formatQueryDate(entry.date)}
              </span>
              <Button
                className="query-delete p-1 text-xl text-neutral-500 outline-none focus-visible:ring-2 focus-visible:ring-neutral-700"
                onPress={() => removeFromHistory(entry.date)}
                aria-label="Remove from history"
              >
                &#10006;
              </Button>
              <div
                role="button"
                tabIndex={0}
                onClick={() => props.goToQuery(query)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    props.goToQuery(query);
                  }
                }}
                className="search-query cursor-pointer outline-none hover:underline focus-visible:ring-2 focus-visible:ring-neutral-700"
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
                    {Object.entries(query.terms).map(([key, value], index) => (
                      <div key={index}>
                        {`${translateProject(key)}: ${translateProject(
                          value[0],
                        )}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          );
        })
      ) : (
        <li>{translate("NO_SEARCH_HISTORY")}.</li>
      )}
    </ul>
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
