import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import { ViewLang } from "../../../model/Broccoli";
import { isArray, isString } from "lodash";

export type ArtworkBody = AnnoRepoBodyBase & {
  type: "Entity";
  elementName: "rs";
  "tei:type": "artwork";
  "tei:ref": ArtworkTeiRef;
};
export type Artwork = ArtworkTeiRef;
type ArtworkTeiRef = {
  id: string;
  "tei:type": string;
  corresp: string;
  head: {
    nl: string;
    en: string;
  };
  date: {
    "tei:type": string;
    text: string;
  };
  relation: {
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
  type: "Entity";
  elementName: "rs";
  "tei:type": "person";
  "tei:ref": PersonTeiRef;
};
export type Person = PersonTeiRef;
export type PersonTeiRef = {
  id: string;
  gender: string;
  source: string[];
  persName: PersonPersName[];
  birth: PersonBirth;
  death: PersonDeath;
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

type PersonBirth = {
  when?: string;
  cert?: string;
};

type PersonDeath = PersonBirth & {
  notBefore?: string;
};

export type IsraelsEntityBody = PersonBody | ArtworkBody;

type LetterTarget = string;
type BibliographyTarget = {
  id: string;
  label: string;
  title: {
    level: string;
    text: string;
  }[];
  text: string;
}[];

export type ReferenceBody = LetterReferenceBody | BibliographyReferenceBody;
export const isReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is ReferenceBody => !!toTest && toTest.type === "Reference";

export type BibliographyReferenceBody = AnnoRepoBodyBase & {
  target: BibliographyTarget;
  type: "Reference";
};
export const isBibliographyReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is BibliographyReferenceBody =>
  isReference(toTest) && isArray(toTest.target);

export type LetterReferenceBody = AnnoRepoBodyBase & {
  target: LetterTarget;
  type: "Reference";
};
export const isLetterReference = (
  toTest?: AnnoRepoBodyBase,
): toTest is LetterReferenceBody =>
  isReference(toTest) && isString(toTest.target);

export type HeadBody = AnnoRepoBodyBase & {
  type: string;
  inFigure?: string;
  corresp: string;
  "tei:id": string;
  n: string;
};

export const isHeadBody = (toTest?: AnnoRepoBodyBase): toTest is HeadBody =>
  !!toTest && toTest.type === "Head";

export type LetterBody = AnnoRepoBodyBase & {
  type: string;
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
  title: Record<ViewLang, string>;
};

export function isLetterBody(toTest?: AnnoRepoBodyBase): toTest is LetterBody {
  if (!toTest) {
    return false;
  }
  return toTest.type === "Letter";
}

export function findLetterBody(
  annotations: AnnoRepoAnnotation[],
): LetterBody | undefined {
  const found = annotations.find((anno) => anno.body.type === "Letter");
  if (isLetterBody(found?.body)) {
    return found.body;
  }
}

// ["Dataset","Division","Document","Entity","Head","Highlight","Letter","Line","List","ListItem","Note","Page","Paragraph","Picture","Quote","Reference","Whitespace"]
const teiHi = "Highlight";
const head = "Head";
const entity = "Entity";
const teiRef = "Reference";
const teiItem = "ListItem";
// TODO: what should this be?
const teiLabel = "Label";
const teiQuote = "Quote";

export const projectEntityTypes = [entity];
export const projectHighlightedTypes = [teiHi, head, teiItem, teiQuote];
// TODO: use peenless equivalent
export const projectTooltipMarkerAnnotationTypes = ["tei:Ptr"];
export const projectPageMarkerAnnotationTypes = ["Page"];

// TODO: use peenless equivalent
export const projectInsertTextMarkerAnnotationTypes = [
  "tei:Space",
  "tei:Graphic",
  "tei:Head",
];

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is IsraelsEntityBody => {
  return projectEntityTypes.includes(toTest.type);
};

export const isPerson = (toTest: AnnoRepoBodyBase): toTest is PersonBody => {
  if (!isEntity(toTest)) {
    return false;
  }
  return toTest["tei:type"] === "person";
};

export const isArtwork = (toTest: AnnoRepoBodyBase): toTest is ArtworkBody => {
  if (!isEntity(toTest)) {
    return false;
  }
  return toTest["tei:type"] === "artwork";
};

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return get(annoRepoBody, "metadata.rend") ?? "unknown";
  } else if (annoRepoBody.type === head) {
    return normalizeClassname(head);
  } else if (annoRepoBody.type === entity) {
    return get(annoRepoBody, "tei:type") ?? "unknown";
  } else if (annoRepoBody.type === teiRef) {
    return normalizeClassname(teiRef);
  } else {
    return "unknown";
  }
}

export function getHighlightCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return get(annoRepoBody, "metadata.rend");
  } else if (isHeadBody(annoRepoBody)) {
    //There can be heads without a metadata block
    if (annoRepoBody.inFigure?.length) {
      return "caption";
    } else {
      return normalizeClassname(head);
    }
  } else if (annoRepoBody.type === teiLabel) {
    return normalizeClassname(teiLabel);
  } else if (annoRepoBody.type === teiItem) {
    return normalizeClassname(teiItem);
  } else if (annoRepoBody.type === teiQuote) {
    return normalizeClassname(teiQuote);
  } else {
    console.warn("Could not find highlight category", annoRepoBody);
    return "unknown";
  }
}

export const entityCategoryToAgg: Record<string, string> = {
  PER: "persons",
  ART: "artworks",
};
