import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";

export type LetterAnno = AnnoRepoBodyBase & {
  datePublished: string;
  sender: string;
  recipient: string;
  fromLocation: string;
  toLocation: string;
  url: string;
  shelfmark: string;
};

const page = "Page";
export const projectPageMarkerAnnotationTypes = [page];
