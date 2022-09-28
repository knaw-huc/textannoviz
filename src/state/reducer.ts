import mirador from "mirador"
import React, { useReducer } from "react"
import { useParams } from "react-router-dom"
import { fetchBroccoliOpening, fetchBroccoliResolution } from "../backend/utils/fetchBroccoli"
import { visualizeAnnosMirador } from "../backend/utils/visualizeAnnosMirador"
import { zoomAnnMirador } from "../backend/utils/zoomAnnMirador"
import { miradorConfig } from "../components/Mirador/MiradorConfig"
import { AnnoRepoAnnotation, iiifAnn } from "../model/AnnoRepoAnnotation"
import { BroccoliText, BroccoliV2, OpeningRequest, ResolutionRequest } from "../model/Broccoli"
import { ACTIONS } from "./actions"
//import { findCurrentIndexCanvas } from "../backend/utils/findCurrentIndexCanvas"

export interface AppState {
    store: any
    MirAnn: iiifAnn
    anno: AnnoRepoAnnotation[]
    text: BroccoliText
    selectedAnn: AnnoRepoAnnotation | undefined
    textToHighlight: BroccoliText
    annItemOpen: boolean,
    currentContext: {
        volumeId?: string,
        context?: string | number,
    }
    broccoli: BroccoliV2,
    openingVol: {
        opening: string,
        volume: string,
    },
    canvas: {
        canvasIds: string[],
        currentIndex: number
    }
}

interface SetStore {
    type: ACTIONS.SET_STORE,
    store: any
}

interface SetMirAnn {
    type: ACTIONS.SET_MIRANN,
    MirAnn: iiifAnn
}

interface SetAnno {
    type: ACTIONS.SET_ANNO,
    anno: AnnoRepoAnnotation[]
}

interface SetText {
    type: ACTIONS.SET_TEXT,
    text: BroccoliText
}

interface SetSelectedAnn {
    type: ACTIONS.SET_SELECTEDANN,
    selectedAnn: AnnoRepoAnnotation | undefined
}

interface SetTextToHighlight {
    type: ACTIONS.SET_TEXTTOHIGHLIGHT,
    textToHighlight: BroccoliText
}

interface SetAnnItemOpen {
    type: ACTIONS.SET_ANNITEMOPEN,
    annItemOpen: boolean
}

interface SetCurrentContext {
    type: ACTIONS.SET_CURRENTCONTEXT,
    currentContext: {
        volumeId?: string,
        context?: number | string,
    }
}

interface SetBroccoli {
    type: ACTIONS.SET_BROCCOLI,
    broccoli: BroccoliV2
}

interface SetOpeningVol {
    type: ACTIONS.SET_OPENINGVOL,
    openingVol: {
        opening: string,
        volume: string
    }
}

interface SetCanvas {
    type: ACTIONS.SET_CANVAS,
    canvas: {
        canvasIds: string[],
        currentIndex: number
    }
}

export type AppAction = SetStore | SetMirAnn | SetAnno | SetText | SetSelectedAnn | SetTextToHighlight | SetAnnItemOpen | SetCurrentContext | SetBroccoli | SetOpeningVol | SetCanvas

export const initAppState: AppState = {
    store: null,
    MirAnn: null,
    anno: null,
    text: null,
    selectedAnn: undefined,
    textToHighlight: null,
    annItemOpen: false,
    currentContext: {
        volumeId: null,
        context: null,
    },
    broccoli: null,
    openingVol: {
        opening: null,
        volume: null
    },
    canvas: {
        canvasIds: null,
        currentIndex: null
    }
}

