import { Key } from "react-aria-components";

/**
 * There are two types of hashes:
 *
 * 1. Navigation hash: this is used to select the correct tab when the user enters the artwork page via a nav item. E.g., nav item 'Works of arts mentioned in the letters (illustrated)' has a link of 'artworks#illustrated'. This is converted to go to tab 'artworksAll'.
 *
 * 2. Focus hash: this is used to focus on one artwork in the artwork page when the user enters the artwork page via the entity modal. E.g., the user enters the artwork page via the entity modal with url 'artworks#sketch_253'. This is converted to go to tab 'sketches'
 */
export const HASH_CONFIG = {
  // Navigation hashes
  navigation: {
    sketches: "sketches" as Key,
    illustrated: "artworksAll" as Key,
    "non-illustrated": "nonIllustrated" as Key,
  },
  // Focus hash prefixes
  prefixes: {
    sketch_: "sketches" as Key,
    ill_: "artworksAll" as Key,
    noill_: "nonIllustrated" as Key,
  },
} as const;

export function getNavigationHashes(): string[] {
  return Object.keys(HASH_CONFIG.navigation);
}

export function getHashPrefixes(): string[] {
  return Object.keys(HASH_CONFIG.prefixes);
}
