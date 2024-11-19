import { useParams, useSearchParams } from "react-router-dom";
import { getFullDetailUrl } from "./getFullDetailUrl.tsx";
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
      highlight: urlParams.get("highlight") || undefined,
    };
  }

  function getDetailUrl(newResultId: string, highlight?: string) {
    return getFullDetailUrl(
      newResultId,
      { highlight },
      searchParams,
      searchQuery,
    );
  }

  return {
    getDetailUrlParams,
    getDetailUrl,
  };
}

export type GetDetailUrl = (newResultId: string, highlight?: string) => string;
