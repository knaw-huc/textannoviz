import React from "react"
import styled from "styled-components"
import { Loading } from "../../backend/utils/Loader"
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation"
import { AnnotationButtons } from "./AnnotationButtons"
import { AnnotationItem } from "./AnnotationItem"
import { AnnotationLinks } from "./AnnotationLinks"
import { useAnnotationsContext } from "./AnnotationsContext"

const AnnotationStyled = styled.div`
    min-width: 400px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
`

export function Annotation() {
    const annotationsState = useAnnotationsContext().state

    function handleSelected(selected: AnnoRepoAnnotation | undefined) {
        console.log(selected)
        return
        // return dispatch({type: ACTIONS.SET_SELECTEDANN, selectedAnn: selected})
    }

    return (
        <AnnotationStyled id="annotation">
            <AnnotationButtons />
            <AnnotationLinks />

            {annotationsState.annotations.length > 0 ? annotationsState.annotations.map((annotation, index) => (
                <AnnotationItem
                    key={index}
                    annot_id={index}
                    annotation={annotation}
                    selected={annotationsState.selectedAnn?.id === annotation.id}
                    onSelect={handleSelected}
                />
            )) : <Loading />}
        </AnnotationStyled>
    )
}