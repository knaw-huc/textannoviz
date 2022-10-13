import mirador from "mirador"
import React from "react"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import { AppContext, MiradorContext } from "../../state/context/context"

const Button = styled.button`
    background: #0d6efd;
    border-radius: 3px;
    border: none;
    color: white;
    padding: 5px;
    margin-right: 0.5em;
`

export const AnnotationButtons = () => {
    const app = React.useContext(AppContext)
    const mir = React.useContext(MiradorContext)
    const navigate = useNavigate()

    const nextCanvasClickHandler = () => {
        const nextCanvas = (app.currentContext.context as number) + 1
        const volume = app.currentContext.volumeId

        navigate(`/detail/volumes/${volume}/openings/${nextCanvas.toString()}`)
        mir.store.dispatch(mirador.actions.setNextCanvas("republic"))

        console.log(mir.store.getState())
    }

    const previousCanvasClickHandler = () => {
        const prevCanvas = (app.currentContext.context as number) - 1
        const volume = app.currentContext.volumeId

        navigate(`/detail/volumes/${volume}/openings/${prevCanvas.toString()}`)
        mir.store.dispatch(mirador.actions.setPreviousCanvas("republic"))
    }

    const testFunctionClickHandler = () => {
        console.log(mir.store.getState())
    }

    return (
        <div id="annotation-buttons">
            <Button onClick={nextCanvasClickHandler}>Next canvas</Button>
            <Button onClick={previousCanvasClickHandler}>Previous canvas</Button>
            <Button onClick={testFunctionClickHandler}>Test button</Button>
        </div>
    )
}