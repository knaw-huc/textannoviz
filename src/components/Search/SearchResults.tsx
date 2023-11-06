import {Facet, FacetOptionName, SearchResult, Terms} from "../../model/Search.ts";
import {ChangeEvent} from "react";
import {projectConfigSelector, translateProjectSelector, useProjectStore} from "../../stores/project.ts";
import {SearchSortBy} from "./SearchSortBy.tsx";
import {SearchResultsPerPage} from "./SearchResultsPerPage.tsx";
import {XMarkIcon} from "@heroicons/react/24/solid";
import {SearchPagination} from "./SearchPagination.tsx";
import {SearchItem} from "./SearchItem.tsx";

export function SearchResults(props: {
  sortByChangeHandler: any;
  keywordFacets: [string, Facet][];
  searchResults: SearchResult;
  selectedFacets: Terms;
  resultStart: number
  pageSize: number
  pageNumber: number
  clickPrevPage: () => Promise<void>;
  clickNextPage: () => Promise<void>;
  changePageSize: (event: ChangeEvent<HTMLSelectElement>) => void;
  removeFacet: (facetName: string, facetOptionName: FacetOptionName) => void;
}) {
  const searchResults = props.searchResults;
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  return (
      <div className="bg-brand1Grey-50 w-9/12 grow self-stretch px-10 py-16">
        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
            <span className="font-semibold">
              {searchResults &&
                  `${props.resultStart}-${Math.min(
                      props.resultStart + props.pageSize,
                      searchResults.total.value,
                  )} of ${searchResults.total.value} results`}
            </span>
          <div className="flex items-center justify-between gap-10">
            {projectConfig.showSearchSortBy ? (
                <SearchSortBy
                    onChange={props.sortByChangeHandler}
                    value="_score"
                />
            ) : null}

            <SearchResultsPerPage
                onChange={props.changePageSize}
                value={props.pageSize}
            />
          </div>
        </div>
        <div className="border-brand1Grey-100 -mx-10 mb-8 flex flex-row flex-wrap items-center justify-end gap-2 border-b px-10">
          {projectConfig.showSelectedFilters ? (
              <>
                <span className="text-brand1Grey-600 text-sm">Filters: </span>
                {props.keywordFacets.map(([facet, facetOptions]) => {
                  return Object.keys(facetOptions).map(
                      (option, index) => {
                        if (props.selectedFacets[facet]?.includes(option)) {
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
                                      onClick={() => props.removeFacet(facet, option)}
                                  />
                                }
                              </div>
                          );
                        }
                      },
                  );
                })}
              </>
          ) : null}

          <SearchPagination
              prevPageClickHandler={props.clickPrevPage}
              nextPageClickHandler={props.clickNextPage}
              pageNumber={props.pageNumber}
              searchResults={searchResults}
              elasticSize={props.pageSize}
          />
        </div>
        {searchResults.results.length >= 1 ? (
            searchResults.results.map((result, index) => (
                <SearchItem key={index} result={result}/>
            ))
        ) : (
            <projectConfig.components.SearchInfoPage/>
        )}
        <SearchPagination
            prevPageClickHandler={props.clickPrevPage}
            nextPageClickHandler={props.clickNextPage}
            pageNumber={props.pageNumber}
            searchResults={searchResults}
            elasticSize={props.pageSize}
        />
      </div>
  );
}