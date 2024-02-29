import { UserIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Link, useParams } from "react-router-dom";
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
  const [attendanceList, setAttendanceList] =
    React.useState<AnnoRepoAnnotation[]>();
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);

  const resolution = props.annotations.find(
    (annotation) => annotation.body.type === "Resolution",
  );

  const scan = props.annotations.find(
    (annotation) => annotation.body.type === "Scan",
  );

  const session = props.annotations.find(
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
    const controller = new AbortController();
    const signal = controller.signal;
    const bodyTypes = props.annotations.map((anno) => anno.body.type);
    const session = props.annotations.find(
      (annotation) => annotation.body.type === "Session",
    );
    setAttendanceList(undefined);
    async function fetchData() {
      if (!session) return;
      const result: Broccoli = await fetchBroccoliScanWithOverlap(
        session.body.id,
        ["AttendanceList"],
        ["anno"],
        "self",
        "Scan",
        projectConfig,
        signal,
      );
      setAttendanceList(result.anno);
    }

    if (!bodyTypes.includes("AttendanceList")) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [projectConfig, props.annotations]);

  function renderAttendants() {
    const broccoliAttendanceList = props.annotations.find(
      (anno) => anno.body.type === "AttendanceList",
    );

    if (attendanceList && attendanceList.length > 0) {
      return (
        <>
          <strong>Aanwezigen: </strong>
          <div className={gridOneColumn + "divide divide-y"}>
            {(attendanceList[0].body as AttendanceListBody).attendanceSpans.map(
              (attendant, index) =>
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
        </>
      );
    }

    if (broccoliAttendanceList) {
      return (
        <div className={gridOneColumn + "divide divide-y"}>
          {(
            broccoliAttendanceList.body as AttendanceListBody
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
          {resolution ? (
            <li className="mb-8">
              <div className={gridOneColumn}>
                <Link
                  to={`/detail/${
                    (resolution.body as ResolutionBody).metadata.sessionId
                  }`}
                  className="hover:text-brand1-600 active:text-brand1-700 text-inherit no-underline"
                >
                  <button>
                    <strong>Go up to session</strong>
                  </button>
                </Link>
              </div>
            </li>
          ) : null}

          {session && resolution ? (
            <li className="mb-8">
              <div className={gridOneColumn}>
                <strong>Datum: </strong>
                {translateProject(
                  (session.body as SessionBody)?.metadata.sessionWeekday,
                )}{" "}
                {(resolution.body as ResolutionBody).metadata.sessionDay}{" "}
                {
                  monthNumberToString[
                    (resolution.body as ResolutionBody).metadata.sessionMonth
                  ]
                }{" "}
                {(resolution.body as ResolutionBody).metadata.sessionYear}
              </div>
            </li>
          ) : null}

          {resolution ? (
            <>
              {(resolution.body as ResolutionBody).metadata.propositionType ? (
                <li className="mb-8">
                  <div className={gridOneColumn}>
                    <strong>Propositie type: </strong>
                    {(
                      resolution.body as ResolutionBody
                    ).metadata.propositionType
                      .charAt(0)
                      .toUpperCase() +
                      (
                        resolution.body as ResolutionBody
                      ).metadata.propositionType.slice(1)}
                  </div>
                </li>
              ) : null}
              {(resolution.body as ResolutionBody).metadata.resolutionType ? (
                <li className="mb-8">
                  <div className={gridOneColumn}>
                    <strong>Resolutie type: </strong>
                    {(resolution.body as ResolutionBody).metadata.resolutionType
                      .charAt(0)
                      .toUpperCase() +
                      (
                        resolution.body as ResolutionBody
                      ).metadata.resolutionType.slice(1)}
                  </div>
                </li>
              ) : null}{" "}
            </>
          ) : null}

          {renderAttendants()}
        </ul>
      </>
    );
  }

  function renderAttendanceListView() {
    const broccoliAttendanceList = props.annotations.find(
      (anno) => anno.body.type === "AttendanceList",
    );

    if (broccoliAttendanceList) {
      return (
        <ul className="m-0 list-none p-0">
          <li className="mb-8">
            <div className={gridOneColumn}>
              <strong>Datum: </strong>
              {
                (broccoliAttendanceList.body as AttendanceListBody).metadata
                  .sessionWeekday
              }{" "}
              {
                (broccoliAttendanceList.body as AttendanceListBody).metadata
                  .sessionDay
              }{" "}
              {
                monthNumberToString[
                  (broccoliAttendanceList.body as AttendanceListBody).metadata
                    .sessionMonth
                ]
              }{" "}
              {
                (broccoliAttendanceList.body as AttendanceListBody).metadata
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
    if (!scan || !session) return;
    return (
      <ul className="m-0 list-none p-0">
        <li className="mb-8">
          <div className={gridOneColumn}>
            <strong>Datum: </strong>
            {translateProject(
              (session.body as SessionBody).metadata.sessionWeekday,
            )}{" "}
            {(session.body as SessionBody).metadata.sessionDay}{" "}
            {
              monthNumberToString[
                (session.body as SessionBody).metadata.sessionMonth
              ]
            }{" "}
            {(session.body as SessionBody).metadata.sessionYear}
          </div>
        </li>
        <li className="mb-8">
          <div className={gridOneColumn}>
            <strong>Volume: </strong>
            {(scan.body as ScanBody).metadata.volume}
          </div>
        </li>
        <li className="mb-8">
          <div className={gridOneColumn}>
            <strong>Opening: </strong>
            {(scan.body as ScanBody).metadata.opening}
          </div>
        </li>
        <strong>Aanwezigen: </strong>
        {renderAttendants()}
      </ul>
    );
  }

  function renderMetadataPanelAnnotationView() {
    if (params.tier2?.includes("resolution") && resolution) {
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
