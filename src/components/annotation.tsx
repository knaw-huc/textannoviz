import React, { useContext } from "react"
import { appContext } from "../state/context"
import mirador from "mirador"
import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import { AnnotationItem } from "./AnnotationItem"
import styled from "styled-components"
import { Loading } from "../backend/utils/Loader"
import { Link } from "react-router-dom"
import { ACTIONS } from "../state/actions"

const AnnotationStyled = styled.div`
    min-width: 400px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
`

const Button = styled.button`
    background: #0d6efd;
    border-radius: 3px;
    border: none;
    color: white;
    padding: 5px;
    margin-right: 0.5em;
`

export function Annotation() {
    const { state, dispatch } = useContext(appContext)
    // const [selectedAnn, setSelectedAnn] = React.useState<ElucidateAnnotation>(undefined)

    const nextCanvas = () => {
        state.store.dispatch(mirador.actions.setNextCanvas("republic"))
        // fetchData()
        //     .catch(console.error)
    }

    const previousCanvas = () => {
        state.store.dispatch(mirador.actions.setPreviousCanvas("republic"))
        // fetchData()
        //     .catch(console.error)
    }

    const testFunction = () => {
        console.log(state.store.dispatch(mirador.actions.receiveManifest("bla", "https://images.diginfra.net/api/pim/imageset/67533019-4ca0-4b08-b87e-fd5590e7a077/manifest")))
    }

    function handleSelected(selected: ElucidateAnnotation | undefined) {
        console.log(selected)
        return dispatch({type: ACTIONS.SET_SELECTEDANN, selectedAnn: selected})
    }

    return (
        <AnnotationStyled id="annotation">
            <Button onClick={nextCanvas}>Next canvas</Button>
            <Button onClick={previousCanvas}>Previous canvas</Button>
            <Button onClick={testFunction}>Test button</Button>
            <Link to="/">Home</Link>

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