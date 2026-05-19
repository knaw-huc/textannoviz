import { useEffect } from "react";
import { useTextStore } from "../../../stores/text/text-store.ts";
import { clearUrlHash, setUrlHash } from "../../../utils/url/UrlHashUtils.ts";

export function useSyncHashWithHeader(): void {
  const activeHeader = useTextStore((s) => s.activeHeader);
  const setActiveHeader = useTextStore((s) => s.setActiveHeader);

  useEffect(() => {
    if (activeHeader) {
      setUrlHash(activeHeader);
    } else {
      clearUrlHash();
    }
  }, [activeHeader]);

  // Clear hash on unmount:
  useEffect(() => {
    return () => {
      clearUrlHash();
      setActiveHeader("");
    };
  }, [setActiveHeader]);
}
