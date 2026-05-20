import { useMemo } from "react";
import iconBooksSvg from "../../assets/icon-gogh-books.svg?raw";
import iconConsignmentsSvg from "../../assets/icon-gogh-consignments.svg?raw";
import iconVisitsSvg from "../../assets/Icon-gogh-visits.svg?raw";
import chronologyData from "./chronology.json";
import { useTranslateProject } from "../../stores/project";

type ChronologyItem = {
  date: string;
  description: string;
  visits?: boolean;
  books?: boolean;
  consignments?: boolean;
};

const chronologyIcons = {
  visits: {
    markup: iconVisitsSvg,
    className: "h-5 w-5 shrink-0 fill-neutral-400 stroke-neutral-400",
  },
  books: {
    markup: iconBooksSvg,
    className: "h-5 w-5 shrink-0 fill-none stroke-neutral-400",
  },
  consignments: {
    markup: iconConsignmentsSvg,
    className: "h-5 w-5 shrink-0 fill-white stroke-neutral-400",
  },
} as const;

function getChronologyIcon(item: ChronologyItem) {
  if (item.visits) return chronologyIcons.visits;
  if (item.books) return chronologyIcons.books;
  if (item.consignments) return chronologyIcons.consignments;
  return null;
}

function ChronologyIcon({
  markup,
  className,
}: {
  markup: string;
  className: string;
}) {
  const html = useMemo(
    () => markup.replace(/^<svg\b/, `<svg class="${className}" `),
    [markup, className],
  );

  return (
    <span
      className="inline-flex"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
      aria-hidden
    />
  );
}

type ChronologyYear = {
  year: number;
  items: ChronologyItem[];
};

const chronology = chronologyData as ChronologyYear[];

function chronologyYearId(year: number) {
  return `chronology-${year}`;
}

function scrollToYear(
  year: number,
  event: React.MouseEvent<HTMLAnchorElement>,
) {
  event.preventDefault();
  const element = document.getElementById(chronologyYearId(year));
  if (!element) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  element.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block: "start",
  });
  window.history.pushState(null, "", `#${chronologyYearId(year)}`);
}

export function Chronology() {
  const translateProject = useTranslateProject();

  return (
    <div className="mx-auto flex min-h-0 max-w-6xl flex-1 flex-col px-6 py-8 lg:px-10">
      <h1 className="mb-6 shrink-0">{translateProject("chronology")}</h1>

      <div className="flex min-h-0 flex-1 flex-row">
        <nav
          className="w-40 shrink-0 overflow-y-auto"
          aria-label={translateProject("chronology")}
        >
          <ul className="flex flex-col gap-1 py-2">
            {chronology.map((yearGroup) => (
              <li key={yearGroup.year}>
                <a
                  className="w-fit text-sm text-neutral-900 no-underline hover:text-neutral-800"
                  href={`#${chronologyYearId(yearGroup.year)}`}
                  onClick={(event) => scrollToYear(yearGroup.year, event)}
                >
                  {yearGroup.year}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <ul className="max-w-5xl space-y-8 md:grid md:grid-cols-[3rem_3.5rem_10rem_minmax(0,1fr)] md:gap-4 md:space-y-0">
            {chronology.map((yearGroup) => (
              <li
                id={chronologyYearId(yearGroup.year)}
                key={yearGroup.year}
                className="scroll-mt-4 md:col-span-full md:mb-8 md:grid md:grid-cols-subgrid md:pb-8"
              >
                <div className="mb-3 bg-white md:sticky md:top-0 md:z-10 md:col-start-1 md:row-span-full md:mb-0 md:self-start">
                  <h2 className="m-0 text-xl font-bold">{yearGroup.year}</h2>
                </div>
                <ul className="md:contents">
                  {yearGroup.items.map((item, index) => {
                    const icon = getChronologyIcon(item);
                    const isLastInYear = index === yearGroup.items.length - 1;
                    return (
                      <li
                        key={index}
                        className="grid grid-cols-[2rem_minmax(0,1fr)] pt-6 last:pb-0 md:col-span-3 md:col-start-2 md:mb-4 md:grid-cols-subgrid md:gap-x-6 md:gap-y-0 md:first:mt-4 md:first:border-t md:first:border-neutral-500 md:first:pt-4 md:last:mb-0 md:last:pb-20"
                      >
                        <div className="pt-1">
                          {icon ? (
                            <ChronologyIcon
                              markup={icon.markup}
                              className={icon.className}
                            />
                          ) : null}
                        </div>
                        <div
                          className={`md:col-span-2 md:col-start-2 md:grid md:grid-cols-subgrid md:gap-x-6 md:gap-y-0 md:first:mt-4 md:first:pt-4 ${
                            isLastInYear
                              ? "border-b-0 pb-0"
                              : "border-b border-neutral-300 pb-10"
                          }`}
                        >
                          <div className="font-bold md:font-bold">
                            {item.date}
                          </div>
                          <div
                            className="min-w-0 md:col-span-1"
                            dangerouslySetInnerHTML={{
                              __html: item.description,
                            }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
