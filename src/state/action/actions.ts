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
    Pick<AppState["mirador"], "store"> &
{
    type: ACTIONS.SET_STORE
}

export type SetMirAnn =
    Pick<AppState["mirador"], "mirAnn"> &
{
    type: ACTIONS.SET_MIRANN
}

export type SetAnno = 
    Pick<AppState["annos"], "annotations"> &
{
    type: ACTIONS.SET_ANNO
}

export type SetText = 
    Pick<AppState["textContainer"], "text"> &
{
    type: ACTIONS.SET_TEXT
}

export type SetSelectedAnn =
    Pick<AppState["annos"], "selectedAnn"> &
{
    type: ACTIONS.SET_SELECTEDANN
}

export type SetTextToHighlight =
    Pick<AppState["textContainer"], "textToHighlight"> &
{
    type: ACTIONS.SET_TEXTTOHIGHLIGHT
}

export type SetAnnItemOpen =
    Pick<AppState["annos"], "annItemOpen"> &
{
    type: ACTIONS.SET_ANNITEMOPEN
}

export type SetCurrentContext =
    Pick<AppState["app"], "currentContext"> &
{
    type: ACTIONS.SET_CURRENTCONTEXT
}

export type SetBroccoli =
    Pick<AppState, "broccoli"> &
{
    type: ACTIONS.SET_BROCCOLI
}

export type SetOpeningVol =
    Pick<AppState["app"], "openingVol"> &
{
    type: ACTIONS.SET_OPENINGVOL
}

export type SetCanvas =
    Pick<AppState["app"], "canvas"> &
{
    type: ACTIONS.SET_CANVAS
}

export type AppAction = SetStore | SetMirAnn | SetAnno | SetText | SetSelectedAnn | SetTextToHighlight | SetAnnItemOpen | SetCurrentContext | SetBroccoli | SetOpeningVol | SetCanvas