import React from "react"
import { iiifAnn } from "../../model/AnnoRepoAnnotation"
import { ContextType } from "../../backend/utils/ContextType"
import { dummyProvider } from "../../backend/utils/dummyProvider"
import { baseReducer } from "../../backend/utils/baseReducer"

export const useMiradorContext = () => React.useContext(MiradorContext)

export type MiradorStateType = {
    store: any,
    mirAnn: iiifAnn | undefined,
    canvas: {
        canvasIds: string[],
        currentIndex: number
    },
    currentContext: {
        volume: string,
        opening: string | number
    }
}

export const defaultMiradorContext = {
    state: {
        store: undefined,
        mirAnn: undefined,
        canvas: {
            canvasIds: [],
            currentIndex: 0
        },
        currentContext: {
            volume: "",
            opening: 0
        }
    },
    setState: dummyProvider
} as ContextType<MiradorStateType>

export const MiradorContext = React.createContext(defaultMiradorContext)
export const miradorReducer : (<T extends MiradorStateType>(s: T, a: T) => T) = baseReducer