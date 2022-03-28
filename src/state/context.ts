import React, { createContext } from "react"
import { AppState, AppAction, initAppState } from './reducer'

interface AppContext {
    state: AppState
    dispatch: React.Dispatch<AppAction>
}

const initAppContext: AppContext = {
    state: initAppState,
    dispatch: null
}

export const appContext = createContext<AppContext>(initAppContext);