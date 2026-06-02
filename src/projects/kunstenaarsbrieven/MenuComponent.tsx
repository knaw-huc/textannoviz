import { ChevronDown } from "../../components/common/icons/ChevronDown";
import { buildNavLink } from "./utils/buildNavLink";
import React from "react";
import {
  Menu,
  MenuItem,
  MenuTrigger,
  SubmenuTrigger,
} from "../../components/common/Menu";
import { Button, Text } from "react-aria-components";
import { useNavigate } from "react-router";

// Individual link in menu
type MenuItem = {
  label: string;
  target: string;
};

/**
 * Represents a menu category.
 * It can contain a list of `items` (links)
 * OR another `menu` array (nested categories).
 */
type MenuCategory = {
  label: string;
} & ({ items: MenuItem[] } | { menu: MenuCategory[] });

// Root structure of menu
export type RootMenu = {
  menu: MenuCategory[];
};

type MenuComponentProps = {
  menu: RootMenu | undefined;
  variant?: "dropdown" | "expanded";
  onNavigate?: () => void;
};

export function MenuComponent(props: MenuComponentProps) {
  const { menu, variant = "dropdown", onNavigate } = props;
  const [openMenuLabel, setOpenMenuLabel] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const menuStyling =
    "min-w-[220px] rounded-xl bg-white px-3 py-2 shadow-md outline-none ring-1 ring-black/5";
  const menuItemStyling =
    "flex cursor-pointer flex-row items-center gap-2 truncate rounded-md px-3 py-2 text-sm font-normal text-neutral-800 outline-none transition-colors hover:text-neutral-900 focus:bg-[#FFCE01] focus:outline-none focus-visible:bg-[#FFCE01] focus-visible:text-neutral-900 focus-visible:outline-none";

  const navigateTo = (target: string) => {
    navigate(buildNavLink(target));
    onNavigate?.();
  };

  if (variant === "expanded") {
    return (
      <ul className="flex flex-col gap-3">
        {menu?.menu.map((category) => (
          <li key={category.label} className="flex flex-col gap-2">
            <strong>{category.label}</strong>
            {"items" in category && (
              <ul className="ml-3 flex flex-col gap-2">
                {category.items.map((item) => (
                  <li key={item.target}>
                    <Button
                      className="w-full justify-start text-left text-inherit no-underline hover:underline"
                      onPress={() => navigateTo(item.target)}
                    >
                      {item.label}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            {"menu" in category && (
              <ul className="ml-3 flex flex-col gap-3">
                {category.menu.map((submenu) => (
                  <li key={submenu.label} className="flex flex-col gap-2">
                    <span>{submenu.label}</span>
                    {"items" in submenu && (
                      <ul className="ml-3 flex flex-col gap-2">
                        {submenu.items.map((item) => (
                          <li key={item.target}>
                            <Button
                              className="w-full justify-start text-left text-inherit no-underline hover:underline"
                              onPress={() => navigateTo(item.target)}
                            >
                              {item.label}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {menu?.menu.map((category) => (
        <MenuTrigger
          key={category.label}
          isOpen={openMenuLabel === category.label}
          onOpenChange={(isOpen) =>
            setOpenMenuLabel(isOpen ? category.label : null)
          }
        >
          <Button className="flex items-center gap-1 rounded-md hover:underline">
            {category.label}
            <ChevronDown
              className={`transition-transform ${
                openMenuLabel === category.label ? "rotate-180" : ""
              }`}
            />
          </Button>
          <Menu className={menuStyling}>
            {"items" in category &&
              category.items?.map((item) => (
                <MenuItem
                  key={item.target}
                  className={menuItemStyling}
                  onAction={() => navigateTo(item.target)}
                >
                  <Text slot="label">{item.label}</Text>
                </MenuItem>
              ))}
            {"menu" in category &&
              category.menu?.map((submenu) => (
                <SubmenuTrigger key={submenu.label}>
                  <MenuItem className={menuItemStyling}>
                    <Text slot="label">{submenu.label}</Text>
                  </MenuItem>
                  <Menu className={menuStyling}>
                    {"items" in submenu &&
                      submenu.items?.map((item) => (
                        <MenuItem
                          key={item.target}
                          className={menuItemStyling}
                          onAction={() => navigateTo(item.target)}
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
    </>
  );
}
