import React from "react"
import { iiifAnn } from "../../model/AnnoRepoAnnotation"
import { MiradorAction, MIRADOR_ACTIONS, SetCanvas, SetCurrentContext, SetMirAnn, SetStore } from "./MiradorActions"

export interface MiradorState {
    store: any,
    mirAnn: iiifAnn,
    currentContext: {
        volumeId: string,
        openingNr: string | number
    },
    canvas: {
        canvasIds: string[],
        currentIndex: number
    }
}

export const initMiradorState: MiradorState = {
    store: null,
    mirAnn: null,
    currentContext: {
        volumeId: null,
        openingNr: null
    },
    canvas: {
        canvasIds: null,
        currentIndex: null
    }
}

export const useMiradorState = (): [MiradorState, React.Dispatch<MiradorAction>] => {
    const [state, dispatch] = React.useReducer(miradorReducer, initMiradorState)

    return [state, dispatch]
}

const miradorReducer = (state: MiradorState, action: MiradorAction): MiradorState => {
    console.log(action, state)

    switch (action.type) {
        case MIRADOR_ACTIONS.SET_STORE:
            return setMirStore(state, action)
        case MIRADOR_ACTIONS.SET_MIRANN:
            return setMirAnn(state, action)
        case MIRADOR_ACTIONS.SET_CANVAS:
            return setCanvas(state, action)
        case MIRADOR_ACTIONS.SET_CURRENTCONTEXT:
            return setCurrentContext(state, action)
        default:
            break
    }

    return state
}

const setMirStore = (state: MiradorState, action: SetStore) => {
    return {
        ...state,
        store: action.store
    }
}

const setMirAnn = (state: MiradorState, action: SetMirAnn) => {
    return {
        ...state,
        mirAnn: action.mirAnn
    }
}

const setCanvas = (state: MiradorState, action: SetCanvas) => {
    return {
        ...state,
        canvas: action.canvas
    }
}

const setCurrentContext = (state: MiradorState, action: SetCurrentContext) => {
    return {
        ...state,
        currentContext: action.currentContext
    }
}