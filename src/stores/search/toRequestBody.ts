import { SearchQuery, SearchQueryRequestBody } from "../../model/Search.ts";
import _ from "lodash";

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
    const aggsObject = _.keyBy(query.aggs, "facetName");
    searchQuery.aggs = _.mapValues(aggsObject, (agg) => ({
      order: agg.order,
      size: agg.size,
    }));
  }

  return searchQuery;
}
