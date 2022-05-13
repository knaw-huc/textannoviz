import React from "react"
import { appContext } from "../../state/context"
import Elucidate from "../Elucidate"
import { ElucidateAnnotation } from "../../model/ElucidateAnnotation"
import getVersionId from "../utils/getVersionId"
import getBodyValue from "../utils/getBodyValue"
import findSelectorTarget from "../utils/findSelectorTarget"
import TextRepo from "../TextRepo"
import { ACTIONS } from "../../state/actions"

export async function FetchData() {
    const { state, dispatch } = React.useContext(appContext)

    const currentState = state.store.getState()

    const jpg = await fetch(currentState.windows.republic.canvasId)
        .then(response => {
            return response.json()
        })
        .then(data => {
            return data.label
        })
    const ann = await Elucidate.getByJpg(jpg)
    if (ann[0]) {
        const versionId = getVersionId(ann[0].id)

        const scanPage: ElucidateAnnotation[] = ann.filter(item => {
            return getBodyValue(item) === "scanpage"
        })

        const annFiltered: ElucidateAnnotation[] = ann.filter(item => {
            return getBodyValue(item) != "line" && "column"
        })

        const selectorTarget = findSelectorTarget(scanPage[0])
        const beginRange = selectorTarget.selector.start
        const endRange = selectorTarget.selector.end
        const text = await TextRepo.getByVersionIdAndRange(versionId, beginRange, endRange)

        dispatch({
            type: ACTIONS.SET_ANNO,
            anno: annFiltered
        })

        dispatch({
            type: ACTIONS.SET_TEXT,
            text: text
        })
    } else {
        return
    }
}
