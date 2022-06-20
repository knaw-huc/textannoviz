import { ACTIONS } from "../state/actions"
import React from "react"
import mirador from "mirador"
import { appContext } from "../state/context"
import Elucidate from "../backend/Elucidate"
import TextRepo from "../backend/TextRepo"
import getVersionId from "../backend/utils/getVersionId"
import findSelectorTarget from "../backend/utils/findSelectorTarget"
import annotationPlugins from "mirador-annotations/es"
import LocalStorageAdapter from "mirador-annotations/es/LocalStorageAdapter"
import getBodyValue from "../backend/utils/getBodyValue"
import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import findImageRegions from "../backend/utils/findImageRegions"
//import { FetchData } from "../backend/utils/fetchData"
import annotation from "../data/annotation.json"

export const miradorConfig = {
    annotation: {
        adapter: (canvasId: never) => new LocalStorageAdapter(`localStorage://?canvasId=${canvasId}`),
        exportLocalStorageAnnotations: false,
    },
    id: "mirador",
    window: {
        allowFullscreen: false,
        // highlightAllAnnotations: true, //this always highlights all annotations, handy for debugging
        forceDrawAnnotations: true, //this should be 'true' for 'selectAnnotation' to render the selected annotation. Without this, the selected annotation will not be rendered with the API call
    },
    windows: [
        {
            loadedManifest: "https://images.diginfra.net/api/pim/imageset/67533019-4ca0-4b08-b87e-fd5590e7a077/manifest",
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
            const jpg = await fetch(currentState.windows.republic.canvasId)
                .then(response => {
                    return response.json()
                })
                .then(data => {
                    return data.label
                })
            //console.log(jpg)
            const ann = await Elucidate.getByJpg(jpg)
            const versionId = getVersionId(ann[0].id)

            const scanPage: ElucidateAnnotation[] = ann.filter(item => {
                return getBodyValue(item) === "scanpage"
            })
            // const annFiltered: ElucidateAnnotation[] = ann.filter(item => {
            //     return getBodyValue(item) != "line" && getBodyValue(item) != "column"
            // })

            const annFiltered: ElucidateAnnotation[] = ann.filter(item => {
                return getBodyValue(item) != "line" && getBodyValue(item) != "column" && getBodyValue(item) != "textregion" && getBodyValue(item) != "scanpage"
            }) //expanded filter to remove 'noise' in visualizing annotations in Mirador

            const selectorTarget = findSelectorTarget(scanPage[0])
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

            const regions = annFiltered.flatMap((item: ElucidateAnnotation) => {
                const region = findImageRegions(item)
                return region
            })
    
            const resources = regions.flatMap((region: string, i: number) => {
                const [x, y, w, h] = region.split(",")
                // console.log(split)
                let colour = ""
                
                switch (getBodyValue(annFiltered[i])) {
                case "resolution":
                    colour = "green"
                    break
                case "attendant":
                    colour = "red"
                    break
                default:
                    colour = "white"
                }
    
                const resources = [{
                    "@id": `${annFiltered[i].id}`,
                    "@type": "oa:Annotation",
                    "motivation": [
                        "oa:commenting", "oa:Tagging"
                    ],
                    "on": [{
                        "@type": "oa:SpecificResource",
                        "full": `${currentState.windows.republic.canvasId}`,
                        "selector": {
                            "@type": "oa:Choice",
                            "default": {
                                "@type": "oa:FragmentSelector",
                                "value": `xywh=${x},${y},${w},${h}`
                            },
                            "item": {
                                "@type": "oa:SvgSelector",
                                "value": `<svg xmlns='http://www.w3.org/2000/svg'><path xmlns="http://www.w3.org/2000/svg" id="testing" d="M${x},${parseInt(y) + parseInt(h)}v-${h}h${w}v${h}z" stroke="${colour}" fill="transparent" stroke-width="1"/></svg>`
                            }
                        },
                        "within": {
                            "@id": "https://images.diginfra.net/api/pim/imageset/67533019-4ca0-4b08-b87e-fd5590e7a077/manifest",
                            "@type": "sc:Manifest"
                        }
                    }],
                    "resource": [{
                        "@type": "dctypes:Text",
                        "format": "text/html",
                        "chars": `${getBodyValue(annFiltered[i])}`
                    }, {
                        "@type": "oa:Tag",
                        "format": "text/html",
                        "chars": `${getBodyValue(annFiltered[i])}`
                    }]
                }]
            
                return resources
            })
     
            annotation.resources.push(...resources)
            
            console.log(viewer.store.dispatch(mirador.actions.receiveAnnotation(`${currentState.windows.republic.canvasId}`, "annotation", annotation)))

            dispatch({
                type: ACTIONS.SET_MIRANN,
                MirAnn: annotation
            })
        }
        fetchData()
            .catch(console.error)

    }, [])

    return (
        <div id={miradorConfig.id} />
    )
}