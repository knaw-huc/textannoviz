import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import { useNavigate } from "react-router-dom";
import { SearchResult } from "../../model/Search.ts";
import { translateSelector, useProjectStore } from "../../stores/project.ts";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { usePagination } from "../../utils/usePagination.tsx";
import { useSearchResults } from "../Search/useSearchResults.tsx";
import {
  GetDetailUrl,
  useDetailUrl,
} from "../Text/Annotated/utils/useDetailUrl.tsx";
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
  const { hasNextPage, selectNextPage, hasPrevPage, selectPrevPage } =
    usePagination();
  const { getSearchResults } = useSearchResults();

  const prevResultPath = createResultPath(
    searchResults,
    tier2,
    highlight,
    (resultIndex) => resultIndex - 1,
    getDetailUrl,
  );
  const nextResultPath = createResultPath(
    searchResults,
    tier2,
    highlight,
    (resultIndex) => resultIndex + 1,
    getDetailUrl,
  );

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

    selectNextPage();
    // TODO: update result page in query from url
    // await loadNewSearchResultPage(from);
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

    const resultIndexUpdater =
      newFrom > searchParams.from
        ? // Start with first result of next page:
          () => 0
        : // Start with last result of previous page:
          () => newSearchResults.results.results.length - 1;

    const nextUrl = createResultPath(
      newSearchResults.results,
      newSearchResults.results.results[0]._id,
      highlight,
      resultIndexUpdater,
      getDetailUrl,
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

function createResultPath(
  searchResults: SearchResult | undefined,
  resultId: string,
  highlight: string | undefined,
  resultIndexUpdater: (oldIndex: number) => number,
  getDetailUrl: GetDetailUrl,
) {
  if (!searchResults) {
    return;
  }
  const resultIndex = searchResults.results.findIndex(
    (r) => r._id === resultId,
  );
  if (resultIndex === -1) {
    return;
  }
  const newResultId =
    searchResults.results[resultIndexUpdater(resultIndex)]?._id;
  if (!newResultId) {
    return;
  }
  return getDetailUrl(newResultId, highlight);
}
