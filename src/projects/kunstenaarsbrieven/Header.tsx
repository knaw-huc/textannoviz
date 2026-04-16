import { useEffect, useState } from "react";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  translateProjectSelector,
  useProjectStore,
} from "../../stores/project.ts";
import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { detailTier2Path } from "../../components/Text/Annotated/project/utils/detailPath.ts";
import { Button } from "react-aria-components";

type HeaderProps = {
  introIds: { name: string; id: string }[];
  letterTitle: string;
  letterNumber: string | undefined;
};

export const Header = (props: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useProjectStore(translateProjectSelector);
  const navigate = useNavigate();
  const location = useLocation();

  const isOnDetailPage = !!matchPath(detailTier2Path, location.pathname);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prevOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className="grid grid-cols-[auto_auto_50px] grid-rows-[auto_auto] bg-[#dddddd] sm:grid-cols-[auto_auto_110px_50px] lg:grid-cols-[auto_auto_110px]">
      <div className="flex flex-col border-b border-neutral-400 px-6 py-2">
        <Button
          className="flex w-fit flex-col items-start text-inherit no-underline hover:underline"
          onPress={() => navigate("/")}
        >
          <strong>{translateProject("TITLE_PT_1")}</strong>
          <strong>{translateProject("TITLE_PT_2")}</strong>
        </Button>
      </div>
      <div className="col-span-2 flex items-center justify-end border-b border-neutral-400 px-4 sm:col-span-3 lg:col-span-1">
        <Button
          className="mr-2 inline-flex items-center justify-center rounded border border-neutral-500 p-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-800 focus-visible:ring-offset-2 lg:hidden"
          aria-label={
            isMenuOpen
              ? translateProject("CLOSE_MAIN_NAVIGATION")
              : translateProject("OPEN_MAIN_NAVIGATION")
          }
          aria-expanded={isMenuOpen}
          aria-controls="main-navigation-mobile"
          onPress={() => setIsMenuOpen((open) => !open)}
        >
          <span className="sr-only">
            {isMenuOpen
              ? translateProject("CLOSE_MAIN_NAVIGATION")
              : translateProject("OPEN_MAIN_NAVIGATION")}
          </span>
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
            <span className="block h-[2px] w-5 bg-current" />
          </span>
        </Button>

        <nav
          className="mr-4 hidden flex-row gap-4 text-sm *:no-underline lg:flex"
          aria-label="Main navigation"
        >
          {props.introIds.map((introId) => (
            <Button
              key={introId.id}
              className="text-inherit no-underline hover:underline"
              onPress={() => navigate(`/detail/${introId.id}`)}
            >
              {introId.name}
            </Button>
          ))}

          {projectConfig.routes.map((route) => (
            <Button
              key={route.path}
              className="text-inherit no-underline hover:underline"
              onPress={() => navigate(`/${route.path}`)}
            >
              {translateProject(route.path)}
            </Button>
          ))}
          <Button
            className="text-inherit no-underline hover:underline"
            onPress={() => navigate("/help")}
          >
            {translateProject("help")}
          </Button>
        </nav>
      </div>

      <div className="hidden items-center justify-center border-b border-neutral-400 lg:flex">
        <LanguageMenu />
      </div>

      {isMenuOpen && (
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
                onPress={() => setIsMenuOpen(false)}
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
              <ul className="flex flex-col gap-2">
                {props.introIds.map((introId) => (
                  <li key={introId.id}>
                    <Button
                      className="w-full justify-start text-left text-inherit no-underline hover:underline"
                      onPress={() => {
                        navigate(`/detail/${introId.id}`);
                        setIsMenuOpen(false);
                      }}
                    >
                      {introId.name}
                    </Button>
                  </li>
                ))}

                {projectConfig.routes.map((route) => (
                  <li key={route.path}>
                    <Button
                      className="w-full justify-start text-left text-inherit no-underline hover:underline"
                      onPress={() => {
                        navigate(`/${route.path}`);
                        setIsMenuOpen(false);
                      }}
                    >
                      {translateProject(route.path)}
                    </Button>
                  </li>
                ))}

                <li>
                  <Button
                    className="w-full justify-start text-left text-inherit no-underline hover:underline"
                    onPress={() => {
                      navigate("/help");
                      setIsMenuOpen(false);
                    }}
                  >
                    {translateProject("help")}
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
      {/* Hide <div> when not on detail page */}
      <div
        className={`col-span-3 flex items-center justify-center gap-2 border-b border-neutral-400 bg-white p-4 text-center sm:col-span-4 lg:col-span-3 ${
          !isOnDetailPage ? "hidden" : ""
        }`}
      >
        <h4>
          {props.letterTitle} <br className="md:hidden" />
        </h4>
        <div className="text-neutral-600">
          {props.letterNumber && "(" + props.letterNumber + ")"}
        </div>
      </div>
    </header>
  );
};
