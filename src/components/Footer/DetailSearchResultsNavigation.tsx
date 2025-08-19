import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchResult } from "../../model/Search.ts";
import {
  translateProjectSelector,
  translateSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { usePagination } from "../../utils/usePagination.tsx";
import { useSearchResults } from "../Search/useSearchResults.tsx";
import { useDetailNavigation } from "../Detail/useDetailNavigation.tsx";
import { FooterLink } from "./FooterLink.tsx";
import { getUrlParams } from "../../utils/UrlParamUtils.ts";
import { useUrlSearchParamsStore } from "../Search/useSearchUrlParamsStore.ts";

export function DetailSearchResultsNavigation() {
  const translate = useProjectStore(translateSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const { findResultId, navigateDetail } = useDetailNavigation();
  const { searchParams, searchQuery } = useUrlSearchParamsStore();
  const { searchResults, searchFacetTypes, setSearchResults } =
    useSearchStore();
  const { hasNextPage, getNextFrom, hasPrevPage, getPrevFrom } =
    usePagination();
  const { getSearchResults } = useSearchResults();

  if (!searchResults) {
    return null;
  }

  const foundResultId = findResultId();
  const resultIndex = foundResultId
    ? searchResults.results.findIndex((r) => r._id === foundResultId)
    : -1;

  //resultIndex is zero indexed
  const currentSearchResultNumber = resultIndex + 1 + searchParams.from;

  async function handleNextResultClick() {
    if (!searchResults || !foundResultId) {
      return null;
    }
    if (hasNextResult(resultIndex, searchResults)) {
      const newResultId = searchResults.results[resultIndex + 1]._id;
      navigateDetail(`/detail/${newResultId}`);
      return;
    }
    if (hasNextPage()) {
      await loadNewSearchResultPage(getNextFrom());
    }
  }

  async function handlePrevResultClick() {
    if (!searchResults || !foundResultId) {
      return null;
    }

    if (hasPrevResult(resultIndex)) {
      const newResultId = searchResults.results[resultIndex - 1]._id;
      navigateDetail(`/detail/${newResultId}`);
      return;
    }
    if (hasPrevPage()) {
      await loadNewSearchResultPage(getPrevFrom());
    }
  }

  async function loadNewSearchResultPage(newFrom: number) {
    const newSearchResults = await getSearchResults(
      searchFacetTypes,
      { ...searchParams, from: newFrom },
      searchQuery,
    );

    if (!newSearchResults) {
      return;
    }

    const indexOnNewPage =
      newFrom > searchParams.from ? 0 : searchParams.size - 1;
    const newResultId = newSearchResults.results.results[indexOnNewPage]._id;
    setSearchResults(newSearchResults.results);
    navigateDetail({
      path: `/detail/${newResultId}`,
      from: newFrom,
      nextSearchResults: newSearchResults.results,
    });
  }

  return (
    <>
      <FooterLink
        onClick={() => navigateDetail(`/?${getUrlParams()}`)}
        classes={[
          "flex items-center border border-stone-500 rounded-full *:px-1 bg-white text-sm no-underline",
        ]}
      >
        <MagnifyingGlassIcon className="inline h-4 w-4 fill-neutral-700" />{" "}
        Search
      </FooterLink>
      <div className="relative flex items-center border border-stone-500 bg-white text-sm no-underline *:px-1 *:py-2 first-of-type:rounded-l-full last-of-type:rounded-r-full">
        <FooterLink
          classes={["border-r"]}
          onClick={handlePrevResultClick}
          disabled={
            !foundResultId || (!hasPrevResult(resultIndex) && !hasPrevPage())
          }
        >
          &lt; {translate("PREV")}
        </FooterLink>
        <div className="border-r">
          <button className="flex items-center gap-1">
            {translateProject("NAVIGATE_SEARCH_RESULTS")}
          </button>
        </div>
        <div className="border-r text-neutral-500">
          <strong>{currentSearchResultNumber}</strong>
          <span> / {searchResults.total.value}</span>
        </div>
        <FooterLink
          onClick={handleNextResultClick}
          disabled={
            !foundResultId ||
            (!hasNextResult(resultIndex, searchResults) && !hasNextPage())
          }
        >
          {translate("NEXT")} &gt;
        </FooterLink>
      </div>
      {/* <FooterLink
        classes={["pl-10"]}
        onClick={handlePrevResultClick}
        disabled={
          !foundResultId || (!hasPrevResult(resultIndex) && !hasPrevPage())
        }
      >
        &lt; {translate("PREV")}
      </FooterLink>
      <FooterLink onClick={() => navigateDetail(`/?${getUrlParams()}}`)}>
        <MagnifyingGlassIcon className="inline h-4 w-4 fill-neutral-500" />{" "}
        {translate("BACK_TO_SEARCH")}
      </FooterLink>
      <FooterLink
        onClick={handleNextResultClick}
        disabled={
          !foundResultId ||
          (!hasNextResult(resultIndex, searchResults) && !hasNextPage())
        }
      >
        {translate("NEXT")} &gt;
      </FooterLink> */}
    </>
  );
}

function hasNextResult(resultIndex: number, searchResult: SearchResult) {
  return resultIndex < searchResult.results.length - 1;
}

function hasPrevResult(resultIndex: number): boolean {
  return !!resultIndex;
}
