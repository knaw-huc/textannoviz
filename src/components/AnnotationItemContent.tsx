import React from "react"
import { HOSTS } from "../Config"
import { AnnoRepoAnnotation, AttendantBody, ResolutionBody, ReviewedBody, SessionBody } from "../model/AnnoRepoAnnotation"
import styled from "styled-components"

type AnnotationContentProps = {
    annotation: AnnoRepoAnnotation | undefined
}

const AnnPreview = styled.div`
    overflow: auto;
`

export function AnnotationItemContent(props: AnnotationContentProps) {
    const [showFull, setShowFull] = React.useState(false)

    return (
        <>
            {props.annotation && <div id="annotation-content">
                <ul>
                    {(() => {
                        switch (props.annotation.body.type) {
                        case ("Attendant"):
                            return (
                                <>
                                    <li>Attendant ID: <br /><code><a title="Link to RAA" rel="noreferrer" target="_blank" href={`${HOSTS.RAA}/${(props.annotation.body as AttendantBody).metadata.delegateId}`}>{(props.annotation.body as AttendantBody).metadata.delegateId}</a></code></li>
                                    <li>Attendant name: <br /><code>{(props.annotation.body as AttendantBody).metadata.delegateName}</code></li>
                                </>
                            )
                        case ("Resolution"):
                            return (
                                <>
                                    <li>Proposition type: <br /><code>{(props.annotation.body as ResolutionBody).metadata.propositionType}</code></li>
                                    <li>Resolution type: <br /><code>{(props.annotation.body as ResolutionBody).metadata.resolutionType}</code></li>
                                </>
                            )
                        case ("Session"):
                            return (
                                <>
                                    <li>Date: <br /><code>{(props.annotation.body as SessionBody).metadata.sessionDate}</code></li>
                                    <li>Weekday: <br /><code>{(props.annotation.body as SessionBody).metadata.sessionWeekday}</code></li>
                                </>
                            )
                        case ("Reviewed"):
                            return (
                                <>
                                    <li>Text: <br /><code>{(props.annotation.body as ReviewedBody).text}</code></li>
                                </>
                            )
                        default:
                            return
                        }
                    })()}
                    <li>
                        <button className="show-full" onClick={(e) => {
                            e.stopPropagation()
                            setShowFull(!showFull)
                        }}>full annotation {String.fromCharCode(showFull ? 9663 : 9657)}</button>
                        <br />
                        <AnnPreview id="annotation-preview">
                            {showFull && <pre>
                                {JSON.stringify(props.annotation, null, 2)}
                            </pre>}
                        </AnnPreview>
                    </li>
                </ul>

            </div>}
        </>
    )

}