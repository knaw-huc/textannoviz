import { SetMirAnn } from "../action/actions"
import { AppState } from "../state"

export const setMirAnn = (state: AppState, action: SetMirAnn) => {
    return {
        ...state,
        mirAnn: action.mirAnn
    }
}