function setMiradorConfig(broccoli: BroccoliV2) {
    miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest
    miradorConfig.windows[0].canvasId = broccoli.iiif.canvasIds[0]
}

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = useReducer(reducer, initAppState)
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
                            context: (broccoli.request as OpeningRequest).opening,
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
                            context: (broccoli.request as ResolutionRequest).resolutionId,
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

                    dispatch({
                        type: ACTIONS.SET_BROCCOLI,
                        broccoli: broccoli
                    })
                })
                .catch(console.error)
        }
    }, [resolutionId])

    React.useEffect(() => {
        if (state.broccoli === null || state.canvas.canvasIds === null || state.canvas.currentIndex === null) return
        
        console.log(state.canvas.canvasIds[state.canvas.currentIndex])
        state.store.dispatch(mirador.actions.setCanvas("republic", state.canvas.canvasIds[state.canvas.currentIndex]))
        
        const iiifAnns = visualizeAnnosMirador(state.broccoli, state.store, state.canvas.canvasIds[state.canvas.currentIndex])
        console.log(iiifAnns)

        setTimeout(() => {
            const zoom = zoomAnnMirador(state.anno[0], state.canvas.canvasIds[state.canvas.currentIndex])

            state.store.dispatch(mirador.actions.selectAnnotation("republic", state.anno[0]))
            state.store.dispatch(mirador.actions.updateViewport("republic", {
                x: zoom.zoomCenter.x,
                y: zoom.zoomCenter.y,
                zoom: 1 / zoom.miradorZoom
            }))
        }, 100)

    }, [state.anno, state.broccoli, state.canvas.canvasIds, state.canvas.currentIndex, state.store])

    return [state, dispatch]
}

function reducer(state: AppState, action: AppAction): AppState {
    console.log(action, state)
    switch (action.type) {
    case ACTIONS.SET_STORE:
        return setStore(state, action)
    case ACTIONS.SET_MIRANN:
        return setMirAnn(state, action)
    case ACTIONS.SET_ANNO:
        return setAnno(state, action)
    case ACTIONS.SET_TEXT:
        return setText(state, action)
    case ACTIONS.SET_SELECTEDANN:
        return setSelectedAnn(state, action)
    case ACTIONS.SET_TEXTTOHIGHLIGHT:
        return setTextToHighlight(state, action)
    case ACTIONS.SET_ANNITEMOPEN:
        return setAnnItemOpen(state, action)
    case ACTIONS.SET_CURRENTCONTEXT:
        return setCurrentContext(state, action)
    case ACTIONS.SET_BROCCOLI:
        return setBroccoli(state, action)
    case ACTIONS.SET_OPENINGVOL:
        return setOpeningVol(state, action)
    case ACTIONS.SET_CANVAS:
        return setCanvas(state, action)
    default:
        return state
    }
}

function setStore(state: AppState, action: SetStore) {
    return {
        ...state,
        store: action.store
    }
}

function setMirAnn(state: AppState, action: SetMirAnn) {
    return {
        ...state,
        MirAnn: action.MirAnn
    }
}

function setAnno(state: AppState, action: SetAnno) {
    return {
        ...state,
        anno: action.anno
    }
}

function setText(state: AppState, action: SetText) {
    return {
        ...state,
        text: action.text
    }
}

function setSelectedAnn(state: AppState, action: SetSelectedAnn) {
    return {
        ...state,
        selectedAnn: action.selectedAnn
    }
}

function setTextToHighlight(state: AppState, action: SetTextToHighlight) {
    return {
        ...state,
        textToHighlight: action.textToHighlight
    }
}

function setAnnItemOpen(state: AppState, action: SetAnnItemOpen) {
    return {
        ...state,
        annItemOpen: action.annItemOpen
    }
}

function setCurrentContext(state: AppState, action: SetCurrentContext) {
    return {
        ...state,
        currentContext: action.currentContext
    }
}

function setBroccoli(state: AppState, action: SetBroccoli) {
    return {
        ...state,
        broccoli: action.broccoli
    }
}

function setOpeningVol(state: AppState, action: SetOpeningVol) {
    return {
        ...state,
        openingVol: action.openingVol
    }
}

function setCanvas(state: AppState, action: SetCanvas) {
    return {
        ...state,
        canvas: action.canvas
    }
}