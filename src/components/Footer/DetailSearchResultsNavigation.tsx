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
  const { hasNextPage, getNextFrom, hasPrevPage, getPrevFrom } =
    usePagination();
  const { getSearchResults } = useSearchResults();

  const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);
  const urlSearchParams = new URLSearchParams(searchParams as Any);

  if (!searchResults) {
    return null;
  }
  const resultIndex = findResultIndex(searchResults, tier2);
  async function handleNextResultClick() {
    if (!searchResults) {
      return null;
    }
    if (hasNextResult(resultIndex, searchParams)) {
      navigate(
        getDetailUrl(searchResults.results[resultIndex + 1]._id, { highlight }),
      );
      return;
    }
    if (hasNextPage()) {
      await loadNewSearchResultPage(getNextFrom());
    }
  }

  async function handlePrevResultClick() {
    if (!searchResults) {
      return null;
    }

    if (hasPrevResult(resultIndex)) {
      navigate(
        getDetailUrl(searchResults.results[resultIndex - 1]._id, { highlight }),
      );
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

    const newIndex = newFrom > searchParams.from ? 0 : searchParams.size - 1;
    const nextUrl = getDetailUrl(
      newSearchResults.results.results[newIndex]._id,
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
        disabled={!hasPrevResult(resultIndex) && !hasPrevPage()}
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
      <FooterLink
        onClick={handleNextResultClick}
        disabled={!hasNextResult(resultIndex, searchParams) && !hasNextPage()}
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
