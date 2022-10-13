import React from "react"
import { ContextType } from "../../backend/utils/ContextType"
import { dummyProvider } from "../../backend/utils/dummyProvider"
import { baseReducer } from "../../backend/utils/baseReducer"
import { BroccoliText } from "../../model/Broccoli"

export const useTextContext = () => React.useContext(TextContext)

export type TextStateType = {
    text: BroccoliText | undefined,
    textToHighlight: BroccoliText | undefined
}

export const defaultTextContext = {
    state: {
        text: undefined,
        textToHighlight: undefined
    },
    setState: dummyProvider
} as ContextType<TextStateType>

export const TextContext = React.createContext(defaultTextContext)
export const textReducer : (<T extends TextStateType>(s: T, a: T) => T) = baseReducer