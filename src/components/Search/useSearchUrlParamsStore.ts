import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import { blankSearchParams } from "./createSearchParams.tsx";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";

function getUrlSearch(): URLSearchParams {
  return new URLSearchParams(window.location.search);
}

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    const searchParams = getUrlSearch();
    const storedValue = searchParams.get(key);
    return JSON.parse(storedValue as string);
  },
  setItem: (key, newValue): void => {
    const searchParams = getUrlSearch();
    searchParams.set(key, JSON.stringify(newValue));
    window.history.replaceState(null, "", `?${searchParams.toString()}`);
  },
  removeItem: (key): void => {
    const searchParams = getUrlSearch();
    searchParams.delete(key);
    window.location.search = searchParams.toString();
  },
};

type SearchUrlParamsStore = {
  isInitSearchUrlParams: boolean;
  searchQuery: SearchQuery;
  searchParams: SearchParams;
} & {
  updateSearchParams: (update: Partial<SearchParams>) => void;
  updateSearchQuery: (update: Partial<SearchQuery>) => void;
  setInitSearchUrlParams: (update: boolean) => void;
};

const storageOptions = {
  name: "urlSearchParamsStore",
  storage: createJSONStorage<SearchUrlParamsStore>(() => persistentStorage),
};

export const useUrlSearchParamsStore = create(
  persist<SearchUrlParamsStore>(
    (set) => ({
      isInitSearchUrlParams: false,
      searchQuery: blankSearchQuery,
      searchParams: blankSearchParams,
      updateSearchQuery: (update) =>
        set((state) => ({
          ...state,
          searchQuery: { ...state.searchQuery, ...update },
        })),
      updateSearchParams: (update) =>
        set((state) => ({
          ...state,
          searchParams: { ...state.searchParams, ...update },
        })),
      setInitSearchUrlParams: (update) =>
        set((state) => ({ ...state, isInitSearchUrlParams: update })),
    }),
    storageOptions,
  ),
);
