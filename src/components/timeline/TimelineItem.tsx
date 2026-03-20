import { Box, HStack, IconButton, Image, ImageProps, Text, useDisclosure } from "@chakra-ui/react";
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

const TimelineItem = ({ item, showOwnerOptions, onClick, onRefresh }: ITimelineItemProps) => {
  const { deleteTimelineItem } = useTimelineItem()
  const [markedForDeletion, setMarkedForDeletion] = React.useState<string>('')
  const router = useRouter()

  const cover = item.media[0]

  const handleOpenDialog = () => {
    onClick(item);
  };

  const handleVerifyActionDeleteTimelineItem = (_id: string) => {
    setMarkedForDeletion(_id)
  }

  const handleDeleteTimelineItem = async () => {
    await deleteTimelineItem(markedForDeletion)
    setMarkedForDeletion('')
    !!onRefresh && await onRefresh()
  }

  return (
    <Box>
      {showOwnerOptions && (
        <HStack gap={2}>
          <Tooltip content={'Edit timeline item'}>
            <IconButton
              size={'xs'}
              colorPalette={'gray'}
              variant={'subtle'}
              onClick={() => router.push(`/timeline/item/${item._id}/edit`)}
            >
              <MdEdit />
            </IconButton>
          </Tooltip>
          <Tooltip content={'Delete timeline item'}>
            <IconButton
              size={'xs'}
              colorPalette={'red'}
              variant={'subtle'}
              onClick={() => handleVerifyActionDeleteTimelineItem(item._id as string)}
            >
              <MdDelete />
            </IconButton>
          </Tooltip>
        </HStack>
      )}
      <Text fontSize={'xl'} fontWeight={'bold'} mb={2} cursor={'pointer'} onClick={handleOpenDialog}>{item.title}</Text>
      {
        !!cover && cover.type.includes('image')
          ? (
            <Image
              width={200}
              height={200}
              borderRadius={'full'}
              margin={{ base: 'auto', md: 0 }}
              position={'relative'}
              left={{ base: -4, md: 0 }}
              right={0}
              cursor={'pointer'}
              onClick={handleOpenDialog}
              src={cover.src}
              alt={cover.alt || 'Timeline Item Media'}
            />
          ) : cover?.type.includes('video')
            ? (
              <Box width={200} height={200} bgColor={'gray.800'} borderRadius={'full'} overflow={'hidden'} position={'relative'} left={{ base: -4, md: 0 }} right={0} cursor={'pointer'} onClick={handleOpenDialog}>
                <Box width={400} height={400}>

                  <video style={{ position: 'relative' }} controls width="100%" muted autoPlay loop>
                    <source src={cover.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </Box>
              </Box>
            ) : cover?.type.includes('document')
              ? (
                <Box width={200} height={200} bgColor={'gray.800'} borderRadius={'full'} overflow={'hidden'} position={'relative'} left={{ base: -4, md: 0 }} right={0} cursor={'pointer'} onClick={handleOpenDialog} display={'block'}>
                  <Image
                    height={100}
                    margin={'auto'}
                    mt={50}
                    src={'/pdf_icon.svg'}
                    alt={cover.alt || 'Timeline Item Media'}
                  />
                </Box>
              ) : cover?.type.includes('audio')
                ? (
                  <Box width={200} height={200} bgColor={'gray.800'} borderRadius={'full'} overflow={'hidden'} position={'relative'} left={{ base: -4, md: 0 }} right={0} cursor={'pointer'} onClick={handleOpenDialog} display={'block'}>
                    <Image
                      height={100}
                      margin={'auto'}
                      mt={50}
                      src={'/audio_icon.png'}
                      alt={cover.alt || 'Timeline Item Media'}
                    />
                  </Box>
                )
                : null
      }
      <VerifyAction
        isOpen={!!markedForDeletion}
        heading={'Are you sure want to delete this timeline item?'}
        subheading={`This will also delete all files associated with this item. This action can't be undone!`}
        onCancel={() => setMarkedForDeletion('')}
        onProceed={handleDeleteTimelineItem}
      />
    </Box>
  );
}

export default TimelineItem;