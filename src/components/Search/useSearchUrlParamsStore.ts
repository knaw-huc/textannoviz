import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import { blankSearchParams } from "./createSearchParams.tsx";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";
import {
  getStateStorageItemFromUrl,
  pushUrlParamsToHistory,
  removeDefaultProps,
  removeOrUpdateParams,
  removeOrUpdateQuery,
} from "../../utils/UrlParamUtils.ts";
import _ from "lodash";

const persistentStorage: StateStorage = {
  getItem: (): string =>
    JSON.stringify({ state: getStateStorageItemFromUrl() }),
  // @ts-expect-error unused key
  setItem: (key, newValue: string): void => {
    const { urlSearchParams, urlSearchQuery } = JSON.parse(newValue).state;
    const paramUpdate = removeOrUpdateParams(
      urlSearchParams,
      blankSearchParams,
    );
    const queryUpdate = removeOrUpdateQuery(urlSearchQuery);
    const updateOrRemove = _.merge(paramUpdate, queryUpdate);
    pushUrlParamsToHistory(updateOrRemove);
  },
  removeItem: (): void => {
    throw new Error("not implemented");
  },
};

type SearchUrlParamsState = {
  /**
   * When init, the defaults have been generated and can be used
   * to generate the query and params from store state + url params:
   */
  isInitSearchUrlParams: boolean;

  // Defaults are not stored in url:
  defaultSearchQuery: SearchQuery;
  defaultSearchParams: SearchParams;

  // Properties that differ from the default are stored in url:
  searchQuery: SearchQuery;
  searchParams: SearchParams;

  // Differences between current and default:
  urlSearchQuery: Partial<SearchQuery>;
  urlSearchParams: Partial<SearchParams>;
};

export type SearchUrlState = Pick<
  SearchUrlParamsState,
  "urlSearchQuery" | "urlSearchParams"
>;

type SearchUrlParamsStore = SearchUrlParamsState & {
  setDefaultSearchParams: (update: SearchParams) => void;
  setDefaultSearchQuery: (update: SearchQuery) => void;

  updateSearchParams: (update: Partial<SearchParams>) => void;
  updateSearchQuery: (update: Partial<SearchQuery>) => void;

  // Initialize search params and query from defaults and url values:
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
    ) {
      const merged = {
        ...state.defaultSearchQuery,
        ...state.urlSearchQuery,
        ...update,
      };
      const deduplicated = removeDefaultProps(merged, state.defaultSearchQuery);
      return {
        ...state,
        searchQuery: merged,
        urlSearchQuery: deduplicated,
      };
    }

    function updateSearchParams(
      state: SearchUrlParamsStore,
      update: Partial<SearchParams>,
    ) {
      const merged = {
        ...state.defaultSearchParams,
        ...state.urlSearchParams,
        ...update,
      };
      const deduplicated = removeDefaultProps(
        merged,
        state.defaultSearchParams,
      );
      return {
        ...state,
        searchParams: merged,
        urlSearchParams: deduplicated,
      };
    }

    function initSearchUrlParams(state: SearchUrlParamsStore) {
      const { searchQuery, urlSearchQuery } = updateSearchQuery(state, {});
      const { searchParams, urlSearchParams } = updateSearchParams(state, {});
      return {
        ...state,
        searchParams,
        urlSearchParams,
        searchQuery,
        urlSearchQuery,
        isInitSearchUrlParams: true,
      };
    }

    return {
      isInitSearchUrlParams: false,

      defaultSearchQuery: blankSearchQuery,
      defaultSearchParams: blankSearchParams,

      searchQuery: blankSearchQuery,
      searchParams: blankSearchParams,

      urlSearchQuery: {},
      urlSearchParams: {},

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
      urlSearchQuery: state.urlSearchQuery,
      urlSearchParams: state.urlSearchParams,
    }),
  },
);

export const useUrlSearchParamsStore = create<SearchUrlParamsStore>()(
  (...a) => ({ ...createUrlSearchParamsStoreState(...a) }),
);
