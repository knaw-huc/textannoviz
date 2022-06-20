import React from "react"
import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import { appContext } from "../state/context"
import getBodyValue from "../backend/utils/getBodyValue"
import {AnnotationItemContent} from "./AnnotationItemContent"
import mirador from "mirador"
import findImageRegions from "../backend/utils/findImageRegions"

type AnnotationSnippetProps = {
    annot_id: React.Key,
    annotation: ElucidateAnnotation,
    selected: boolean
    onSelect: (a: ElucidateAnnotation | undefined) => void
}

export function AnnotationItem(props: AnnotationSnippetProps) {
    const [isOpen, setOpen] = React.useState(false)
    const { state } = React.useContext(appContext)

    function toggleOpen() {
        setOpen(!isOpen)

        if(!isOpen) {
            const region = findImageRegions(props.annotation)
            const [x, y, w, h] = region[0].split(",")
            console.log(x, y, w, h)      
            const boxToZoom = {
                x: parseInt(x),
                y: parseInt(y),
                width: parseInt(w),
                height: parseInt(h)
            }
            const zoomCenter = {
                x: boxToZoom.x + boxToZoom.width / 2,
                y: boxToZoom.y + boxToZoom.height / 2
            }
            state.store.dispatch(mirador.actions.selectAnnotation("republic", props.annotation.id))
            state.store.dispatch(mirador.actions.updateViewport("republic", {
                x: zoomCenter.x,
                y: zoomCenter.y,
                zoom: 0.8 / boxToZoom.width
            }))

        } else {
            state.store.dispatch(mirador.actions.deselectAnnotation("republic", props.annotation.id))
        }
    }

    // React.useEffect(() => {
    //     if (props.selected) {
    //         props.onSelect(undefined)
    //     } else {
    //         props.onSelect(props.annotation)
    //     }
    // }, [])

    return (
        <div id="annotation-snippet">
            <div onClick={toggleOpen} id="clickable">
                {getBodyValue(props.annotation)}
            </div>
            {isOpen && <AnnotationItemContent ann={props.annotation}/>}
        </div>
    )
}