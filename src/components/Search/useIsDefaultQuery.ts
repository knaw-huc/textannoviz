import { useEffect, useState } from "react";
import { useSearchStore } from "../../stores/search/search-store.ts";
import { useSearchUrlParams } from "./useSearchUrlParams.tsx";
import _ from "lodash";

export function useIsDefaultQuery() {
  const { searchQuery } = useSearchUrlParams();
  const [isDefaultQuery, setIsDefaultQuery] = useState(false);
  const { defaultQuery } = useSearchStore();

  useEffect(() => {
    setIsDefaultQuery(_.isEqual(defaultQuery, searchQuery));
  }, [defaultQuery, searchQuery]);

  return { isDefaultQuery };
}
