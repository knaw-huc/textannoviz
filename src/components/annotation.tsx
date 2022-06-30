import React, { useContext } from "react"
import { appContext } from "../state/context"
import mirador from "mirador"
import Elucidate from "../backend/Elucidate"
import { ACTIONS } from "../state/actions"
import getVersionId from "../backend/utils/getVersionId"
import findSelectorTarget from "../backend/utils/findSelectorTarget"
import TextRepo from "../backend/TextRepo"
import getBodyValue from "../backend/utils/getBodyValue"
import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
//import {FetchData} from "../backend/utils/fetchData"
import findImageRegions from "../backend/utils/findImageRegions"
import annotation from "../data/annotation.json"
import { AnnotationItem } from "./AnnotationItem"
import styled from "styled-components"
import { Loading } from "../backend/utils/Loader"

const AnnotationStyled = styled.div`
    min-width: 400px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
`

const Button = styled.button`
    background: #0d6efd;
    border-radius: 3px;
    border: none;
    color: white;
    padding: 5px;
    margin-right: 0.5em;
`

export function Annotation() {
    const { state, dispatch } = useContext(appContext)

    const fetchData = async () => {
        const currentState = state.store.getState()
        console.log(currentState)
        const jpg = await fetch(currentState.windows.republic.canvasId)
            .then(response => {
                return response.json()
            })
            .then(data => {
                return data.label
            })
        const ann = await Elucidate.getByJpg(jpg)
        if (ann[0]) {
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

            console.log(regions)

            const resources = regions.flatMap((region: string, i: number) => {
                const [x, y, w, h] = region.split(",")
                // console.log(split)
                let colour = ""

                switch (getBodyValue(annFiltered[i])) {
                case "resolution":
                    colour = "green"
                    break
                case "attendant":
                    colour = "#DB4437"
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
                                "value": `<svg xmlns='http://www.w3.org/2000/svg'><path xmlns="http://www.w3.org/2000/svg" id="testing" d="M${x},${parseInt(y) + parseInt(h)}v-${h}h${w}v${h}z" stroke="${colour}" fill="${colour}" fill-opacity="0.5" stroke-width="1"/></svg>`
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
            annotation.resources.splice(0, annotation.resources.length) //otherwise the annotations are added to the end of the array
            annotation.resources.push(...resources)

            console.log(state.store.dispatch(mirador.actions.receiveAnnotation(`${currentState.windows.republic.canvasId}`, "annotation", annotation)))

            dispatch({
                type: ACTIONS.SET_MIRANN,
                MirAnn: annotation
            })
        } else {
            return
        }
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

    const testFunction = () => {
        console.log("TEST")
    }

    function handleSelected(selected: ElucidateAnnotation | undefined) {
        return dispatch({type: ACTIONS.SET_SELECTEDANN, selectedAnn: selected})
    }

    return (
        <AnnotationStyled id="annotation">
            <Button onClick={nextCanvas}>Next canvas</Button>
            <Button onClick={previousCanvas}>Previous canvas</Button>
            <Button onClick={testFunction}>Test button</Button>

            {state.anno ? state.anno.map((annotation: ElucidateAnnotation, index: React.Key) => (
                <AnnotationItem
                    key={index}
                    annot_id={index}
                    annotation={annotation}
                    selected={state.selectedAnn?.id === annotation.id}
                    onSelect={handleSelected}
                />
            )) : <Loading />}
        </AnnotationStyled>
    )
}