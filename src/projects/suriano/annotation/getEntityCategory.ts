import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";

export function getEntityCategory(annoRepoBody: AnnoRepoBody) {
  return _.get(annoRepoBody, "metadata.kind") ?? "unknown";
}
