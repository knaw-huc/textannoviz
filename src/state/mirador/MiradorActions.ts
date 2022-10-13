import { MiradorState } from "./MiradorState"

export enum MIRADOR_ACTIONS {
    SET_STORE = "SET_STORE",
    SET_MIRANN = "SET_MIRANN"
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

export type MiradorAction = SetStore | SetMirAnn