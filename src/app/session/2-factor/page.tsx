'use client'

import { Box } from "@chakra-ui/react"
import { Form, Page, useHeader, IAuth, toaster } from "@vrobots/storybook"
import axios, { AxiosError } from "axios"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "../SessionProvider"
import config from "@/config"

const SecondFactorPage = () => {
  const { ref: headerRef } = useHeader()
  const { setSession } = useSession()
  const searchParams = useSearchParams()
  const userId = searchParams.get('u')
  const router = useRouter()

  const handle2FactorAuth = async (auth: IAuth) => {
    // Handle 2-factor authentication logic here, such as sending the auth code to the server for verification
    console.log("2-Factor Auth Code:", auth.authCode)
    try {
      const response = await axios({
        url: process.env.NEXT_PUBLIC_API_HOST + `/api/v1/user/${userId}/session/login/second-factor`,
        method: 'POST',
        data: {
          authCode: Number(auth.authCode),
          rememberDevice: auth.rememberDevice === 'on',
        }
      })
      toaster.create({
        title: "Authentication Successful",
        description: response.data.message,
        type: "success",
        closable: true,
        duration: 5000,
      })
      setSession(response.data.session)
      router.push(config.state.authenticated.default_path)
    }
    catch (err) {
      const error = err as AxiosError
      toaster.create({
        title: "Error",
        description: error.response?.data || error.message,
        type: "error",
        closable: true,
        duration: 5000,
      })
    }
  }

  const handleResendCode = async () => {
    // Handle logic to resend the 2-factor authentication code, such as making an API call to trigger the email
    console.log("Resend 2-Factor Auth Code")
  }

  return (
    <Page>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={`calc(100vh - ${(headerRef.current?.offsetHeight || 0) * 2}px)`}
      >
        <Form.SecondFactorAuth
          onSecondFactorAuth={handle2FactorAuth}
          onResendAuthCode={handleResendCode}
        />
      </Box>
    </Page>
  )
}

export default SecondFactorPage