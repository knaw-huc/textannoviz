import React from 'react'

export interface AppState {
    store: any
}

export const initAppState: AppState = {
    store: null
}

interface SetStore {
    type: "SET_STORE",
    store: any
}

export type AppAction = SetStore

export function useAppState(): [AppState, React.Dispatch<AppAction>] {
	const [state, dispatch] = React.useReducer(
		reducer,
        initAppState
	)

	return [state, dispatch]
}

function reducer(state: AppState, action: AppAction): AppState {
	console.log(action, state)
	switch (action.type) {
		case 'SET_STORE': return setStore(state, action)
		default: break
	}

	return state
}

function setStore(state: AppState, action: SetStore) {
    return {
        ...state,
        store: action.store
    }
}