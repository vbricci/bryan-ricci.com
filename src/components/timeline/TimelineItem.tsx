import { Box, HStack, IconButton, Image, Text } from "@chakra-ui/react";
import { toaster, Tooltip, VerifyAction } from "@vrobots/storybook";
import { ITimelineItem } from "@vrobots/writing";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { MdEdit, MdDelete } from 'react-icons/md'

export const useTimelineItem = (_id?: string) => {
  const [timelineItem, setTimelineItem] = React.useState<ITimelineItem>()

  const getTimelineItem = React.useCallback(async (_id: string) => {
    try {
      const { data: timelineItem } = await axios({
        method: 'GET',
        url: `/api/v1/writing/timeline/item/${_id}`,
      })
      setTimelineItem(timelineItem)
    }
    catch (err) {
      const error = err as any
      toaster.create({
        title: 'Get Timeline Item Failed',
        description: error.response?.data.error || 'An error occurred while fetching the timeline item.',
        type: 'error',
        closable: true,
        duration: 5000,
      })
    }
  }, [])

  const updateTimelineItem = React.useCallback(async (item: ITimelineItem) => {
    try {
      const { data: timelineItem } = await axios({
        method: 'PUT',
        url: `/api/v1/writing/timeline/item`,
        data: item,
      })
      setTimelineItem(timelineItem)
      toaster.create({
        title: 'Timeline Item Updated',
        description: 'The timeline item was successfully updated.',
        type: 'success',
        closable: true,
        duration: 5000,
      })
    }
    catch (err) {
      const error = err as any
      toaster.create({
        title: 'Update Timeline Item Failed',
        description: error.response?.data.error || 'An error occurred while updating the timeline item.',
        type: 'error',
        closable: true,
        duration: 5000,
      })
    }
  }, [])

  const deleteTimelineItem = React.useCallback(async (_id: string) => {
    try {
      const { data: message } = await axios({
        method: 'DELETE',
        url: `/api/v1/writing/timeline/item/${_id}`,
      })
      toaster.create({
        title: 'Timeline Item Deleted',
        description: message,
        type: 'success',
        closable: true,
        duration: 5000,
      })
    }
    catch (err) {
      const error = err as any
      toaster.create({
        title: 'Delete Timeline Item Failed',
        description: error.response?.data.error || 'An error occurred while deleting the timeline item.',
        type: 'error',
        closable: true,
        duration: 5000,
      })
    }
  }, [])

  const createTimelineLineItem = React.useCallback(async (timelineItem: ITimelineItem) => {
    try {
      const { data: message } = await axios({
        method: 'POST',
        url: `/api/v1/writing/timeline/item`,
        data: timelineItem,
      })
      toaster.create({
        title: 'Timeline Item Created',
        description: message || 'Your timeline item has been created successfully.',
        type: 'success',
        closable: true,
        duration: 3000,
      })
    } catch (err) {
      const error = err as AxiosError
      toaster.create({
        title: 'Creation Failed',
        description: error.response?.data || 'An error occurred while creating the timeline item.',
        type: 'error',
        closable: true,
        duration: 5000,
      })
    }
  }, [])

  React.useEffect(() => {
    if (!!_id) getTimelineItem(_id)
  }, [_id])

  return {
    timelineItem,
    setTimelineItem,
    getTimelineItem,
    updateTimelineItem,
    createTimelineLineItem,
    deleteTimelineItem,
  }
}

export interface ITimelineItemProps {
  item: ITimelineItem
  showOwnerOptions?: boolean
  onClick: (item: ITimelineItem) => void;
  onRefresh?: () => Promise<void>
}

interface IMediaFrameProps {
  cover: ITimelineItem['media'][0]
  onClick: () => void
}

