import { UserIcon } from "@heroicons/react/24/solid";
import React from "react";
import { useParams } from "react-router-dom";
import { HelpTooltip } from "../../components/common/HelpTooltip.tsx";
import {
  AnnoRepoAnnotation,
  AttendanceListBody,
  ResolutionBody,
  SessionBody,
} from "../../model/AnnoRepoAnnotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { fetchBroccoliScanWithOverlap } from "../../utils/broccoli";
import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { monthNumberToString } from "../../utils/monthNumberToString";
import {
  isEntity,
  ProjectEntityBody,
} from "./annotation/ProjectAnnotationModel";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const params = useParams();
  const entities = props.annotations.filter(
    (anno) => anno.body.type === "Entity",
  );

  function filterEntitiesByCategory(category: string) {
    return entities.filter(
      (entity) =>
        (entity.body as ProjectEntityBody).metadata.category === category,
    );
  }

  const hoeEntities = filterEntitiesByCategory("HOE");
  const locEntities = filterEntitiesByCategory("LOC");
  const comEntities = filterEntitiesByCategory("COM");
  const orgEntities = filterEntitiesByCategory("ORG");
  const perEntities = filterEntitiesByCategory("PERS");

  return (
    <>
      {params.tier2?.includes("resolution") ? (
        <ResolutionMetadata annotations={props.annotations} />
      ) : (
        <div>No panel defined for this annotation type.</div>
      )}
      <AttendantsMetadata annotations={props.annotations} />
      <EntitiesMetadata title="Locaties" entities={locEntities} />
      <EntitiesMetadata title="Hoedanigheden" entities={hoeEntities} />
      <EntitiesMetadata title="Personen" entities={perEntities} />
      <EntitiesMetadata title="Commissies" entities={comEntities} />
      <EntitiesMetadata title="Organisaties" entities={orgEntities} />
    </>
  );
};

function AttendantsMetadata(props: { annotations: AnnoRepoAnnotation[] }) {
  const translateProject = useProjectStore(translateProjectSelector);

  const [attendanceList, setAttendanceList] =
    React.useState<AnnoRepoAnnotation[]>();
  const projectConfig = useProjectStore(projectConfigSelector);

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
      const result = await fetchBroccoliScanWithOverlap(
        session.body.id,
        ["AttendanceList"],
        ["anno"],
        "self",
        "Scan",
        projectConfig,
        signal,
      );
      if (result) {
        setAttendanceList(result.anno);
      }
    }

    if (!bodyTypes.includes("AttendanceList")) {
      fetchData();
    }

    return () => {
      controller.abort();
    };
  }, [projectConfig, props.annotations]);

  if (
    !attendanceList ||
    !(attendanceList[0].body as AttendanceListBody).attendanceSpans
  )
    return null;

  return (
    <>
      <strong>
        {translateProject("delegates")}:{" "}
        <HelpTooltip label={translateProject("ATTENDANTS_LIST_HELP")} />
      </strong>
      <div className={gridOneColumn + "divide divide-y pb-8"}>
        {(attendanceList[0].body as AttendanceListBody).attendanceSpans.map(
          (attendant, index) =>
            attendant.delegateName !== "" ? (
              <li
                key={index}
                className="flex flex-row items-center justify-start gap-1 py-1 text-sm"
              >
                <UserIcon className="inline h-3 w-3" />
                {attendant.delegateName}
              </li>
            ) : null,
        )}
      </div>
    </>
  );
}

function ResolutionMetadata(props: { annotations: AnnoRepoAnnotation[] }) {
  const translateProject = useProjectStore(translateProjectSelector);

  const resolution = props.annotations.find(
    (annotation) => annotation.body.type === "Resolution",
  );

  if (!resolution) return null;

  return (
    <>
      <ul className="m-0 list-none p-0">
        {resolution ? (
          <li className="mb-8">
            <div className={gridOneColumn}>
              <strong>Datum: </strong>
              {translateProject(
                (resolution.body as SessionBody)?.metadata.sessionWeekday,
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
            {(resolution.body as ResolutionBody).metadata.resolutionType ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <strong>{translateProject("resolutionType")}: </strong>
                  {firstLetterToUppercase(
                    (resolution.body as ResolutionBody).metadata.resolutionType,
                  )}
                </div>
              </li>
            ) : null}{" "}
            {(resolution.body as ResolutionBody).metadata.propositionType ? (
              <li className="mb-8">
                <div className={gridOneColumn}>
                  <strong>{translateProject("propositionType")}: </strong>
                  {firstLetterToUppercase(
                    (resolution.body as ResolutionBody).metadata
                      .propositionType,
                  )}
                </div>
              </li>
            ) : null}
          </>
        ) : null}
      </ul>
    </>
  );
}

function EntitiesMetadata(props: {
  title: string;
  entities: AnnoRepoAnnotation[];
}) {
  const translateProject = useProjectStore(translateProjectSelector);

  if (!props.entities.length) return null;

  return (
    <>
      <strong>{props.title}</strong>
      {props.entities.map((entity, index) => (
        <ul key={index}>
          <li className="mb-8">
            <div className={gridOneColumn}>
              {translateProject("name")}:{" "}
              {isEntity(entity.body)
                ? entity.body.type === "Entity"
                  ? entity.body.metadata.name
                  : ""
                : null}
            </div>
            <div className={gridOneColumn}>
              {translateProject("category")}:{" "}
              {isEntity(entity.body)
                ? entity.body.type === "Entity"
                  ? entity.body.metadata.entityLabels.join("; ")
                  : ""
                : null}
            </div>
          </li>
        </ul>
      ))}
    </>
  );
}
