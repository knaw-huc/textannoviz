import React, { useContext } from "react"
import styled from "styled-components"
import { Loading } from "../../backend/utils/Loader"
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation"
import { ACTIONS } from "../../state/action/actions"
import { appContext } from "../../state/context/context"
import { AnnotationButtons } from "./AnnotationButtons"
import { AnnotationItem } from "./AnnotationItem"
import { AnnotationLinks } from "./AnnotationLinks"

const AnnotationStyled = styled.div`
    min-width: 400px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
`

export function Annotation() {
    const { state, dispatch } = useContext(appContext)

    function handleSelected(selected: AnnoRepoAnnotation | undefined) {
        console.log(selected)
        return dispatch({type: ACTIONS.SET_SELECTEDANN, selectedAnn: selected})
    }

    return (
        <AnnotationStyled id="annotation">
            <AnnotationButtons />
            <AnnotationLinks />

            {state.anno ? state.anno.map((annotation, index) => (
                <AnnotationItem
                    key={index}
                    annot_id={index}
                    annotation={annotation}
                    selected={state.selectedAnn?.id === annotation.id}
                    onSelect={handleSelected}
                />
            )) : <Loading />}
        </AnnotationStyled>
    )
}