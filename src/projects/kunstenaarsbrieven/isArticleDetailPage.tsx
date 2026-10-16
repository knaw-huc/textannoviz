import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { article } from "./annotation/ProjectAnnotationModel.ts";

export function isArticleDetailPage(
  annotations: AnnoRepoAnnotation[],
): boolean {
  return annotations.some((a) => a.body.type === article);
}
