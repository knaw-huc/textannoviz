import { useParams, useSearchParams } from "react-router-dom";
import {
  cleanUrlParams,
  getUrlParams,
  setUrlParams,
} from "../../../../utils/UrlParamUtils.ts";

export type DetailUrlSearchParams = {
  from?: number;
  highlight?: string;
};

export type DetailParams = DetailUrlSearchParams & {
  tier2: string;
};

export function useDetailUrl() {
  const params = useParams();
  const [urlParams] = useSearchParams();

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

  function getDetailUrl(
    resultId: string,
    detailParams?: DetailUrlSearchParams,
  ) {
    const nextUrlSearchParams = getUrlParams();
    if (detailParams) {
      setUrlParams(nextUrlSearchParams, cleanUrlParams(detailParams));
    }
    return `/detail/${resultId}?${nextUrlSearchParams}`;
  }

  return {
    getDetailUrlParams,
    getDetailUrl,
  };
}
