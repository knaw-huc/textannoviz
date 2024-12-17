import { DetailQueryParams } from "./useDetailUrlParams.tsx";

export function toDetailPageUrl(tier2: string, params: DetailQueryParams) {
  return `/detail/${tier2}?${new URLSearchParams(params)}`;
}
