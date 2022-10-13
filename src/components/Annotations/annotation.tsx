import React from "react"
import styled from "styled-components"
import { Loading } from "../../backend/utils/Loader"
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation"
import { AnnotationButtons } from "./AnnotationButtons"
import { AnnotationItem } from "./AnnotationItem"
import { AnnotationLinks } from "./AnnotationLinks"
import { useAnnotationsContext } from "./AnnotationsContext"
import { useMiradorContext } from "../Mirador/MiradorContext"
import { useTextContext } from "../Text/TextContext"
import { fetchBroccoliOpening, fetchBroccoliResolution } from "../../backend/utils/fetchBroccoli"
import { useParams } from "react-router-dom"
import { BroccoliV2 } from "../../model/Broccoli"
import { miradorConfig } from "../Mirador/MiradorConfig"
import { visualizeAnnosMirador } from "../../backend/utils/visualizeAnnosMirador"
import mirador from "mirador"

const AnnotationStyled = styled.div`
    min-width: 400px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
`

function setMiradorConfig(broccoli: BroccoliV2) {
    miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest
    miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0]
}

export function Annotation() {
    const miradorState = useMiradorContext().state
    const setMiradorState = useMiradorContext().setState
    const annotationsState = useAnnotationsContext().state
    const setAnnotationsState = useAnnotationsContext().setState
    const textState = useTextContext().state
    const setTextState = useTextContext().setState
    const { volumeNum, openingNum, resolutionId } = useParams<{ volumeNum: string, openingNum: string, resolutionId: string }>()

    React.useEffect(() => {
        if (volumeNum && openingNum) {
            fetchBroccoliOpening(volumeNum, openingNum)
                .then(function (broccoli: BroccoliV2) {
                    console.log(broccoli)
                    setMiradorConfig(broccoli)
                    const viewer = mirador.viewer(miradorConfig)
                    setMiradorState({
                        ...miradorState,
                        store: viewer.store
                    })
                    const iiifAnns = visualizeAnnosMirador(broccoli, viewer.store, broccoli.iiif.canvasIds[0])

                    setMiradorState({
                        ...miradorState,
                        mirAnn: iiifAnns
                    })

                    setMiradorState({
                        ...miradorState,
                        canvas: {
                            canvasIds: broccoli.iiif.canvasIds,
                            currentIndex: 0
                        }
                    })

                    setAnnotationsState({
                        ...annotationsState,
                        annotations: broccoli.anno
                    })

                    setTextState({
                        ...textState,
                        text: broccoli.text
                    })

                    console.log(miradorState)
                })
                .catch(console.error)
        }
    }, [volumeNum, openingNum])

    function handleSelected(selected: AnnoRepoAnnotation | undefined) {
        console.log(selected)
        return
        // return dispatch({type: ACTIONS.SET_SELECTEDANN, selectedAnn: selected})
    }

    return (
        <AnnotationStyled id="annotation">
            <AnnotationButtons />
            <AnnotationLinks />

            {annotationsState.annotations.length > 0 ? annotationsState.annotations.map((annotation, index) => (
                <AnnotationItem
                    key={index}
                    annot_id={index}
                    annotation={annotation}
                    selected={annotationsState.selectedAnn?.id === annotation.id}
                    onSelect={handleSelected}
                />
            )) : <Loading />}
        </AnnotationStyled>
    )
}