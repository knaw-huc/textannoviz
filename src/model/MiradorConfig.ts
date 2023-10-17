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
      loadedManifest: string;
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
};
