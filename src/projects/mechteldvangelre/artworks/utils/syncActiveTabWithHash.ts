import { getTabFromHash } from "./getTabFromHash";
import { TabId } from "./hashConfig";

export function syncActiveTabWithHash(
  hashId: string,
  setActiveTab: (newId: TabId) => void,
) {
  const tab = getTabFromHash(hashId);
  if (tab) {
    setActiveTab(tab);
  }
}
