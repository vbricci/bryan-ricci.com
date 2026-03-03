'use client'
import React from "react";
import App from "@/app/App";

import { ISession } from "@/types";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
export interface IAppProviderProps {
  session?: ISession
  children: React.ReactNode;
}

const AppProvider: React.FC<IAppProviderProps> = ({ session, children }) => {
 console.log('Session in AppProvider:', session)
 const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!session || !isMounted) {
    return null
  }

  return (
    <ChakraProvider value={defaultSystem}>
      <App session={session} children={children} />
    </ChakraProvider>
  )
};

export default AppProvider;