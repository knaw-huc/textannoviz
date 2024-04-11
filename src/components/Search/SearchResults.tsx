import isEmpty from "lodash/isEmpty";
import keys from "lodash/keys";
import React, { ChangeEvent, ReactNode } from "react";
import { CategoricalChartState } from "recharts/types/chart/types";
import { FacetName, FacetOptionName } from "../../model/Search.ts";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { FacetEntry } from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { KeywordFacetLabel } from "./KeywordFacetLabel.tsx";
import { SearchPagination } from "./SearchPagination.tsx";
import { SearchResultsPerPage } from "./SearchResultsPerPage.tsx";
import { SearchSorting, Sorting } from "./SearchSorting.tsx";
import { Histogram } from "./histogram/Histogram.tsx";
import { HistogramControls } from "./histogram/HistogramControls.tsx";
import { removeTerm } from "./util/removeTerm.ts";
import { toPageNumber } from "./util/toPageNumber.ts";

export function SearchResults(props: {
  keywordFacets: FacetEntry[];
  onSearch: (stayOnPage?: boolean) => void;
}) {
  const { keywordFacets, onSearch } = props;
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
    onSearch();
  }

  async function selectPrevPage() {
    const newFrom = searchUrlParams.from - searchUrlParams.size;
    if (!searchResults || newFrom < 0) {
      return;
    }
    await selectPage(newFrom);
  }

  async function selectNextPage() {
    const newFrom = searchUrlParams.from + searchUrlParams.size;
    if (!searchResults || newFrom >= searchResults.total.value) {
      return;
    }
    await selectPage(newFrom);
  }

  async function jumpToPage(page: number) {
    const newFrom = (page - 1) * searchUrlParams.size;
    if (!searchResults || newFrom >= searchResults.total.value) return;
    await selectPage(newFrom);
  }

  async function selectPage(newFrom: number) {
    setSearchUrlParams({
      ...searchUrlParams,
      from: newFrom,
    });
    onSearch(true);
  }

  const changePageSize = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!event.currentTarget.value) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      size: parseInt(event.currentTarget.value),
    });
    onSearch();
  };

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const newTerms = structuredClone(searchQuery.terms);
    removeTerm(newTerms, facet, option);
    setSearchQuery({ ...searchQuery, terms: newTerms });
    setSearchUrlParams({ ...searchUrlParams });
    onSearch();
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
    onSearch();
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

    onSearch();
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
      <div className="border-brand1Grey-100 -mx-10 my-8 flex flex-row flex-wrap items-center justify-end gap-2 border-b px-10 pb-8">
        {projectConfig.showSelectedFilters && !isEmpty(keywordFacets) && (
          <>
            <span className="text-brand1Grey-600 text-sm">
              {translate("FILTERS")}:{" "}
            </span>
            {keywordFacets.map(([facet, facetOptions]) =>
              keys(facetOptions)
                .filter((option) => searchQuery.terms[facet]?.includes(option))
                .map((option, i) => (
                  <KeywordFacetLabel
                    key={i}
                    option={option}
                    facet={facet}
                    onRemove={removeFacet}
                  />
                )),
            )}
          </>
        )}

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
    </>
  );
}

export function SearchResultsColumn(props: { children?: ReactNode }) {
  return (
    <div className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
      {props.children}
    </div>
  );
}
