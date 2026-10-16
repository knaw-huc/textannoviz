import React from "react";
import { useTextStore } from "../../stores/text/text-store.ts";
import { BroccoliTextGeneric } from "../../model/Broccoli.ts";
import { findViewText } from "./findViewText.ts";

export function useViewText(
  viewsToRender: string | string[],
): BroccoliTextGeneric | undefined {
  const textViews = useTextStore((state) => state.views);
  return React.useMemo(
    () => findViewText(textViews, viewsToRender),
    [textViews, viewsToRender],
  );
}
