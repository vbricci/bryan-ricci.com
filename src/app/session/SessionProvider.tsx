'use client'

import { ISession } from "@/types"
import axios from "axios"
import { userAgent } from "next/dist/server/web/spec-extension/user-agent"
import React from "react"

export interface ISessionContextProps {
  session: ISession
  setSession: React.Dispatch<React.SetStateAction<ISession>>
}

const SessionContext = React.createContext<ISessionContextProps>({} as ISessionContextProps)

export const useSession = () => {
  const session = React.useContext(SessionContext)
  return session
}

const createAxiosHeaders = (session?: ISession) => {
  axios.interceptors.request.use((request) => {
    const authorizationHeader = session ? `Bearer ${session.token}` : ''
    request.headers['Authorization'] = authorizationHeader
    return request
  }, function (error) {
    return Promise.reject(error);
  });
}

const SessionProvider: React.FC<{ session: ISession, children: React.ReactNode }> = ({ session: incomingSession, children }) => {
  const [session, setSession] = React.useState<ISession>(incomingSession)
  const provider: ISessionContextProps = {
    session,
    setSession
  }

  React.useEffect(() => {
    setSession(incomingSession)
  }, [incomingSession])

  React.useEffect(() => {
    createAxiosHeaders(session)
  }, [session])

  return (
    <SessionContext.Provider value={provider}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider