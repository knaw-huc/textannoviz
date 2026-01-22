import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation";

export type LetterAnno = AnnoRepoBodyBase & {
  datePublished: string;
  sender: string;
  recipient: string;
  fromLocation: string;
  title: string;
  dateSent: string;
  editor: string;
  publisher: string;

  toLocation: string; // why can't I remove this?
  url: string; // why can't I remove this?
  shelfmark: string; // why can't I remove this?
};

const page = "Page";
export const projectPageMarkerAnnotationTypes = [page];
