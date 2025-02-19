import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { SearchParams, SearchQuery } from "../../model/Search.ts";
import { blankSearchParams } from "./createSearchParams.tsx";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";
import {
  getStateStorageItemFromUrl,
  pushUrlParamsToHistory,
  removeDefaultParamProps,
  removeDefaultProps,
  removeDefaultQueryProps,
} from "../../utils/UrlParamUtils.ts";
import _ from "lodash";

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    const stateStorageItemFromUrl = getStateStorageItemFromUrl();
    const result = JSON.stringify({ state: stateStorageItemFromUrl });
    console.log("getItem", { key, stateStorageItemFromUrl, result });
    return result;
  },
  // @ts-expect-error unused key
  setItem: (key, newValue: string): void => {
    const urlState = JSON.parse(newValue).state as SearchUrlState;
    const updateOrRemove = _.merge(
      removeDefaultParamProps(urlState.urlSearchParams, blankSearchParams),
      removeDefaultQueryProps(urlState.urlSearchQuery),
    );
    console.log("setItem", { newValue, urlState, updateOrRemove });
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
      const result = {
        ...state,
        searchQuery: merged,
        urlSearchQuery: deduplicated,
      };
      console.log("updateSearchQuery", { state, result });
      return result;
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
      const result = {
        ...state,
        searchParams: merged,
        urlSearchParams: deduplicated,
      };
      console.log("updateSearchParams", {
        state,
        merged,
        defaultSearchParams: state.defaultSearchParams,
        deduplicated,
      });
      return result;
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
        set((state) => {
          const result = { ...state, defaultSearchQuery };
          console.log("setDefaultSearchQuery", {
            state,
            defaultSearchQuery,
            result,
          });
          return result;
        }),
      setDefaultSearchParams: (defaultSearchParams) =>
        set((state) => {
          const result = { ...state, defaultSearchParams };
          console.log("setDefaultSearchParams", {
            state,
            defaultSearchParams,
            result,
          });
          return result;
        }),

      updateSearchQuery: (update) =>
        set((state) => updateSearchQuery(state, update)),
      updateSearchParams: (update) =>
        set((state) => updateSearchParams(state, update)),

      initSearchUrlParams: () =>
        set((state) => {
          const { searchQuery, urlSearchQuery } = updateSearchQuery(state, {});
          const { searchParams, urlSearchParams } = updateSearchParams(
            state,
            {},
          );
          const result = {
            ...state,
            searchParams,
            urlSearchParams,
            searchQuery,
            urlSearchQuery,
            isInitSearchUrlParams: true,
          };
          console.log("initSearchUrlParams", { state, result });
          return result;
        }),
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
  (...a) => ({
    ...createUrlSearchParamsStoreState(...a),
  }),
);
