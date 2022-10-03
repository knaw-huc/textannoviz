import { SetCurrentContext } from "../action/actions"
import { AppState } from "../state"

export const setCurrentContext = (state: AppState, action: SetCurrentContext) => {
    return {
        ...state,
        setCurrentContext: action.setCurrentContext
    }
}