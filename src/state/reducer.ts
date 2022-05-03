import React, { useReducer } from "react"
import { ACTIONS } from "./actions"

export interface AppState {
    store: any
    jpg: any
    anno: any
    text: any
}

interface SetStore {
    type: ACTIONS.SET_STORE,
    store: any
}

interface SetJpg {
    type: ACTIONS.SET_JPG,
    jpg: any
}

interface SetAnno {
    type: ACTIONS.SET_ANNO,
    anno: any
}

interface SetText {
    type: ACTIONS.SET_TEXT,
    text: any
}

export type AppAction = SetStore | SetJpg | SetAnno | SetText

export const initAppState: AppState = {
    store: null,
    jpg: null,
    anno: null,
    text: null
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
    case ACTIONS.SET_JPG:
        return setJpg(state, action)
    case ACTIONS.SET_ANNO:
        return setAnno(state, action)
    case ACTIONS.SET_TEXT:
        return setText(state, action)
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

function setJpg(state: AppState, action: SetJpg) {
    return {
        ...state,
        jpg: action.jpg
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