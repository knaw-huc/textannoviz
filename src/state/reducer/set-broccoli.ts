import { SetBroccoli } from "../action/actions"
import { AppState } from "../state"

export const setBroccoli = (state: AppState, action: SetBroccoli) => {
    return {
        ...state,
        broccoli: action.broccoli
    }
}