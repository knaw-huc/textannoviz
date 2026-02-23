import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";

export type DocumentAnnoBody = AnnoRepoBodyBase & {
  datePublished: string;
  title: string;
  author: string;
  publisher: string;
  location: string;
};

export function isDocumentBody(
  toTest?: AnnoRepoBodyBase,
): toTest is DocumentAnnoBody {
  if (!toTest) {
    return false;
  }
  return toTest.type === "Document";
}

const page = "Page";
export const projectPageMarkerAnnotationTypes = [page];
