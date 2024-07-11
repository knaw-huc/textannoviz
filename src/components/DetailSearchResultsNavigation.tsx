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
  const { selectNextPage, hasNextPage } = usePagination();
  const { getSearchResults } = useSearchResults();

  const prevResultPath = createPrevUrl(
    detailParams.tier2,
    detailParams.highlight,
    searchResults,
  );
  const nextResultPath = createNextUrl(
    detailParams.tier2,
    detailParams.highlight,
    searchResults,
  );

  const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const urlSearchParams = new URLSearchParams(searchUrlParams as any);

  const total = searchResults?.total.value || 0;

  const isOnFirstOfPage = !prevResultPath;
  // TODO:
  const hasPreviousPage = false;
  const isPrevDisabled = isOnFirstOfPage && !hasPreviousPage;

  const isOnEndOfPage = !nextResultPath;
  const lastPageResult = searchUrlParams.from + searchUrlParams.size;
  const isNextDisabled = isOnEndOfPage && !hasNextPage();

  console.log("DetailSearchResultsNavigation", {
    total,
    isOnEndOfPage,
    lastPageResult,
    hasNextPage: hasNextPage(),
    isNextDisabled,
  });

  async function handleNextResultClick() {
    if (!nextResultPath && !hasNextPage()) {
      return;
    }

    if (nextResultPath) {
      navigate(nextResultPath);
      return;
    }

    selectNextPage();
    const newSearchResults = await getSearchResults(
      searchFacetTypes,
      searchUrlParams,
      searchQuery,
    );
    if (newSearchResults) {
      const nextUrl = createNextUrl(
        newSearchResults.results.results[0]._id,
        detailParams.highlight,
        newSearchResults.results,
      );
      if (!nextUrl) {
        throw new Error("No results found");
      }
      navigate(nextUrl);
      setSearchResults(newSearchResults.results);
    }
  }

  return (
    <>
      <FooterLink
        classes={["pl-10"]}
        onClick={() => prevResultPath && navigate(prevResultPath)}
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

function createPrevUrl(
  tier2: string,
  highlight: string | undefined,
  searchResults?: SearchResult,
): string | undefined {
  return createBrowseUrl(
    searchResults,
    tier2,
    highlight,
    (resultIndex) => resultIndex - 1,
  );
}

function createNextUrl(
  tier2: string,
  highlight: string | undefined,
  searchResults?: SearchResult,
): string | undefined {
  return createBrowseUrl(
    searchResults,
    tier2,
    highlight,
    (resultIndex) => resultIndex + 1,
  );
}

function createBrowseUrl(
  searchResults: SearchResult | undefined,
  tier2: string,
  highlight: string | undefined,
  toIndex: (oldIndex: number) => number,
) {
  if (!searchResults) {
    return;
  }
  const resultIndex = searchResults.results.findIndex((r) => r._id === tier2);
  if (resultIndex === -1) {
    return;
  }
  const newResultId = searchResults.results[toIndex(resultIndex)]?._id;
  if (!newResultId) {
    return;
  }
  return toDetailPageUrl(newResultId, { highlight });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function skipEmptyValues(_: string, v: any) {
  return [null, ""].includes(v) ? undefined : v;
}
