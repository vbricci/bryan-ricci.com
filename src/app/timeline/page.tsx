'use client'
import Timeline, { useTimeline } from "@/components/timeline/Timeline"
import { Box, Heading, HStack, IconButton } from "@chakra-ui/react"
import { Tooltip } from "@vrobots/storybook"
import { useRouter } from "next/navigation"
import React from "react"
import { MdAdd } from 'react-icons/md'

const TimelinePage = () => {
  const { timeline, getTimeline } = useTimeline()
  const router = useRouter()
  return (
    <React.Fragment>
      <Timeline timeline={timeline} onRefresh={getTimeline}>
        <HStack mb={4}>
          <Heading>Timeline</Heading>
          <Box>
            <Tooltip content={'Add a timelime item'}>
              <IconButton
                size={'xs'}
                onClick={() => router.push('/timeline/item/add')}
              >
                <MdAdd />
              </IconButton>
            </Tooltip>
          </Box>
        </HStack>
      </Timeline>
    </React.Fragment>
  )
}

export default TimelinePage