import LocalStorageAdapter from "mirador-annotations/es/LocalStorageAdapter"

export const miradorConfig = {
    annotation: {
        adapter: (canvasId: never) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
        exportLocalStorageAnnotations: false,
    },
    id: "mirador",
    window: {
        allowFullscreen: false,
        //highlightAllAnnotations: true, //this always highlights all annotations, handy for debugging
        forceDrawAnnotations: true, //this should be 'true' for 'selectAnnotation' to render the selected annotation. Without this, the selected annotation will not be rendered with the API call
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