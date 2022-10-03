import { SetTextToHighlight } from "../action/actions"
import { AppState } from "../state"

export const setTextToHighlight = (state: AppState, action: SetTextToHighlight) => {
    return {
        ...state,
        setTextToHighlight: action.setTextToHighlight
    }
}