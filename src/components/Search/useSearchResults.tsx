import { FacetTypes, SearchResult } from "../../model/Search.ts";
import {
  projectConfigSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { SearchUrlParams } from "../../stores/search/search-params-slice.ts";
import {
  FacetEntry,
  filterFacetsByType,
  SearchQuery,
  toRequestBody,
} from "../../stores/search/search-query-slice.ts";
import { sendSearchQuery } from "../../utils/broccoli.ts";

type SearchResultsAndFacets = {
  results: SearchResult;
  facets: FacetEntry[];
};

export function useSearchResults() {
  const projectConfig = useProjectStore(projectConfigSelector);

  async function getSearchResults(
    facetTypes: FacetTypes,
    params: SearchUrlParams,
    query: SearchQuery,
    signal?: AbortSignal,
  ): Promise<SearchResultsAndFacets | undefined> {
    if (!query.terms) {
      return;
    }

    const newParams = { ...params, indexName: projectConfig.elasticIndexName };

    const searchResults = await sendSearchQuery(
      projectConfig,
      newParams,
      toRequestBody(query),
      signal,
    );
    if (!searchResults) {
      return;
    }
    const newKeywordFacets = filterFacetsByType(
      facetTypes,
      searchResults.aggs,
      "keyword",
    );

    const newNestedFacets: FacetEntry[] = Object.entries(searchResults.aggs)
      .filter(([name]) => {
        return projectConfig.nestedFacets.includes(name);
      })
      .map(([facetCategory, facetItems]) => {
        return {
          type: "nested",
          facetName: facetCategory,
          facetItems: facetItems,
        };
      });

    const newCheckboxFacets = [...newKeywordFacets, ...newNestedFacets];

    return { results: searchResults, facets: newCheckboxFacets };
  }
  return {
    getSearchResults,
  };
}
