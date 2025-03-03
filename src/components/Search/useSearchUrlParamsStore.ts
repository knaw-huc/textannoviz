import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DetailParams, SearchParams, SearchQuery } from "../../model/Search.ts";
import {
  blankDetailParams,
  blankParams,
  blankSearchParams,
  SearchUrlState,
} from "./createSearchParams.tsx";
import { blankSearchQuery } from "../../stores/search/default-query-slice.ts";
import { removeDefaultProps } from "../../utils/UrlParamUtils.ts";
import { createUrlStorage } from "./createUrlStorage.ts";
import { omit, pick } from "lodash";

type SearchUrlParamsState = {
  searchQuery: SearchQuery;
  searchParams: SearchParams;
  detailParams: DetailParams;

  /**
   * When initialized, the defaults have been generated and are used
   * to generate the query and params from store state + url params:
   */
  isInitSearchUrlParams: boolean;

  // Defaults are not stored in url:
  defaultSearchQuery: SearchQuery;
  defaultSearchParams: SearchParams;

  // Param and query properties that differ from the default are stored in url:
  urlState: SearchUrlState;
};

type SearchUrlParamsStore = SearchUrlParamsState & {
  setDefaultSearchParams: (update: SearchParams) => void;
  setDefaultSearchQuery: (update: SearchQuery) => void;

  updateSearchParams: (update: Partial<SearchParams>) => void;
  updateSearchQuery: (update: Partial<SearchQuery>) => void;
  updateDetailParams: (update: Partial<DetailParams>) => void;

  initSearchUrlParams: () => void;
};

export const useUrlSearchParamsStore = create<SearchUrlParamsStore>()(
  persist(
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
        return {
          ...state,
          searchQuery: newQuery,
          urlState: { ...state.urlState, query: deduplicatedQuery },
        };
      }

      function updateSearchParams(
        state: SearchUrlParamsState,
        update: Partial<SearchParams>,
      ): SearchUrlParamsState {
        const currentSearchParams = pick(
          state.urlState,
          Object.keys(blankSearchParams),
        );
        const otherParams = omit(
          state.urlState,
          Object.keys(blankSearchParams),
        );
        const newParams = {
          ...state.defaultSearchParams,
          ...currentSearchParams,
          ...update,
        };
        const deduplicatedParams = removeDefaultProps(
          newParams,
          state.defaultSearchParams,
        );
        return {
          ...state,
          searchParams: newParams,
          urlState: { ...otherParams, ...deduplicatedParams },
        };
      }

      function updateDetailParams(
        state: SearchUrlParamsState,
        update: Partial<DetailParams>,
      ): SearchUrlParamsState {
        const currentDetailParams = pick(
          state.urlState,
          Object.keys(blankDetailParams),
        );
        const otherParams = omit(
          state.urlState,
          Object.keys(blankDetailParams),
        );
        const newParams = {
          ...blankDetailParams,
          ...currentDetailParams,
          ...update,
        };
        const deduplicatedParams = removeDefaultProps(
          newParams,
          blankDetailParams,
        );
        return {
          ...state,
          detailParams: newParams,
          urlState: { ...otherParams, ...deduplicatedParams },
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

        detailParams: blankDetailParams,

        urlState: {},

        setDefaultSearchQuery: (defaultSearchQuery) =>
          set((state) => ({ ...state, defaultSearchQuery })),
        setDefaultSearchParams: (defaultSearchParams) =>
          set((state) => ({ ...state, defaultSearchParams })),

        updateSearchQuery: (update) =>
          set((state) => updateSearchQuery(state, update)),
        updateSearchParams: (update) =>
          set((state) => updateSearchParams(state, update)),
        updateDetailParams: (update) =>
          set((state) => updateDetailParams(state, update)),

        initSearchUrlParams: () => set((state) => initSearchUrlParams(state)),
      };
    },

    {
      name: "urlSearchParamsStore",
      storage: createJSONStorage(() => createUrlStorage(blankParams)),
      partialize: (state) => ({
        urlState: state.urlState,
      }),
    },
  ),
);
