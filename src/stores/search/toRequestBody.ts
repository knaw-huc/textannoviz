import { SearchQuery, SearchQueryRequestBody } from "../../model/Search.ts";
import keyBy from "lodash/keyBy";
import mapValues from "lodash/mapValues";

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
    const aggsObject = keyBy(query.aggs, "facetName");
    searchQuery.aggs = mapValues(aggsObject, (agg) => ({
      order: agg.order,
      size: agg.size,
    }));
  }

  return searchQuery;
}
