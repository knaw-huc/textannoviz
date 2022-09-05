import React, { useReducer } from "react"
import { ACTIONS } from "./actions"
import { AnnoRepoAnnotation, iiifAnn } from "../model/AnnoRepoAnnotation"
import { BroccoliV1 } from "../model/Broccoli"
import mirador from "mirador"
import { miradorConfig } from "../components/Mirador/MiradorConfig"
import { fetchBroccoliOpening } from "../backend/utils/fetchBroccoli"
import { visualizeAnnosMirador } from "../backend/utils/visualizeAnnosMirador"
import { useParams } from "react-router-dom"

export interface AppState {
    store: any
    MirAnn: iiifAnn
    anno: AnnoRepoAnnotation[]
    text: string[]
    selectedAnn: AnnoRepoAnnotation | undefined
    textToHighlight: any
    annItemOpen: boolean,
    currentContext: {
        volume: number,
        context: number
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
    text: string[]
}

interface SetSelectedAnn {
    type: ACTIONS.SET_SELECTEDANN,
    selectedAnn: AnnoRepoAnnotation | undefined
}

interface SetTextToHighlight {
    type: ACTIONS.SET_TEXTTOHIGHLIGHT,
    textToHighlight: any
}

interface SetAnnItemOpen {
    type: ACTIONS.SET_ANNITEMOPEN,
    annItemOpen: boolean
}

interface SetCurrentContext {
    type: ACTIONS.SET_CURRENTCONTEXT,
    currentContext: {
        volume: number,
        context: number
    }
}

export type AppAction = SetStore | SetMirAnn | SetAnno | SetText | SetSelectedAnn | SetTextToHighlight | SetAnnItemOpen | SetCurrentContext

export const initAppState: AppState = {
    store: null,
    MirAnn: null,
    anno: null,
    text: null,
    selectedAnn: undefined,
    textToHighlight: null,
    annItemOpen: false,
    currentContext: {
        volume: null,
        context: null
    }
}

function setMiradorConfig(broccoli: BroccoliV1) {
    miradorConfig.windows[0].loadedManifest = broccoli.iiif.manifest
    miradorConfig.windows[0].canvasId = broccoli.iiif.canvasId
}

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = useReducer(reducer, initAppState)
    const params = useParams()
    console.log(parseInt(params.volume))
    console.log(parseInt(params.context))

    React.useEffect(() => {
        fetchBroccoliOpening(params.volume, params.context)
            .then(function(broccoli: BroccoliV1) {
                console.log(broccoli)
                setMiradorConfig(broccoli)
                const viewer = mirador.viewer(miradorConfig)
                dispatch({
                    type: ACTIONS.SET_STORE,
                    store: viewer.store
                })

                const iiifAnns = visualizeAnnosMirador(broccoli, viewer.store)

                dispatch({
                    type: ACTIONS.SET_CURRENTCONTEXT,
                    currentContext: {
                        volume: parseInt(broccoli.request.volume),
                        context: broccoli.request.opening
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
            })
            .catch(console.error)
    }, [params])
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