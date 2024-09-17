import { AnnoRepoBody } from "../../../model/AnnoRepoAnnotation.ts";
import _ from "lodash";

export function getEntityCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === "DateOccurrence") {
    return "DAT";
  }
  return _.get(annoRepoBody, "metadata.category") ?? "unknown";
}
