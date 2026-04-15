import { Annotation } from "../Annotations/Annotation";
import { FacsimileViewer } from "../Facsimile/FacsimileViewer";

export const PanelTemplates = {
  facsPanel: {
    content: <FacsimileViewer />,
  },
  metadataPanel: {
    content: <Annotation isLoading={false} />,
  },
};
