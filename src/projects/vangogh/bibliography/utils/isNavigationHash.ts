import { getNavigationHashes } from "./hashConfig";

export function isNavigationHash(hash: string) {
  return getNavigationHashes().includes(hash);
}
