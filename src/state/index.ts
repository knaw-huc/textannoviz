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
import { MiradorReducer } from "./mirador/MiradorReducer"
import { initialMiradorState } from "./mirador/MiradorState"
import { MIRADOR_ACTIONS } from "./mirador/MiradorActions"

function setMiradorConfig(broccoli: BroccoliV2) {
    miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest
    miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0]
}

export const useAppState = (): [AppState, React.Dispatch<AppAction>] => {
    const [state, dispatch] = React.useReducer(appReducer, initialAppState)
    const [miradorState, miradorDispatch] = React.useReducer(MiradorReducer, initialMiradorState)

    miradorDispatch({
        type: MIRADOR_ACTIONS.SET_STORE,
        store: null
    })

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
                        store: viewer.store
                    })

                    const iiifAnns = visualizeAnnosMirador(broccoli, viewer.store, broccoli.iiif.canvasIds[0])

                    dispatch({
                        type: ACTIONS.SET_CURRENTCONTEXT,
                        currentContext: {
                            volumeId: (broccoli.request as OpeningRequest).volumeId,
                            context: (broccoli.request as OpeningRequest).opening
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_CANVAS,
                        canvas: {
                            canvasIds: broccoli.iiif.canvasIds,
                            currentIndex: 0
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_ANNO,
                        annotations: broccoli.anno
                    })

                    dispatch({
                        type: ACTIONS.SET_TEXT,
                        text: broccoli.text
                    })

                    dispatch({
                        type: ACTIONS.SET_MIRANN,
                        mirAnn: iiifAnns
                    })

                    dispatch({
                        type: ACTIONS.SET_BROCCOLI,
                        broccoli: broccoli
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
                        store: viewer.store
                    })

                    const iiifAnns = visualizeAnnosMirador(broccoli, viewer.store, broccoli.iiif.canvasIds[0])

                    dispatch({
                        type: ACTIONS.SET_CURRENTCONTEXT,
                        currentContext: {
                            context: (broccoli.request as ResolutionRequest).resolutionId
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_CANVAS,
                        canvas: {
                            canvasIds: broccoli.iiif.canvasIds,
                            currentIndex: 0
                        }
                    })

                    dispatch({
                        type: ACTIONS.SET_ANNO,
                        annotations: broccoli.anno
                    })

                    dispatch({
                        type: ACTIONS.SET_TEXT,
                        text: broccoli.text
                    })

                    dispatch({
                        type: ACTIONS.SET_MIRANN,
                        mirAnn: iiifAnns
                    })

                    dispatch({
                        type: ACTIONS.SET_BROCCOLI,
                        broccoli: broccoli
                    })
                })
                .catch(console.error)
        }
    }, [resolutionId])

    React.useEffect(() => {
        if (state.broccoli === null || state.app.canvas.canvasIds === null || state.app.canvas.currentIndex === null) return
        
        console.log(state.app.canvas.canvasIds[state.app.canvas.currentIndex])
        state.mirador.store.dispatch(mirador.actions.setCanvas("republic", state.app.canvas.canvasIds[state.app.canvas.currentIndex]))
        
        const iiifAnns = visualizeAnnosMirador(state.broccoli, state.mirador.store, state.app.canvas.canvasIds[state.app.canvas.currentIndex])
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

    }, [state.broccoli, state.app.canvas.canvasIds, state.app.canvas.currentIndex, state.mirador.store])

    return [state, dispatch]
}