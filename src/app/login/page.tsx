'use client'

import { Form, Page, toaster, useHeader } from "@vrobots/storybook"
import { ILoginCredentials } from "@vrobots/storybook"
import axios, { AxiosError } from "axios"
import { useRouter } from "next/navigation"
import { useSession } from "../session/SessionProvider"
import config from "@/config"

const LoginPage = () => {
  const { ref: headerRef } = useHeader()
  const { setSession } = useSession()
  const router = useRouter()

  const handleLogin = async (credentials: ILoginCredentials) => {
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.NEXT_PUBLIC_API_HOST_USER + '/api/v1/user/session/login',
        data: credentials,
      })

      const requires2Factor = !!response.data.path
      toaster.create({
        title: !requires2Factor ? "Login Successful" : "2-Factor Authentication Required",
        description: response.data.message,
        type: !requires2Factor ? "success" : "info",
        closable: true,
        duration: 5000,
      })
      if (response.data.path) {
        router.push(response.data.path)
      }
      else {
        setSession(response.data.session)
        router.push(config.state.authenticated.default_path)
      }
    }
    catch (err) {
      const error = err as AxiosError
      toaster.create({
        title: "Login Failed",
        description: error.response?.data || error.message,
        type: "error",
        closable: true,
        duration: 5000,
      })
    }
  }
  return (
    <Page.Flex>
      <Form.Login
        onLogin={handleLogin}
      />
    </Page.Flex>
  )
}

export default LoginPage