const MediaFrame = ({ cover, onClick }: IMediaFrameProps) => {
  const isImage = cover.type.includes('image')
  const isVideo = cover.type.includes('video')
  const isDocument = cover.type.includes('document')
  const isAudio = cover.type.includes('audio')

  if (!isImage && !isVideo && !isDocument && !isAudio) return null

  return (
    <Box
      position={'relative'}
      width={'100%'}
      height={'160px'}
      borderRadius={'16px 16px 0 0'}
      overflow={'hidden'}
      cursor={'pointer'}
      onClick={onClick}
      flexShrink={0}
      bg={'neu.bg'}
    >
      {isImage && (
        <Image
          src={cover.src}
          alt={cover.alt || 'Timeline Item Media'}
          position={'absolute'}
          top={0}
          left={0}
          right={0}
          bottom={0}
          width={'100%'}
          height={'100%'}
          objectFit={'cover'}
          display={'block'}
        />
      )}
      {isVideo && (
        <video
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          muted
          autoPlay
          loop
          playsInline
        >
          <source src={cover.src} type="video/mp4" />
        </video>
      )}
      {(isDocument || isAudio) && (
        <Image
          src={isDocument ? '/pdf_icon.svg' : '/audio_icon.png'}
          alt={cover.alt || (isDocument ? 'Document' : 'Audio')}
          position={'absolute'}
          top={'50%'}
          left={'50%'}
          transform={'translate(-50%, -50%)'}
          width={'40%'}
          height={'auto'}
          objectFit={'contain'}
        />
      )}
    </Box>
  )
}

const TimelineItem = ({ item, showOwnerOptions, onClick, onRefresh }: ITimelineItemProps) => {
  const { deleteTimelineItem } = useTimelineItem()
  const [markedForDeletion, setMarkedForDeletion] = React.useState<string>('')
  const router = useRouter()

  const cover = item.media?.[0]

  const handleOpenDialog = () => onClick(item)

  const handleDeleteTimelineItem = async () => {
    await deleteTimelineItem(markedForDeletion)
    setMarkedForDeletion('')
    await onRefresh?.()
  }

  return (
    <Box
      layerStyle={'neuRaised'}
      display={'flex'}
      flexDirection={'column'}
      overflow={'hidden'}
      width={'100%'}
      maxWidth={'100%'}
      minWidth={0}
      transition={'transform 0.15s ease, box-shadow 0.2s ease'}
      _hover={{ transform: 'translateY(-2px)' }}
    >
      {/* Media — full-width at the top, bleeds to card edge */}
      {!!cover && (
        <MediaFrame cover={cover} onClick={handleOpenDialog} />
      )}

      {/* Content */}
      <Box p={4} flex={1} minW={0} minH={'100px'} overflow={'hidden'}>
        {showOwnerOptions && (
          <HStack gap={1} mb={2}>
            <Tooltip content={'Edit timeline item'}>
              <IconButton
                size={'xs'}
                variant={'ghost'}
                aria-label={'Edit timeline item'}
                onClick={() => router.push(`/timeline/item/${item._id}/edit`)}
              >
                <MdEdit />
              </IconButton>
            </Tooltip>
            <Tooltip content={'Delete timeline item'}>
              <IconButton
                size={'xs'}
                variant={'ghost'}
                colorPalette={'red'}
                aria-label={'Delete timeline item'}
                onClick={() => setMarkedForDeletion(item._id as string)}
              >
                <MdDelete />
              </IconButton>
            </Tooltip>
          </HStack>
        )}

        <Text
          display={'block'}
          width={'100%'}
          maxWidth={'100%'}
          overflow={'hidden'}
          minW={0}
          fontSize={'lg'}
          fontWeight={'semibold'}
          color={'neu.text'}
          lineHeight={'short'}
          cursor={'pointer'}
          _hover={{ color: 'neu.accent' }}
          transition={'color 0.15s ease'}
          onClick={handleOpenDialog}
          lineClamp={1}
          overflowWrap={'anywhere'}
          wordBreak={'break-word'}
        >
          {item.title}
        </Text>

        {!!item.description && (
          <Text
            display={'block'}
            width={'100%'}
            maxWidth={'100%'}
            minW={0}
            fontSize={'sm'}
            color={'neu.muted'}
            mt={1}
            lineClamp={2}
            overflowWrap={'anywhere'}
            wordBreak={'break-word'}
          >
            {item.description}
          </Text>
        )}
      </Box>

      <VerifyAction
        isOpen={!!markedForDeletion}
        heading={'Delete this timeline item?'}
        subheading={`This will also delete all associated files. This action can't be undone.`}
        onCancel={() => setMarkedForDeletion('')}
        onProceed={handleDeleteTimelineItem}
      />
    </Box>
  )
}

export default TimelineItem;