import {
  AnnoRepoAnnotation,
  CanvasTarget,
  SvgSelector,
} from "../model/AnnoRepoAnnotation";

export function findSvgSelector(
  annotation: AnnoRepoAnnotation,
  canvasId: string,
): string | undefined {
  const canvasTargets = annotation.target as CanvasTarget[];
  const svgSelector = canvasTargets
    .filter((t) => isCanvasTarget(t) && t.source.includes(canvasId))
    .flatMap((t) => t.selector)
    .find((s): s is SvgSelector => s?.type === "SvgSelector");
  return svgSelector?.value;
}

function isCanvasTarget(target: unknown): target is CanvasTarget {
  return (
    typeof target === "object" &&
    target !== null &&
    "source" in target &&
    "selector" in target
  );
}
