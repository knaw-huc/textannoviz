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

    fetch(currentState.windows.republic.canvasId)
        .then(response => {
            return response.json()
        })
        .then(async data => {
            const jpg = data.label
            const ann = await Elucidate.getByJpg(jpg)
            if (ann[0]) {
                const versionId = getVersionId(ann[0].id)

                const scanPageFiltered: ElucidateAnnotation[] = ann.filter(item => {
                    return getBodyValue(item) === "scanpage"
                })
                const annFiltered: ElucidateAnnotation[] = ann.filter(item => {
                    return getBodyValue(item) != "line" && "column"
                })
                console.log(annFiltered)
                console.log(scanPageFiltered)

                const selectorTarget = findSelectorTarget(scanPageFiltered[0])
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
        })
}
