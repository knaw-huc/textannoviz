import { useEffect, useState } from "react";
import { useSearchStore } from "../../stores/search/search-store.ts";
import _ from "lodash";
import { useUrlSearchParamsStore } from "./useSearchUrlParamsStore.ts";

export function useIsDefaultQuery() {
  const { searchQuery } = useUrlSearchParamsStore();
  const [isDefaultQuery, setIsDefaultQuery] = useState(false);
  const { defaultQuery } = useSearchStore();

  useEffect(() => {
    setIsDefaultQuery(_.isEqual(defaultQuery, searchQuery));
  }, [defaultQuery, searchQuery]);

  return { isDefaultQuery };
}
