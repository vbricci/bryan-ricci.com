import { ISidebarProviderProps } from "@vrobots/storybook"
import React from "react"

export interface IAppConfigStateOptions {
  default_path: string // Default path for the header navigation
  menus: {
    header: {
      desktop: React.ReactNode | null // Component to render in the header menu
      mobile: React.ReactNode | null // Component to render in the mobile header menu
    },
    sidebar: {
      desktop: ISidebarProviderProps // Component to render in the sidebar menu
      mobile: ISidebarProviderProps // Component to render in the mobile sidebar menu   
    }
  }
  footer: React.ReactNode | null // Component to render in the footer
}

export interface IAppConfig {
  app: {
    name: string // Application name
    logo: {
      light: string // URL to light mode logo
      dark: string // URL to dark mode logo
    }
  }
  state: {
    unauthenticated: IAppConfigStateOptions // Config options for unauthenticated users
    authenticated: IAppConfigStateOptions // Config options for authenticated users
  }
}