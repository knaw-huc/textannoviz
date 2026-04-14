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
    .filter((t) => t.source.includes(canvasId))
    .flatMap((t) => t.selector)
    .find((s): s is SvgSelector => s?.type === "SvgSelector");
  return svgSelector?.value;
}
