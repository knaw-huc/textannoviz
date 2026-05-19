import { Key } from "react-aria-components";
import { getTabFromHash } from "./getTabFromHash";

export function syncActiveTabWithHash(
  hashId: string,
  setActiveTab: (newId: Key) => void,
) {
  const tab = getTabFromHash(hashId);
  setActiveTab(tab);
}
