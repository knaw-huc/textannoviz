import { ACTIONS, AppAction } from "../action/actions"
import { AppState } from "../state"
import { setAnnItemOpen } from "./set-annitemopen"
import { setAnno } from "./set-anno"
import { setBroccoli } from "./set-broccoli"
import { setCanvas } from "./set-canvas"
import { setCurrentContext } from "./set-currentcontext"
import { setStore } from "./set-mirador-store"
import { setMirAnn } from "./set-mirann"
import { setOpeningVol } from "./set-openingvol"
import { setSelectedAnn } from "./set-selectedann"
import { setText } from "./set-text"
import { setTextToHighlight } from "./set-texttohighlight"

export const appReducer = (state: AppState, action: AppAction): AppState => {
    console.log(action, state)

    switch (action.type) {
    case ACTIONS.SET_STORE:{
        return setStore(state, action)}
    case ACTIONS.SET_MIRANN:
        return setMirAnn(state, action)
    case ACTIONS.SET_ANNO:
        return setAnno(state, action)
    case ACTIONS.SET_TEXT:
        return setText(state, action)
    case ACTIONS.SET_SELECTEDANN:
        return setSelectedAnn(state, action)
    case ACTIONS.SET_TEXTTOHIGHLIGHT:
        return setTextToHighlight(state, action)
    case ACTIONS.SET_ANNITEMOPEN:
        return setAnnItemOpen(state, action)
    case ACTIONS.SET_CURRENTCONTEXT:
        return setCurrentContext(state, action)
    case ACTIONS.SET_BROCCOLI:
        return setBroccoli(state, action)
    case ACTIONS.SET_OPENINGVOL:
        return setOpeningVol(state, action)
    case ACTIONS.SET_CANVAS:
        return setCanvas(state, action)
    default:
        break
    }
}