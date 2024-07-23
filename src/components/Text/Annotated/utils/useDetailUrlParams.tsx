import { useParams, useSearchParams } from "react-router-dom";

export function useDetailUrlParams() {
  const params = useParams();
  const [searchParams] = useSearchParams();
  return {
    tier2: params.tier2,
    highlight: searchParams.get("highlight") || undefined,
  };
}
