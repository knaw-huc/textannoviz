import { Mirador } from "../Mirador/Mirador";
import { MetadataTab } from "./MetadataTab";
import { TextComponentTab } from "./TextComponentTab";

export const PanelTemplates = {
  facsPanel: {
    title: "Facsimile",
    content: <Mirador />,
  },
  origTextPanel: {
    title: "Original text",
    content: <TextComponentTab viewToRender="textOrig" />,
  },
  transTextPanel: {
    title: "Translated text",
    content: <TextComponentTab viewToRender="textTrans" />,
  },
  metadataPanel: {
    title: "Metadata panel",
    content: <MetadataTab />,
  },
};
