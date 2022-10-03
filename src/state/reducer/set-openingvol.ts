import { SetOpeningVol } from "../action/actions"
import { AppState } from "../state"

export const setOpeningVol = (state: AppState, action: SetOpeningVol) => {
    return {
        ...state,
        setOpeningVol: action.setOpeningVol
    }
}