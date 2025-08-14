import isEmpty from "lodash/isEmpty";
import React, { ReactNode } from "react";
import type { Key } from "react-aria-components";
import { CategoricalChartState } from "recharts/types/chart/types";
import { FacetName, FacetOptionName, SearchQuery } from "../../model/Search.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { usePagination } from "../../utils/usePagination.tsx";
import { KeywordFacetLabel } from "./KeywordFacetLabel.tsx";
import { SearchPagination } from "./SearchPagination.tsx";
import { SearchResultsPerPage } from "./SearchResultsPerPage.tsx";
import { SearchSorting, Sorting } from "./SearchSorting.tsx";
import { Histogram } from "./histogram/Histogram.tsx";
import { HistogramControls } from "./histogram/HistogramControls.tsx";
import { removeTerm } from "./util/removeTerm.ts";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";

type SearchResultsProps = {
  searchQuery: SearchQuery;
  onSearch: () => void;
  onPageChange: () => void;
};

export function SearchResults(props: SearchResultsProps) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const { searchResults } = useSearchStore();
  const { searchQuery } = props;
  const { updateSearchQuery, searchParams, updateSearchParams } =
    useUrlSearchParamsStore();

  const {
    hasPrevPage,
    selectPrevPage,
    hasNextPage,
    selectNextPage,
    jumpToPage,
    fromToPage,
  } = usePagination();

  const resultsStart = searchParams.from + 1;
  const pageSize = searchParams.size;
  const pageNumber = fromToPage(searchParams.from);
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const [graphType, setGraphType] = React.useState("bar");
  const [graphFrom] = React.useState(
    projectConfig.initialDateFrom.split("-")[0],
  );
  const [graphTo] = React.useState(projectConfig.initialDateTo.split("-")[0]);
  const [showHistogram, setShowHistogram] = React.useState(true);
  const { searchQueryHistory } = useSearchStore();
  const [histogramZoomed, setHistogramZoomed] = React.useState(false);

  function updateSorting(sorting: Sorting) {
    updateSearchParams({
      sortBy: sorting.field,
      sortOrder: sorting.order,
    });
    props.onSearch();
  }

  function handleSelectPrevPageClick() {
    if (!hasPrevPage()) {
      return;
    }
    selectPrevPage();
    props.onPageChange();
  }

  function handleSelectNextPageClick() {
    if (!hasNextPage()) {
      return;
    }
    selectNextPage();
    props.onPageChange();
  }

  function handleJumpToPage(page: number) {
    jumpToPage(page);
    props.onPageChange();
  }

  const changePageSize = (key: Key) => {
    if (!key) {
      return;
    }
    updateSearchParams({
      size: key as number,
    });
    props.onSearch();
  };

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const newTerms = structuredClone(searchQuery.terms);
    removeTerm(newTerms, facet, option);
    updateSearchQuery({ terms: newTerms });
    props.onSearch();
  }

  if (!searchResults) {
    return null;
  }
  const resultsEnd = Math.min(
    resultsStart + pageSize - 1,
    searchResults.total.value,
  );
  const resultStartEnd = searchResults.total.value
    ? `${resultsStart}-${resultsEnd} ${translate("FROM").toLowerCase()}`
    : "";

  function graphTypeButtonClickHandler(newGraphType: string) {
    setGraphType(newGraphType);
  }

  function showHistogramButtonClickHandler(newValue: boolean) {
    setShowHistogram(newValue);
  }

  function filterDateQuery(event: CategoricalChartState) {
    const newYear = event.activeLabel;

    if (!newYear) return;

    setHistogramZoomed(true);

    updateSearchQuery({
      ...searchQuery,
      dateFrom: `${newYear}-01-01`,
      dateTo: `${newYear}-12-31`,
    });
    props.onSearch();
  }

  function returnToPrevDateRange() {
    if (searchQueryHistory.length < 2) return;
    const prevQuery = searchQueryHistory[searchQueryHistory.length - 2].query;

    setHistogramZoomed(false);

    updateSearchQuery({
      dateFrom: prevQuery.dateFrom,
      dateTo: prevQuery.dateTo,
    });

    props.onSearch();
  }

  return (
    <>
      <div
        id="search-results"
        className="flex flex-col items-center justify-between gap-2 md:flex-row"
      >
        <span className="font-semibold">
          {resultStartEnd
            ? `${resultStartEnd} ${
                searchResults.total.value
              } ${translateProject("results").toLowerCase()}`
            : translate("NO_SEARCH_RESULTS")}
        </span>
        <div className="flex items-center justify-between gap-10">
          {searchResults.results.length >= 1 &&
            projectConfig.showSearchSortBy && (
              <SearchSorting
                dateFacet={searchQuery.dateFacet}
                onSort={updateSorting}
                selected={{
                  field: searchParams.sortBy,
                  order: searchParams.sortOrder,
                }}
              />
            )}

          {searchResults.results.length >= 1 && (
            <SearchResultsPerPage onChange={changePageSize} value={pageSize} />
          )}
        </div>
      </div>
      <div className="border-brand1Grey-100 -mx-10 my-8 flex flex-row items-center border-b px-10">
        {projectConfig.showSelectedFilters && !isEmpty(searchQuery.terms) && (
          <div className="flex w-full flex-row items-center justify-start">
            <div className="grid grid-cols-4 items-center gap-2">
              <span className="text-brand1Grey-600 text-sm">
                {translate("FILTERS")}:{" "}
              </span>
              {Object.entries(searchQuery.terms).map(
                ([facetOptionName, facetOptions]) =>
                  facetOptions.map((facetOption, index) => {
                    return (
                      <KeywordFacetLabel
                        key={index}
                        option={facetOption}
                        facet={facetOptionName}
                        onRemove={removeFacet}
                      />
                    );
                  }),
              )}
            </div>
          </div>
        )}

        {searchResults.results.length >= 1 &&
          projectConfig.showTopSearchPagination && (
            <div className="flex w-full flex-row justify-end">
              <SearchPagination
                onPrevPageClick={handleSelectPrevPageClick}
                onNextPageClick={handleSelectNextPageClick}
                pageNumber={pageNumber}
                searchResult={searchResults}
                elasticSize={pageSize}
                onJumpToPage={handleJumpToPage}
              />
            </div>
          )}
      </div>
      {projectConfig.showHistogram && searchResults.results.length >= 1 ? (
        <>
          <HistogramControls
            graphTypeButtonClickHandler={graphTypeButtonClickHandler}
            showHistogramButtonClickHandler={showHistogramButtonClickHandler}
            returnToPrevDateRange={returnToPrevDateRange}
            histogramZoomed={histogramZoomed}
          />
          <Histogram
            searchResults={searchResults}
            dateFacet={projectConfig.histogramFacet}
            graphType={graphType}
            graphFrom={graphFrom}
            graphTo={graphTo}
            showHistogram={showHistogram}
            filterDateQuery={filterDateQuery}
          />
        </>
      ) : null}
      <div id="resultsList">
        {searchResults.results.length >= 1 &&
          searchResults.results.map((result, index) => (
            <projectConfig.components.SearchItem
              key={index}
              result={result}
              query={searchQuery}
            />
          ))}
        {searchResults.results.length >= 1 && (
          <SearchPagination
            onPrevPageClick={handleSelectPrevPageClick}
            onNextPageClick={handleSelectNextPageClick}
            pageNumber={pageNumber}
            searchResult={searchResults}
            elasticSize={pageSize}
            onJumpToPage={handleJumpToPage}
          />
        )}
      </div>
    </>
  );
}

export function SearchResultsColumn(props: { children?: ReactNode }) {
  return (
    <main className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
      {props.children}
    </main>
  );
}
