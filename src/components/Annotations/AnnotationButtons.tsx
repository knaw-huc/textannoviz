import mirador from "mirador"
import React from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { appContext } from "../../state/context/context"

const Button = styled.button`
    background: #0d6efd;
    border-radius: 3px;
    border: none;
    color: white;
    padding: 5px;
    margin-right: 0.5em;
`

export const AnnotationButtons = () => {
    const { state } = React.useContext(appContext)
    const navigate = useNavigate()

    const nextCanvasClickHandler = () => {
        const nextCanvas = (state.currentContext.context as number) + 1
        const volume = state.currentContext.volumeId

        navigate(`/detail/volumes/${volume}/openings/${nextCanvas.toString()}`)
        state.store.dispatch(mirador.actions.setNextCanvas("republic"))

        console.log(state.store.getState())
    }

    const previousCanvasClickHandler = () => {
        const prevCanvas = (state.currentContext.context as number) - 1
        const volume = state.currentContext.volumeId

        navigate(`/detail/volumes/${volume}/openings/${prevCanvas.toString()}`)
        state.store.dispatch(mirador.actions.setPreviousCanvas("republic"))
    }

    const testFunctionClickHandler = () => {
        console.log(state.store.getState())
    }

    return (
        <div id="annotation-buttons">
            <Button onClick={nextCanvasClickHandler}>Next canvas</Button>
            <Button onClick={previousCanvasClickHandler}>Previous canvas</Button>
            <Button onClick={testFunctionClickHandler}>Test button</Button>
        </div>
    )
}