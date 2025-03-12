import { StateStorage } from "zustand/middleware";
import {
  getStateFromUrl,
  pushUrlParamsToHistory,
  removeOrUpdateParams,
} from "../../utils/UrlParamUtils.ts";

export type UrlStateItem<T> = {
  urlState: Partial<T>;
};

/**
 * Implement zustand StateStorage to persist state as URLSearchParams
 */
export function createUrlStorage<T extends object>(
  /**
   * Object containing all properties with an initial value, used to:
   * 1. find relevant params in URLSearchParams
   * 2. infer types when converting url values into state
   */
  paramTemplate: T,
): StateStorage {
  return {
    getItem: (): string => {
      try {
        return JSON.stringify({ state: getStateFromUrl(paramTemplate) });
      } catch (cause) {
        console.error("Could not get item:", cause);
        throw new Error("Could not get item", { cause });
      }
    },

    setItem: (_, newValue: string): void => {
      const { urlState } = JSON.parse(newValue).state as UrlStateItem<T>;
      const paramUpdate = removeOrUpdateParams(urlState, paramTemplate);
      pushUrlParamsToHistory(paramUpdate);
    },

    removeItem: (): void => {
      throw new Error("not implemented");
    },
  };
}
