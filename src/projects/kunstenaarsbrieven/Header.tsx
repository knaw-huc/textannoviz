import { useEffect, useState } from "react";
import { LanguageMenu } from "../../components/LanguageMenu.tsx";
import {
  projectConfigSelector,
  useProjectStore,
  useTranslateProject,
} from "../../stores/project.ts";
import { matchPath, useLocation, useNavigate } from "react-router";
import { detailTier2Path } from "../../components/Text/Annotated/project/utils/detailPath.ts";
import { Button, Text } from "react-aria-components";
import { toast } from "../../utils/toast.ts";
import React from "react";
import { handleAbort } from "../../utils/handleAbort.tsx";
import { Menu, MenuItem, MenuTrigger, SubmenuTrigger } from "./Menu.tsx";
import { ChevronDown } from "../../components/common/icons/ChevronDown.tsx";

type HeaderProps = {
  introIds: { name: string; id: string }[];
  letterTitle: string;
  letterNumber: string | undefined;
};

// Individual link in menu
interface MenuItem {
  label: string;
  target: string;
}

/**
 * Represents a menu category.
 * It can contain a list of `items` (links)
 * OR another `menu` array (nested categories).
 */
interface MenuCategory {
  label: string;
  items?: MenuItem[];
  menu?: MenuCategory[];
}

// Root structure of menu
interface RootMenu {
  menu: MenuCategory[];
}

export const Header = (props: HeaderProps) => {
  const [menu, setMenu] = React.useState<RootMenu>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMenuLabel, setOpenMenuLabel] = useState<string | null>(null);
  const projectConfig = useProjectStore(projectConfigSelector);
  const translateProject = useTranslateProject();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const aborter = new AbortController();
    async function initPersons(aborter: AbortController) {
      const newMenu = await fetchMenu(
        "http://localhost:8040/files/vangogh/menu/menu.json",
        aborter.signal,
      );
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

  // SvD, 22042026: this appears to be unnecessary?
  // useEffect(() => {
  //   setIsMenuOpen(false);
  // }, [location.pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const { style } = document.body;
    const prevOverflow = style.overflow;
    style.overflow = "hidden";
    return () => {
      style.overflow = prevOverflow;
    };
  }, [isMobileMenuOpen]);

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
            <span className="block h-[2px] w-5 bg-current" />
          </span>
        </Button>

        <nav
          className="hidden flex-row gap-4 text-sm *:no-underline lg:flex"
          aria-label="Main navigation"
        >
          {menu?.menu.map((category) => (
            <MenuTrigger
              key={category.label}
              isOpen={openMenuLabel === category.label}
              onOpenChange={(isOpen) =>
                setOpenMenuLabel(isOpen ? category.label : null)
              }
            >
              <Button
                className={`flex items-center gap-1 rounded-md font-medium hover:underline`}
              >
                {category.label}
                <ChevronDown
                  className={`transition-transform ${
                    openMenuLabel === category.label ? "rotate-180" : ""
                  }`}
                />
              </Button>
              <Menu>
                {category.items?.map((item) => (
                  <MenuItem
                    key={item.target}
                    onAction={() =>
                      navigate(
                        `/detail/urn:mace:huc.knaw.nl:vangogh:${item.target}`,
                      )
                    }
                  >
                    <Text slot="label">{item.label}</Text>
                  </MenuItem>
                ))}
                {category.menu?.map((submenu) => (
                  <SubmenuTrigger key={submenu.label}>
                    <MenuItem className="flex items-center justify-between rounded-md px-3 py-2">
                      <Text slot="label">{submenu.label}</Text>
                    </MenuItem>
                    <Menu>
                      {submenu.items?.map((item) => (
                        <MenuItem
                          key={item.target}
                          onAction={() =>
                            navigate(
                              `/detail/urn:mace:huc.knaw.nl:vangogh:${item.target}`,
                            )
                          }
                        >
                          <Text slot="label">{item.label}</Text>
                        </MenuItem>
                      ))}
                    </Menu>
                  </SubmenuTrigger>
                ))}
              </Menu>
            </MenuTrigger>
          ))}
        </nav>
      </div>

      <div className="hidden items-center justify-center border-b border-neutral-400 lg:flex">
        <LanguageMenu />
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
              <ul className="flex flex-col gap-2">
                {props.introIds.map((introId) => (
                  <li key={introId.id}>
                    <Button
                      className="w-full justify-start text-left text-inherit no-underline hover:underline"
                      onPress={() => {
                        navigate(`/detail/${introId.id}`);
                        setIsMobileMenuOpen(false);
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
                        setIsMobileMenuOpen(false);
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
                      setIsMobileMenuOpen(false);
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
