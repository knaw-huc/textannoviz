import React from "react";
import {
  LocationBuilding,
  LocationRiver,
  LocationSettlement,
  LocationTerritory,
  LocationTeiRef,
  MechteldLocation,
} from "./annotation/ProjectAnnotationModel";
import { fetchJson } from "../../utils/fetchJson";
import { handleAbort } from "../../utils/handleAbort";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project";
import { Link } from "react-aria-components";
import { HelpIcon } from "../../components/common/icons/HelpIcon";

type JsonLocation = Omit<LocationTeiRef, "tei:type"> & {
  type: LocationTeiRef["tei:type"];
};

export function Locations() {
  const [locations, setLocations] = React.useState<MechteldLocation[]>();
  const locationRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const translateProject = useTranslateProject();

  const locationUrl = useProjectStore(projectConfigSelector).locationUrl;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initLocations(aborter: AbortController) {
      const newLocations = await fetchJson<JsonLocation[]>(
        locationUrl,
        aborter.signal,
      );
      if (!newLocations) return;

      setLocations(
        newLocations.map(
          ({ type, ...rest }) =>
            ({ ...rest, "tei:type": type }) as LocationTeiRef,
        ),
      );
    }

    initLocations(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, [locationUrl]);

  React.useEffect(() => {
    if (!locations) return;
    const locId = window.location.hash.split("#")[1];
    if (!locId) return;
    const element = locationRefs.current[locId];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.setProperty("background-color", "#FFCE01", "important");
    }
  }, [locations]);

  return (
    <>
      <h1 className="pl-8">{translateProject("locations")}</h1>
      <div
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(320px, 1fr))" }}
        className="grid gap-6 px-8 pb-8"
      >
        {locations?.map((loc) => (
          <div
            className="min-h-36 max-w-[800px] rounded bg-neutral-50 p-5 transition-colors duration-500"
            key={loc.id}
            ref={(el) => {
              locationRefs.current[loc.id] = el;
            }}
          >
            <LocationCardBody loc={loc} />
          </div>
        ))}
      </div>
    </>
  );
}

function LocationCardBody({ loc }: { loc: MechteldLocation }) {
  switch (loc["tei:type"]) {
    case "settlement":
      return <SettlementBody loc={loc} />;
    case "building":
      return <BuildingBody loc={loc} />;
    case "territory":
    case "subterritory":
      return <TerritoryBody loc={loc} />;
    case "river":
      return <RiverBody loc={loc} />;
    default:
      return assertNever(loc);
  }
}

function SettlementBody({ loc }: { loc: LocationSettlement }) {
  return (
    <>
      <div className="flex flex-row items-start">
        <div className="flex w-fit flex-grow flex-col justify-start">
          <span className="font-bold">{loc.settlement}</span>
          {loc.region.length ? (
            <span className="text-neutral-600">{loc.region.join(", ")}</span>
          ) : null}
        </div>
        <SourceLinks
          links={loc.source.filter((src) => src.trim())}
          label={loc.settlement}
        />
      </div>
      {loc.desc ? <p className="mt-2">{loc.desc}</p> : null}
    </>
  );
}

function BuildingBody({ loc }: { loc: LocationBuilding }) {
  // `corresp` arrives as one whitespace-separated string, so split before linking.
  const links = [...loc.source, ...(loc.corresp?.split(/\s+/) ?? [])].filter(
    (link) => link.trim(),
  );
  const place = [loc.settlement, ...loc.region].filter(Boolean).join(", ");

  return (
    <>
      <div className="flex flex-row items-start">
        <div className="flex w-fit flex-grow flex-col justify-start">
          <span className="font-bold">{loc.objectName}</span>
          {place ? <span className="text-neutral-600">{place}</span> : null}
        </div>
        <SourceLinks links={links} label={loc.objectName} />
      </div>
      {loc.desc ? <p className="mt-2">{loc.desc}</p> : null}
    </>
  );
}

function TerritoryBody({ loc }: { loc: LocationTerritory }) {
  return (
    <div className="flex flex-col">
      <span className="font-bold">{loc.region.join(", ")}</span>
      {loc.desc ? <p className="mt-2">{loc.desc}</p> : null}
    </div>
  );
}

function RiverBody({ loc }: { loc: LocationRiver }) {
  return (
    <div className="flex flex-col">
      <span className="font-bold">{loc.geogName}</span>
      {loc.desc ? <p className="mt-2">{loc.desc}</p> : null}
    </div>
  );
}

/**
 * External reference links (geonames, VIAF, castle databases), rendered as icons.
 * Several can sit in one card, so each needs its own accessible name.
 * The icon alone gives a screen reader nothing to tell them apart.
 */
function SourceLinks(props: { links: string[]; label: string }) {
  if (!props.links.length) {
    return null;
  }

  return (
    <div className="flex shrink-0 flex-row items-center justify-end gap-1">
      {props.links.map((link) => (
        <Link
          className="inline-flex h-6 w-6 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2"
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${props.label} on ${hostnameOf(
            link,
          )} (opens in new tab)`}
          key={link}
        >
          <HelpIcon />
        </Link>
      ))}
    </div>
  );
}

function hostnameOf(link: string): string {
  try {
    return new URL(link).hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled location type: ${JSON.stringify(value)}`);
}
