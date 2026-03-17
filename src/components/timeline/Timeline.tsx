import React, { Suspense } from "react"
import { Timeline as TimelineStorybook, toaster } from '@vrobots/storybook'
import { formatDate, formatDateMonthYear, formatDateTime } from "./TimelineForm";
import { CalendarDate, CalendarDateTime, getLocalTimeZone } from "@internationalized/date";
import TimelineItem from "./TimelineItem";
import { Box, Button, CloseButton, Dialog, Image, Portal, Text, useDisclosure } from "@chakra-ui/react";
import { ITimeline, ITimelineItem } from "@vrobots/writing";
import axios, { AxiosError } from "axios";
import { useSession } from "@/app/session/SessionProvider";

export const useTimeline = () => {
  const [timeline, setTimeline] = React.useState<ITimeline>()

  const getTimeline = React.useCallback(async () => {
    try {
      const { data: timeline } = await axios({
        method: 'GET',
        url: process.env.NEXT_PUBLIC_API_HOST + '/api/v1/writing/timeline/master',
      })
      const items = timeline?.items?.map((item: ITimelineItem) => ({
        ...item,
        sortDate: new Date(formatTimelineDate(item))
      }))
        .sort((a: any, b: any) => a.sortDate - b.sortDate)
      setTimeline({ ...timeline, items })
    }
    catch (err) {
      const error = err as AxiosError
      toaster.create({
        title: 'Get Timeline Failed',
        description: error.response?.data || 'An error occurred while fetching the timeline.',
        type: 'error',
        closable: true,
        duration: 5000,
      })
    }
  }, [])

  React.useEffect(() => {
    getTimeline()
  }, [])

  return {
    timeline,
    setTimeline,
    getTimeline,
  }
}

export const formatTimelineDate = (lineItem: ITimelineItem) => {
  const rawDate = lineItem.dateType === 'date+time' ? lineItem.date as any[] : lineItem.date as any
  const formattedDate = lineItem.dateType === 'date+time' ? formatDateTime.format(new CalendarDateTime(
    rawDate[0]?.year as number,
    rawDate[0]?.month as number,
    rawDate[0]?.day as number,
    rawDate[0]?.hour as number,
    rawDate[0]?.minute as number,
  ).toDate(getLocalTimeZone())) : lineItem.dateType === 'month+year' ? formatDateMonthYear.format(new CalendarDate(
    rawDate[0]?.year as number,
    rawDate[0]?.month as number,
    rawDate[0]?.day as number,
  ).toDate(getLocalTimeZone())) : formatDate.format(new CalendarDate(
    rawDate[0]?.year as number,
    rawDate[0]?.month as number,
    rawDate[0]?.day as number,
  ).toDate(getLocalTimeZone()));
  return formattedDate
}

const makeTimelineItem = (showOwnerOptions: boolean, onClick: (src: string, title: string, description?: string) => void, onRefresh?: () => Promise<void>) => (timelineItem: ITimelineItem) => {
  const formattedDate = formatTimelineDate(timelineItem);
  const splitDate = formattedDate.split(' ')
  const date = timelineItem.dateType === 'month+year'
    ? `${splitDate[0]} - ${splitDate[2]}`
    : formattedDate
  return {
    date,
    component: <TimelineItem
      _id={timelineItem._id as string}
      title={timelineItem.title}
      description={timelineItem.description}
      src={process.env.NEXT_PUBLIC_API_HOST + timelineItem.media[0].src}
      alt={timelineItem.media[0].alt}
      showOwnerOptions={showOwnerOptions}
      click={onClick}
      onRefresh={onRefresh}
    />,
    icon: timelineItem.icon,
  }
}

export interface ITimelineProps {
  timeline?: ITimeline
  onRefresh?: () => Promise<void>
  children?: React.ReactNode | React.ReactNode[]
}

const Timeline = ({ timeline, onRefresh, children = null }: ITimelineProps) => {
  const { session } = useSession()
  const { open, onOpen, onClose } = useDisclosure()
  const [selected, setSelected] = React.useState<{ src: string, title: string, description?: string }>({ src: '', title: '' })
  const showOwnerOptions = timeline?.user?._id === session.user?._id
  const handleTimelineItemClick = (src: string, title: string, description?: string) => {
    setSelected({ src, title, description })
    onOpen()
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setSelected({ src: '', title: '' }), 300) // Delay clearing the image until after the dialog has closed
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Box
        width={'100%'}
        bg={{ _light: 'rgba(255, 255, 255, 0.8)', _dark: 'rgba(0, 0, 0, 0.8)' }}
        padding={{ base: 4, md: 8 }}
      >
        {children}
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={'center'}
          justifyContent={'center'}
        >
          <TimelineStorybook
            items={timeline?.items?.map(makeTimelineItem(showOwnerOptions, handleTimelineItemClick, onRefresh))}
            margin={'auto'}
            width={'100%'}
            maxWidth={'400px'}
            flex={'0 1 auto'}
            colorPalette={'cyan'}
          />
        </Box>
      </Box>
      <Dialog.Root open={open} onOpenChange={handleClose}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{selected.title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Image
                  src={selected.src || void 0}
                  alt="Selected Timeline Image"
                  width={'100%'}
                />
                {
                  !!selected.description && (
                    <Text mt={4}>{selected.description}</Text>
                  )
                }
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button>Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Suspense>
  )
}

export default Timeline