import React from "react";
import { OrganisationTeiRef } from "./annotation/ProjectAnnotationModel";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project";
import { fetchJson } from "../../utils/fetchJson";
import { handleAbort } from "../../utils/handleAbort";

export function Organisations() {
  const [organisations, setOrganisations] =
    React.useState<OrganisationTeiRef[]>();
  const orgRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const translateProject = useTranslateProject();

  const orgUrl = useProjectStore(projectConfigSelector).organisationUrl;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initOrganisations(aborter: AbortController) {
      const newOrganisations = await fetchJson<OrganisationTeiRef[]>(
        orgUrl,
        aborter.signal,
      );
      if (!newOrganisations) return;

      setOrganisations(newOrganisations);
    }

    initOrganisations(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, [orgUrl]);

  React.useEffect(() => {
    if (!organisations) return;
    const orgId = window.location.hash.split("#")[1];
    if (!orgId) return;
    const element = orgRefs.current[orgId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.setProperty("background-color", "#fef08a", "important");
    }
  }, [organisations]);

  return (
    <>
      <h1 className="pl-8">{translateProject("organisations")}</h1>
      <div
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px, 1fr))" }}
        className="grid gap-6 px-8 pb-8"
      >
        {organisations?.map((org) => (
          <div
            className="min-h-36 max-w-[800px] rounded bg-neutral-50 p-5 transition-colors duration-500"
            key={org.id}
            ref={(el) => {
              orgRefs.current[org.id] = el;
            }}
          >
            <span className="font-bold">{org.orgName.nl.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}
