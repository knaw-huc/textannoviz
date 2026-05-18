import { Key } from "react-aria-components";

export function syncActiveTabWithHash(
  hashId: string,
  setActiveTab: React.Dispatch<React.SetStateAction<Key>>,
) {
  if (hashId.startsWith("sketch")) {
    setActiveTab("sketches");
  } else if (hashId.startsWith("ill")) {
    setActiveTab("artworksAll");
  }
}
