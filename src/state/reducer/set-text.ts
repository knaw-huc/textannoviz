import { SetText } from "../action/actions"
import { AppState } from "../state"

export const setText = (state: AppState, action: SetText) => {
    return {
        ...state,
        setText: action.setText
    }
}