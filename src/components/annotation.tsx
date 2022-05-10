import React, { useContext } from "react"
import { appContext } from "../state/context"
import mirador from "mirador"
import Elucidate from "../backend/Elucidate"
import { ACTIONS } from "../state/actions"
import getVersionId from "../backend/utils/getVersionId"
import findSelectorTarget from "../backend/utils/findSelectorTarget"
import TextRepo from "../backend/TextRepo"
import getBodyValue from "../backend/utils/getBodyValue"
import { ElucidateAnnotation, ElucidateTarget } from "../model/ElucidateAnnotation"
//import {FetchData} from "../backend/utils/fetchData"
import findImageRegions from "../backend/utils/findImageRegions"

export function Annotation() {
    const { state, dispatch } = useContext(appContext)

    const fetchData = async () => {
        const currentState = state.store.getState()
        console.log(currentState)
        fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(async data => {
                const jpg = data.label
                const ann = await Elucidate.getByJpg(jpg)
                if (ann[0]) {
                    const versionId = getVersionId(ann[0].id)

                    const scanPage: ElucidateAnnotation[] = ann.filter(item => {
                        return getBodyValue(item) === "scanpage"
                    })
                    const annFiltered: ElucidateAnnotation[] = ann.filter(item => {
                        return getBodyValue(item) != "line" && "column"
                    })

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
                } else {
                    return
                }
            })
    }

    const nextCanvas = () => {
        state.store.dispatch(mirador.actions.setNextCanvas("republic"))
        fetchData()
            .catch(console.error)
    }

    const previousCanvas = () => {
        state.store.dispatch(mirador.actions.setPreviousCanvas("republic"))
        fetchData()
            .catch(console.error)
    }

    const testFunction = async () => {
        const currentState = state.store.getState()
        console.log(currentState)
        const target = state.anno[0].target as ElucidateTarget[]
        const [x, y, w, h] = findImageRegions(target)
        console.log(x, y, w, h)

        const json = {
            "@id": "https://images.diginfra.net/api/annotation/getTextAnnotations?uri=https%3A%2F%2Fimages.diginfra.net%2Fiiif%2FNL-HaNA_1.01.02%2F3783%2FNL-HaNA_1.01.02_3783_0286.jpg",
            "@context": "http://iiif.io/api/presentation/2/context.json",
            "@type": "sc:AnnotationList",
            "resources": [{
                "@id": "test",
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
                            "value": `<svg xmlns='http://www.w3.org/2000/svg'><path xmlns="http://www.w3.org/2000/svg" id="testing" d="M${x},${y+h}v-${h}h${w}v${h}z" stroke="red" fill="transparent" stroke-width="1"/></svg>`
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
                    "chars": "testing"
                }, {
                    "@type": "oa:Tag",
                    "format": "text/html",
                    "chars": "testing"
                }]
            }]
        }

        console.log(json)

        state.store.dispatch(mirador.actions.receiveAnnotation(`${currentState.windows.republic.canvasId}`, "testing", json))

        // const boxToZoom = {
        //     x: x,
        //     y: y,
        //     width: w,
        //     height: h
        // }

        // const zoomCenter = {
        //     x: boxToZoom.x + boxToZoom.width / 2,
        //     y: boxToZoom.y + boxToZoom.height / 2
        // }

        // const zoomAction = mirador.actions.updateViewport("republic", {
        //     x: zoomCenter.x,
        //     y: zoomCenter.y,
        //     zoom: 1 / boxToZoom.width
        // })
        // state.store.dispatch(zoomAction)

    }

    return (
        <>
            <button onClick={nextCanvas}>Next canvas</button>
            <button onClick={previousCanvas}>Previous canvas</button>
            <button onClick={testFunction}>Test button</button>
            <ol>
                {
                    state.anno ? state.anno.map((item: ElucidateAnnotation, i: React.Key) => 
                        <li key={i}>
                            <code>
                                {JSON.stringify(item, null, "\t")}
                            </code>
                        </li>
                    ) : "Loading..." }
                    
            </ol>
        </>
    )
}