import { ACTIONS } from "../state/actions"
import React from "react"
import mirador from "mirador"
import { appContext } from "../state/context"
import Elucidate from "../backend/Elucidate"
import TextRepo from "../backend/TextRepo"
import getVersionId from "../backend/utils/getVersionId"
import findSelectorTarget from "../backend/utils/findSelectorTarget"

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
            const ann = await Elucidate.getByJpg(jpg)
            dispatch({
                type: ACTIONS.SET_ANNO,
                anno: ann
            })

            const versionId = getVersionId(ann[0].id)
            console.log(versionId)
    
            const scanPageFiltered: any[] = []
            ann.map((item: any) => {
                if (item.body.value === 'scanpage') {
                    scanPageFiltered.push(item)
                }
            })
            console.log(scanPageFiltered)
    
            const selectorTarget = findSelectorTarget(scanPageFiltered[0])
            
            const beginRange = selectorTarget.selector.start
            const endRange = selectorTarget.selector.end
            console.log(beginRange)
            console.log(endRange)
            const text = await TextRepo.getByVersionIdAndRange(versionId, beginRange, endRange)
            
            dispatch({
                type: ACTIONS.SET_TEXT,
                text: text
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
