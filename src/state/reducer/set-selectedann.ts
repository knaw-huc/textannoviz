import { SetSelectedAnn } from "../action/actions"
import { AppState } from "../state"

export const setSelectedAnn = (state: AppState, action: SetSelectedAnn) => {
    return {
        ...state,
        setSelectedAnn: action.setSelectedAnn
    }
}