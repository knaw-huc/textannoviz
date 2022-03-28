import { ACTIONS } from "../state/reducer"
import React from "react"
import mirador from "mirador"
import { appContext } from "../state/context"

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
            id: "republic"
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
    const { dispatch } = React.useContext(appContext);

    React.useEffect(() => {
        const viewer = mirador.viewer(miradorConfig, []);
        dispatch({
            type: ACTIONS.SET_STORE,
            store: viewer.store
        })
    }, [])

    return (
        <div id={miradorConfig.id} />
    )


}