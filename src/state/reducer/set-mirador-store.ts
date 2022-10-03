import { SetStore } from "../action/actions"
import { AppState } from "../state"

export const setStore = (state: AppState, action: SetStore) => {
    return {
        ...state,
        setStore: action.setStore
    }
}