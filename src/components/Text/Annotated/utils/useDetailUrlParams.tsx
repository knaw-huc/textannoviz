import { useParams, useSearchParams } from "react-router-dom";

export type DetailQueryParams = {
  highlight?: string;
};

export type DetailParams = DetailQueryParams & {
  tier2: string;
};

export function useDetailUrlParams(): DetailParams {
  const params = useParams();
  const [searchParams] = useSearchParams();
  return {
    tier2: params.tier2!,
    highlight: searchParams.get("highlight") || undefined,
  };
}
