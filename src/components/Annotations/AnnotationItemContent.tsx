import React from "react";
import styled from "styled-components";
//import { zoomAnnMirador } from "../../backend/utils/zoomAnnMirador"
import { HOSTS } from "../../Config";
import {
  AnnoRepoAnnotation,
  AttendanceListBody,
  AttendantBody,
  ResolutionBody,
  ReviewedBody,
  SessionBody,
} from "../../model/AnnoRepoAnnotation";
import { MIRADOR_ACTIONS } from "../../state/mirador/MiradorActions";
import { miradorContext } from "../../state/mirador/MiradorContext";

type AnnotationContentProps = {
  annotation: AnnoRepoAnnotation | undefined;
};

const AnnPreview = styled.div`
  overflow: auto;
`;

export function AnnotationItemContent(props: AnnotationContentProps) {
  const [showFull, setShowFull] = React.useState(false);

  const { miradorState, miradorDispatch } = React.useContext(miradorContext);

  const nextCanvasClickHandler = () => {
    const canvasIds = miradorState.canvas.canvasIds;
    const currentIndex = miradorState.canvas.currentIndex;

    if (currentIndex >= canvasIds.length - 1) {
      return;
    }

    let nextCanvas = currentIndex;
    nextCanvas += 1;

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_CANVAS,
      canvas: {
        canvasIds: canvasIds,
        currentIndex: nextCanvas,
      },
    });
  };

  const prevCanvasClickHandler = () => {
    const canvasIds = miradorState.canvas.canvasIds;
    const currentIndex = miradorState.canvas.currentIndex;

    console.log(currentIndex, canvasIds.length - 1);

    if (currentIndex > canvasIds.length - 1) {
      return;
    }

    let prevCanvas = currentIndex;
    prevCanvas -= 1;

    miradorDispatch({
      type: MIRADOR_ACTIONS.SET_CANVAS,
      canvas: {
        canvasIds: canvasIds,
        currentIndex: prevCanvas,
      },
    });
  };

  return (
    <>
      {props.annotation && (
        <div id="annotation-content">
          <ul>
            {(() => {
              switch (props.annotation.body.type) {
                case "Attendant":
                  return (
                    <>
                      <li>
                        Attendant ID: <br />
                        <code>
                          <a
                            title="Link to RAA"
                            rel="noreferrer"
                            target="_blank"
                            href={`${HOSTS.RAA}/${
                              (props.annotation.body as AttendantBody).metadata
                                .delegateId
                            }`}
                          >
                            {
                              (props.annotation.body as AttendantBody).metadata
                                .delegateId
                            }
                          </a>
                        </code>
                      </li>
                      <li>
                        Attendant name: <br />
                        <code>
                          {
                            (props.annotation.body as AttendantBody).metadata
                              .delegateName
                          }
                        </code>
                      </li>
                    </>
                  );
                case "Resolution":
                  return (
                    <>
                      <li>
                        Proposition type: <br />
                        <code>
                          {
                            (props.annotation.body as ResolutionBody).metadata
                              .propositionType
                          }
                        </code>
                      </li>
                      <li>
                        Resolution type: <br />
                        <code>
                          {
                            (props.annotation.body as ResolutionBody).metadata
                              .resolutionType
                          }
                        </code>
                      </li>
                    </>
                  );
                case "Session":
                  return (
                    <>
                      <li>
                        Date: <br />
                        <code>
                          {
                            (props.annotation.body as SessionBody).metadata
                              .sessionDate
                          }
                        </code>
                      </li>
                      <li>
                        Weekday: <br />
                        <code>
                          {
                            (props.annotation.body as SessionBody).metadata
                              .sessionWeekday
                          }
                        </code>
                      </li>
                    </>
                  );
                case "Reviewed":
                  return (
                    <li>
                      Text: <br />
                      <code>
                        {(props.annotation.body as ReviewedBody).text}
                      </code>
                    </li>
                  );
                case "AttendanceList":
                  return (
                    props.annotation.body as AttendanceListBody
                  ).attendanceSpans.map((attendant, i) => {
                    return attendant.delegateName != "" ? (
                      <li key={i}>
                        Attendant: <code>{attendant.delegateName}</code>
                      </li>
                    ) : null;
                  });
                default:
                  return;
              }
            })()}
            <li>
              {(() => {
                if (
                  miradorState.canvas.canvasIds.length > 1 &&
                  miradorState.canvas.currentIndex <
                    miradorState.canvas.canvasIds.length - 1
                ) {
                  return (
                    <button onClick={nextCanvasClickHandler}>
                      Next canvas
                    </button>
                    // <p onClick={clickHandler}>This annotation extends to the next opening.<br />Click here to view next opening.</p>
                  );
                }
              })()}
            </li>
            <li>
              {(() => {
                if (
                  miradorState.canvas.canvasIds.length > 1 &&
                  miradorState.canvas.currentIndex > 0
                ) {
                  return (
                    <button onClick={prevCanvasClickHandler}>
                      Previous canvas
                    </button>
                  );
                }
              })()}
            </li>
            <li>
              <button
                className="show-full"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFull(!showFull);
                }}
              >
                full annotation {String.fromCharCode(showFull ? 9663 : 9657)}
              </button>
              <br />
              <AnnPreview id="annotation-preview">
                {showFull && (
                  <pre>{JSON.stringify(props.annotation, null, 2)}</pre>
                )}
              </AnnPreview>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}
