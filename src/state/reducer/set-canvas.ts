import { SetCanvas } from "../action/actions"
import { AppState } from "../state"

export const setCanvas = (state: AppState, action: SetCanvas) => {
    return {
        ...state,
        setCanvas: action.setCanvas
    }
}