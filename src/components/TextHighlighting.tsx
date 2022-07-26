import React, { useContext } from "react"
import { appContext } from "../state/context"

export function TextHighlighting() {
    const { state } = useContext(appContext)
    const [textToMark, setTextToMark] = React.useState(state.text)
    console.log("text component begins")

    const subtract = (endIndex: number, startIndex: number): number => {
        const result = endIndex - startIndex + 1
        return result
    }
    // let textToMark: any = state.text

    React.useEffect(() => {
        console.log("if statement is true")
        const markElement = `<mark>${state.text.slice(state.textToHighlight.start.line, state.textToHighlight.end.line + 1).join("\n")}</mark>`
        console.log(markElement)
        setTextToMark(textToMark.splice(state.textToHighlight.start.line, subtract(state.textToHighlight.end.line, state.textToHighlight.start.line), markElement))
        console.log(textToMark)

        if (state.annItemOpen === false) {
            setTextToMark(state.text)
            console.log(textToMark)
        }
    }, [state.annItemOpen])

    console.log(textToMark)

    //Warning: "dangerouslySetInnerHTML" is susceptible to XSS attacks. This might fix it: https://www.npmjs.com/package/dompurify
    return (
        <span dangerouslySetInnerHTML={{ __html: textToMark.join("\n") }} />
    )
}