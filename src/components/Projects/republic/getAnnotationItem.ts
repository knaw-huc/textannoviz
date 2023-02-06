import {
  AnnoRepoAnnotation,
  AttendantBody,
  ResolutionBody,
  SessionBody,
} from "../../../model/AnnoRepoAnnotation";
import { republicConfig } from "./config/index";

export const getAnnotationItem = (annotation: AnnoRepoAnnotation) => {
  switch (annotation.body.type) {
    case republicConfig.bodyType[0]:
      return (
        (annotation.body as SessionBody).metadata.sessionWeekday +
        ", " +
        `${(annotation.body as SessionBody).metadata.sessionDate}`
      );
    case republicConfig.bodyType[1]:
      return (
        (annotation.body as ResolutionBody).metadata.propositionType +
        " (" +
        `${annotation.body.type}` +
        ")"
      );
    case republicConfig.bodyType[2]:
      return (
        (annotation.body as AttendantBody).metadata.delegateName +
        " (" +
        `${annotation.body.type}` +
        ")"
      );
    default:
      return annotation.body.type;
  }
};