import { UserIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useParams } from "react-router-dom";
import { HOSTS } from "../../Config";
import {
  AnnoRepoAnnotation,
  AttendanceListBody,
  ResolutionBody,
  ScanBody,
  SessionBody,
} from "../../model/AnnoRepoAnnotation";
import { Broccoli } from "../../model/Broccoli";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { fetchBroccoliScanWithOverlap } from "../../utils/broccoli";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const params = useParams();
  const [attendanceList, setAttendanceList] = React.useState<Broccoli>();
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const resolution = props.annotations.filter(
    (annotation) => annotation.body.type === "Resolution",
  );

  const scan = props.annotations.filter(
    (annotation) => annotation.body.type === "Scan",
  );

  const session = props.annotations.filter(
    (annotation) => annotation.body.type === "Session",
  );

  const gridOneColumn = "grid grid-cols-1";

  // TODO: use label keys:
  const monthNumberToString: Record<number, string> = {
    1: "januari",
    2: "februari",
    3: "maart",
    4: "april",
    5: "mei",
    6: "juni",
    7: "juli",
    8: "augustus",
    9: "september",
    10: "oktober",
    11: "november",
    12: "december",
  };

  React.useEffect(() => {
    const bodyTypes = props.annotations.map((anno) => anno.body.type);
    const session = props.annotations.filter(
      (annotation) => annotation.body.type === "Session",
    );
    setAttendanceList(undefined);
    async function fetchData() {
      const result: Broccoli = await fetchBroccoliScanWithOverlap(
        session[0].body.id,
        ["AttendanceList"],
        ["anno"],
        "self",
        "Scan",
        projectConfig,
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
      (anno) => anno.body.type === "AttendanceList",
    );

    if (attendanceList) {
      return (
        <div className={gridOneColumn + "divide divide-y"}>
          {(
            attendanceList.anno[0].body as AttendanceListBody
          ).attendanceSpans.map((attendant, index) =>
            attendant.delegateName !== "" ? (
              <li
                key={index}
                className="flex flex-row items-center justify-start gap-1 py-1 text-sm"
              >
                {<UserIcon className="inline h-3 w-3" />}
                <a
                  title="Link"
                  rel="noreferrer"
                  target="_blank"
                  href={
                    attendant.delegateId > 0
                      ? `${HOSTS.RAA}/${attendant.delegateId}`
                      : undefined
                  }
                  className="hover:text-brand1-900 text-inherit no-underline hover:underline"
                >
                  {attendant.delegateName}
                </a>
              </li>
            ) : null,
          )}
        </div>
      );
    }

    if (broccoliAttendanceList.length > 0) {
      return (
        <div className={gridOneColumn + "divide divide-y"}>
          {(
            broccoliAttendanceList[0].body as AttendanceListBody
          ).attendanceSpans.map((attendant, index) =>
            attendant.delegateName !== "" ? (
              <li
                key={index}
                className="flex flex-row items-center justify-start gap-1 py-1 text-sm"
              >
                {<UserIcon className="inline h-3 w-3" />}
                <a
                  title="Link"
                  rel="noreferrer"
                  target="_blank"
                  href={
                    attendant.delegateId > 0
                      ? `${HOSTS.RAA}/${attendant.delegateId}`
                      : undefined
                  }
                  className="hover:text-brand1-900 text-inherit no-underline hover:underline"
                >
                  {attendant.delegateName}
                </a>
              </li>
            ) : null,
          )}
        </div>
      );
    }
  }

  function renderResolutionView() {
    return (
      <>
        <ul className="m-0 list-none p-0">
          <li className="mb-8">
            <div className={gridOneColumn}>
              <strong>Datum: </strong>
              {translateProject(
                (session[0].body as SessionBody).metadata.sessionWeekday,
              )}{" "}
              {(resolution[0].body as ResolutionBody).metadata.sessionDay}{" "}
              {
                monthNumberToString[
                  (resolution[0].body as ResolutionBody).metadata.sessionMonth
                ]
              }{" "}
              {(resolution[0].body as ResolutionBody).metadata.sessionYear}
            </div>
          </li>
          <li className="mb-8">
            <div className={gridOneColumn}>
              <strong>Propositie type: </strong>
              {(resolution[0].body as ResolutionBody).metadata.propositionType
                .charAt(0)
                .toUpperCase() +
                (
                  resolution[0].body as ResolutionBody
                ).metadata.propositionType.slice(1)}
            </div>
          </li>
          <li className="mb-8">
            <div className={gridOneColumn}>
              <strong>Resolutie type: </strong>
              {(resolution[0].body as ResolutionBody).metadata.resolutionType
                .charAt(0)
                .toUpperCase() +
                (
                  resolution[0].body as ResolutionBody
                ).metadata.resolutionType.slice(1)}
            </div>
          </li>
          <strong>Aanwezigen: </strong>
          {renderAttendants()}
        </ul>
      </>
    );
  }

  function renderAttendanceListView() {
    const broccoliAttendanceList = props.annotations.filter(
      (anno) => anno.body.type === "AttendanceList",
    );

    if (broccoliAttendanceList.length >= 1) {
      return (
        <ul className="m-0 list-none p-0">
          <li className="mb-8">
            <div className={gridOneColumn}>
              <strong>Datum: </strong>
              {
                (broccoliAttendanceList[0].body as AttendanceListBody).metadata
                  .sessionWeekday
              }{" "}
              {
                (broccoliAttendanceList[0].body as AttendanceListBody).metadata
                  .sessionDay
              }{" "}
              {
                monthNumberToString[
                  (broccoliAttendanceList[0].body as AttendanceListBody)
                    .metadata.sessionMonth
                ]
              }{" "}
              {
                (broccoliAttendanceList[0].body as AttendanceListBody).metadata
                  .sessionYear
              }
            </div>
          </li>
          <strong>Attendants: </strong>
          {renderAttendants()}
        </ul>
      );
    }
  }

  function renderMetadataPanelScanView() {
    return (
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <div className={gridOneColumn}>
            <strong>Datum: </strong>
            {translateProject(
              (session[0].body as SessionBody).metadata.sessionWeekday,
            )}{" "}
            {(session[0].body as SessionBody).metadata.sessionDay}{" "}
            {
              monthNumberToString[
                (session[0].body as SessionBody).metadata.sessionMonth
              ]
            }{" "}
            {(session[0].body as SessionBody).metadata.sessionYear}
          </div>
        </li>
        <li className="mb-8">
          <div className={gridOneColumn}>
            <strong>Volume: </strong>
            {(scan[0].body as ScanBody).metadata.volume}
          </div>
        </li>
        <li className="mb-8">
          <div className={gridOneColumn}>
            <strong>Opening: </strong>
            {(scan[0].body as ScanBody).metadata.opening}
          </div>
        </li>
        <strong>Aanwezigen: </strong>
        {renderAttendants()}
      </ul>
    );
  }

  function renderMetadataPanelAnnotationView() {
    if (params.tier2?.includes("resolution") && resolution.length > 0) {
      return renderResolutionView();
    }

    if (params.tier2?.includes("attendance_list")) {
      return renderAttendanceListView();
    }

    return <div>No panel defined for this annotation type.</div>;
  }

  return (
    <>
      {params.tier0 && params.tier1 ? renderMetadataPanelScanView() : null}
      {params.tier2 ? renderMetadataPanelAnnotationView() : null}
    </>
  );
};
