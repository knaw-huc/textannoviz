import get from "lodash/get";
import { normalizeClassname } from "../../../components/Text/Annotated/utils/createAnnotationClasses";
import {
  AnnoRepoAnnotation,
  AnnoRepoBody,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import { ViewLang } from "../../../model/Broccoli";

export type Artwork = {
  source: string[];
  corresp: string;
  id: string;
  idno?: string;
  head: ArtworkHead;
  date: ArtworkDate;
  relation?: ArtworkRelation;
  graphic: ArtworkGraphic;
  measure?: ArtworkMeasure[];
  note: ArtworkNote;
};

type ArtworkHead = Record<ViewLang, string>;

type ArtworkDate = {
  "tei:type": string;
  text: string;
};

type ArtworkRelation = {
  name: string;
  ref: ArtworkRelationRef;
  label?: string;
};

type ArtworkRelationRef = Person;

type ArtworkGraphic = {
  url: string;
  width: string;
  height: string;
};

type ArtworkMeasure = {
  commodity: string;
  unit: string;
  quantity: string;
};

type ArtworkNote = Record<ViewLang, Record<string, string>>;

export type Artworks = Artwork[];

export type Person = {
  id: string;
  sex: string;
  source?: string[];
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

export type Persons = Person[];

export type IsraelsTeiRsBody = AnnoRepoBodyBase & {
  type: string;
  "tei:type": string;
  ref: IsraelsTeiRsPersonRef | IsraelsTeiRsArtworkRef;
};

export type IsraelsTeiRsPersonRef = Persons;
export type IsraelsTeiRsArtworkRef = Artworks;

export type IsraelsEntityBody = IsraelsTeiRsBody;

export type ReferenceBody = AnnoRepoBodyBase & {
  target:
    | string
    | {
        id: string;
        label: string;
        title: {
          level: string;
          text: string;
        }[];
        text: string;
      }[];
  type: string;
};

export function isReferenceBody(
  toTest?: AnnoRepoBodyBase,
): toTest is ReferenceBody {
  if (!toTest) {
    return false;
  }
  const result = toTest.type === "Reference";
  console.log("Is reference?", toTest.type);
  return result;
}

export type IsraelsTeiHeadBody = AnnoRepoBodyBase & {
  metadata: {
    type: string;
    inFigure?: string;
    corresp: string;
    "tei:id": string;
    n: string;
  };
};

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
const teiHead = "Head";
const teiRs = "Entity";
const teiRef = "Reference";
const teiItem = "ListItem";
// TODO: what should this be?
// const teiLabel = "tei:Label";
const teiQuote = "Quote";

export const projectEntityTypes = [teiRs];
export const projectHighlightedTypes = [teiHi, teiHead, teiItem, teiQuote];
export const projectTooltipMarkerAnnotationTypes = ["tei:Ptr"];
export const projectPageMarkerAnnotationTypes = ["tf:Page"];

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

export const isPersonEntity = (
  toTest: Persons | Artworks,
): toTest is IsraelsTeiRsPersonRef => {
  return Array.isArray(toTest) && toTest.length > 0 && "persName" in toTest[0];
};

export const isArtworkEntity = (
  toTest: Persons | Artworks,
): toTest is IsraelsTeiRsArtworkRef => {
  return Array.isArray(toTest) && toTest.length > 0 && "graphic" in toTest[0];
};

export function getAnnotationCategory(annoRepoBody: AnnoRepoBody) {
  if (annoRepoBody.type === teiHi) {
    return get(annoRepoBody, "metadata.rend") ?? "unknown";
  } else if (annoRepoBody.type === teiHead) {
    return normalizeClassname(teiHead);
  } else if (annoRepoBody.type === teiRs) {
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
  } else if (annoRepoBody.type === teiHead) {
    const headBody = annoRepoBody as IsraelsTeiHeadBody;
    //There can be heads without a metadata block
    if (headBody.metadata?.inFigure?.length) {
      return "caption";
    } else {
      return normalizeClassname(teiHead);
    }
    // } else if (annoRepoBody.type === teiLabel) {
    //   return normalizeClassname(teiLabel);
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
