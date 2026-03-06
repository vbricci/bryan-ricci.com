'use client'
import config from "../config";
import { ColorModeProvider, Frame, HeaderProvider, SidebarProvider, Toaster, useIsMobile } from "@vrobots/storybook";
import { useSession } from "./session/SessionProvider";
import { TAppState, TRes } from "@/types";
import { AUTHENTICATED, UNAUTHENTICATED } from "@/constants";

export interface IAppProps {
  children: React.ReactNode
}

const App = ({ children }: IAppProps) => {
  const { session } = useSession()
  const isMobile = useIsMobile()
  const res: TRes = isMobile ? 'mobile' : 'desktop'

  console.log('App session:', session)
  const appState: TAppState = !!session.user ? AUTHENTICATED : UNAUTHENTICATED
  
  return (
    <ColorModeProvider
      attribute="class"
      enableSystem={false}
    >
      <Toaster />
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