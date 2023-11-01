import { MiradorConfig } from "../../model/MiradorConfig";

/**
 * Configuration as required by the mirador viewer
 */
export const defaultMiradorConfig: MiradorConfig = {
  id: "mirador",
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
};
