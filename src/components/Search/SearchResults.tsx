import isEmpty from "lodash/isEmpty";
import React, { ReactNode } from "react";
import type { Key } from "react-aria-components";
import { CategoricalChartState } from "recharts/types/chart/types";
import { FacetName, FacetOptionName } from "../../model/Search.ts";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SearchQuery } from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { KeywordFacetLabel } from "./KeywordFacetLabel.tsx";
import { SearchPagination } from "./SearchPagination.tsx";
import { SearchResultsPerPage } from "./SearchResultsPerPage.tsx";
import { SearchSorting, Sorting } from "./SearchSorting.tsx";
import { Histogram } from "./histogram/Histogram.tsx";
import { HistogramControls } from "./histogram/HistogramControls.tsx";
import { removeTerm } from "./util/removeTerm.ts";
import { toPageNumber } from "./util/toPageNumber.ts";

type SearchResultsProps = {
  onSearch: (stayOnPage?: boolean) => void;
  selectedFacets: SearchQuery;
};

export function SearchResults(props: SearchResultsProps) {
  const projectConfig = useProjectStore(projectConfigSelector);
  const {
    searchUrlParams,
    setSearchUrlParams,
    searchQuery,
    setSearchQuery,
    searchResults,
  } = useSearchStore();

  const resultsStart = searchUrlParams.from + 1;
  const pageSize = searchUrlParams.size;
  const pageNumber = toPageNumber(searchUrlParams.from, searchUrlParams.size);
  const translate = useProjectStore(translateSelector);

  const [graphType, setGraphType] = React.useState("bar");
  const [graphFrom] = React.useState(
    projectConfig.initialDateFrom.split("-")[0],
  );
  const [graphTo] = React.useState(projectConfig.initialDateTo.split("-")[0]);
  const [showHistogram, setShowHistogram] = React.useState(true);
  const queryHistory = useSearchStore((state) => state.searchQueryHistory);
  const [histogramZoomed, setHistogramZoomed] = React.useState(false);

  function updateSorting(sorting: Sorting) {
    setSearchUrlParams({
      ...searchUrlParams,
      sortBy: sorting.field,
      sortOrder: sorting.order,
    });
    props.onSearch();
  }

  function selectPrevPage() {
    const newFrom = searchUrlParams.from - searchUrlParams.size;
    if (!searchResults || newFrom < 0) {
      return;
    }
    selectPage(newFrom);
  }

  function selectNextPage() {
    const newFrom = searchUrlParams.from + searchUrlParams.size;
    if (!searchResults || newFrom >= searchResults.total.value) {
      return;
    }
    selectPage(newFrom);
  }

  function jumpToPage(page: number) {
    const newFrom = (page - 1) * searchUrlParams.size;
    if (!searchResults || newFrom >= searchResults.total.value) return;
    selectPage(newFrom);
  }

  function selectPage(newFrom: number) {
    setSearchUrlParams({
      ...searchUrlParams,
      from: newFrom,
    });
    props.onSearch(true);
  }

  const changePageSize = (key: Key) => {
    if (!key) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      size: key as number,
    });
    props.onSearch();
  };

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const newTerms = structuredClone(searchQuery.terms);
    removeTerm(newTerms, facet, option);
    setSearchQuery({ ...searchQuery, terms: newTerms });
    setSearchUrlParams({ ...searchUrlParams });
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
    setHistogramZoomed(true);
    const newYear = event.activeLabel;

    setSearchQuery({
      ...searchQuery,
      dateFrom: `${newYear}-01-01`,
      dateTo: `${newYear}-12-31`,
    });
    props.onSearch();
  }

  function returnToPrevDateRange() {
    if (queryHistory.length < 2) return;
    const prevQuery = queryHistory[queryHistory.length - 2];

    setHistogramZoomed(false);

    setSearchQuery({
      ...searchQuery,
      dateFrom: prevQuery.dateFrom,
      dateTo: prevQuery.dateTo,
    });

    props.onSearch();
  }

  return (
    <>
      <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
        <span className="font-semibold">
          {resultStartEnd
            ? `${resultStartEnd} ${searchResults.total.value} ${translate(
                "RESULTS",
              ).toLowerCase()}`
            : translate("NO_SEARCH_RESULTS")}
        </span>
        <div className="flex items-center justify-between gap-10">
          {searchResults.results.length >= 1 &&
            projectConfig.showSearchSortBy && (
              <SearchSorting
                dateFacet={searchQuery.dateFacet}
                onSort={updateSorting}
                selected={{
                  field: searchUrlParams.sortBy,
                  order: searchUrlParams.sortOrder,
                }}
              />
            )}

          {searchResults.results.length >= 1 && (
            <SearchResultsPerPage onChange={changePageSize} value={pageSize} />
          )}
        </div>
      </div>
      <div className="border-brand1Grey-100 -mx-10 my-8 flex flex-row items-center border-b px-10 pb-8">
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

        {searchResults.results.length >= 1 && (
          <div className="flex w-full flex-row justify-end">
            <SearchPagination
              prevPageClickHandler={selectPrevPage}
              nextPageClickHandler={selectNextPage}
              pageNumber={pageNumber}
              searchResult={searchResults}
              elasticSize={pageSize}
              jumpToPage={jumpToPage}
            />
          </div>
        )}
      </div>
      {projectConfig.showHistogram ? (
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
            <projectConfig.components.SearchItem key={index} result={result} />
          ))}
        {searchResults.results.length >= 1 && (
          <SearchPagination
            prevPageClickHandler={selectPrevPage}
            nextPageClickHandler={selectNextPage}
            pageNumber={pageNumber}
            searchResult={searchResults}
            elasticSize={pageSize}
            jumpToPage={jumpToPage}
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
