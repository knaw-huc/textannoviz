import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation.ts";
import { letter } from "./annotation/ProjectAnnotationModel.ts";

export function isLetterDetailPage(annotations: AnnoRepoAnnotation[]): boolean {
  return annotations.some((a) => a.body.type === letter);
}
