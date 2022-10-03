import mirador from "mirador"
import React from "react"
import { useParams } from "react-router-dom"
import { AppAction } from "./action/actions"
import { appReducer } from "./reducer"
import { AppState, initialAppState } from "./state"
import { fetchBroccoliOpening, fetchBroccoliResolution } from "../backend/utils/fetchBroccoli"
import { BroccoliV2, OpeningRequest, ResolutionRequest } from "../model/Broccoli"
import { miradorConfig } from "../components/Mirador/MiradorConfig"
import { ACTIONS } from "./action/actions"
import { visualizeAnnosMirador } from "../backend/utils/visualizeAnnosMirador"

function setMiradorConfig(broccoli: BroccoliV2) {
    miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest
    miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0]
}

export const useAppState = (): [AppState, React.Dispatch<AppAction>] => {
    const [state, dispatch] = React.useReducer(appReducer, initialAppState)

    const { volumeNum, openingNum, resolutionId } = useParams<{ volumeNum: string, openingNum: string, resolutionId: string }>()

    React.useEffect(() => {
        if (volumeNum && openingNum) {
            fetchBroccoliOpening(volumeNum, openingNum)
                .then(function (broccoli: BroccoliV2) {
                    console.log(broccoli)
                    setMiradorConfig(broccoli)
                    const viewer = mirador.viewer(miradorConfig)
                    dispatch({
                        type: ACTIONS.SET_STORE,
                        setStore: viewer.store
                    })

                    const iiifAnns = visualizeAnnosMirador(broccoli, viewer.store, broccoli.iiif.canvasIds[0])

                    dispatch({
                        type: ACTIONS.SET_CURRENTCONTEXT,
                        setCurrentContext: {
                            volumeId: (broccoli.request as OpeningRequest).volumeId,
                            context: (broccoli.request as OpeningRequest).opening,
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_CANVAS,
                        setCanvas: {
                            canvasIds: broccoli.iiif.canvasIds,
                            currentIndex: 0 
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_ANNO,
                        setAnno: broccoli.anno
                    })

                    dispatch({
                        type: ACTIONS.SET_TEXT,
                        setText: broccoli.text
                    })

                    dispatch({
                        type: ACTIONS.SET_MIRANN,
                        setMirAnn: iiifAnns
                    })

                    dispatch({
                        type: ACTIONS.SET_BROCCOLI,
                        setBroccoli: broccoli
                    })
                })
                .catch(console.error)
        }
    }, [openingNum, volumeNum])

    React.useEffect(() => {
        if (resolutionId) {
            fetchBroccoliResolution(resolutionId)
                .then(function (broccoli: BroccoliV2) {
                    console.log(broccoli)
                    setMiradorConfig(broccoli)
                    const viewer = mirador.viewer(miradorConfig)
                    dispatch({
                        type: ACTIONS.SET_STORE,
                        setStore: viewer.store
                    })

                    const iiifAnns = visualizeAnnosMirador(broccoli, viewer.store, broccoli.iiif.canvasIds[0])

                    dispatch({
                        type: ACTIONS.SET_CURRENTCONTEXT,
                        setCurrentContext: {
                            context: (broccoli.request as ResolutionRequest).resolutionId,
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_CANVAS,
                        setCanvas: {
                            canvasIds: broccoli.iiif.canvasIds,
                            currentIndex: 0 
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_ANNO,
                        setAnno: broccoli.anno
                    })

                    dispatch({
                        type: ACTIONS.SET_TEXT,
                        setText: broccoli.text
                    })

                    dispatch({
                        type: ACTIONS.SET_MIRANN,
                        setMirAnn: iiifAnns
                    })

                    dispatch({
                        type: ACTIONS.SET_BROCCOLI,
                        setBroccoli: broccoli
                    })
                })
                .catch(console.error)
        }
    }, [resolutionId])

    React.useEffect(() => {
        if (state.setBroccoli === null || state.setCanvas.canvasIds === null || state.setCanvas.currentIndex === null) return
        
        console.log(state.setCanvas.canvasIds[state.setCanvas.currentIndex])
        state.setStore.dispatch(mirador.actions.setCanvas("republic", state.setCanvas.canvasIds[state.setCanvas.currentIndex]))
        
        const iiifAnns = visualizeAnnosMirador(state.setBroccoli, state.setStore, state.setCanvas.canvasIds[state.setCanvas.currentIndex])
        console.log(iiifAnns)

        // setTimeout(() => {
        //     const zoom = zoomAnnMirador(state.anno[0], state.canvas.canvasIds[state.canvas.currentIndex])

        //     state.store.dispatch(mirador.actions.selectAnnotation("republic", state.anno[0]))
        //     state.store.dispatch(mirador.actions.updateViewport("republic", {
        //         x: zoom.zoomCenter.x,
        //         y: zoom.zoomCenter.y,
        //         zoom: 1 / zoom.miradorZoom
        //     }))
        // }, 100)

    }, [state.setAnno, state.setBroccoli, state.setCanvas.canvasIds, state.setCanvas.currentIndex, state.setStore])

    return [state, dispatch]
}