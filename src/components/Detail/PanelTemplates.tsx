import { Annotation } from "../Annotations/Annotation";
import { Mirador } from "../Mirador/Mirador";

export const PanelTemplates = {
  facsPanel: {
    content: <Mirador />,
  },
  metadataPanel: {
    content: <Annotation isLoading={false} />,
  },
};
