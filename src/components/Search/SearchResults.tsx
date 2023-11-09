import {FacetName, FacetOptionName, Facets} from "../../model/Search.ts";
import {projectConfigSelector, translateSelector, useProjectStore} from "../../stores/project.ts";
import {SearchSorting, Sorting} from "./SearchSorting.tsx";
import {SearchResultsPerPage} from "./SearchResultsPerPage.tsx";
import {SearchPagination} from "./SearchPagination.tsx";
import {SearchItem} from "./SearchItem.tsx";
import * as _ from "lodash";
import {useSearchStore} from "../../stores/search/search-store.ts";
import {ChangeEvent, ReactNode} from "react";
import {filterFacetByTypeSelector} from "../../stores/search/search-query-slice.ts";
import {removeTerm} from "./util/removeTerm.ts";
import {toPageNumber} from "./util/toPageNumber.ts";
import {KeywordFacetLabel} from "./KeywordFacetLabel.tsx";

export function SearchResults(props: {
  facets: Facets;
  onSearch: (stayOnPage?: boolean) => void
}) {

  const {
    facets,
    onSearch
  } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const filterFacetsByType = useSearchStore(filterFacetByTypeSelector);
  const {
    searchUrlParams, setSearchUrlParams,
    searchQuery, setSearchQuery,
    searchResult
  } = useSearchStore();

  const resultsStart = searchUrlParams.from + 1;
  const pageSize = searchUrlParams.size;
  const pageNumber = toPageNumber(searchUrlParams.from, searchUrlParams.size);
  const keywordFacets = filterFacetsByType(facets, "keyword");
  const translate = useProjectStore(translateSelector);

  function updateSorting(sorting: Sorting) {
    setSearchUrlParams({
      ...searchUrlParams,
      sortBy: sorting.field,
      sortOrder: sorting.order
    })
    onSearch();
  }

  async function selectPrevPage() {
    const newFrom = searchUrlParams.from - searchUrlParams.size;
    if (!searchResult || newFrom < 0) {
      return;
    }
    await selectPage(newFrom);
  }

  async function selectNextPage() {
    const newFrom = searchUrlParams.from + searchUrlParams.size;
    if (!searchResult || newFrom >= searchResult.total.value) {
      return;
    }
    await selectPage(newFrom)
  }

  async function selectPage(newFrom: number) {
    setSearchUrlParams({
      ...searchUrlParams,
      from: newFrom
    });
    onSearch(true)
  }

  const changePageSize = (
      event: ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!event.currentTarget.value) {
      return;
    }
    setSearchUrlParams({
      ...searchUrlParams,
      size: parseInt(event.currentTarget.value)
    });
    onSearch()
  };

  function removeFacet(facet: FacetName, option: FacetOptionName) {
    const newTerms = structuredClone(searchQuery.terms);
    removeTerm(newTerms, facet, option);
    setSearchQuery({...searchQuery, terms: newTerms});
    setSearchUrlParams({...searchUrlParams});
    onSearch()
  }

  if(!searchResult) {
    return null;
  }
  const resultsEnd = Math.min(
      resultsStart + pageSize - 1,
      searchResult.total.value,
  );
  const resultStartEnd = searchResult.total.value
      ? `${resultsStart}-${resultsEnd} ${translate("FROM").toLowerCase()}`
      : '';
  return (
      <SearchResultsColumn>
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <span className="font-semibold">
              {`${resultStartEnd} ${searchResult.total.value} ${translate("RESULTS").toLowerCase()}`}
            </span>
          <div className="flex items-center justify-between gap-10">
            {projectConfig.showSearchSortBy && (
                <SearchSorting
                    dateFacets={filterFacetsByType(facets, "date")}
                    onSort={updateSorting}
                    selected={{
                      field: searchUrlParams.sortBy,
                      order: searchUrlParams.sortOrder
                    }}
                />
            )}

            <SearchResultsPerPage
                onChange={changePageSize}
                value={pageSize}
            />
          </div>
        </div>
        <div className="border-brand1Grey-100 -mx-10 mb-8 flex flex-row flex-wrap items-center justify-end gap-2 border-b px-10">
          {projectConfig.showSelectedFilters && !_.isEmpty(keywordFacets) && <>
            <span className="text-brand1Grey-600 text-sm">{translate("FILTERS")}: </span>
            {keywordFacets.map(([facet, facetOptions]) => _.keys(facetOptions)
                .filter(option => searchQuery.terms[facet]?.includes(option))
                .map((option, i) => <KeywordFacetLabel
                    key={i}
                    option={option}
                    facet={facet}
                    onRemove={removeFacet}
                />))}
          </>}

          <SearchPagination
              prevPageClickHandler={selectPrevPage}
              nextPageClickHandler={selectNextPage}
              pageNumber={pageNumber}
              searchResult={searchResult}
              elasticSize={pageSize}
          />
        </div>
        {searchResult.results.length >= 1 && (
            searchResult.results.map((result, index) => (
                <SearchItem key={index} result={result}/>
            ))
        )}
        <SearchPagination
            prevPageClickHandler={selectPrevPage}
            nextPageClickHandler={selectNextPage}
            pageNumber={pageNumber}
            searchResult={searchResult}
            elasticSize={pageSize}
        />
      </SearchResultsColumn>
  );
}

export function SearchResultsColumn(props: {children?: ReactNode}) {
  return <div className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
    {props.children}
  </div>
}