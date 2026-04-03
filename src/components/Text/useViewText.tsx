import React from "react";
import { useTextStore } from "../../stores/text/text-store.ts";
import {
  BroccoliTextGeneric,
  ViewLang,
  Broccoli,
} from "../../model/Broccoli.ts";

export function useViewText(
  viewsToRender: string | string[],
): BroccoliTextGeneric | undefined {
  const textViews = useTextStore((state) => state.views);
  return React.useMemo(() => {
    const viewsToTry = Array.isArray(viewsToRender)
      ? viewsToRender
      : [viewsToRender];

    for (const viewStr of viewsToTry) {
      const [view, lang] = viewStr.split(".") as [
        keyof Broccoli["views"],
        ViewLang,
      ];

      const candidate = textViews?.[view];
      if (!candidate) {
        continue;
      }

      if (typeof candidate === "object" && lang in candidate) {
        return (candidate as Record<string, BroccoliTextGeneric>)[lang];
      }
    }
    return undefined;
  }, [textViews, viewsToRender]);
}
