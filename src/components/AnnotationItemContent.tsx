//import { ElucidateAnnotation } from "../model/ElucidateAnnotation"
import React from "react"
// import getBodyType from "../backend/utils/getBodyType"
// import getAttendantName from "../backend/utils/getAttendantInfo"
// import getResolutionInfo from "../backend/utils/getResolutionInfo"
import { HOSTS } from "../Config"
import { AnnoRepoAnnotation, AttendantBody, ResolutionBody, SessionBody } from "../model/AnnoRepoAnnotation"
import styled from "styled-components"

type AnnotationContentProps = {
    ann: AnnoRepoAnnotation | undefined
}

const AnnPreview = styled.div`
    overflow: auto;
`

export function AnnotationItemContent(props: AnnotationContentProps) {
    const ann = props.ann
    const [showFull, setShowFull] = React.useState(false)

    return (
        <>
            {ann && <div id="annotation-content">
                <ul>
                    {/* <li>Annotation ID: <br /><code>{ann.id}</code></li> */}
                    {props.ann.body.type === "Attendant" ? <li>Attendant ID: <br /><code><a title="Link to RAA" rel="noreferrer" target="_blank" href={`${HOSTS.RAA}/${(props.ann.body as AttendantBody).metadata.delegateId}`}>{(props.ann.body as AttendantBody).metadata.delegateId}</a></code></li> : null}
                    {props.ann.body.type === "Attendant" ? <li>Attendant name: <br /><code>{(props.ann.body as AttendantBody).metadata.delegateName}</code></li> : null}
                    {props.ann.body.type === "Resolution" ? <li>Proposition type: <br /><code>{(props.ann.body as ResolutionBody).metadata.resolutionType}</code></li> : null}
                    {props.ann.body.type === "Session" ? <li>Date: <br /><code>{(props.ann.body as SessionBody).metadata.sessionDate}</code></li> : null}
                    {props.ann.body.type === "Session" ? <li>Weekday: <br /><code>{(props.ann.body as SessionBody).metadata.sessionWeekday}</code></li> : null}
                    <li>
                        <button className="show-full" onClick={(e) => {
                            e.stopPropagation()
                            setShowFull(!showFull)
                        }}>full annotation {String.fromCharCode(showFull ? 9663 : 9657)}</button>
                        <br />
                        <AnnPreview id="annotation-preview">
                            {showFull && <pre>
                                {JSON.stringify(ann, null, 2)}
                            </pre>}
                        </AnnPreview>
                    </li>
                </ul>

            </div>}
        </>
    )

}