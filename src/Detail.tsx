import mirador from "mirador"
import React from "react"
import styled from "styled-components"
import { Annotation } from "./components/Annotations/annotation"
import { Mirador } from "./components/Mirador/Mirador"
import { Text } from "./components/Text/text"
import { useAnnotationsContext } from "./components/Annotations/AnnotationsContext"
import { useMiradorContext } from "./components/Mirador/MiradorContext"
import { useTextContext } from "./components/Text/TextContext"
import { fetchBroccoliOpening, fetchBroccoliResolution } from "./backend/utils/fetchBroccoli"
import { useParams } from "react-router-dom"
import { BroccoliV2, OpeningRequest } from "./model/Broccoli"
import { miradorConfig } from "./components/Mirador/MiradorConfig"
import { visualizeAnnosMirador } from "./backend/utils/visualizeAnnosMirador"

const AppContainer = styled.div`
    border-style: solid;
    border-color: black;
    border-width: 2px;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
`

function setMiradorConfig(broccoli: BroccoliV2) {
    miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest
    miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0]
}

export const Detail = () => {
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

                    setMiradorState({
                        ...miradorState,
                        currentContext: {
                            volume: (broccoli.request as OpeningRequest).volumeId,
                            opening: (broccoli.request as OpeningRequest).openingNr
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
                })
                .catch(console.error)
        }
    }, [volumeNum, openingNum])

    React.useEffect(() => {
        if (resolutionId) {
            fetchBroccoliResolution(resolutionId)
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

                    setMiradorState({
                        ...miradorState,
                        currentContext: {
                            volume: (broccoli.request as OpeningRequest).volumeId,
                            opening: (broccoli.request as OpeningRequest).openingNr
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
                })
        }
    }, [resolutionId])

    return (
        <AppContainer id="appcontainer">
            <Row id="row">
                <Mirador />
                <Text />
                <Annotation />
            </Row>
        </AppContainer>
    )
}