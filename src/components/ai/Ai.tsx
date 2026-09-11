import { Box } from "@chakra-ui/react"
import AiSection from "./AiSection"
import AiResponse from "./AiResponse"
import useAiStream from "@/hooks/useAiStream"
import AiPrompt from "./AiPrompt"
import React from "react"
import { useSession } from "@/app/session/SessionProvider"

const Ai = () => {
  const { session } = useSession()
  const [prompt, setPrompt] = React.useState("")
  const { response, isStreaming, startStream, stopStream, fullResponse } = useAiStream(session.user?._id ??'guest' as string, session._id as string, 1024)

  const handleStream = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isStreaming) {
      stopStream()
      return
    }
    startStream(prompt)
  }

  React.useEffect(() => {
    return () => stopStream()
  }, [])

  return (
    <React.Fragment>
      <Box w={'100%'} maxW={'1100px'} mx={'auto'} px={4} pt={6} pb={36}>
        <AiResponse
          response={response}
          fullResponse={fullResponse}
          isStreaming={isStreaming}
        />
      </Box>
      <AiPrompt
        isStreaming={isStreaming}
        prompt={prompt}
        onSetPrompt={setPrompt}
        onStream={handleStream}
      />
    </React.Fragment>
  )
}
export default Ai