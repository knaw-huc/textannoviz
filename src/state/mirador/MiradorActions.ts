import { MiradorState } from "./MiradorReducer"

export enum MIRADOR_ACTIONS {
    SET_STORE = "SET_STORE",
    SET_MIRANN = "SET_MIRANN",
    SET_CURRENTCONTEXT = "SET_CURRENTCONTEXT",
    SET_CANVAS = "SET_CANVAS"
}

export type SetStore =
    Pick<MiradorState, "store"> &
    {
        type: MIRADOR_ACTIONS.SET_STORE
    }

export type SetMirAnn =
    Pick<MiradorState, "mirAnn"> &
    {
        type: MIRADOR_ACTIONS.SET_MIRANN
    }

export type SetCurrentContext =
    Pick<MiradorState, "currentContext"> &
    {
        type: MIRADOR_ACTIONS.SET_CURRENTCONTEXT
    }

export type SetCanvas =
    Pick<MiradorState, "canvas"> &
    {
        type: MIRADOR_ACTIONS.SET_CANVAS
    }

export type MiradorAction = SetStore | SetMirAnn | SetCurrentContext | SetCanvas