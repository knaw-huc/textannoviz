import React, { useReducer } from "react"
import { ACTIONS } from "./actions"

export interface AppState {
    store: any
    MirAnn: any
    anno: any
    text: any
    selectedAnn: any
}

interface SetStore {
    type: ACTIONS.SET_STORE,
    store: any
}

interface SetMirAnn {
    type: ACTIONS.SET_MIRANN,
    MirAnn: any
}

interface SetAnno {
    type: ACTIONS.SET_ANNO,
    anno: any
}

interface SetText {
    type: ACTIONS.SET_TEXT,
    text: any
}

interface SetSelectedAnn {
    type: ACTIONS.SET_SELECTEDANN,
    selectedAnn: any
}

export type AppAction = SetStore | SetMirAnn | SetAnno | SetText | SetSelectedAnn

export const initAppState: AppState = {
    store: null,
    MirAnn: null,
    anno: null,
    text: null,
    selectedAnn: null,
}

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = useReducer(reducer, initAppState)

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