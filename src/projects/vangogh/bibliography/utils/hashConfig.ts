export const TAB_IDS = {
  vangogh: "vangogh",
  editors: "editors",
} as const;
export type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

/**
 * There are two types of hashes:
 *
 * 1. Navigation hash: this is used to select the correct tab when the user enters the bibliography page via a nav item. E.g., nav item 'Literature cited by Van Gogh' has a link of 'bibliography#vangogh'. This is converted to go to tab 'vangogh'.
 *
 * 2. Focus hash: this is used to focus on one bibliography item in the bibliography page when the user enters the bibliography page via the entity modal. E.g., the user enters the bibliography page via the entity modal with url 'bibliography#_lit_101'. This is converted to go to tab 'vangogh'. Editor bibliography items do not have a prefix.
 */
export const HASH_CONFIG = {
  // Navigation hashes
  navigation: {
    vangogh: TAB_IDS.vangogh,
    editors: TAB_IDS.editors,
  },
  // Focus hash prefixes
  prefixes: {
    _lit_: TAB_IDS.vangogh,
  },
} as const;

export function getNavigationHashes(): string[] {
  return Object.keys(HASH_CONFIG.navigation);
}

export function getHashPrefixes(): string[] {
  return Object.keys(HASH_CONFIG.prefixes);
}
