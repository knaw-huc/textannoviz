import {
  Broccoli,
  BroccoliTextGeneric,
  ViewLang,
} from "../../model/Broccoli.ts";

export type TextViews = Broccoli["views"] | undefined;

/**
 * Resolve view spec(s) like "text" or "text.nl" to their text.
 * Tries each spec in order, returning the first that exists.
 *
 * Kept free of store and window access so it can be used outside a component.
 */
export function findViewText(
  textViews: TextViews,
  viewsToRender: string | string[],
): BroccoliTextGeneric | undefined {
  const viewsToTry = Array.isArray(viewsToRender)
    ? viewsToRender
    : [viewsToRender];

  for (const viewStr of viewsToTry) {
    const [view, lang] = viewStr.split(".") as [
      keyof Broccoli["views"],
      ViewLang,
    ];

    const candidate = textViews?.[view];
    if (!candidate) continue;

    if (!lang) {
      return candidate as BroccoliTextGeneric;
    }

    if (typeof candidate === "object" && lang in candidate) {
      return (candidate as unknown as Record<string, BroccoliTextGeneric>)[
        lang
      ];
    }
  }

  return undefined;
}
