import { Annotation } from "../Annotations/Annotation";
import { Mirador } from "../Mirador/Mirador";
import { TextComponentTab } from "./TextComponentTab";

export const PanelTemplates = {
  facsPanel: {
    content: <Mirador />,
  },
  origTextPanel: {
    content: <TextComponentTab viewToRender="text.nl" />,
  },
  transTextPanel: {
    content: <TextComponentTab viewToRender="text.en" />,
  },
  metadataPanel: {
    content: <Annotation isLoading={false} />,
  },
};
