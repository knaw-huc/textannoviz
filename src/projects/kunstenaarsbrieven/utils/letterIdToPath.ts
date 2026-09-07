import {
  projectConfigSelector,
  useProjectStore,
} from "../../../stores/project";

/**
 * Lazy: the project config is only set in the store after App has loaded it
 */
const getLetterIdFormat = () =>
  projectConfigSelector(useProjectStore.getState()).letterIdFormat;

/**
 * The letter number as cited, which is not always how the id is stored
 * (see the project config's letterIdFormat).
 */
export function formatLetterNumber(letterId: string) {
  return getLetterIdFormat().toNumber(letterId);
}

export function letterIdToPath(letterId: string, baseUrl: string) {
  return `${baseUrl}${getLetterIdFormat().toUrnSuffix(letterId)}`;
}

/**
 * Turn what a user typed into the quick search into a letter id, so it can be
 * looked up in the letter index.
 */
export function normaliseLetterId(input: string) {
  return getLetterIdFormat().fromInput(input);
}
