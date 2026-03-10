'use client'

import { toaster } from "@vrobots/storybook"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import React from "react"
import { useSession } from "../session/SessionProvider"
import config from "@/config"

const LogoutPage = () => {
  const { session, setSession } = useSession()
  const router = useRouter()
  const handleLogout = async () => {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.NEXT_PUBLIC_API_HOST_USER + `/api/v1/user/${session.user._id}/session/logout`,
      })
      setSession(response.data.session)
      toaster.create({
        title: 'Logout Successful',
        type: 'success',
        description: response.data.message,
        closable: true,
        duration: 5000,
      })
      router.push(config.state.unauthenticated.default_path)
    }
    catch (err) {
      const error = err as AxiosError
      toaster.create({
        title: 'Error logging out',
        type: 'error',
        description: error.response?.data as string || error.message,
        closable: true,
        duration: 5000,
      })
    }
  }

  React.useEffect(() => {
    handleLogout()
  }, [])

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  )
}

export default LogoutPage