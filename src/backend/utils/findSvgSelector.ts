import {
  AnnoRepoAnnotation,
  CanvasTarget,
  SvgSelector,
} from "../../model/AnnoRepoAnnotation";

export const findSvgSelector = (
  annotation: AnnoRepoAnnotation,
  canvasId: string
): string => {
  const canvasTargets = annotation.target as CanvasTarget[];
  const filteredCanvasTargets = canvasTargets.filter((t) =>
    t.source.includes(canvasId)
  );
  const svgSelectors = filteredCanvasTargets
    .flatMap((t) => t.selector)
    .filter((t) => t.type === "SvgSelector");

  return (svgSelectors[0] as SvgSelector).value;
};
