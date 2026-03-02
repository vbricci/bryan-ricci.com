'use client'
import config from "../config";
import { ColorModeProvider, Frame, HeaderProvider, SidebarProvider, useIsMobile } from "@vrobots/storybook";
import { ISession } from "@/types"

export type TAppState = 'unauthenticated' | 'authenticated'
export type TRes = 'mobile' | 'desktop'
const UNAUTHENTICATED = 'unauthenticated'
const AUTHENTICATED = 'authenticated'

export interface IAppProps {
  session: ISession
  children: React.ReactNode
}

const App = ({ session, children }: IAppProps) => {
  const isMobile = useIsMobile()
  const res: TRes = isMobile ? 'mobile' : 'desktop'
  const appState: TAppState = !!session.user ? AUTHENTICATED : UNAUTHENTICATED
  
  return (
    <ColorModeProvider
      attribute="class"
      enableSystem={false}
    >
      <HeaderProvider
        defaultPath={config.state[appState].default_path}
        appName={config.app.name}
        logo={config.app.logo}
        menu={config.state[appState].menus.header[res]}
      >
        <SidebarProvider {...config.state[appState].menus.sidebar[res]}>
          <Frame>
            {children}
          </Frame>
        </SidebarProvider>
      </HeaderProvider>
    </ColorModeProvider>
  )
}

export default App