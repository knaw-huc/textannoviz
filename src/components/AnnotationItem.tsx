import React from "react"
import { AnnoRepoAnnotation, AttendantBody, ResolutionBody, SessionBody } from "../model/AnnoRepoAnnotation"
import { appContext } from "../state/context"
import {AnnotationItemContent} from "./AnnotationItemContent"
import mirador from "mirador"
import findImageRegions from "../backend/utils/findImageRegions"
import styled from "styled-components"
// import { fetchJson } from "../backend/utils/fetchJson"
// import { ACTIONS } from "../state/actions"

type AnnotationSnippetProps = {
    annot_id: React.Key,
    annotation: AnnoRepoAnnotation,
    selected: boolean
    onSelect: (a: AnnoRepoAnnotation | undefined) => void
}

const AnnSnippet = styled.div`
    margin: 5px 0;
    padding: 10px;
    border-style: solid;
    border-color: darkgray;
    border-width: 1px;
`

const Clickable = styled.div`
    cursor: pointer;
    font-weight: bold;
    user-select: none;
    &:hover {
        text-decoration: underline;
    }
`

export function AnnotationItem(props: AnnotationSnippetProps) {
    const [isOpen, setOpen] = React.useState(false)
    const { state } = React.useContext(appContext)

    function toggleOpen() {
        setOpen(!isOpen)
        props.onSelect(props.annotation)

        if(!isOpen) {
            //Visualize annotation in Mirador
            const region = findImageRegions(props.annotation)
            const [x, y, w, h] = region[0].split(",")
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

            //Set text to highlight
            // fetchJson(`https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=${props.annotation.body.id}`)
            //     .then(function(textToHighlight) {
            //         if (textToHighlight !== null) {
            //             console.log(textToHighlight)
            //             dispatch({
            //                 type: ACTIONS.SET_TEXTTOHIGHLIGHT,
            //                 textToHighlight: textToHighlight
            //             })
            //             console.log("text to highlight dispatch done")
            //         } else {
            //             return
            //         }
            //     })
            //     .catch(console.error)

        } else {
            props.onSelect(undefined)
            state.store.dispatch(mirador.actions.deselectAnnotation("republic", props.annotation.id))
        }
    }

    /**
     * The next two functions might be performance intensive, especially for mobile users.
     * TODO: check performance of both functions
     */

    function selectAnn() {
        state.store.dispatch(mirador.actions.selectAnnotation("republic", props.annotation.id))
    }

    function deselectAnn() {
        state.store.dispatch(mirador.actions.deselectAnnotation("republic", props.annotation.id))
    }

    return (
        <AnnSnippet id="annotation-snippet">
            <Clickable onMouseOver={selectAnn} onMouseLeave={deselectAnn} onClick={toggleOpen} id="clickable">
                {(() => {
                    switch(props.annotation.body.type) {
                    case("Attendant"):
                        return (props.annotation.body as AttendantBody).metadata.delegateName + " (" + `${props.annotation.body.type}` + ")"
                    case("Resolution"):
                        return (props.annotation.body as ResolutionBody).metadata.propositionType + " (" + `${props.annotation.body.type}` + ")"
                    case("Session"):
                        return (props.annotation.body as SessionBody).metadata.sessionWeekday + ", " + `${(props.annotation.body as SessionBody).metadata.sessionDate}`
                    default:
                        return props.annotation.body.type
                    }
                })()}
            </Clickable>
            {isOpen && <AnnotationItemContent annotation={props.annotation} />}
        </AnnSnippet>
    )
}