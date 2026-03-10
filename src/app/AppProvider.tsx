'use client'
import React from "react";
import App from "@/app/App";

import { ISession } from "@vrobots/user";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import SessionProvider from "./session/SessionProvider";

export interface IAppProviderProps {
  session?: ISession
  children: React.ReactNode;
}

const AppProvider: React.FC<IAppProviderProps> = ({ session, children }) => {
 const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!session || !isMounted) {
    return null
  }

  return (
    <ChakraProvider value={defaultSystem}>
      <SessionProvider session={session}>
        <App>{children}</App>
      </SessionProvider>
    </ChakraProvider>
  )
};

export default AppProvider;