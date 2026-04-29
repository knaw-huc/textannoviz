import { useEffect } from "react";
import { useTextStore } from "../../../stores/text/text-store.ts";
import { clearUrlHash, setUrlHash } from "../../../utils/url/UrlHashUtils.ts";

export function useSyncHashWithHeader(
  /**
   * Ignore the first header to prevent unneeded scrolling on init:
   */
  firstHeaderId: string,
): void {
  const activeHeader = useTextStore((s) => s.activeHeader);

  useEffect(() => {
    if (!activeHeader || activeHeader === firstHeaderId) {
      clearUrlHash();
    } else {
      setUrlHash(activeHeader);
    }
  }, [activeHeader, firstHeaderId]);
}
