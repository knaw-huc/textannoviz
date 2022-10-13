import { SetStore } from "./MiradorActions"
import { MiradorState } from "./MiradorState"

export const setStore = (miradorState: MiradorState, action: SetStore) => {
    return {
        ...miradorState,
        store: action.store
    }
}