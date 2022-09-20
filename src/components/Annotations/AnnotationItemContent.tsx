import React, { useContext } from "react"
import { HOSTS } from "../../Config"
import { AnnoRepoAnnotation, AttendanceListBody, AttendantBody, ResolutionBody, ReviewedBody, SessionBody } from "../../model/AnnoRepoAnnotation"
import styled from "styled-components"
import { appContext } from "../../state/context"
import mirador from "mirador"
import { visualizeAnnosMirador } from "../../backend/utils/visualizeAnnosMirador"
import { zoomAnnMirador } from "../../backend/utils/zoomAnnMirador"

type AnnotationContentProps = {
    annotation: AnnoRepoAnnotation | undefined
}

const AnnPreview = styled.div`
    overflow: auto;
`

export function AnnotationItemContent(props: AnnotationContentProps) {
    const [showFull, setShowFull] = React.useState(false)
    const { state } = useContext(appContext)

    console.log(state.broccoli.iiif.canvasIds)

    const clickHandler = () => {
        state.store.dispatch(mirador.actions.setCanvas("republic", state.broccoli.iiif.canvasIds[1]))

        const iiifAnns = visualizeAnnosMirador(state.broccoli, state.store, state.broccoli.iiif.canvasIds[1])
        console.log(iiifAnns)

        setTimeout(() => {
            const zoom = zoomAnnMirador(props.annotation, state.broccoli.iiif.canvasIds[1])

            state.store.dispatch(mirador.actions.selectAnnotation("republic", props.annotation.id))
            state.store.dispatch(mirador.actions.updateViewport("republic", {
                x: zoom.zoomCenter.x,
                y: zoom.zoomCenter.y,
                zoom: 1 / zoom.miradorZoom
            }))
        }, 100)
    }

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
                                <li>Text: <br /><code>{(props.annotation.body as ReviewedBody).text}</code></li>
                            )
                        case ("AttendanceList"):
                            return (
                                (props.annotation.body as AttendanceListBody).attendanceSpans.map((attendant, i) => {
                                    return (
                                        attendant.delegateName != "" ? <li key={i}>Attendant: <code>{attendant.delegateName}</code></li> : null
                                    )
                                })
                            )
                        default:
                            return
                        }
                    })()}
                    <li>
                        {(() => {
                            if (state.broccoli.iiif.canvasIds.length > 1) {
                                return (
                                    <p onClick={clickHandler}>This annotation extends to the next opening.<br />Click here to view next opening.</p>
                                )
                            }
                        })()}
                    </li>
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