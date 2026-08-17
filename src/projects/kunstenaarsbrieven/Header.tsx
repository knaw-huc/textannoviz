import { useEffect, useState } from "react";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project.ts";
import { matchPath, useLocation } from "react-router";
import { detailTier2Path } from "../../utils/detailPath.ts";
import { Button, Link } from "react-aria-components";
import { toast } from "../../utils/toast.ts";
import React from "react";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { MenuComponent, RootMenu } from "./MenuComponent.tsx";
import { QuickSearch } from "./QuickSearch.tsx";
import { getBaseUrl } from "./annotation/ProjectAnnotationModel.ts";
import { getAdjacentLetterPaths } from "./utils/getAdjacentLetterPaths.ts";
import { isLetterDetailPage } from "./isLetterDetailPage.ts";
import { useAnnotationStore } from "../../stores/annotation.ts";

type HeaderProps = {
  introIds: { name: string; id: string }[];
  letterTitle: string;
  letterNumber: string | undefined;
  menuUrl?: string;
  letterIds?: string[];
};

export const Header = (props: HeaderProps) => {
  const [menu, setMenu] = React.useState<RootMenu>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const translateProject = useTranslateProject();
  const location = useLocation();
  const version = useProjectStore(projectConfigSelector).version;
  const versionHash = useProjectStore(projectConfigSelector).versionHash;
  const annotations = useAnnotationStore().annotations;

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initPersons(aborter: AbortController) {
      if (!props.menuUrl) return;
      const newMenu = await fetchMenu(props.menuUrl, aborter.signal);
      if (!newMenu) return;

      setMenu(newMenu);
    }

    initPersons(aborter).catch(handleAbort);

    return () => {
      aborter.abort();
    };
  }, []);

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

  const { prev, next } = React.useMemo(
    () =>
      getAdjacentLetterPaths(props.letterIds, props.letterNumber, getBaseUrl()),
    [props.letterIds, props.letterNumber],
  );

  return (
    <header className="grid grid-cols-[auto_auto_50px] grid-rows-[auto_auto] bg-[#dddddd] sm:grid-cols-[auto_auto_110px_50px] lg:grid-cols-[auto_auto_210px]">
      <div className="flex flex-col border-b border-neutral-400 px-6 py-2">
        <Link
          className="flex w-fit flex-col items-start text-inherit no-underline hover:text-inherit hover:underline"
          href="/"
        >
          <strong>{translateProject("TITLE_PT_1")}</strong>
          <strong>{translateProject("TITLE_PT_2")}</strong>
        </Link>
      </div>
      <div className="col-span-2 flex items-center justify-end border-b border-neutral-400 px-4 sm:col-span-3 lg:col-span-1">
        <Button
          className="mr-2 inline-flex items-center justify-center rounded border border-neutral-500 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 lg:hidden"
          aria-label={
            isMobileMenuOpen
              ? translateProject("CLOSE_MAIN_NAVIGATION")
              : translateProject("OPEN_MAIN_NAVIGATION")
          }
          aria-expanded={isMobileMenuOpen}
          aria-controls="main-navigation-mobile"
          onPress={() => setIsMobileMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {isMobileMenuOpen
              ? translateProject("CLOSE_MAIN_NAVIGATION")
              : translateProject("OPEN_MAIN_NAVIGATION")}
          </span>
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
          </span>
        </Button>

        <nav
          className="hidden flex-row gap-4 text-sm *:no-underline lg:flex"
          aria-label="Main navigation"
        >
          <QuickSearch letterIds={props.letterIds} />
          <MenuComponent menu={menu} />
        </nav>
      </div>

      <div className="hidden items-center justify-between gap-2 border-b border-neutral-400 px-4 lg:flex">
        <LanguageMenu />
        <span className="min-w-0 truncate text-xs text-neutral-600">
          v{version}
          {versionHash && (
            <span className="ml-1 font-mono" title={versionHash}>
              {versionHash}
            </span>
          )}
        </span>
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-white lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={translateProject("MAIN_NAVIGATION")}
        >
          <div className="flex h-full flex-col px-6 py-4">
            <div className="mb-3 flex items-center justify-end">
              <Button
                className="inline-flex items-center justify-center rounded border border-neutral-500 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2"
                aria-label={translateProject("CLOSE_MAIN_NAVIGATION")}
                onPress={() => setIsMobileMenuOpen(false)}
              >
                <span aria-hidden="true">&#10006;</span>
              </Button>
            </div>

            <div className="mb-4 flex justify-end border-b border-neutral-300 py-4">
              <LanguageMenu />
            </div>

            <nav
              id="main-navigation-mobile"
              aria-label="Main navigation"
              className="flex-1 overflow-y-auto text-sm"
            >
              <MenuComponent
                menu={menu}
                variant="mobile"
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </nav>
          </div>
        </div>
      )}
      {/* Hide <div> when not on detail page and when on 'about' pages */}
      <div
        className={`col-span-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b border-neutral-400 bg-white px-3 py-3 sm:col-span-4 sm:gap-4 sm:px-4 lg:col-span-3 ${
          !isOnDetailPage || !isLetterDetailPage(annotations) ? "hidden" : ""
        }`}
      >
        {/* Both cells stay in the grid while the letter index loads, so the
            title does not shift sideways once prev/next appear */}
        <div className="justify-self-start">
          {props.letterIds && (
            <Link
              className="hover:bg-brand1-50 hover:text-brand1-600 focus-visible:ring-brand1-600 text-brand1Grey-600 group -mx-2 -my-1 inline-flex items-center gap-2 rounded px-2 py-1 no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              isDisabled={!prev}
              href={prev?.path}
              aria-label={`${translateProject("PREVIOUS_LETTER")} ${
                prev?.number ?? ""
              }`}
            >
              <span
                aria-hidden="true"
                className="transition-transform group-hover:-translate-x-0.5"
              >
                &#8592;
              </span>
              <span className="text-sm font-semibold tabular-nums tracking-wide">
                {prev?.number ?? "—"}
              </span>
            </Link>
          )}
        </div>

        <div className="flex min-w-0 flex-col items-center gap-0 justify-self-center text-center sm:flex-row sm:items-baseline sm:gap-2">
          {props.letterNumber && (
            <span className="text-brand1-600 text-sm font-semibold tabular-nums tracking-wider">
              {props.letterNumber}
            </span>
          )}
          <h4 className="min-w-0 truncate font-bold">{props.letterTitle}</h4>
        </div>

        <div className="justify-self-end">
          {props.letterIds && (
            <Link
              className="hover:bg-brand1-50 hover:text-brand1-600 focus-visible:ring-brand1-600 text-brand1Grey-600 group -mx-2 -my-1 inline-flex flex-row-reverse items-center gap-2 rounded px-2 py-1 no-underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40"
              isDisabled={!next}
              href={next?.path}
              aria-label={`${translateProject("NEXT_LETTER")} ${
                next?.number ?? ""
              }`}
            >
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                &#8594;
              </span>
              <span className="text-sm font-semibold tabular-nums tracking-wide">
                {next?.number ?? "—"}
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

async function fetchMenu(
  url: string,
  signal: AbortSignal,
): Promise<RootMenu | null> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    const error = await response.json();
    toast(`${error.message}`, { type: "error" });
    return null;
  }
  return await response.json();
}
