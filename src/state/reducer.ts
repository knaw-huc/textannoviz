import React, { useReducer } from 'react'

export interface AppState {
    store: any
}

interface SetStore {
    type: string,
    store: any
}

export type AppAction = SetStore;

export const ACTIONS = {
    SET_STORE: 'set_store'
}

export const initAppState: AppState = {
    store: null
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