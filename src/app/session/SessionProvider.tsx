'use client'

import { ISession } from "@vrobots/user"
import axios from "axios"
import React from "react"
import { useRouter } from 'next/navigation'

export interface ISessionContextProps {
  session: ISession
  setSession: React.Dispatch<React.SetStateAction<ISession>>
}

const SessionContext = React.createContext<ISessionContextProps>({} as ISessionContextProps)

export const useSession = () => {
  const session = React.useContext(SessionContext)
  return session
}

const createAxiosInterceptors = (router: any) => (session?: ISession) => {
  axios.interceptors.request.use((request) => {
    const authorizationHeader = session ? `Bearer ${session.token}` : ''
    request.headers['Authorization'] = authorizationHeader
    return request
  }, function (error) {
    return Promise.reject(error);
  });

  axios.interceptors.response.use((response) => {
    if (response.status === 401) {
      router.push('/unauthorized')
    }
    return response
  }, function (error) {
    return Promise.reject(error);
  });
}

const SessionProvider: React.FC<{ session: ISession, children: React.ReactNode }> = ({ session: incomingSession, children }) => {
  const [session, setSession] = React.useState<ISession>(incomingSession)
  const router = useRouter()
  const provider: ISessionContextProps = {
    session,
    setSession
  }

  React.useEffect(() => {
    setSession(incomingSession)
  }, [incomingSession])

  createAxiosInterceptors(router)(session)

  return (
    <SessionContext.Provider value={provider}>
      {children}
    </SessionContext.Provider>
  )
}

export default SessionProvider