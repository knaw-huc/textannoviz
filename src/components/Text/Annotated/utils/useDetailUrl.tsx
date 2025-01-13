import { useParams, useSearchParams } from "react-router-dom";
import { createUrlSearchParams } from "./getFullDetailUrl.tsx";
import { useSearchUrlParams } from "../../../Search/useSearchUrlParams.tsx";

export type DetailUrlSearchParams = {
  highlight?: string;
};

export type DetailParams = DetailUrlSearchParams & {
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

  function getDetailUrlSearchParams(): DetailUrlSearchParams {
    return {
      highlight: urlParams.get("highlight") || undefined,
    };
  }

  function createDetailUrl(resultId: string, overwriteParams?: object) {
    const urlSearchParams = createUrlSearchParams(searchParams, searchQuery, {
      ...getDetailUrlSearchParams(),
      ...overwriteParams,
    });
    return `/detail/${resultId}?${urlSearchParams}`;
  }

  return {
    getDetailUrlParams,
    createDetailUrl,
  };
}
