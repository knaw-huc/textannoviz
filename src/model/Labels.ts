export type Labels = {
  DATE_ASC: string,
  DATE_DESC: string,
  DISPLAY_CONTEXT: string,
  FROM: string,
  NEW_SEARCH_QUERY: string,
  NEXT: string,
  NO_SEARCH_HISTORY: string,
  PAGE_VIEW: string,
  PREV: string,
  RELEVANCE: string,
  RESULTS_PER_PAGE: string,
  SEARCH_HISTORY: string,
  SELECTED_FACETS: string,
  SNIPPET: string,
  SORT_BY: string,
  TEXT: string,
  UP_TO_AND_INCLUDING: string,
}

export type LabelKey = keyof Labels;
