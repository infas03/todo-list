import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { Button } from "@heroui/button";
import { useAuth } from "../context/AuthProvider";
import { GithubIcon, LinkedInIcon, Logo } from "./icons";
import { siteConfig } from "../config/site";
import { ThemeSwitch } from "./theme-switch";

export const Navbar = () => {
  const location = useLocation();

  const { logout, role, userDetails, isLoggedIn } = useAuth();

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
            <p className="text-sm md:text-base font-bold text-inherit">
              TASK MANAGEMENT SYSTEM
            </p>
          </Link>
        </NavbarBrand>
        {role === "admin" && (
          <div className="hidden lg:flex gap-4 justify-start ml-2">
            {siteConfig.navItems.map((item) => {
              const isActive = location.pathname === item.href;

              return (
                <NavbarItem key={item.href} isActive={isActive}>
                  <Link
                    className={clsx(linkStyles({ color: "foreground" }), {
                      "text-blue-500 font-medium": isActive,
                      "data-[active=true]:text-primary data-[active=true]:font-medium":
                        !isActive,
                    })}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </NavbarItem>
              );
            })}
          </div>
        )}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href={siteConfig.links.linkedin} title="Linkedin">
            <LinkedInIcon className="text-default-500" />
          </Link>
          <Link isExternal href={siteConfig.links.github} title="GitHub">
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="flex flex-col text-xs">
          <span className="font-medium capitalize">{userDetails?.name}</span>
        </NavbarItem>
        {isLoggedIn && (
          <NavbarItem>
            <Button color="danger" href="#" variant="flat" onPress={logout}>
              Logout
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link>
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {role === "admin" &&
            siteConfig.navItems.map((item, index) => {
              const isActive = location.pathname === item.href;

              return (
                <NavbarMenuItem key={`${item}-${index}`} isActive={isActive}>
                  <Link
                    className={clsx(linkStyles({ color: "foreground" }), {
                      "text-blue-500 font-medium": isActive,
                      "data-[active=true]:text-primary data-[active=true]:font-medium":
                        !isActive,
                    })}
                    color="foreground"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </NavbarMenuItem>
              );
            })}
          <NavbarItem>
            <Button color="danger" href="#" variant="flat" onPress={logout}>
              Sign Out
            </Button>
          </NavbarItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
