import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  blankParams,
  blankSearchParams,
  UrlState,
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
  urlState: UrlState;
};

const persistentStorage: StateStorage = {
  getItem: (): string => {
    return JSON.stringify({ state: getSearchUrlStateFromUrl() });
  },

  setItem: (_, newValue: string): void => {
    const { urlState } = JSON.parse(newValue).state as UrlStateItem;
    const paramUpdate = removeOrUpdateParams(urlState, blankParams);
    pushUrlParamsToHistory(paramUpdate);
  },

  removeItem: (): void => {
    throw new Error("not implemented");
  },
};

export type UrlStateItem = {
  urlState: UrlState;
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
    ): SearchUrlParamsState {
      const currentUrlQuery = state.urlState.query ?? {};
      const newQuery = {
        ...state.defaultSearchQuery,
        ...currentUrlQuery,
        ...update,
      };
      const deduplicatedQuery = removeDefaultProps(
        newQuery,
        state.defaultSearchQuery,
      );
      const newUrlState = { ...state.urlState, query: deduplicatedQuery };

      return {
        ...state,
        searchQuery: newQuery,
        urlState: newUrlState,
      };
    }

    function updateSearchParams(
      state: SearchUrlParamsState,
      update: Partial<SearchParams>,
    ): SearchUrlParamsState {
      const { query, ...currentParams } = state.urlState;
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
        urlState: { ...deduplicatedParams, query },
      };
    }

    function initSearchUrlParams(state: SearchUrlParamsStore) {
      let stateUpdate = updateSearchQuery(state, {});
      stateUpdate = updateSearchParams(stateUpdate, {});
      const { searchQuery, searchParams, urlState } = stateUpdate;

      return {
        ...state,
        searchParams,
        searchQuery,
        urlState,
        isInitSearchUrlParams: true,
      };
    }

    return {
      isInitSearchUrlParams: false,

      defaultSearchQuery: blankSearchQuery,
      defaultSearchParams: blankSearchParams,

      searchQuery: blankSearchQuery,
      searchParams: blankSearchParams,

      urlState: {},

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
      urlState: state.urlState,
    }),
  },
);

export const useUrlSearchParamsStore = create<SearchUrlParamsStore>()(
  (...a) => ({ ...createUrlSearchParamsStoreState(...a) }),
);
