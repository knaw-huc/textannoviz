import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { Base64 } from "js-base64";
import { useParams } from "react-router-dom";
import { HelpTooltip } from "../../components/common/HelpTooltip";
import { HammerIcon } from "../../components/common/icons/HammerIcon";
import { toEntityCategory } from "../../components/Text/Annotated/utils/createAnnotationClasses.ts";
import {
  AnnoRepoAnnotation,
  isResolution,
  ResolutionBody,
  SessionBody,
} from "../../model/AnnoRepoAnnotation";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project";
import { firstLetterToUppercase } from "../../utils/firstLetterToUppercase";
import { gridOneColumn } from "../../utils/gridOneColumn";
import { monthNumberToString } from "../../utils/monthNumberToString";
import { skipEmptyValues } from "../../utils/skipEmptyValues";
import {
  isEntity,
  ProjectEntityBody,
} from "./annotation/ProjectAnnotationModel";
import { SearchQuery } from "../../model/Search.ts";
import { ProvenanceButton } from "./annotation/ProvenanceButton.tsx";
import { toast } from "react-toastify";

type RenderMetadataPanelProps = {
  annotations: AnnoRepoAnnotation[];
};

export const MetadataPanel = (props: RenderMetadataPanelProps) => {
  const translateProject = useProjectStore(translateProjectSelector);
  const projectConfig = useProjectStore(projectConfigSelector);

  const params = useParams();
  const entities = props.annotations.filter(
    (anno) => anno.body.type === "Entity",
  );

  function filterEntitiesByCategory(category: string) {
    return entities.filter(
      (entity) =>
        toEntityCategory(
          projectConfig,
          (entity.body as ProjectEntityBody).metadata.category ?? "unknown",
        ) === category,
    );
  }

  const hoeEntities = filterEntitiesByCategory("HOE");
  const locEntities = filterEntitiesByCategory("LOC");
  const comEntities = filterEntitiesByCategory("COM");
  const orgEntities = filterEntitiesByCategory("ORG");
  const perEntities = filterEntitiesByCategory("PER");

  return (
    <>
      {params.tier2?.includes("resolution") ? (
        <ResolutionMetadata annotations={props.annotations} />
      ) : (
        <div>No panel defined for this annotation type.</div>
      )}
      <DelegatesMetadata annotations={props.annotations} />
      <EntitiesMetadata
        title={translateProject("LOC")}
        entities={locEntities}
      />
      <EntitiesMetadata
        title={translateProject("HOE")}
        entities={hoeEntities}
      />
      <EntitiesMetadata
        title={translateProject("PER")}
        entities={perEntities}
      />
      <EntitiesMetadata
        title={translateProject("COM")}
        entities={comEntities}
      />
      <EntitiesMetadata
        title={translateProject("ORG")}
        entities={orgEntities}
      />
    </>
  );
};

function DelegatesMetadata(props: { annotations: AnnoRepoAnnotation[] }) {
  const translateProject = useProjectStore(translateProjectSelector);

  const session = props.annotations.find(
    (annotation) => annotation.body.type === "Session",
  );

  const delegates = (session?.body as SessionBody).metadata.delegates.map(
    (delegate) => delegate,
  );

  return (
    <>
      <strong>
        {translateProject("delegates")}:{" "}
        <HelpTooltip label={translateProject("ATTENDANTS_LIST_HELP")} />
      </strong>
      <div className={gridOneColumn + "divide divide-y pb-8"}>
        {delegates.length ? (
          delegates.map((delegate, index) =>
            delegate.name !== "" ? (
              <li key={index} className="flex flex-row gap-1 py-1 text-sm">
                <div className="flex flex-grow flex-row items-center justify-start gap-1">
                  <UserIcon className="h-3 w-3 flex-shrink-0" />
                  <a
                    title={translateProject("DELEGATE_LINK")}
                    className="hover:text-brand1-900 text-inherit no-underline hover:underline"
                    href={delegate.detailsUrl ? delegate.detailsUrl : undefined}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {delegate.name}{" "}
                    {delegate.province.length > 0 &&
                      !delegate.province.startsWith("-") &&
                      "(" + delegate.province + ")"}
                  </a>
                  {delegate.president ? (
                    <div title={translateProject("president")}>
                      <HammerIcon className="ml-1 h-3 w-3 flex-shrink-0" />
                    </div>
                  ) : null}
                </div>

                <div className="flex flex-row items-center justify-end gap-1">
                  {
                    <MagnifyingGlassIcon
                      onClick={() =>
                        handleDelegateSearchClick(
                          delegate.delegateID,
                          delegate.name,
                        )
                      }
                      className="h-3 w-3 flex-shrink-0 cursor-pointer"
                    />
                  }
                </div>
              </li>
            ) : null,
          )
        ) : (
          <div>{translateProject("NO_DATA")}</div>
        )}
      </div>
    </>
  );
}

function handleDelegateSearchClick(delegateID: string, delegateName: string) {
  const params = new URLSearchParams();
  const newQuery = {} as Partial<SearchQuery>;
  newQuery.terms = {
    ["delegateId"]: [delegateID],
    ["delegateName"]: [delegateName],
  };
  params.set("query", Base64.encode(JSON.stringify(newQuery, skipEmptyValues)));

  window.open(`/?${params.toString()}`, "_blank");
}

function ResolutionMetadata(props: { annotations: AnnoRepoAnnotation[] }) {
  const translateProject = useProjectStore(translateProjectSelector);

  const resolution = props.annotations.find(
    (annotation) => annotation.body.type === "Resolution",
  );

  if (!resolution) return null;

  return (
    <>
      <ProvenanceButton
        className="d-block float-right"
        onClick={() => {
          if (isResolution(resolution?.body)) {
            const provUrl = resolution.body.metadata.provenance.at(-1);
            window.open(provUrl, "_blank");
          } else {
            const msg = "Annotation is not a resolution";
            console.warn(`${msg}:`, resolution);
            return toast(msg, { type: "warning" });
          }
        }}
      />
      <ul className="m-0 list-none p-0">
        {resolution ? (
          <li className="mb-8">
            <div className={gridOneColumn}>
              <strong>{translateProject("date")}: </strong>
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
      <strong className="capitalize">{props.title}</strong>
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
