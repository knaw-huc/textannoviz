import { SetAnno } from "../action/actions"
import { AppState } from "../state"

export const setAnno = (state: AppState, action: SetAnno) => {
    return {
        ...state,
        setAnno: action.setAnno
    }
}