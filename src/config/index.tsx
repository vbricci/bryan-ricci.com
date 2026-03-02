import { MenuSidebarAuthenticatedDesktop, MenuSidebarAuthenticatedMobile, MenuSidebarUnauthenticatedMobile } from "@/menus/sidebar/MenuSidebar";
import { IAppConfig } from "./types";
import { MenuHeaderAuthenticatedDesktop, MenuHeaderAuthenticatedMobile, MenuHeaderUnauthenticatedDesktop, MenuHeaderUnauthenticatedMobile } from "@/menus/header/MenuHeader";

const config: IAppConfig = {
  app:{
    name: "Bryan Ricci",
    logo: {
      light: '/ricci_light.svg',
      dark: '/ricci_dark.svg',
    }
  },
  state: {
    unauthenticated: {
      default_path: '/',
      menus: {
        header: {
          desktop: <MenuHeaderUnauthenticatedDesktop />,
          mobile: <MenuHeaderUnauthenticatedMobile />,
        },
        sidebar: {
          desktop: {
            isOpen: false,
            menu: null
          },
          mobile: {
            isOpen: false,
            menu: <MenuSidebarUnauthenticatedMobile />
          },
        },
      },
      footer: null,
    },
    authenticated: {
      default_path: '/dashboard',
      menus: {
        header: {
          desktop: <MenuHeaderAuthenticatedDesktop />,
          mobile: <MenuHeaderAuthenticatedMobile />,
        },
        sidebar: {
          desktop: {
            isOpen: true,
            menu: <MenuSidebarAuthenticatedDesktop />
          },
          mobile: {
            isOpen: false,
            menu: <MenuSidebarAuthenticatedMobile />
          },
        },
      },
      footer: null,
    }
  }
};

export default config;