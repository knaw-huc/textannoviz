import React from "react"
import { AnnotationsContext, TextContext } from "../../state/context/context"

export function TextHighlighting() {
    const annos = React.useContext(AnnotationsContext)
    const text = React.useContext(TextContext)
    const [textToMark, setTextToMark] = React.useState(text.text.lines)
    console.log("text component begins")

    React.useEffect(() => {
        if (annos.annItemOpen === true) {
            console.log("IF STATEMENT TRUE")
            console.log(text.textToHighlight)
            const markElement = `<mark>${textToMark.slice(text.textToHighlight.location.start.line, text.textToHighlight.location.end.line + 1).join("\n")}</mark>`
            console.log(markElement)
            textToMark.splice(text.textToHighlight.location.start.line, text.textToHighlight.location.end.offset, markElement)
            console.log(textToMark)
        } else {
            setTextToMark(text.text.lines)
            console.log("IF IS FALSE")
            console.log(textToMark)
            console.log(text.text)
        }
    }, [annos.annItemOpen, text.text])

    //Warning: "dangerouslySetInnerHTML" is susceptible to XSS attacks. This might fix it: https://www.npmjs.com/package/dompurify
    return (
        <span dangerouslySetInnerHTML={{ __html: textToMark.join("\n") }} />
    )
}