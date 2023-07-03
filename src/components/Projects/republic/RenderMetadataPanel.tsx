import { UserIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useParams } from "react-router-dom";
import { HOSTS } from "../../../Config";
import {
  AnnoRepoAnnotation,
  AttendanceListBody,
  ResolutionBody,
  ScanBody,
  SessionBody,
} from "../../../model/AnnoRepoAnnotation";
import { Broccoli } from "../../../model/Broccoli";
import { useProjectStore } from "../../../stores/project";
import { fetchBroccoliScanWithOverlap } from "../../../utils/broccoli";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const RenderMetadataPanel = (props: RenderMetadataPanelProps) => {
  const params = useParams();
  const [attendanceList, setAttendanceList] = React.useState<Broccoli>();
  const projectConfig = useProjectStore((state) => state.projectConfig);
  const attendants = props.annotations.filter(
    (annotation) => annotation.body.type === "Attendant"
  );

  const resolution = props.annotations.filter(
    (annotation) => annotation.body.type === "Resolution"
  );

  const scan = props.annotations.filter(
    (annotation) => annotation.body.type === "Scan"
  );

  const session = props.annotations.filter(
    (annotation) => annotation.body.type === "Session"
  );

  React.useEffect(() => {
    const bodyTypes = props.annotations.map((anno) => anno.body.type);
    const session = props.annotations.filter(
      (annotation) => annotation.body.type === "Session"
    );
    setAttendanceList(undefined);
    async function fetchData() {
      const result: Broccoli = await fetchBroccoliScanWithOverlap(
        session[0].body.id,
        ["AttendanceList"],
        ["anno", "iiif", "text"],
        "self",
        projectConfig!
      );
      if (!ignore) {
        setAttendanceList(result);
      }
    }

    let ignore = false;

    if (!bodyTypes.includes("AttendanceList")) {
      fetchData();
    }

    return () => {
      ignore = true;
    };
  }, [projectConfig, props.annotations]);

  function renderAttendants() {
    const broccoliAttendanceList = props.annotations.filter(
      (anno) => anno.body.type === "AttendanceList"
    );

    if (attendanceList) {
      return (
        <div className="metadataPanelLiContent">
          {(
            attendanceList.anno[0].body as AttendanceListBody
          ).attendanceSpans.map((attendant, index) =>
            attendant.delegateName !== "" ? (
              <li key={index}>
                {<UserIcon style={{ height: "0.75rem", width: "0.75rem" }} />}
                <a
                  title="Link"
                  rel="noreferrer"
                  target="_blank"
                  href={`${HOSTS.RAA}/${attendant.delegateId}`}
                >
                  {attendant.delegateName}
                </a>
              </li>
            ) : null
          )}
        </div>
      );
    }

    if (broccoliAttendanceList.length > 0) {
      return (
        <div className="metadataPanelLiContent">
          {(
            broccoliAttendanceList[0].body as AttendanceListBody
          ).attendanceSpans.map((attendant, index) =>
            attendant.delegateName !== "" ? (
              <li key={index}>
                {<UserIcon style={{ height: "0.75rem", width: "0.75rem" }} />}
                <a
                  title="Link"
                  rel="noreferrer"
                  target="_blank"
                  href={`${HOSTS.RAA}/${attendant.delegateId}`}
                >
                  {attendant.delegateName}
                </a>
              </li>
            ) : null
          )}
        </div>
      );
    }
  }

  function renderMetadataPanelScanView() {
    return (
      <ul className="metadataPanelUl">
        <li className="metadataPanelLi">
          <div className="metadataPanelLiContent">
            <strong>Date: </strong>
            {(session[0].body as SessionBody).metadata.sessionWeekday}{" "}
            {(session[0].body as SessionBody).metadata.sessionDay}
            {"-"}
            {(session[0].body as SessionBody).metadata.sessionMonth}
            {"-"}
            {(session[0].body as SessionBody).metadata.sessionYear}
          </div>
        </li>
        <li className="metadataPanelLi">
          <div className="metadataPanelLiContent">
            <strong>Volume: </strong>
            {(scan[0].body as ScanBody).metadata.volume}
          </div>
        </li>
        <li className="metadataPanelLi">
          <div className="metadataPanelLiContent">
            <strong>Opening: </strong>
            {(scan[0].body as ScanBody).metadata.opening}
          </div>
        </li>
        <strong>Attendants: </strong>
        {renderAttendants()}
      </ul>
    );
  }

  function renderMetadataPanelResolutionView() {
    return (
      <>
        <ul className="metadataPanelUl">
          <li className="metadataPanelLi">
            <div className="metadataPanelLiContent">
              <strong>Date: </strong>
              {
                (resolution[0].body as ResolutionBody).metadata.sessionWeekday
              }{" "}
              {(resolution[0].body as ResolutionBody).metadata.sessionDay}
              {"-"}
              {(resolution[0].body as ResolutionBody).metadata.sessionMonth}
              {"-"}
              {(resolution[0].body as ResolutionBody).metadata.sessionYear}
            </div>
          </li>
          <li className="metadataPanelLi">
            <div className="metadataPanelLiContent">
              <strong>Proposition type: </strong>
              {(resolution[0].body as ResolutionBody).metadata.propositionType}
            </div>
          </li>
          <li className="metadataPanelLi">
            <div className="metadataPanelLiContent">
              <strong>Resolution type: </strong>
              {(resolution[0].body as ResolutionBody).metadata.resolutionType}
            </div>
          </li>
          <strong>Attendants: </strong>
          {renderAttendants()}
        </ul>
      </>
    );
  }

  return (
    <>
      {params.tier0 && params.tier1 ? renderMetadataPanelScanView() : null}
      {params.tier2 ? renderMetadataPanelResolutionView() : null}
    </>
  );
};
