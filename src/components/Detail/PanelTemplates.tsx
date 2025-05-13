import { Annotation } from "../Annotations/Annotation";
import { Mirador } from "../Mirador/Mirador";
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
    content: <Annotation isLoading={false} />,
  },
};
