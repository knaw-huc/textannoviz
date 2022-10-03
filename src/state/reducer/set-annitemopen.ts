import { SetAnnItemOpen } from "../action/actions"
import { AppState } from "../state"

export const setAnnItemOpen = (state: AppState, action: SetAnnItemOpen) => {
    return {
        ...state,
        setAnnItemOpen: action.setAnnItemOpen
    }
}