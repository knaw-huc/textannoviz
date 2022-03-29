import React, { useReducer } from 'react'

export enum ACTIONS {
    SET_STORE = 'SET_STORE',
    CURRENT_STATE = 'CURRENT_STATE'
}

export interface AppState {
    store: any
    currentState: any
}

interface SetStore {
    type: ACTIONS.SET_STORE,
    store: any
}

interface SetCurrentState {
    type: ACTIONS.CURRENT_STATE
    currentState: any
}

export type AppAction = SetStore | SetCurrentState;

export const initAppState: AppState = {
    store: null,
    currentState: null
}

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
    const [state, dispatch] = useReducer(reducer, initAppState)
    return [state, dispatch]
}

function reducer(state: AppState, action: AppAction): AppState {
    console.log(action, state);
    switch (action.type) {
        case ACTIONS.SET_STORE:
            return setStore(state, action)
        case ACTIONS.CURRENT_STATE:
            return setCurrentState(state, action)
        default:
            state
    }
}

function setStore(state: AppState, action: SetStore) {
    return {
        ...state,
        store: action.store
    }
}

function setCurrentState(state: AppState, action: SetCurrentState) {
    return {
        ...state,
        currentState: action.currentState
    }
}