import { SearchQuery, SearchQueryRequestBody } from "../../model/Search.ts";

export function toRequestBody(query: SearchQuery): SearchQueryRequestBody {
  if (!query?.terms) {
    return {};
  }
  const searchQuery = {} as SearchQueryRequestBody;
  if (query.fullText) {
    searchQuery.text = query.fullText;
  }

  searchQuery.terms = query.terms;

  // TODO: revert!
  if (query.dateFacet && query.dateFrom && query.dateTo) {
    searchQuery.date = {
      name: query.dateFacet,
      from: query.dateFrom,
      to: query.dateTo,
    };
  }

  // TODO: revert!
  if (query.rangeFacet && query.rangeFrom && query.rangeTo) {
    searchQuery.range = {
      name: query.rangeFacet,
      from: query.rangeFrom,
      to: query.rangeTo,
    };
  }

  if (query.aggs) {
    searchQuery.aggs = query.aggs
      .filter((agg) => agg.order && agg.size)
      .map((agg) => `${agg.facetName}:${agg.order},${agg.size}`);
  }

  return searchQuery;
}
