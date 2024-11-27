import { useParams, useSearchParams } from "react-router-dom";
import { createUrlSearchParams } from "./getFullDetailUrl.tsx";
import { useSearchUrlParams } from "../../../Search/useSearchUrlParams.tsx";

export type DetailQueryParams = {
  highlight?: string;
};

export type DetailParams = DetailQueryParams & {
  tier2: string;
};

export function useDetailUrl() {
  const params = useParams();
  const [urlParams] = useSearchParams();
  const { searchParams, searchQuery } = useSearchUrlParams();

  function getDetailUrlParams(): DetailParams {
    const tier2 = params.tier2;
    if (!tier2) {
      throw new Error("No tier2 found in url");
    }
    return {
      tier2,
      ...getDetailUrlSearchParams(),
    };
  }

  function getDetailUrlSearchParams(): { highlight?: string } {
    return {
      highlight: urlParams.get("highlight") || undefined,
    };
  }

  function getDetailUrl(resultId: string, overwriteParams?: object) {
    const urlSearchParams = createUrlSearchParams(searchParams, searchQuery, {
      ...getDetailUrlSearchParams(),
      ...overwriteParams,
    });
    return `/detail/${resultId}?${urlSearchParams}`;
  }

  return {
    getDetailUrlParams,
    getDetailUrl,
  };
}
