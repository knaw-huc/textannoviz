import { useSearchStore } from "../stores/search/search-store.ts";

export function usePagination() {
  const { searchResults, searchUrlParams, setSearchUrlParams } =
    useSearchStore();

  function getPrevFrom() {
    return searchUrlParams.from - searchUrlParams.size;
  }

  function hasPrevPage() {
    return isValidFrom(getPrevFrom());
  }

  function selectPrevPage() {
    if (!hasPrevPage()) {
      return;
    }
    selectPage(getPrevFrom());
  }

  function getNextFrom() {
    return searchUrlParams.from + searchUrlParams.size;
  }

  function isValidFrom(from: number) {
    return searchResults && from >= 0 && from < searchResults.total.value;
  }

  function hasNextPage() {
    return isValidFrom(getNextFrom());
  }

  function selectNextPage() {
    if (!hasNextPage()) {
      return;
    }
    selectPage(getNextFrom());
  }

  function selectPage(newFrom: number) {
    setSearchUrlParams({
      ...searchUrlParams,
      from: newFrom,
    });
  }

  function fromToPage(from: number) {
    return Math.floor(from / searchUrlParams.size) + 1;
  }

  function pageToFrom(page: number) {
    return (page - 1) * searchUrlParams.size;
  }

  function jumpToPage(page: number) {
    const newFrom = pageToFrom(page);
    if (!isValidFrom(newFrom)) {
      return;
    }
    selectPage(newFrom);
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
