import React from "react"
import { AppAction } from "../action/actions"
import { initialAppState } from "../state"

export const DispatchContext = React.createContext<React.Dispatch<AppAction>>(null)

export const MiradorContext = React.createContext(initialAppState.mirador)

export const AnnotationsContext = React.createContext(initialAppState.annotations)

export const TextContext = React.createContext(initialAppState.text)

export const BroccoliContext = React.createContext(initialAppState.broccoli)

export const AppContext = React.createContext(initialAppState.app)