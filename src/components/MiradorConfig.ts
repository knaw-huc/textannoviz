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
            canvasId: "https://images.diginfra.net/api/pim/iiif/67533019-4ca0-4b08-b87e-fd5590e7a077/canvas/75718d0a-5441-41fe-94c1-db773e0848e7",
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