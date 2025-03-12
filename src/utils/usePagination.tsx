import { useSearchStore } from "../stores/search/search-store.ts";
import _ from "lodash";
import { SearchParams } from "../model/Search.ts";
import { useUrlSearchParamsStore } from "../components/Search/useSearchUrlParamsStore.ts";

export type PageParams = Pick<SearchParams, "from" | "size">;

function toPageParams(searchParams: SearchParams) {
  return _.pick(searchParams, ["from", "size"]);
}

export function usePagination() {
  const { searchParams, updateSearchParams } = useUrlSearchParamsStore();

  const { searchResults } = useSearchStore();

  function getPrevFrom(): number {
    return searchParams.from - searchParams.size;
  }

  function hasPrevPage(): boolean {
    return isValidFrom(getPrevFrom());
  }

  function selectPrevPage(): PageParams {
    if (!hasPrevPage()) {
      return toPageParams(searchParams);
    }
    return selectPage(getPrevFrom());
  }

  function getNextFrom(): number {
    return searchParams.from + searchParams.size;
  }

  function isValidFrom(from: number): boolean {
    return !!(searchResults && from >= 0 && from < searchResults.total.value);
  }

  function hasNextPage(): boolean {
    return isValidFrom(getNextFrom());
  }

  function selectNextPage(): PageParams {
    if (!hasNextPage()) {
      return toPageParams(searchParams);
    }
    return selectPage(getNextFrom());
  }

  function selectPage(newFrom: number): PageParams {
    const update = {
      ...searchParams,
      from: newFrom,
    };
    updateSearchParams(update);
    return toPageParams(update);
  }

  function fromToPage(from: number): number {
    return Math.floor(from / searchParams.size) + 1;
  }

  function pageToFrom(page: number): number {
    return (page - 1) * searchParams.size;
  }

  function jumpToPage(page: number): PageParams {
    const newFrom = pageToFrom(page);
    if (!isValidFrom(newFrom)) {
      return toPageParams(searchParams);
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
    getPrevFrom,
    getNextFrom,
  };
}
