import { ACTIONS } from "../state/actions"
import React from "react"
import mirador from "mirador"
import { appContext } from "../state/context"
import Elucidate from "../backend/Elucidate"

export const miradorConfig = {
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
    workspaceControlPanel: {
        enabled: false,
    }
}

export function Mirador() {
    const { dispatch } = React.useContext(appContext)

    React.useEffect(() => {
        const viewer = mirador.viewer(miradorConfig, [])
        dispatch({
            type: ACTIONS.SET_STORE,
            store: viewer.store
        })

        const currentState = viewer.store.getState()
        const fetchData = async () => {
            const response = await fetch(currentState.windows.republic.canvasId)
            const data = await response.json()
            const jpg = data.label
            console.log(jpg)
            dispatch({
                type: ACTIONS.SET_ANNO,
                anno: await Elucidate.getByJpg(jpg)
            })
        }
        fetchData()
            .catch(console.error)

        // haal hier huidige state van store op en setjpg?
        // dan in annotation.tsx een react.useeffect in main body waarin direct de anno's worden opgehaald en naar een anno state in de context worden gepushed

    }, [])

    return (
        <div id={miradorConfig.id} />
    )
}
