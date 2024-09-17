import {
  AnnoRepoBodyBase,
  EntityDetail,
} from "../../../model/AnnoRepoAnnotation.ts";

export const projectEntityTypes = ["tf:Ent"];
export const projectFootnoteMarkerAnnotationTypes = ["tei:Ptr"];
export const projectPageMarkerAnnotationTypes = ["tf:Page"];

export type ProjectEntityBody = AnnoRepoBodyBase & {
  type: "tf:Ent";
  metadata: {
    details: EntityDetail[];
    n: string;
  };
};

export function isEntity(
  toTest: AnnoRepoBodyBase,
): toTest is ProjectEntityBody {
  return projectEntityTypes.includes(toTest.type);
}
