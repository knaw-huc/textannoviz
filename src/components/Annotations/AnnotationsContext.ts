import React from "react"
import { ContextType } from "../../backend/utils/ContextType"
import { dummyProvider } from "../../backend/utils/dummyProvider"
import { baseReducer } from "../../backend/utils/baseReducer"
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation"

export const useAnnotationsContext = () => React.useContext(AnnotationsContext)

export type AnnotationsStateType = {
    annotations: AnnoRepoAnnotation[],
    selectedAnn: AnnoRepoAnnotation | undefined,
    annItemOpen: boolean
}

export const defaultAnnotationsContext = {
    state: {
        annotations: [],
        selectedAnn: undefined,
        annItemOpen: false
    },
    setState: dummyProvider
} as ContextType<AnnotationsStateType>

export const AnnotationsContext = React.createContext(defaultAnnotationsContext)
export const annotationsReducer : (<T extends AnnotationsStateType>(s: T, a: T) => T) = baseReducer