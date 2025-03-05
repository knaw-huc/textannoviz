import { MetadataTab } from "./MetadataTab";
import { MiradorTab } from "./MiradorTab";
import { TextComponentTab } from "./TextComponentTab";
import { WebAnnoTab } from "./WebAnnoTab";

export const TabRecipes = {
  facsTab: {
    title: "Facsimile",
    content: <MiradorTab />,
  },
  textTab: {
    title: "Text",
    content: <TextComponentTab />,
  },
  metadataTab: {
    title: "Metadata",
    content: <MetadataTab />,
  },
  webAnnoTab: {
    title: "Web annotations",
    content: <WebAnnoTab />,
  },
};
