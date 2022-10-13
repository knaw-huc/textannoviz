import mirador from "mirador"
import React from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { useMiradorContext } from "../Mirador/MiradorContext"

const Button = styled.button`
    background: #0d6efd;
    border-radius: 3px;
    border: none;
    color: white;
    padding: 5px;
    margin-right: 0.5em;
`

export const AnnotationButtons = () => {
    const miradorState = useMiradorContext().state
    const navigate = useNavigate()

    const nextCanvasClickHandler = () => {
        const nextCanvas = (miradorState.currentContext.opening as number) + 1
        const volume = miradorState.currentContext.volume

        navigate(`/detail/volumes/${volume}/openings/${nextCanvas.toString()}`)
        miradorState.store.dispatch(mirador.actions.setNextCanvas("republic"))

        console.log(miradorState.store.getState())
    }

    const previousCanvasClickHandler = () => {
        const prevCanvas = (miradorState.currentContext.opening as number) - 1
        const volume = miradorState.currentContext.volume

        navigate(`/detail/volumes/${volume}/openings/${prevCanvas.toString()}`)
        miradorState.store.dispatch(mirador.actions.setPreviousCanvas("republic"))
    }

    const testFunctionClickHandler = () => {
        console.log(miradorState.store.getState())
    }

    return (
        <div id="annotation-buttons">
            <Button onClick={nextCanvasClickHandler}>Next canvas</Button>
            <Button onClick={previousCanvasClickHandler}>Previous canvas</Button>
            <Button onClick={testFunctionClickHandler}>Test button</Button>
        </div>
    )
}