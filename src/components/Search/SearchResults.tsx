import {FacetName, FacetOptionName, Facets} from "../../model/Search.ts";
import {
  projectConfigSelector,
  translateProjectSelector,
  translateSelector,
  useProjectStore
} from "../../stores/project.ts";
import {SearchSortBy} from "./SearchSortBy.tsx";
import {SearchResultsPerPage} from "./SearchResultsPerPage.tsx";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {SearchPagination} from "./SearchPagination.tsx";
import {SearchItem} from "./SearchItem.tsx";
import * as _ from "lodash";
import {useSearchStore} from "../../stores/search/search-store.ts";
import {ChangeEvent} from "react";
import {SortOrder} from "../../stores/search/search-params-slice.ts";
import {toast} from "react-toastify";
import {filterFacetByTypeSelector} from "../../stores/search/search-query-slice.ts";
import {removeTerm} from "./util/removeTerm.ts";
import {toPageNumber} from "./util/toPageNumber.ts";

export function SearchResults(props: {
  facets: Facets;
  onSearch: (stayOnPage?: boolean) => void,
}) {

  const {
    facets,
    onSearch
  } = props;
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
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

  function updateSorting(event: ChangeEvent<HTMLSelectElement>) {
    const selectedValue = event.currentTarget.value;

    let sortBy = "_score";
    let sortOrder: SortOrder = "desc";

    if (filterFacetsByType(facets, "date") && (filterFacetsByType(facets, "date"))[0]) {
      const facetName = (filterFacetsByType(facets, "date"))[0][0];

      if (selectedValue === "dateAsc" || selectedValue === "dateDesc") {
        sortBy = facetName;
        sortOrder = selectedValue === "dateAsc" ? "asc" : "desc";
      }
    } else {
      toast(
          "Sorting on date is not possible with the current search results.",
          {type: "info"},
      );
    }
    setSearchUrlParams({
      ...searchUrlParams,
      sortBy,
      sortOrder
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

  if (!searchResult) {
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
      <div className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <span className="font-semibold">
              {`${resultStartEnd}${searchResult.total.value} ${translate("RESULTS").toLowerCase()}`}
            </span>
          <div className="flex items-center justify-between gap-10">
            {projectConfig.showSearchSortBy && (
                <SearchSortBy
                    onChange={updateSorting}
                    value={searchUrlParams.sortBy}
                />
            )}

            <SearchResultsPerPage
                onChange={changePageSize}
                value={pageSize}
            />
          </div>
        </div>
        <div className="border-brand1Grey-100 -mx-10 mb-8 flex flex-row flex-wrap items-center justify-end gap-2 border-b px-10">
          {projectConfig.showSelectedFilters && !_.isEmpty(keywordFacets) && (
              <>
                <span className="text-brand1Grey-600 text-sm">{translate("FILTERS")}: </span>
                {keywordFacets.map(([facet, facetOptions]) => {
                  return Object.keys(facetOptions).map(
                      (option, index) => {
                        if (searchQuery.terms[facet]?.includes(option)) {
                          return (
                              <div
                                  className="bg-brand2-100 text-brand2-700 hover:text-brand2-900 active:bg-brand2-200 flex cursor-pointer flex-row rounded px-1 py-1 text-sm"
                                  key={index}
                              >
                                {translateProject(facet)}:{" "}
                                {/^[a-z]/.test(option)
                                    ? option.charAt(0).toUpperCase() + option.slice(1)
                                    : translateProject(option)}{" "}
                                {
                                  <XMarkIcon
                                      className="h-5 w-5"
                                      onClick={() => removeFacet(facet, option)}
                                  />
                                }
                              </div>
                          );
                        }
                      },
                  );
                })}
              </>
          )}

          <SearchPagination
              prevPageClickHandler={selectPrevPage}
              nextPageClickHandler={selectNextPage}
              pageNumber={pageNumber}
              searchResult={searchResult}
              elasticSize={pageSize}
          />
        </div>
        {searchResult.results.length >= 1 ? (
            searchResult.results.map((result, index) => (
                <SearchItem key={index} result={result}/>
            ))
        ) : (
            <projectConfig.components.SearchInfoPage/>
        )}
        <SearchPagination
            prevPageClickHandler={selectPrevPage}
            nextPageClickHandler={selectNextPage}
            pageNumber={pageNumber}
            searchResult={searchResult}
            elasticSize={pageSize}
        />
      </div>
  );
}