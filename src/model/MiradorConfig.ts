/**
 * Config as required by the mirador viewer
 */
export type MiradorConfig = {
  id: string;
  window: {
    allowClose: boolean;
    allowWindowSideBar: boolean;
    allowFullscreen: boolean;
    highlightAllAnnotations: boolean;
    forceDrawAnnotations: boolean;
    allowMaximize: boolean;
    hideWindowTitle: boolean;
    allowTopMenuButton: boolean;
  };
  windows: [
    {
      imageToolsEnabled: boolean;
      imageToolsOpen: boolean;
      manifestId: string;
      canvasId: string;
      id: string;
    },
  ];
  workspace: {
    showZoomControls: boolean;
  };
  workspaceControlPanel: {
    enabled: boolean;
  };

  requests: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    postprocessors: any;
  };
};
