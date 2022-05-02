import { ACTIONS } from "../state/actions"
import React from "react"
import mirador from "mirador"
import { appContext } from "../state/context"
import Elucidate from "../backend/Elucidate"
import TextRepo from "../backend/TextRepo"
import getVersionId from "../backend/utils/getVersionId"
import findSelectorTarget from "../backend/utils/findSelectorTarget"
import annotationPlugins from 'mirador-annotations/es'
import LocalStorageAdapter from 'mirador-annotations/es/LocalStorageAdapter'
import getBodyValue from '../backend/utils/getBodyValue'
import { ElucidateAnnotation } from "../model/ElucidateAnnotation"

export const miradorConfig = {
    annotation: {
        adapter: (canvasId: any) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
        exportLocalStorageAnnotations: false,
    },
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
        const viewer = mirador.viewer(miradorConfig, [...annotationPlugins])
        dispatch({
            type: ACTIONS.SET_STORE,
            store: viewer.store
        })

        const currentState = viewer.store.getState()
        const fetchData = async () => {
            const response = await fetch(currentState.windows.republic.canvasId)
            const data = await response.json()
            const jpg = data.label
            const ann = await Elucidate.getByJpg(jpg)
            const versionId = getVersionId(ann[0].id)
    
            const scanPageFiltered: ElucidateAnnotation[] = []
            const annFiltered: ElucidateAnnotation[] = []
            ann.map((item: ElucidateAnnotation) => {
                if (getBodyValue(item) === 'scanpage') {
                    scanPageFiltered.push(item)
                }
                if (getBodyValue(item) != 'line' && 'column') {
                    annFiltered.push(item)
                }
            })
    
            const selectorTarget = findSelectorTarget(scanPageFiltered[0])
            const beginRange = selectorTarget.selector.start
            const endRange = selectorTarget.selector.end
            const text = await TextRepo.getByVersionIdAndRange(versionId, beginRange, endRange)
            
            dispatch({
                type: ACTIONS.SET_ANNO,
                anno: annFiltered
            })

            dispatch({
                type: ACTIONS.SET_TEXT,
                text: text
            })
        }
        fetchData()
            .catch(console.error)

    }, [])

    return (
        <div id={miradorConfig.id} />
    )
}