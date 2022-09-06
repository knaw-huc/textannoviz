export const miradorConfig = {
    id: "mirador",
    window: {
        allowFullscreen: false,
        //highlightAllAnnotations: true, //this always highlights all annotations, handy for debugging
        forceDrawAnnotations: true, //this should be 'true' for 'selectAnnotation' to render the selected annotation. Without this, the selected annotation will not be rendered with the API call
        allowMaximize: false,
        hideWindowTitle: true
    },
    windows: [
        {
            loadedManifest: "",
            canvasId: "",
            id: "republic"
        },
    ],
    workspace: {
        showZoomControls: true,
    },
    workspaceControlPanel: {
        enabled: false,
    }
}