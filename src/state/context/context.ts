import React, { createContext } from "react"
import { AppAction, AppState, initAppState } from "../reducer/reducer"

interface AppContext {
    state: AppState
    dispatch: React.Dispatch<AppAction>
}

const initAppContext: AppContext = {
    state: initAppState,
    dispatch: null
}

export const initialMiradorContextValue: any = null
export const miradorContext = React.createContext(initialMiradorContextValue)

export const appContext = createContext<AppContext>(initAppContext)

export const DispatchContext = React.createContext<React.Dispatch<AppAction>>(null)