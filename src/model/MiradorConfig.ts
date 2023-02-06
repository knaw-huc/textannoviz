export interface MiradorConfig {
  id: string;
  window: {
    allowFullscreen: boolean;
    highlightAllAnnotations: boolean;
    forceDrawAnnotations: boolean;
    allowMaximize: boolean;
    hideWindowTitle: boolean;
  };
  windows: [
    {
      loadedManifest: string;
      canvasId: string;
      id: string;
    }
  ];
  workspace: {
    showZoomControls: boolean;
  };
  workspaceControlPanel: {
    enabled: boolean;
  };
}