import React from "react"
import { useContext } from "react"
import { appContext } from "../state/context"
import styled from "styled-components"
import { Loading } from "../backend/utils/Loader"
import Highlighter from "react-highlight-words"
import { fetchJson } from "../backend/utils/fetchJson"
import { ACTIONS } from "../state/actions"

const TextStyled = styled.div`
    min-width: 300px;
    height: 800px;
    padding: 0.7em;
    overflow: auto;
    white-space: pre-wrap;
    border-left: 1px solid black;
    border-right: 1px solid black;
    font-size: 1rem;
    line-height: 2.25rem;
    mark {
        background-color: #ffc04b;
        color: black;
    }
`
//https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-attendant-2
//https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-attendant-6
//https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-attendant-11

//https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-resolution-3

function TextHighlighter() {
    const { dispatch } = useContext(appContext)

    React.useEffect(() => {
        fetchJson("https://broccoli.tt.di.huc.knaw.nl/republic/v0?opening=285&volume=1728&bodyId=urn:example:republic:meeting-1728-06-19-session-1-resolution-3")
            .then(function(broccoli) {
                console.log(broccoli)
                dispatch({
                    type: ACTIONS.SET_TEXTTOHIGHLIGHT,
                    textToHighlight: broccoli
                })
            })
    }, [])
}

export function Text() {
    const { state } = useContext(appContext)
    TextHighlighter()
    
    // React.useEffect(() => {
    //     if (state.text) {
    //         console.log(state.text.slice(0, 15))
    //     }
    // }, [state.text])

    return (
        <TextStyled id="text">
            {state.text && state.textToHighlight ? <Highlighter
                highlightClassName="texthighlight"
                searchWords={state.text.slice(state.textToHighlight.start.line, state.textToHighlight.end.line)}
                //searchWords={[state.text[state.textToHighlight.start.line]]}
                //searchWords={[state.text.slice(state.textToHighlight.start.line, state.textToHighlight.end.line)]}
                autoEscape={true}
                textToHighlight={state.text.join("\n")}
            /> : <Loading />}
            {/* <Highlighter
                highlightClassName="texthighlight"
                searchWords={[state.text ? state.text[5] : ""]}
                autoEscape={false}
                textToHighlight={state.text ? state.text.join("\n") : ""}
            /> */}
            {/* {state.text ? state.text.join("\n") : <Loading/>} */}
        </TextStyled>
    )
}