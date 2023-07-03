import React from "react";
import { useParams } from "react-router-dom";
import {
  AnnoRepoAnnotation,
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
    async function fetchData() {
      setAttendanceList(undefined);

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

  function renderMetadataPanelScanView() {
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <strong>Volume: </strong>
          {(scan[0].body as ScanBody).metadata.volume}
        </li>
        <li>
          <strong>Opening: </strong>
          {(scan[0].body as ScanBody).metadata.opening}
        </li>
        <li>
          <strong>Date: </strong>
          {(session[0].body as SessionBody).metadata.sessionWeekday}{" "}
          {(session[0].body as SessionBody).metadata.sessionDay}
          {"-"}
          {(session[0].body as SessionBody).metadata.sessionMonth}
          {"-"}
          {(session[0].body as SessionBody).metadata.sessionYear}
        </li>
      </ul>
    );
  }

  function renderMetadataPanelResolutionView() {
    return (
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        <li>
          <strong>Date: </strong>
          {(resolution[0].body as ResolutionBody).metadata.sessionWeekday}{" "}
          {(resolution[0].body as ResolutionBody).metadata.sessionDay}
          {"-"}
          {(resolution[0].body as ResolutionBody).metadata.sessionMonth}
          {"-"}
          {(resolution[0].body as ResolutionBody).metadata.sessionYear}
        </li>
        <li>
          <strong>Proposition type: </strong>
          {(resolution[0].body as ResolutionBody).metadata.propositionType}
        </li>
        <li>
          <strong>Resolution type: </strong>
          {(resolution[0].body as ResolutionBody).metadata.resolutionType}
        </li>
      </ul>
    );
  }

  return (
    <>
      {params.tier0 && params.tier1 ? renderMetadataPanelScanView() : null}
      {params.tier2 ? renderMetadataPanelResolutionView() : null}
    </>
  );
};
