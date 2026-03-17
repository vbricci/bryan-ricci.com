import { Box, HStack, IconButton, Image, ImageProps, Text } from "@chakra-ui/react";
import { toaster, Tooltip } from "@vrobots/storybook";
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
        url: process.env.NEXT_PUBLIC_API_HOST_WRITING + `/api/v1/writing/timeline/item/${_id}`,
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
        url: process.env.NEXT_PUBLIC_API_HOST_WRITING + `/api/v1/writing/timeline/item`,
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
        url: process.env.NEXT_PUBLIC_API_HOST_WRITING + `/api/v1/writing/timeline/item/${_id}`,
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
        url: `${process.env.NEXT_PUBLIC_API_HOST_WRITING}/api/v1/writing/timeline/item`,
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

export interface ITimelineItemProps extends ImageProps {
  _id: string
  title: string
  description?: string
  showOwnerOptions?: boolean
  click: (src: string, title: string, description?: string) => void;
  onRefresh?: () => Promise<void>
}

const TimelineItem = ({ _id, title, description, showOwnerOptions, click, onRefresh, ...props }: ITimelineItemProps) => {
  const { deleteTimelineItem } = useTimelineItem()
  const router = useRouter()
  const handleOpenDialog = () => {
    click(props.src as string, title, description);
  };
  const handleDeleteTimelineItem = async (_id: string) => {
    await deleteTimelineItem(_id)
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
              onClick={() => router.push(`/timeline/item/${_id}/edit`)}
            >
              <MdEdit />
            </IconButton>
          </Tooltip>
          <Tooltip content={'Delete timeline item'}>
            <IconButton
              size={'xs'}
              colorPalette={'red'}
              variant={'subtle'}
              onClick={() => handleDeleteTimelineItem(_id)}
            >
              <MdDelete />
            </IconButton>
          </Tooltip>
        </HStack>
      )}
      <Text fontSize={'xl'} fontWeight={'bold'} mb={2} cursor={'pointer'} onClick={handleOpenDialog}>{title}</Text>
      <Image
        {...props}
        width={200}
        height={200}
        borderRadius={'full'}
        margin={{ base: 'auto', md: 0 }}
        position={'relative'}
        left={{ base: -4, md: 0 }}
        right={0}
        cursor={'pointer'}
        onClick={handleOpenDialog}
      />
    </Box>
  );
}

export default TimelineItem;