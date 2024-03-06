import { SearchResult } from "../../../model/Search.ts";

const HIT_PREVIEW_REGEX = new RegExp(/<em>(.*?)<\/em>/g);

export function createHighlights(data: SearchResult, exactSearch: boolean) {
  const toHighlight = {
    map: new Map<string, string[]>(),
    exact: exactSearch,
  };
  if (!data) {
    return toHighlight;
  }

  data.results.forEach((result) => {
    const previews: string[] = [];
    const searchHits = result._hits;
    if (!searchHits) {
      return;
    }
    searchHits.text.forEach((hit) => {
      const matches = hit
        .match(HIT_PREVIEW_REGEX)
        ?.map((str) => str.substring(4, str.length - 5));
      if (matches) {
        previews.push(...new Set(matches));
      }
    });
    toHighlight.map.set(result._id, [...new Set(previews)]);
  });

  return toHighlight;
}
