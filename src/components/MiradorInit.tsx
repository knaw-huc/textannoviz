import React from "react"
import mirador from "mirador"

const miradorConfig = {
    id: 'mirador',
    window: {
        allowFullscreen: false,
        highlightAllAnnotations: true,
        forceDrawAnnotations: true,
    },
    windows: [
        {
            loadedManifest: "https://images.diginfra.net/api/pim/imageset/67533019-4ca0-4b08-b87e-fd5590e7a077/manifest",
            canvasId: "https://images.diginfra.net/api/pim/iiif/67533019-4ca0-4b08-b87e-fd5590e7a077/canvas/75718d0a-5441-41fe-94c1-db773e0848e7",
            id: "test",
        },
    ],
    thumbnailNavigation: {
        defaultPosition: 'far-bottom',
    },
    workspaceControlPanel: {
        enabled: false,
    }
}

export function Mirador() {
    React.useEffect(() => {
        mirador.viewer(miradorConfig, [])
    }, [])

    return (
        <div id={miradorConfig.id} />
    )
}
