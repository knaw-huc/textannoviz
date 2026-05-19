import { Key } from "react-aria-components";
import { HASH_CONFIG } from "./hashConfig";

export function getTabFromHash(hash: string): Key {
  // Check navigation hashes first
  if (hash in HASH_CONFIG.navigation) {
    return HASH_CONFIG.navigation[hash as keyof typeof HASH_CONFIG.navigation];
  }

  // Check focus hash prefixes
  for (const [prefix, tab] of Object.entries(HASH_CONFIG.prefixes)) {
    if (hash.startsWith(prefix)) {
      return tab as Key;
    }
  }

  return "artworksAll";
}
