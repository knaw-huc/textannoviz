export const TAB_IDS = {
  artworksAll: "artworksAll",
  artworksVG: "artworksVG",
  artworksOthers: "artworksOthers",
  nonIllustrated: "nonIllustrated",
  sketches: "sketches",
} as const;
export type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

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
    sketches: "sketches",
    illustrated: "artworksAll",
    "non-illustrated": "nonIllustrated",
  },
  // Focus hash prefixes
  prefixes: {
    sketch_: "sketches",
    ill_: "artworksAll",
    noill_: "nonIllustrated",
  },
} as const;

export function getNavigationHashes(): string[] {
  return Object.keys(HASH_CONFIG.navigation);
}

export function getHashPrefixes(): string[] {
  return Object.keys(HASH_CONFIG.prefixes);
}
