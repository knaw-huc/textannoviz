import {
  AnnoRepoAnnotation,
  XPathSelectorTarget,
} from "../model/AnnoRepoAnnotation";

export function findXPathSelector(
  annotation: AnnoRepoAnnotation,
): string | undefined {
  const targets = (annotation.target ?? []) as XPathSelectorTarget[];
  return targets.find(isXPathSelectorTarget)?.selector.value;
}

function isXPathSelectorTarget(target: unknown): target is XPathSelectorTarget {
  return (
    typeof target === "object" &&
    target !== null &&
    (target as XPathSelectorTarget).selector?.type === "XPathSelector"
  );
}
