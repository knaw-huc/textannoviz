import React, { useContext } from "react"
import { appContext } from "../../state/context/context"

export function TextHighlighting() {
    const { state } = useContext(appContext)
    const [textToMark, setTextToMark] = React.useState(state.text.lines)
    console.log("text component begins")

    React.useEffect(() => {
        if (state.annItemOpen === true) {
            console.log("IF STATEMENT TRUE")
            console.log(state.textToHighlight)
            const markElement = `<mark>${textToMark.slice(state.textToHighlight.location.start.line, state.textToHighlight.location.end.line + 1).join("\n")}</mark>`
            console.log(markElement)
            textToMark.splice(state.textToHighlight.location.start.line, state.textToHighlight.location.end.offset, markElement)
            console.log(textToMark)
        } else {
            setTextToMark(state.text.lines)
            console.log("IF IS FALSE")
            console.log(textToMark)
            console.log(state.text)
        }
    }, [state.annItemOpen, state.text])

    //Warning: "dangerouslySetInnerHTML" is susceptible to XSS attacks. This might fix it: https://www.npmjs.com/package/dompurify
    return (
        <span dangerouslySetInnerHTML={{ __html: textToMark.join("\n") }} />
    )
}