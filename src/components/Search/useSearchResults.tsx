import { FacetNamesByType, SearchResult } from "../../model/Search.ts";
import { SearchUrlParams } from "../../stores/search/search-params-slice.ts";
import {
  FacetEntry,
  filterFacetsByType,
  SearchQuery,
  toRequestBody,
} from "../../stores/search/search-query-slice.ts";
import { sendSearchQuery } from "../../utils/broccoli.ts";
import { ProjectConfig } from "../../model/ProjectConfig.ts";

type SearchResultsAndFacets = {
  results: SearchResult;
  facets: FacetEntry[];
};

export function useSearchResults(params: { projectConfig: ProjectConfig }) {
  const { projectConfig } = params;

  async function getSearchResults(
    facetsByType: FacetNamesByType,
    params: SearchUrlParams,
    query: SearchQuery,
    signal: AbortSignal,
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
    const keywordFacets = filterFacetsByType(
      facetsByType,
      searchResults.aggs,
      "keyword",
    );
    return { results: searchResults, facets: keywordFacets };
  }
  return {
    getSearchResults,
  };
}
