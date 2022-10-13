import { SetMirAnn } from "./MiradorActions"
import { MiradorState } from "./MiradorState"

export const setMirAnn = (miradorState: MiradorState, action: SetMirAnn) => {
    return {
        ...miradorState,
        mirAnn: action.mirAnn
    }
}