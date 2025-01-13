import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import { useNavigate } from "react-router-dom";
import { SearchParams } from "../../model/Search.ts";
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
  const { getDetailUrlParams, createDetailUrl } = useDetailUrl();
  const { tier2 } = getDetailUrlParams();
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

  const resultIndex = searchResults.results.findIndex((r) => r._id === tier2);

  const isCurrentInResults = resultIndex !== -1;

  async function handleNextResultClick() {
    if (!searchResults) {
      return null;
    }
    if (hasNextResult(resultIndex, searchParams)) {
      const newResultId = searchResults.results[resultIndex + 1]._id;
      navigate(createDetailUrl(newResultId));
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
      const newResultId = searchResults.results[resultIndex - 1]._id;
      navigate(createDetailUrl(newResultId));
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
    const nextUrl = createDetailUrl(
      newResultId,
      // Pass new from to prevent resetting with old from:
      { from: newFrom },
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
        disabled={
          !isCurrentInResults || (!hasPrevResult(resultIndex) && !hasPrevPage())
        }
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
        disabled={
          !isCurrentInResults ||
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
