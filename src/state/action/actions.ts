import { AppState } from "../state"

export enum ACTIONS {
    SET_STORE = "SET_STORE",
    SET_MIRANN = "SET_MIRANN",
    SET_ANNO = "SET_ANNO",
    SET_TEXT = "SET_TEXT",
    SET_SELECTEDANN = "SET_SELECTEDANN",
    SET_BROCCOLI = "SET_BROCCOLI",
    SET_TEXTTOHIGHLIGHT = "SET_TEXTTOHIGHLIGHT",
    SET_ANNITEMOPEN = "SET_ANNITEMOPEN",
    SET_CURRENTCONTEXT = "SET_CURRENTCONTEXT",
    SET_OPENINGVOL = "SET_OPENINGVOL",
    SET_CANVAS = "SET_CANVAS"
}

export type SetStore = 
    Pick<AppState, "setStore"> &
{
    type: ACTIONS.SET_STORE
}

export type SetMirAnn =
    Pick<AppState, "setMirAnn"> &
{
    type: ACTIONS.SET_MIRANN
}

export type SetAnno = 
    Pick<AppState, "setAnno"> &
{
    type: ACTIONS.SET_ANNO
}

export type SetText = 
    Pick<AppState, "setText"> &
{
    type: ACTIONS.SET_TEXT
}

export type SetSelectedAnn =
    Pick<AppState, "setSelectedAnn"> &
{
    type: ACTIONS.SET_SELECTEDANN
}

export type SetTextToHighlight =
    Pick<AppState, "setTextToHighlight"> &
{
    type: ACTIONS.SET_TEXTTOHIGHLIGHT
}

export type SetAnnItemOpen =
    Pick<AppState, "setAnnItemOpen"> &
{
    type: ACTIONS.SET_ANNITEMOPEN
}

export type SetCurrentContext =
    Pick<AppState, "setCurrentContext"> &
{
    type: ACTIONS.SET_CURRENTCONTEXT
}

export type SetBroccoli =
    Pick<AppState, "setBroccoli"> &
{
    type: ACTIONS.SET_BROCCOLI
}

export type SetOpeningVol =
    Pick<AppState, "setOpeningVol"> &
{
    type: ACTIONS.SET_OPENINGVOL
}

export type SetCanvas =
    Pick<AppState, "setCanvas"> &
{
    type: ACTIONS.SET_CANVAS
}

export type AppAction = SetStore | SetMirAnn | SetAnno | SetText | SetSelectedAnn | SetTextToHighlight | SetAnnItemOpen | SetCurrentContext | SetBroccoli | SetOpeningVol | SetCanvas