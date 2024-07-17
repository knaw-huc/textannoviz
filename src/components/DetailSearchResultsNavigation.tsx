import { useNavigate } from "react-router-dom";
import { translateSelector, useProjectStore } from "../stores/project.ts";
import { useSearchStore } from "../stores/search/search-store.ts";
import { useDetailUrlParams } from "./Text/Annotated/utils/useDetailUrlParams.tsx";
import { Base64 } from "js-base64";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchResult } from "../model/Search.ts";
import { toDetailPageUrl } from "./Text/Annotated/utils/toDetailPageUrl.tsx";
import { FooterLink } from "./FooterLink.tsx";
import { usePagination } from "../utils/usePagination.tsx";
import { useSearchResults } from "./Search/useSearchResults.tsx";

export function DetailSearchResultsNavigation() {
  const navigate = useNavigate();
  const translate = useProjectStore(translateSelector);
  const detailParams = useDetailUrlParams();
  const {
    searchQuery,
    searchUrlParams,
    searchResults,
    searchFacetTypes,
    setSearchResults,
  } = useSearchStore();
  const { hasNextPage, selectNextPage, hasPrevPage, selectPrevPage } =
    usePagination();
  const { getSearchResults } = useSearchResults();

  const prevResultPath = createResultPath(
    searchResults,
    detailParams.tier2,
    detailParams.highlight,
    (resultIndex) => resultIndex - 1,
  );
  const nextResultPath = createResultPath(
    searchResults,
    detailParams.tier2,
    detailParams.highlight,
    (resultIndex) => resultIndex + 1,
  );

  const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const urlSearchParams = new URLSearchParams(searchUrlParams as any);

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

    const { from } = selectNextPage();
    await loadNewSearchResultPage(from);
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
      { ...searchUrlParams, from: newFrom },
      searchQuery,
    );

    if (!newSearchResults) {
      return;
    }

    const resultIndexUpdater =
      newFrom > searchUrlParams.from
        ? // Start with first result of next page:
          () => 0
        : // Start with last result of previous page:
          () => newSearchResults.results.results.length - 1;

    const nextUrl = createResultPath(
      newSearchResults.results,
      newSearchResults.results.results[0]._id,
      detailParams.highlight,
      resultIndexUpdater,
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
        &lt; Previous
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
        Next &gt;
      </FooterLink>
    </>
  );
}

function createResultPath(
  searchResults: SearchResult | undefined,
  resultId: string,
  highlight: string | undefined,
  resultIndexUpdater: (oldIndex: number) => number,
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
  return toDetailPageUrl(newResultId, { highlight });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function skipEmptyValues(_: string, v: any) {
  return [null, ""].includes(v) ? undefined : v;
}
