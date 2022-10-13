import { SetAnnItemOpen } from "../action/actions"
import { AppState } from "../state"

export const setAnnItemOpen = (state: AppState, action: SetAnnItemOpen) => {
    return {
        ...state,
        annItemOpen: action.annItemOpen
    }
}