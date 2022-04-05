import React, { useReducer } from 'react'

export enum ACTIONS {
    SET_STORE = 'SET_STORE',
}

export interface AppState {
    store: any
}

interface SetStore {
    type: ACTIONS.SET_STORE,
    store: any
}

export type AppAction = SetStore

export const initAppState: AppState = {
    store: null,
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