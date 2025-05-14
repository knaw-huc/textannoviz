import { Annotation } from "../Annotations/Annotation";
import { Mirador } from "../Mirador/Mirador";
import { TextComponentTab } from "./TextComponentTab";

export const PanelTemplates = {
  facsPanel: {
    content: <Mirador />,
  },
  origTextPanel: {
    content: <TextComponentTab viewToRender="textOrig" />,
  },
  transTextPanel: {
    content: <TextComponentTab viewToRender="textTrans" />,
  },
  metadataPanel: {
    content: <Annotation isLoading={false} />,
  },
};
