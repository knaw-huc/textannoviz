import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchParams } from "../../model/Search.ts";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { usePagination } from "../../utils/usePagination.tsx";
import { useSearchResults } from "../Search/useSearchResults.tsx";
import { useDetailNavigation } from "../Detail/useDetailNavigation.tsx";
import { FooterLink } from "./FooterLink.tsx";
import { getUrlParams } from "../../utils/UrlParamUtils.ts";
import { useUrlSearchParamsStore } from "../Search/useSearchUrlParamsStore.ts";

export function DetailSearchResultsNavigation() {
  const translate = useProjectStore(translateSelector);
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

  async function handleNextResultClick() {
    if (!searchResults || !foundResultId) {
      return null;
    }
    if (hasNextResult(resultIndex, searchParams)) {
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
      params: { from: newFrom },
    });
  }

  return (
    <>
      <FooterLink
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
          (!hasNextResult(resultIndex, searchParams) && !hasNextPage())
        }
      >
        {translate("NEXT")} &gt;
      </FooterLink>
    </>
  );
}

function hasNextResult(resultIndex: number, searchParams: SearchParams) {
  return resultIndex < searchParams.size - 1;
}

function hasPrevResult(resultIndex: number): boolean {
  return !!resultIndex;
}
