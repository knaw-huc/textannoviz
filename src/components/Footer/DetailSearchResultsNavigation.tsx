import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import { useNavigate } from "react-router-dom";
import { SearchParams, SearchResult } from "../../model/Search.ts";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { usePagination } from "../../utils/usePagination.tsx";
import { useSearchResults } from "../Search/useSearchResults.tsx";
import { useDetailUrl } from "../Text/Annotated/utils/useDetailUrl.tsx";
import { FooterLink } from "./FooterLink.tsx";
import { skipEmptyValues } from "../../utils/skipEmptyValues.ts";
import { Any } from "../../utils/Any.ts";
import { useSearchUrlParams } from "../Search/useSearchUrlParams.tsx";

export function DetailSearchResultsNavigation() {
  const navigate = useNavigate();
  const translate = useProjectStore(translateSelector);
  const { getDetailUrlParams, getDetailUrl } = useDetailUrl();
  const { tier2, highlight } = getDetailUrlParams();
  const { searchQuery, searchParams } = useSearchUrlParams();
  const { searchResults, searchFacetTypes, setSearchResults } =
    useSearchStore();
  const { hasNextPage, getNextFrom, hasPrevPage, selectPrevPage } =
    usePagination();
  const { getSearchResults } = useSearchResults();

  if (!searchResults) {
    return null;
  }

  const resultIndex = findResultIndex(searchResults, tier2);

  const prevResultPath =
    hasPrevResult(resultIndex) &&
    getDetailUrl(searchResults.results[resultIndex - 1]._id, { highlight });
  const nextResultPath =
    hasNextResult(resultIndex, searchParams) &&
    getDetailUrl(searchResults.results[resultIndex + 1]._id, { highlight });

  const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);
  const urlSearchParams = new URLSearchParams(searchParams as Any);

  const isOnFirstOfPage = !prevResultPath;
  const isPrevDisabled = isOnFirstOfPage && !hasPrevPage();

  const isOnEndOfPage = !nextResultPath;
  const isNextDisabled = isOnEndOfPage && !hasNextPage();

  async function handleNextResultClick() {
    if (!nextResultPath && !hasNextPage()) {
      return;
    }

    if (nextResultPath) {
      navigate(nextResultPath);
      return;
    }

    const nextFrom = getNextFrom();
    // TODO: update result page in query from url
    await loadNewSearchResultPage(nextFrom);
  }

  async function handlePrevResultClick() {
    if (!prevResultPath && !hasPrevPage()) {
      return;
    }

    if (prevResultPath) {
      navigate(prevResultPath);
      return;
    }

    const { from } = selectPrevPage();
    await loadNewSearchResultPage(from);
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

    const nextUrl = getDetailUrl(
      newSearchResults.results.results[
        newFrom > searchParams.from ? 0 : searchParams.size - 1
      ]._id,
      { highlight, from: newFrom },
    );
    if (!nextUrl) {
      throw new Error("No results found");
    }
    setSearchResults(newSearchResults.results);
    navigate(nextUrl);
  }

  return (
    <>
      <FooterLink
        classes={["pl-10"]}
        onClick={handlePrevResultClick}
        disabled={isPrevDisabled}
      >
        &lt; {translate("PREV")}
      </FooterLink>
      <FooterLink
        onClick={() =>
          navigate(`/?${urlSearchParams}&query=${Base64.toBase64(cleanQuery)}`)
        }
      >
        <MagnifyingGlassIcon className="inline h-4 w-4 fill-neutral-500" />{" "}
        {translate("BACK_TO_SEARCH")}
      </FooterLink>
      <FooterLink onClick={handleNextResultClick} disabled={isNextDisabled}>
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

function findResultIndex(
  searchResults: SearchResult,
  resultId: string,
): number {
  const found = searchResults.results.findIndex((r) => r._id === resultId);
  if (found === -1) {
    throw new Error(`Id ${resultId} not found in results`);
  }
  return found;
}
