import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import {
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import { ViewLang } from "../../../model/Broccoli";

/**
 * Oratie specific document body:
 */
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

/**
 * Annotation, element and tei type names
 * Note: duplicated from kunstenaarsbrieven
 * TODO: move to projects/common?
 */

export const caption = "Caption";
export const document = "Document";
export const elementRs = "rs";
export const elementPtr = "ptr";
export const entity = "Entity";
export const head = "Head";
export const highlight = "Highlight";
export const label = "Label";
export const letter = "Letter";
export const listItem = "ListItem";
export const note = "Note";
export const page = "Page";
export const person = "person";
export const picture = "Picture";
export const quote = "Quote";
export const reference = "Reference";
export const teiArt = "art";
export const teiArtwork = "artwork";
export const teiIll = "ill";
export const unknown = "unknown";

export type ArtworkBody = AnnoRepoBodyBase & {
  type: typeof entity;
  elementName: typeof elementRs;
  "tei:type": typeof teiArtwork;
  "tei:ref": ArtworkTeiRef;
};

type ArtworkTeiRef = {
  id: string;
  // TODO: check if source truely exists in peenless:
  source: string[];
  "tei:type": typeof teiIll | typeof teiArt;
  corresp: string;
  head: {
    nl: string;
    en: string;
  };
  date: {
    "tei:type": string;
    text: string;
  };
  relation?: {
    name: string;
    ref: {
      id: string;
      gender: string;
      source: string[];
      persName: Array<{
        full: string;
        forename: string;
        nameLink: string;
        surname: string[];
      }>;
      birth: {
        when: string;
      };
      death: {
        when: string;
      };
      displayLabel: string;
      sortLabel: string;
    };
  };
  graphic: {
    url: string;
    width: number;
    height: number;
  };
  measure: {
    commodity: string;
    unit: string;
    quantity: string;
  }[];
  note: {
    nl: {
      technical: string;
      creditline: string;
      collection: string;
    };
    en: {
      technical: string;
      creditline: string;
      collection: string;
    };
  };
};

export type PersonBody = AnnoRepoBodyBase & {
  type: typeof entity;
  elementName: typeof elementRs;
  "tei:type": typeof person;
  "tei:ref": PersonTeiRef;
};
export type PersonTeiRef = {
  id: string;
  gender: string;
  source: string[];
  persName: PersonPersName[];
  birth?: PersonLifespan;
  death?: PersonLifespan; //There are living persons in the data, so made this optional
  displayLabel: string;
  sortLabel: string;
  note?: Record<ViewLang, Record<string, string>>;
};

type PersonPersName = {
  full: string;
  forename: string;
  addName?: string;
  surname: string[] | { type: string; text: string };
  nameLink?: string;
};

export type PersonLifespan = {
  when?: string;
  cert?: string;
  notBefore?: string;
  notAfter?: string;
};

export type IsraelsEntityBody = PersonBody | ArtworkBody;

export type LetterBody = AnnoRepoBodyBase & {
  type: typeof letter;
  correspondent: string;
  sender: string;
  n: string;
  institution: string;
  letterid: string;
  location: string;
  identifier: string;
  period: string;
  periodlong: string;
  prevLetter: string;
  nextLetter: string;
  titles: Record<ViewLang, string>;
  title: string;
  recipient: string;
};

export const projectEntityTypes = [entity, reference];
export const projectHighlightedTypes = [
  highlight,
  head,
  listItem,
  quote,
  caption,
];
export const projectPageMarkerAnnotationTypes = [page];

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is IsraelsEntityBody => {
  return projectEntityTypes.includes(toTest.type);
};

export const isArtwork = (toTest: AnnoRepoBodyBase): toTest is ArtworkBody => {
  if (!isEntity(toTest)) {
    return false;
  }
  return toTest["tei:type"] === teiArtwork;
};

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if ([head, reference, caption].includes(annoRepoBody.type)) {
    return normalizeClassname(annoRepoBody.type);
  } else if (annoRepoBody.type === highlight) {
    return get(annoRepoBody, "metadata.rend") ?? unknown;
  } else if (annoRepoBody.type === entity) {
    return get(annoRepoBody, "tei:type") ?? unknown;
  } else {
    console.warn("Could not find annotation category:", annoRepoBody);
    return unknown;
  }
}

export function getHighlightCategory(annoRepoBody: AnnoRepoBody) {
  if ([head, caption, label, listItem, quote].includes(annoRepoBody.type)) {
    return normalizeClassname(annoRepoBody.type);
  } else if (annoRepoBody.type === highlight) {
    return get(annoRepoBody, "metadata.rend");
  } else {
    console.warn("Could not find highlight category:", annoRepoBody);
    return unknown;
  }
}
