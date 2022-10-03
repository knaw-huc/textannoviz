import mirador from "mirador"
import React from "react"
import styled from "styled-components"
import { zoomAnnMirador } from "../../backend/utils/zoomAnnMirador"
import { AnnoRepoAnnotation, AttendantBody, ResolutionBody, SessionBody } from "../../model/AnnoRepoAnnotation"
import { ACTIONS } from "../../state/action/actions"
import { appContext } from "../../state/context/context"
import { AnnotationItemContent } from "./AnnotationItemContent"
import { fetchBroccoliBodyId } from "../../backend/utils/fetchBroccoli"

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
    const { state, dispatch } = React.useContext(appContext)

    function toggleOpen() {
        setOpen(!isOpen)
        props.onSelect(props.annotation)

        if(!isOpen) {
            //Zoom in on annotation in Mirador
            const zoom = zoomAnnMirador(props.annotation, state.broccoli.iiif.canvasIds[0])

            state.store.dispatch(mirador.actions.selectAnnotation("republic", props.annotation.id))
            state.store.dispatch(mirador.actions.updateViewport("republic", {
                x: zoom.zoomCenter.x,
                y: zoom.zoomCenter.y,
                zoom: 1 / zoom.miradorZoom
            }))

            //Set text to highlight
            fetchBroccoliBodyId(state.currentContext.volumeId, state.currentContext.context.toString(), props.annotation.body.id)
                .then(function(textToHighlight) {
                    if (textToHighlight !== null) {
                        console.log(textToHighlight)
                        dispatch({
                            type: ACTIONS.SET_TEXTTOHIGHLIGHT,
                            textToHighlight: textToHighlight.text
                        })
                        console.log("text to highlight dispatch done")
                        dispatch({
                            type: ACTIONS.SET_ANNITEMOPEN,
                            annItemOpen: true
                        })
                    } else {
                        return
                    }
                })
                .catch(console.error)

        } else {
            props.onSelect(undefined)
            state.store.dispatch(mirador.actions.deselectAnnotation("republic", props.annotation.id))
        }
    }

    /**
     * The next two functions might be performance intensive, especially for mobile users.
     * TODO: check performance of both functions
     */

    // function selectAnn() {
    //     state.store.dispatch(mirador.actions.selectAnnotation("republic", props.annotation.id))
    // }

    // function deselectAnn() {
    //     state.store.dispatch(mirador.actions.deselectAnnotation("republic", props.annotation.id))
    // }

    return (
        <AnnSnippet id="annotation-snippet">
            <Clickable onClick={toggleOpen} id="clickable">
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