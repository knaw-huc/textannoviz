import React, { useContext } from "react"
import { appContext } from "../../state/context"
import mirador from "mirador"
import { AnnoRepoAnnotation, iiifAnn, iiifAnnResources } from "../../model/AnnoRepoAnnotation"
import { AnnotationItem } from "./AnnotationItem"
import styled from "styled-components"
import { Loading } from "../../backend/utils/Loader"
import { Link } from "react-router-dom"
import { ACTIONS } from "../../state/actions"
import { fetchBroccoli } from "../../backend/utils/fetchBroccoli"
import { BroccoliV1 } from "../../model/Broccoli"
import { visualizeAnnosMirador } from "../../backend/utils/visualizeAnnosMirador"

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

    const nextCanvas = () => {
        state.store.dispatch(mirador.actions.setNextCanvas("republic"))
        fetchBroccoli(state.currentContext + 1)
            .then(function (broccoli: BroccoliV1) {
                console.log(broccoli)
                const iiifAnns = visualizeAnnosMirador(broccoli, state.store)

                dispatch({
                    type: ACTIONS.SET_CURRENTCONTEXT,
                    currentContext: broccoli.request.opening
                })
                
                dispatch({
                    type: ACTIONS.SET_ANNO,
                    anno: broccoli.anno
                })

                dispatch({
                    type: ACTIONS.SET_TEXT,
                    text: broccoli.text
                })

                dispatch({
                    type: ACTIONS.SET_MIRANN,
                    MirAnn: iiifAnns
                })
            })
            .catch(console.error)
        console.log(state.store.getState())
    }

    const previousCanvas = () => {
        state.store.dispatch(mirador.actions.setPreviousCanvas("republic"))
        fetchBroccoli(state.currentContext - 1)
            .then(function (broccoli: BroccoliV1) {
                console.log(broccoli)
                const iiifAnns = visualizeAnnosMirador(broccoli, state.store)

                dispatch({
                    type: ACTIONS.SET_CURRENTCONTEXT,
                    currentContext: broccoli.request.opening
                })

                dispatch({
                    type: ACTIONS.SET_ANNO,
                    anno: broccoli.anno
                })

                dispatch({
                    type: ACTIONS.SET_TEXT,
                    text: broccoli.text
                })

                dispatch({
                    type: ACTIONS.SET_MIRANN,
                    MirAnn: iiifAnns
                })
            })
            .catch(console.error)
        console.log(state.store.getState())
    }

    const testFunction = () => {
        fetchBroccoli()
            .then(function (broccoli: BroccoliV1) {
                console.log(broccoli)
                const currentState = state.store.getState()
                const iiifAnn: iiifAnn = {
                    "@id": "https://images.diginfra.net/api/annotation/getTextAnnotations?uri=https%3A%2F%2Fimages.diginfra.net%2Fiiif%2FNL-HaNA_1.01.02%2F3783%2FNL-HaNA_1.01.02_3783_0285.jpg",
                    "@context": "http://iiif.io/api/presentation/2/context.json",
                    "@type": "sc:AnnotationList",
                    "resources": []
                }

                const resources: iiifAnnResources[] = [{
                    "@id": "https://annorepo.republic-caf.diginfra.org/w3c/volume-1728-3/26c4b477-b228-40a0-974a-6ce5bf61a79c",
                    "@type": "oa:Annotation",
                    "motivation": [
                        "oa:commenting", "oa:Tagging"
                    ],
                    "on": [{
                        "@type": "oa:SpecificResource",
                        "full": "https://images.diginfra.net/api/pim/iiif/67533019-4ca0-4b08-b87e-fd5590e7a077/canvas/75718d0a-5441-41fe-94c1-db773e0848e7",
                        "selector": {
                            "@type": "oa:Choice",
                            "default": {
                                "@type": "oa:FragmentSelector",
                                "value": "xywh=3382,1559,905,1768"
                            },
                            "item": {
                                "@type": "oa:SvgSelector",
                                "value": "<svg><path d=\"M3382,3327v-1768h905v1768z\" fill=\"black\"/></svg>"
                                // "value": "<svg><rect x=\"3382\" y=\"1559\" width=\"905\" height=\"1768\" fill=\"black\"></rect></svg>"
                                // "value": "<svg><polygon points=\"377,2698 386,1970 405,628 409,434 429,414 845,409 1089,412 1308,434 1308,464 1297,1667 1279,2680 1274,2778 851,2825 705,2833 379,2812 377,2717\" fill='black' /></svg>"
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
                        "chars": "test"
                    }, {
                        "@type": "oa:Tag",
                        "format": "text/html",
                        "chars": "test2"
                    }]
                }]

                iiifAnn.resources.push(...resources)
        
                console.log(state.store.dispatch(mirador.actions.receiveAnnotation(`${currentState.windows.republic.canvasId}`, "annotation", iiifAnn)))
            })
        console.log(state.store.getState())
    }

    function handleSelected(selected: AnnoRepoAnnotation | undefined) {
        console.log(selected)
        return dispatch({type: ACTIONS.SET_SELECTEDANN, selectedAnn: selected})
    }

    return (
        <AnnotationStyled id="annotation">
            <Button onClick={nextCanvas}>Next canvas</Button>
            <Button onClick={previousCanvas}>Previous canvas</Button>
            <Button onClick={testFunction}>Test button</Button>
            <Link to="/">Home</Link>

            {state.anno ? state.anno.map((annotation, index) => (
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