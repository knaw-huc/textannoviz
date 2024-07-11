import { useNavigate } from "react-router-dom";
import { translateSelector, useProjectStore } from "../stores/project.ts";
import { useSearchStore } from "../stores/search/search-store.ts";
import {
  DetailParams,
  useDetailUrlParams,
} from "./Text/Annotated/utils/useDetailUrlParams.tsx";
import { Base64 } from "js-base64";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { SearchResult } from "../model/Search.ts";
import { toDetailPageUrl } from "./Text/Annotated/utils/toDetailPageUrl.tsx";
import { FooterLink } from "./FooterLink.tsx";

export function DetailSearchResultsNavigation() {
  const navigate = useNavigate();
  const translate = useProjectStore(translateSelector);
  const { searchQuery, searchUrlParams, searchResults } = useSearchStore();
  const detailParams = useDetailUrlParams();

  const { prevResult, nextResult } = createPrevNextUrls(
    detailParams,
    searchResults,
  );

  const cleanQuery = JSON.stringify(searchQuery, skipEmptyValues);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const urlSearchParams = new URLSearchParams(searchUrlParams as any);

  const isOnFirstOfPage = !prevResult;
  // TODO:
  const hasPreviousPage = false;
  const isPrevDisabled = isOnFirstOfPage && !hasPreviousPage;

  const isOnEndOfPage = !nextResult;
  // TODO:
  const hasNextPage = false;
  const isNextDisabled = isOnEndOfPage && !hasNextPage;

  return (
    <>
      <FooterLink
        classes={["pl-10"]}
        onClick={() => prevResult && navigate(prevResult)}
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
      <FooterLink
        onClick={() => nextResult && navigate(nextResult)}
        disabled={isNextDisabled}
      >
        Next &gt;
      </FooterLink>
    </>
  );
}

function createPrevNextUrls(
  detailParams: DetailParams,
  searchResults?: SearchResult,
): {
  prevResult?: string;
  nextResult?: string;
} {
  if (!searchResults) {
    return {};
  }
  const { tier2, highlight } = detailParams;
  const resultIndex = searchResults.results.findIndex((r) => r._id === tier2);
  const prevResultId =
    resultIndex > 0 ? searchResults.results[resultIndex - 1]._id : undefined;
  const prevResult = prevResultId
    ? toDetailPageUrl(prevResultId, { highlight })
    : undefined;
  const nextResultId =
    resultIndex !== -1 && resultIndex < searchResults.results.length - 1
      ? searchResults.results[resultIndex + 1]._id
      : undefined;
  const nextResult = nextResultId
    ? toDetailPageUrl(nextResultId, { highlight })
    : undefined;
  return { prevResult, nextResult };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function skipEmptyValues(_: string, v: any) {
  return [null, ""].includes(v) ? undefined : v;
}
