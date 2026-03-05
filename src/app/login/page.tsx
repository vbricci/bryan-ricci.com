'use client'

import { Box } from "@chakra-ui/react"
import { Form, Page, toaster, useHeader } from "@vrobots/storybook"
import { ILoginCredentials } from "@vrobots/storybook/dist/src/components/form/Login"
import axios, { AxiosError } from "axios"

const LoginPage = () => {
  const { ref: headerRef } = useHeader()
  console.log("Header ref:", headerRef.current?.offsetHeight)
  const handleLogin = async (credentials: ILoginCredentials) => {
    console.log("Login credentials:", credentials)
    try {
      const response = await axios({
        method: 'POST',
        url: process.env.NEXT_PUBLIC_API_HOST + '/api/v1/user/session/login',
        data: credentials,
        // headers: {
        //   'User-Agent': navigator.userAgent,
        //   'Authorization': 'testing' // Clear any existing authorization header for login
        // }
      })
      console.log("Login response:", response)
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
    <Page>
      <Box
        display="flex"  
        justifyContent="center"
        alignItems="center"
        height={`calc(100vh - ${(headerRef.current?.offsetHeight || 0) * 2}px)`}
      >
        <Form.Login
          onLogin={handleLogin}
        />
      </Box>
    </Page>
  )
}

export default LoginPage