import * as _ from "lodash";
import { ChangeEvent, ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FacetName, FacetOptionName } from "../../model/Search.ts";
import {
  projectConfigSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { FacetEntry } from "../../stores/search/search-query-slice.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { createIndices } from "../../utils/createIndices.ts";
import { KeywordFacetLabel } from "./KeywordFacetLabel.tsx";
import { SearchPagination } from "./SearchPagination.tsx";
import { SearchResultsPerPage } from "./SearchResultsPerPage.tsx";
import { SearchSorting, Sorting } from "./SearchSorting.tsx";
import { removeTerm } from "./util/removeTerm.ts";
import { toPageNumber } from "./util/toPageNumber.ts";

type HitsYear = {
  name: string;
  count: number;
  year: number;
}[];

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

  const hitsYear: HitsYear = [];

  const years = createIndices(1705, 1795);

  /*
  TODO:
  - parameters: oorspronkelijke data, begin, end
  - in component: switchen staaf/line, inzoomen, uitzoomen
  - met speciale klik dan waarde omhoog naar TAV voor filter search query
  - views: alles tussen eerste en laatste jaar in data, volledige breedte project, inzoomen, uitzoomen, per eeuw/decennia/jaar/kwartaal/maand/week/dag
  */

  const yearsInData = Object.keys(searchResults.aggs.sessionYear).map((year) =>
    parseInt(year),
  );

  years.map((year) => {
    Object.entries(searchResults.aggs.sessionYear).map(([key, value]) => {
      if (year === parseInt(key)) {
        hitsYear.push({
          name: "year",
          count: value,
          year: parseInt(key),
        });
      }
    });

    if (!yearsInData.includes(year)) {
      hitsYear.push({
        name: "year",
        count: 0,
        year: year,
      });
    }
  });

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
        {projectConfig.showSelectedFilters && !_.isEmpty(keywordFacets) && (
          <>
            <span className="text-brand1Grey-600 text-sm">
              {translate("FILTERS")}:{" "}
            </span>
            {keywordFacets.map(([facet, facetOptions]) =>
              _.keys(facetOptions)
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
          />
        )}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={500}
          height={300}
          data={hitsYear}
          margin={{ right: 30, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="1 6" />
          <XAxis dataKey="year" />
          <YAxis dataKey="count" allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="count"
            name="Occurrences per year"
            fill="#8884d8"
            onClick={(event) => console.log(event)}
          />
        </BarChart>
      </ResponsiveContainer>
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
