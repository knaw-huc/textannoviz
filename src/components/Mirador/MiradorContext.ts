import React from "react"
import { iiifAnn } from "../../model/AnnoRepoAnnotation"
import { ContextType } from "../../backend/utils/ContextType"
import { dummyProvider } from "../../backend/utils/dummyProvider"
import { baseReducer } from "../../backend/utils/baseReducer"

interface MiradorStateType {
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

const initialMiradorState: MiradorStateType = {
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
}

interface MiradorContext {
    state: MiradorStateType,
    dispatch: React.Dispatch<MiradorAction>
}

enum MiradorActions {
    SET_STORE = "SET_STORE",
    SET_MIRANN = "SET_MIRANN",
    SET_CANVAS = "SET_CANVAS",
    SET_CURRENTCONTEXT = "SET_CURRENTCONTEXT"
}

export type SetStore =
    Pick<MiradorStateType, "store"> &
    {
        type: MiradorActions.SET_STORE
    }

export type SetMirAnn =
    Pick<MiradorStateType, "mirAnn"> &
    {
        type: MiradorActions.SET_MIRANN
    }

export type SetCanvas =
    Pick<MiradorStateType, "canvas"> &
    {
        type: MiradorActions.SET_CANVAS
    }

export type SetCurrentContext =
    Pick<MiradorStateType, "currentContext"> &
    {
        type: MiradorActions.SET_CURRENTCONTEXT
    }

type MiradorAction = SetStore | SetMirAnn | SetCanvas | SetCurrentContext

// export const useMiradorContext = () => React.useContext(MiradorContext)

// export type MiradorStateType = {
//     store: any,
//     mirAnn: iiifAnn | undefined,
//     canvas: {
//         canvasIds: string[],
//         currentIndex: number
//     },
//     currentContext: {
//         volume: string,
//         opening: string | number
//     }
// }

// export const defaultMiradorContext = {
//     state: {
//         store: undefined,
//         mirAnn: undefined,
//         canvas: {
//             canvasIds: [],
//             currentIndex: 0
//         },
//         currentContext: {
//             volume: "",
//             opening: 0
//         }
//     },
//     setState: dummyProvider
// } as ContextType<MiradorStateType>

// export const MiradorContext = React.createContext(defaultMiradorContext)
// export const miradorReducer : (<T extends MiradorStateType>(s: T, a: T) => T) = baseReducer