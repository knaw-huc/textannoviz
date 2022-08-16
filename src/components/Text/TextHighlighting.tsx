import React, { useContext } from "react"
import { appContext } from "../../state/context"

export function TextHighlighting() {
    const { state } = useContext(appContext)
    console.log("text component begins")

    const subtract = (endIndex: number, startIndex: number): number => {
        const result = endIndex - startIndex + 1
        return result
    }
    
    const textToMark = state.text

    React.useEffect(() => {
        console.log("if statement is true")
        const markElement = `<mark>${state.text.slice(state.textToHighlight.start.line, state.textToHighlight.end.line + 1).join("\n")}</mark>`
        console.log(markElement)
        textToMark.splice(state.textToHighlight.start.line, subtract(state.textToHighlight.end.line, state.textToHighlight.start.line), markElement)
        console.log(textToMark)

        // if (state.annItemOpen === false) {
        //     textToMark = state.text
        //     console.log(textToMark)
        // }
    }, [state.text, state.textToHighlight.end.line, state.textToHighlight.start.line, textToMark])

    //Warning: "dangerouslySetInnerHTML" is susceptible to XSS attacks. This might fix it: https://www.npmjs.com/package/dompurify
    return (
        <span dangerouslySetInnerHTML={{ __html: textToMark.join("\n") }} />
    )
}