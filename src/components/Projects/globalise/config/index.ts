import { ProjectConfig } from "../../../../model/ProjectConfig";

export const globaliseConfig: ProjectConfig = {
  id: "globalise",

  colours: {
    textregion: "white",
    textline: "DB4437",
    entity: "green",
  },

  relativeTo: "px:Page",
  annotationTypesToInclude: [
    "px:TextRegion, px:TextLine, tt:Paragraph, tt:Entity, px:Page",
  ],
  broccoliVersion: "v0",
  tier: ["documents", "openings"],
};
