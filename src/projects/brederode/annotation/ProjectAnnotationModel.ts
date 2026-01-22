import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";

export type LetterAnnoBody = AnnoRepoBodyBase & {
  datePublished: string;
  sender: string;
  recipient: string;
  fromLocation: string;
  toLocation: string;
  url: string;
  shelfmark: string;
  title: string;
};

const page = "Page";
export const projectPageMarkerAnnotationTypes = [page];
