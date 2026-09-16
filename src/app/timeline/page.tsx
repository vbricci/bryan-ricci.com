'use client'
import Timeline, { useTimeline } from "@/components/timeline/Timeline"
import { Box, Heading, HStack, IconButton } from "@chakra-ui/react"
import { Tooltip } from "@vrobots/storybook"
import { useRouter } from "next/navigation"
import React from "react"
import { MdAdd } from 'react-icons/md'
import { useSession } from "../session/SessionProvider"

const TimelinePage = () => {
  const { session } = useSession()
  const isLoggedIn = !!session.user
  const { timeline, getTimeline } = useTimeline(isLoggedIn && 'protected')
  const router = useRouter()
  return (
    <React.Fragment>
      <Timeline timeline={timeline} onRefresh={() => getTimeline(isLoggedIn && 'protected')}>
        <HStack mb={4}>
          <Heading>Timeline</Heading>
          {
            isLoggedIn && (
              <Box>
                <Tooltip content={'Add a timeline item'}>
                  <IconButton
                    size={'xs'}
                    onClick={() => router.push('/timeline/item/add')}
                  >
                    <MdAdd />
                  </IconButton>
                </Tooltip>
              </Box>
            )
          }
        </HStack>
      </Timeline>
    </React.Fragment>
  )
}

export default TimelinePage