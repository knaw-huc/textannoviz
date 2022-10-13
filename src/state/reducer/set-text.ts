import { SetText } from "../action/actions"
import { AppState } from "../state"

export const setText = (state: AppState, action: SetText) => {
    return {
        ...state,
        text: action.text
    }
}