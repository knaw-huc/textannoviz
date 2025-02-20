import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  blankParams,
  blankSearchParams,
  SearchQueryAndParamUrlParams,
} from "./createSearchParams.tsx";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";
import {
  getSearchUrlStateFromUrl,
  pushUrlParamsToHistory,
  removeDefaultProps,
  removeOrUpdateParams,
} from "../../utils/UrlParamUtils.ts";

type SearchUrlParamsState = {
  searchQuery: SearchQuery;
  searchParams: SearchParams;

  /**
   * When init, the defaults have been generated and can be used
   * to generate the query and params from store state + url params:
   */
  isInitSearchUrlParams: boolean;

  // Defaults are not stored in url:
  defaultSearchQuery: SearchQuery;
  defaultSearchParams: SearchParams;

  // Param and query properties that differ from the default are stored in url:
  urlParams: SearchQueryAndParamUrlParams;
};

const persistentStorage: StateStorage = {
  getItem: (): string => {
    return JSON.stringify({ state: getSearchUrlStateFromUrl() });
  },

  setItem: (_, newValue: string): void => {
    const { urlParams } = JSON.parse(newValue).state;
    const paramUpdate = removeOrUpdateParams(urlParams, blankParams);
    pushUrlParamsToHistory(paramUpdate);
  },

  removeItem: (): void => {
    throw new Error("not implemented");
  },
};

export type SearchUrlState = {
  urlParams: SearchQueryAndParamUrlParams;
};

type SearchUrlParamsStore = SearchUrlParamsState & {
  setDefaultSearchParams: (update: SearchParams) => void;
  setDefaultSearchQuery: (update: SearchQuery) => void;

  updateSearchParams: (update: Partial<SearchParams>) => void;
  updateSearchQuery: (update: Partial<SearchQuery>) => void;

  initSearchUrlParams: () => void;
};

const createUrlSearchParamsStoreState: StateCreator<
  SearchUrlParamsStore,
  [],
  [["zustand/persist", unknown]],
  SearchUrlParamsStore
> = persist(
  (set) => {
    function updateSearchQuery(
      state: SearchUrlParamsStore,
      update: Partial<SearchQuery>,
    ): SearchUrlParamsStore {
      const currentUrlQuery = state.urlParams.query ?? {};
      const newQuery = {
        ...state.defaultSearchQuery,
        ...currentUrlQuery,
        ...update,
      };
      const deduplicatedQuery = removeDefaultProps(
        newQuery,
        state.defaultSearchQuery,
      );
      const newUrlParams = { ...state.urlParams, query: deduplicatedQuery };

      return {
        ...state,
        searchQuery: newQuery,
        urlParams: newUrlParams,
      };
    }

    function updateSearchParams(
      state: SearchUrlParamsStore,
      update: Partial<SearchParams>,
    ) {
      const { query, ...currentParams } = state.urlParams;
      const newParams = {
        ...state.defaultSearchParams,
        ...currentParams,
        ...update,
      };
      const deduplicatedParams = removeDefaultProps(
        newParams,
        state.defaultSearchParams,
      );
      return {
        ...state,
        searchParams: newParams,
        urlParams: { ...deduplicatedParams, query },
      };
    }

    function initSearchUrlParams(state: SearchUrlParamsStore) {
      const updatedState = updateSearchQuery(state, {});
      const searchQuery = updatedState.searchQuery;
      const { searchParams, urlParams } = updateSearchParams(updatedState, {});

      return {
        ...state,
        searchParams,
        searchQuery,
        urlParams,
        isInitSearchUrlParams: true,
      };
    }

    return {
      isInitSearchUrlParams: false,

      defaultSearchQuery: blankSearchQuery,
      defaultSearchParams: blankSearchParams,

      searchQuery: blankSearchQuery,
      searchParams: blankSearchParams,

      urlParams: {},

      setDefaultSearchQuery: (defaultSearchQuery) =>
        set((state) => ({ ...state, defaultSearchQuery })),
      setDefaultSearchParams: (defaultSearchParams) =>
        set((state) => ({ ...state, defaultSearchParams })),

      updateSearchQuery: (update) =>
        set((state) => updateSearchQuery(state, update)),
      updateSearchParams: (update) =>
        set((state) => updateSearchParams(state, update)),

      initSearchUrlParams: () => set((state) => initSearchUrlParams(state)),
    };
  },
  {
    name: "urlSearchParamsStore",
    storage: createJSONStorage(() => persistentStorage),
    partialize: (state) => ({
      urlParams: state.urlParams,
    }),
  },
);

export const useUrlSearchParamsStore = create<SearchUrlParamsStore>()(
  (...a) => ({ ...createUrlSearchParamsStoreState(...a) }),
);
