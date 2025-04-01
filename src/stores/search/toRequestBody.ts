import _ from "lodash";

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

  if (query.dateFacet) {
    searchQuery.date = {
      name: query.dateFacet,
      from: query.dateFrom,
      to: query.dateTo,
    };
  }

  if (query.rangeFacet) {
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
