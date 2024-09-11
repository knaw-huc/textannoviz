import { MiradorConfig } from "../../model/MiradorConfig";

type Action = {
  annotationId: string;
  annotationJson: object;
  targetId: string;
  type: string;
};

/**
 * Configuration as required by the mirador viewer
 */
export const defaultMiradorConfig: MiradorConfig = {
  id: "mirador",
  theme: {
    palette: {
      annotations: {
        default: {
          strokeStyle: "yellow",
        },
        hovered: { strokeStyle: "yellow" },
        selected: { strokeStyle: "yellow" },
      },
    },
  },
  window: {
    allowClose: false,
    allowWindowSideBar: true,
    allowFullscreen: false,
    highlightAllAnnotations: false, //this set to 'true' will always highlight all annotations, handy for debugging
    forceDrawAnnotations: true, //this should be 'true' for 'selectAnnotation' to render the selected annotation. Without this, the selected annotation will not be rendered with the API call
    allowMaximize: false,
    hideWindowTitle: true,
    allowTopMenuButton: false,
  },
  windows: [
    {
      manifestId: "",
      canvasId: "",
      id: "",
    },
  ],
  workspace: {
    showZoomControls: true,
  },
  workspaceControlPanel: {
    enabled: false,
  },

  requests: {
    postprocessors: [
      (_url: string, action: Action) => {
        if (action.annotationId) {
          action.annotationJson = {};
        }
      },
    ],
  },
};
