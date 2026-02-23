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

export type DocumentAnnoBody = AnnoRepoBodyBase & {
  datePublished: string;
  title: string;
  author: string;
  publisher: string;
  location: string;
};

const page = "Page";
export const projectPageMarkerAnnotationTypes = [page];
