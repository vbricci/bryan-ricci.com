import React, { Suspense } from "react"
import { Timeline as TimelineStorybook, toaster } from '@vrobots/storybook'
import { formatDate, formatDateMonthYear, formatDateTime } from "./TimelineForm";
import { CalendarDate, CalendarDateTime, getLocalTimeZone } from "@internationalized/date";
import TimelineItem from "./TimelineItem";
import { Box, Button, Carousel, CloseButton, Dialog, IconButton, Image, Portal, Text, useDisclosure } from "@chakra-ui/react";
import { ITimeline, ITimelineItem } from "@vrobots/writing";
import axios, { AxiosError } from "axios";
import { useSession } from "@/app/session/SessionProvider";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu"

type TProtectedTimeline = 'protected' | 'restricted'

export const useTimeline = (protection?: TProtectedTimeline) => {
  const [timeline, setTimeline] = React.useState<ITimeline>()

  const getTimeline = React.useCallback(async (protection?: TProtectedTimeline) => {
    try {
      const { data: timeline } = await axios({
        method: 'GET',
        url: `/api/v1/writing/timeline/master${protection ? `/${protection}` : ''}`,
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
    getTimeline(protection)
  }, [protection])

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

const makeTimelineItem = (showOwnerOptions: boolean, onClick: (item: ITimelineItem) => void, onRefresh?: () => Promise<void>) => (timelineItem: ITimelineItem) => {
  const formattedDate = formatTimelineDate(timelineItem);
  const splitDate = formattedDate.split(' ')
  const date = timelineItem.dateType === 'month+year'
    ? `${splitDate[0]} - ${splitDate[2]}`
    : formattedDate
  return {
    date,
    component: <TimelineItem
      item={timelineItem}
      showOwnerOptions={showOwnerOptions}
      onClick={onClick}
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
  const [selected, setSelected] = React.useState<ITimelineItem>()
  const showOwnerOptions = timeline?.user?._id === session.user?._id
  const cover = selected?.media[0]

  const handleTimelineItemClick = (item: ITimelineItem) => {
    setSelected(item)
    onOpen()
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setSelected(void 0), 300) // Delay clearing the image until after the dialog has closed
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
      <Dialog.Root open={open} onOpenChange={handleClose} size={'lg'}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{selected?.title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {
                  !!cover && cover.type.includes('image')
                    ? (
                      <Carousel.Root slideCount={selected?.media.length} gap="4">
                        <Carousel.Control justifyContent="center" gap="4" width="full">
                          <Carousel.PrevTrigger asChild>
                            <IconButton size="xs" variant="outline">
                              <LuChevronLeft />
                            </IconButton>
                          </Carousel.PrevTrigger>

                          <Carousel.ItemGroup width="full">
                            {selected?.media.map((item, index) => (
                              <Carousel.Item key={index} index={index}>
                                <Image
                                  aspectRatio="16/9"
                                  src={item.src}
                                  alt={item.alt}
                                  w="100%"
                                  h="100%"
                                  objectFit="cover"
                                />
                              </Carousel.Item>
                            ))}
                          </Carousel.ItemGroup>

                          <Carousel.NextTrigger asChild>
                            <IconButton size="xs" variant="outline">
                              <LuChevronRight />
                            </IconButton>
                          </Carousel.NextTrigger>
                        </Carousel.Control>

                        <Carousel.IndicatorGroup>
                          {selected?.media.map((item, index) => (
                            <Carousel.Indicator
                              key={index}
                              index={index}
                              unstyled
                              _current={{
                                outline: "2px solid currentColor",
                                outlineOffset: "2px",
                              }}
                            >
                              <Image
                                w="20"
                                aspectRatio="16/9"
                                src={item.src}
                                alt={item.alt}
                                objectFit="cover"
                              />
                            </Carousel.Indicator>
                          ))}
                        </Carousel.IndicatorGroup>
                      </Carousel.Root>
                    ) : cover?.type.includes('video')
                      ? (
                        <video controls width="100%" height="100%" autoPlay>
                          <source src={cover.src} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : cover?.type.includes('document')
                        ? (
                          <a href={cover.src} target="_blank" rel="noopener noreferrer">{cover.alt || 'View Document'}</a>
                        ) : null
                }
                {
                  !!selected?.description && (
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