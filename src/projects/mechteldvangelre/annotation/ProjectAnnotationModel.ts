import {
  AnnoRepoAnnotation,
  AnnoRepoBodyBase,
} from "../../../model/AnnoRepoAnnotation";
import {
  BroccoliViews,
  ViewLang,
  BroccoliTextGeneric,
} from "../../../model/Broccoli";
import {
  elementRs,
  entity,
  letter,
  LetterBody,
} from "../../kunstenaarsbrieven/annotation/ProjectAnnotationModel";

export type MechteldVanGelreTextViews = BroccoliViews & {
  text: Record<ViewLang, BroccoliTextGeneric>;
  textNotes: Record<ViewLang, Record<string, BroccoliTextGeneric>>;
  regest?: Record<ViewLang, BroccoliTextGeneric>;
  publication?: Record<ViewLang, BroccoliTextGeneric>;
  seclit?: Record<ViewLang, BroccoliTextGeneric>;
  transcrSource?: Record<ViewLang, BroccoliTextGeneric>;
};

export type LocationBody = AnnoRepoBodyBase & {
  type: typeof entity;
  elementName: typeof elementRs;
  "tei:type": "location";
  "tei:ref": LocationTeiRef;
};

export type MechteldLocation = LocationTeiRef;

type LocationBase = {
  id: string;
  graphic: { url: string };
  desc?: string;
};

export type LocationSettlement = LocationBase & {
  "tei:type": "settlement";
  settlement: string;
  region: string[];
  source: string[];
  corresp?: string;
};

export type LocationBuilding = LocationBase & {
  "tei:type": "building";
  objectName: string;
  region: string[];
  source: string[];
  settlement?: string;
  corresp?: string;
};

export type LocationTerritory = LocationBase & {
  "tei:type": "territory" | "subterritory";
  region: string[];
};

export type LocationRiver = LocationBase & {
  "tei:type": "river";
  geogName: string;
};

export type LocationTeiRef =
  | LocationSettlement
  | LocationBuilding
  | LocationTerritory
  | LocationRiver;

export type MechteldLetterBody = LetterBody & {
  material: string;
  watermark: string;
  measure: string[];
  seal: string;
};

export function isMechteldLetterBody(
  toTest?: AnnoRepoBodyBase,
): toTest is MechteldLetterBody {
  return !!toTest && toTest.type === letter;
}

export function findMechteldLetterBody(
  annotations: AnnoRepoAnnotation[],
): MechteldLetterBody | undefined {
  const found = annotations.find((anno) => anno.body.type === letter);
  if (isMechteldLetterBody(found?.body)) {
    return found.body;
  }
}
