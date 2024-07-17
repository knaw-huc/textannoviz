import { useSearchStore } from "../stores/search/search-store.ts";
import { SearchUrlParams } from "../stores/search/search-params-slice.ts";
import _ from "lodash";

export type PageParams = Pick<SearchUrlParams, "from" | "size">;

function toPageParams(searchUrlParams: SearchUrlParams) {
  return _.pick(searchUrlParams, ["from", "size"]);
}

export function usePagination() {
  const { searchResults, searchUrlParams, setSearchUrlParams } =
    useSearchStore();

  function getPrevFrom(): number {
    return searchUrlParams.from - searchUrlParams.size;
  }

  function hasPrevPage(): boolean {
    return isValidFrom(getPrevFrom());
  }

  function selectPrevPage(): PageParams {
    if (!hasPrevPage()) {
      return toPageParams(searchUrlParams);
    }
    return selectPage(getPrevFrom());
  }

  function getNextFrom(): number {
    return searchUrlParams.from + searchUrlParams.size;
  }

  function isValidFrom(from: number): boolean {
    return !!(searchResults && from >= 0 && from < searchResults.total.value);
  }

  function hasNextPage(): boolean {
    return isValidFrom(getNextFrom());
  }

  function selectNextPage(): PageParams {
    if (!hasNextPage()) {
      return toPageParams(searchUrlParams);
    }
    return selectPage(getNextFrom());
  }

  function selectPage(newFrom: number): PageParams {
    const update = {
      ...searchUrlParams,
      from: newFrom,
    };
    setSearchUrlParams(update);
    return toPageParams(update);
  }

  function fromToPage(from: number): number {
    return Math.floor(from / searchUrlParams.size) + 1;
  }

  function pageToFrom(page: number): number {
    return (page - 1) * searchUrlParams.size;
  }

  function jumpToPage(page: number): PageParams {
    const newFrom = pageToFrom(page);
    if (!isValidFrom(newFrom)) {
      return toPageParams(searchUrlParams);
    }
    return selectPage(newFrom);
  }

  return {
    jumpToPage,
    hasPrevPage,
    selectPrevPage,
    hasNextPage,
    selectNextPage,
    fromToPage,
  };
}
