import {
  AnnoRepoAnnotation,
  CanvasTarget,
  ImageApiSelector,
} from "../model/AnnoRepoAnnotation";

const imageRegionRegex = /[0-9]+.*[0-9]+.*[0-9]+.*[0-9]+/i;

export function findImageRegions(
  annotation: AnnoRepoAnnotation,
  canvasId: string,
): RegExpMatchArray | null {
  const target = annotation.target as CanvasTarget[];
  const imageCoords = target
    .filter((t) => t.source.includes(canvasId))
    .flatMap(
      (t) =>
        t.selector &&
        t.selector.filter((t) => t.type === "iiif:ImageApiSelector"),
    );

  if (imageCoords[0] === undefined) {
    console.log(annotation.body.id + " has no image targets");
    return null;
  }

  const selector = imageCoords[0] as ImageApiSelector;
  return selector.region.match(imageRegionRegex);
}
