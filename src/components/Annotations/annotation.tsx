import React, { useContext } from "react"
import { Link, useParams } from "react-router-dom"
import styled from "styled-components"
import { Loading } from "../../backend/utils/Loader"
import { AnnoRepoAnnotation } from "../../model/AnnoRepoAnnotation"
import { ACTIONS } from "../../state/actions"
import { appContext } from "../../state/context"
import { AnnotationItem } from "./AnnotationItem"
import { AnnotationButtons } from "./AnnotationButtons"

const AnnotationStyled = styled.div`
    min-width: 400px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
`

export function Annotation() {
    const { state, dispatch } = useContext(appContext)
    const { volumeNum, openingNum } = useParams<{ volumeNum: string, openingNum: string }>()

    function handleSelected(selected: AnnoRepoAnnotation | undefined) {
        console.log(selected)
        return dispatch({type: ACTIONS.SET_SELECTEDANN, selectedAnn: selected})
    }

    return (
        <AnnotationStyled id="annotation">
            <AnnotationButtons />
            <Link to="/">Home</Link> <br/>
            {volumeNum && openingNum ? <Link to="/detail/resolutions/urn:republic:session-1728-06-19-ordinaris-num-1-resolution-16">Switch to resolution view</Link> : <Link to="/detail/volumes/1728/openings/285">Switch to opening view</Link>}

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