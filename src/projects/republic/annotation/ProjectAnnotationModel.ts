import { AnnoRepoBodyBase } from "../../../model/AnnoRepoAnnotation.ts";

export const projectEntityTypes = ["Entity", "DateOccurrence"];

export type ProjectEntityBody = AnnoRepoBodyBase & {
  type: "Entity" | "DateOccurrence";
  text: string;
  metadata: {
    entityId: string;
    entityLabels: string[];
    inventoryNum: string;
    name: string;
  };
};

export const isEntity = (
  toTest: AnnoRepoBodyBase,
): toTest is ProjectEntityBody => {
  return projectEntityTypes.includes(toTest.type);
};
