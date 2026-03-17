
'use client'

import useFileUpload from "@/hooks/useFileUpload";
import { Box, Button, Card, createListCollection, DatePicker, Field, Image, Input, Listbox, NativeSelect, Popover, Portal, Stack, Textarea, useFilter, useListbox, useLiveRef } from "@chakra-ui/react";
import { MdEditCalendar } from "react-icons/md"
import { TFilePermission } from "@vrobots/file";
import { Form, toaster } from "@vrobots/storybook";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as Icons from "react-icons/md"
import { LuChevronDown } from "react-icons/lu"
import { CalendarDate, CalendarDateTime, DateFormatter, getLocalTimeZone } from "@internationalized/date"
import type { DateValue } from "@chakra-ui/react"
import { type VirtualItem, useVirtualizer } from "@tanstack/react-virtual"
import { ITimelineItem, ITimelineMedia, TTimelineDateType, } from "@vrobots/writing"
import axios from 'axios'
import config from "@/config";
import { formatTimelineDate } from "./Timeline";
import { useTimelineItem } from "./TimelineItem";

export interface ITimelineFormProps {
  timelineItem?: ITimelineItem
}

const TimelineForm = ({ timelineItem }: ITimelineFormProps) => {
  const [files, setFiles] = React.useState<File[]>([])
  const [uploadPercentages, setUploadPercentages] = React.useState<number[]>([])
  const router = useRouter()
  const fileUpload = useFileUpload()
  const [open, setOpen] = React.useState(false)
  const [filterValue, setFilterValue] = React.useState("")
  const { contains } = useFilter({ sensitivity: "base" })
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const { createTimelineLineItem, updateTimelineItem } = useTimelineItem()
  const isEdit = !!timelineItem

  const icons = React.useMemo(
    () => Object.keys(Icons).map(key => ({ value: key, label: key })).filter(icon => contains(icon.label, filterValue)),
    [contains, filterValue]
  )

  const virtual = useListboxVirtualizer({
    count: icons.length,
  })

  const collection = React.useMemo(
    () => createListCollection({ items: icons }),
    [icons],
  )

  const listbox = useListbox({
    collection,
    onValueChange() {
      setOpen(false)
      setInputValueFn("")
      !!selectedIcon && setValue('icon', selectedIcon.label as any)
      triggerRef.current?.focus()
    },
  })

  const setInputValueFn = (value: string) => {
    setFilterValue(value)
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ITimelineItem>({ defaultValues: { permission: 'public', ...timelineItem, date: '' } })

  const selectedIcon = !!timelineItem ? { label: watch('icon'), value: watch('icon') } : listbox.selectedItems[0]
  const selectedDateType = watch('dateType')
  const selectedDate = watch('date') || [] as any
  const timeValue = selectedDate.length > 0 && selectedDateType === 'date+time'
    ? `${String(selectedDate[0].hour).padStart(2, "0")}:${String(selectedDate[0].minute).padStart(2, "0")}`
    : ""

  const handleFilesSelected = (files: File[]) => {
    setFiles(files)
  }

  const onChangeDateType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('date', void 0)
    setValue('dateType', e.currentTarget.value as any)
  }

  const onDateTimeChange = (details: { value: DateValue[] }) => {
    const newDate = details.value[0]
    if (!newDate) return setValue('date', [] as any)
    const prevTime = selectedDate[0] ?? { hour: 0, minute: 0 }
    const value = [
      new CalendarDateTime(
        newDate.year,
        newDate.month,
        newDate.day,
        prevTime.hour,
        prevTime.minute,
      ),
    ] as CalendarDateTime[]
    setValue('date', value)
  }

  const onDateTimeChangeInitial = (details: { value: CalendarDateTime[] }) => {
    const newDate = details.value[0]
    if (!newDate) return setValue('date', [] as any)
    const value = [
      new CalendarDateTime(
        newDate.year,
        newDate.month,
        newDate.day,
        newDate.hour ?? 0,
        newDate.minute ?? 0,
      ),
    ] as CalendarDateTime[]
    setValue('date', value)
  }

  const onTimeChange = (date: CalendarDateTime) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.currentTarget.value.split(":").map(Number)
    setValue('date', [date.set({ hour: hours, minute: minutes })] as any)
  }

  const handleUpload = async (permission: TFilePermission) => {
    try {
      const uploadPromises = files.map((file, index) => fileUpload.upload(file, permission, (percent) => {
        setUploadPercentages((prev) => {
          const next = [...prev]
          next[index] = percent
          return next
        })
      }))
      const uploadedFiles = await Promise.all(uploadPromises)
      return uploadedFiles.map((file: any) => ({
        type: file.mimetype.startsWith('image') ? 'image' : file.mimetype.startsWith('video') ? 'video' : 'document',
        src: `/api/v1/file/${file._id}`,
        alt: file.filename,
      } as ITimelineMedia)) as ITimelineMedia[]
    }
    catch (err) {
      const error = err as AxiosError
      toaster.create({
        title: 'Upload Failed',
        description: error.response?.data || 'An error occurred while uploading files.',
        type: 'error',
        closable: true,
        duration: 5000,
      })
    }
  }

  const onSubmit = async (data: ITimelineItem) => {
    try {
      const media = files.length > 0 ? await handleUpload(data.permission as 'private') : isEdit ? timelineItem.media : void 0

      if (!media) {
        toaster.create({
          title: 'Timeline Media is Required',
          description: 'Timeline media is a required field.',
          type: 'error',
          closable: true,
          duration: 5000,
        })
        return
      }
      const item = {
        ...data,
        media,
        icon: selectedIcon?.value as keyof typeof Icons || 'MdCircle',
      }
      isEdit
        ? updateTimelineItem(item as ITimelineItem)
        : createTimelineLineItem(item as ITimelineItem)
      router.push(config.state.authenticated.default_path)
    }
    catch (err) {

    }
  }

  React.useEffect(() => {
    if (timelineItem) {
      setValue('icon', timelineItem.icon as any)
      onDateTimeChangeInitial({ value: timelineItem.date as CalendarDateTime[] })
    }
  }, [timelineItem])

  // React.useEffect(() => {
  //   // Cleanup file previews on unmount
  //   return () => { 
  //     filePreviews.forEach((preview) => URL.revokeObjectURL(preview))
  //   }
  // }, [filePreviews])

  return (
    <Card.Root mb={4}>
      <Card.Body>
        <Card.Title>New Timeline Item</Card.Title>
        <Card.Description mb={4}>Create a new item for your timeline.</Card.Description>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack gap="4">
            <Field.Root
              invalid={!!errors.permission}
              required
            >
              <Field.Label>Permission</Field.Label>
              <NativeSelect.Root size="sm" variant="subtle">
                <NativeSelect.Field
                  {...register("permission", { required: "Please select a permission level" })}
                  autoFocus
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            <Field.Root
              invalid={!!errors.dateType}
              required
            >
              <Field.Label>
                Date Type
                <Field.RequiredIndicator />
              </Field.Label>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field placeholder="Select an option"
                  {...register("dateType", { required: "Please select a date type", onChange: onChangeDateType })}>
                  <option value="month+year">Month &amp; Year</option>
                  <option value="date">Date</option>
                  <option value="date+time">Date &amp; Time</option>
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Field.Root>

            {
              !!selectedDateType && (
                <Field.Root>
                  <Field.Label>
                    Date
                    <Field.RequiredIndicator />
                  </Field.Label>
                  <DatePicker.Root
                    value={selectedDate}
                    onValueChange={onDateTimeChange}
                    closeOnSelect={selectedDateType !== 'date+time'}
                    format={format(selectedDateType as TTimelineDateType)}
                    parse={parse(selectedDateType as TTimelineDateType)}
                    invalid={!!errors.date}
                    defaultView={'month'}
                    minView={selectedDateType === 'month+year' ? 'month' : 'day'}
                    placeholder={dateFormat[selectedDateType as 'date']}
                    variant="subtle"
                    required
                  >
                    {
                      selectedDateType !== 'date+time' ? (
                        <DatePicker.Control>
                          <DatePicker.Input />
                          <DatePicker.IndicatorGroup>
                            <DatePicker.Trigger>
                              <MdEditCalendar />
                            </DatePicker.Trigger>
                          </DatePicker.IndicatorGroup>
                        </DatePicker.Control>
                      ) : (
                        <DatePicker.Control>
                          <DatePicker.Trigger asChild unstyled>
                            <Button variant="outline" width="full" justifyContent="space-between">
                              {selectedDate.length > 0
                                ? formatDateTime.format(selectedDate[0]?.toDate(getLocalTimeZone()))
                                : "Select date and time"}
                              <MdEditCalendar />
                            </Button>
                          </DatePicker.Trigger>
                        </DatePicker.Control>
                      )
                    }
                    <Portal>
                      <DatePicker.Positioner>
                        <DatePicker.Content>
                          <DatePicker.View view="day">
                            <DatePicker.Header />
                            <DatePicker.DayTable />
                            {selectedDateType === 'date+time' && (
                              <Input type="time" value={timeValue} onChange={onTimeChange(selectedDate[0])} />
                            )}
                          </DatePicker.View>
                          <DatePicker.View view="month">
                            <DatePicker.Header />
                            <DatePicker.MonthTable />
                          </DatePicker.View>
                          <DatePicker.View view="year">
                            <DatePicker.Header />
                            <DatePicker.YearTable />
                          </DatePicker.View>
                        </DatePicker.Content>
                      </DatePicker.Positioner>
                    </Portal>
                  </DatePicker.Root>
                </Field.Root>
              )
            }

            <Field.Root
              invalid={!!errors.dateType}
              required
            >
              <Field.Label>
                Icon
                <Field.RequiredIndicator />
              </Field.Label>
              <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Popover.Trigger asChild>
                  <Button size="sm" ref={triggerRef} variant="subtle" width={'100%'}>
                    {selectedIcon ? <>{React.createElement(Icons[selectedIcon.value as 'MdEditCalendar'], {})} {selectedIcon.label.replace('Md', '')}</> : "Select an icon"} <LuChevronDown />
                  </Button>
                </Popover.Trigger>

                <Portal>
                  <Popover.Positioner>
                    <Popover.Content _closed={{ animation: "none" }}>
                      <Popover.Body p="0">
                        <Listbox.RootProvider value={listbox} gap="0" overflow="hidden">
                          <Listbox.Input
                            minH="10"
                            px="3"
                            roundedTop="l2"
                            bg="transparent"
                            outline="0"
                            onChange={(e) => setInputValueFn(e.currentTarget.value)}
                          />
                          <Listbox.Label pl={4}>Select Icon ({icons.length} items)</Listbox.Label>
                          <Listbox.Content ref={virtual.scrollRef} maxH="300px">
                            <div {...virtual.getViewportProps()}>
                              {virtual.virtualItems.map((virtualItem) => {
                                const item = icons[virtualItem.index]
                                return (
                                  <Listbox.Item item={item} key={item.value} {...virtual.getItemProps({ virtualItem })}>
                                    <Box display="flex" alignItems="center" gap="3" flex="1">
                                      <Box color="fg.muted" flexShrink="0">
                                        {React.createElement(Icons[item.value as 'MdEditCalendar'], {})}
                                      </Box>
                                      <Listbox.ItemText>{item.label.replace('Md', '')}</Listbox.ItemText>
                                    </Box>
                                    <Listbox.ItemIndicator />
                                  </Listbox.Item>
                                )
                              })}
                            </div>
                          </Listbox.Content>
                        </Listbox.RootProvider>
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            </Field.Root>

            <Field.Root
              invalid={!!errors.title}
              required
            >
              <Field.Label>
                Title
                <Field.RequiredIndicator />
              </Field.Label>
              <Input size={'sm'} variant="subtle" {...register("title", { required: "Please enter a title", })} />
              <Field.ErrorText>{errors.title?.message as string}</Field.ErrorText>
            </Field.Root>

            <Field.Root>
              <Field.Label>
                Description
              </Field.Label>
              <Textarea placeholder="Start typing..." variant="subtle" {...register('description')} />
            </Field.Root>

            <Field.Root>
              <Field.Label>Cover Image</Field.Label>
              <Form.FileUploader
                onFilesSelected={handleFilesSelected}
                uploadPercentages={uploadPercentages}
                width={'100%'}
              />

              {!!timelineItem && timelineItem.media.map((media, key) => (
                <Image
                  key={'uploaded-image-' + key}
                  src={process.env.NEXT_PUBLIC_API_HOST + media.src}
                  alt={media.alt}
                />
              ))}
            </Field.Root>
          </Stack>


          <Button mt={4} type="submit" colorScheme="blue">
            Save Timeline Item
          </Button>
        </Box>
      </Card.Body>
    </Card.Root>
  );
}

const format = (dateType: TTimelineDateType) => (date: DateValue) => {
  const day = date.day.toString().padStart(2, "0")
  const month = date.month.toString().padStart(2, "0")
  const year = date.year.toString()
  if (dateType === 'month+year') {
    return `${month}/${year}`
  }
  return `${month}/${day}/${year}`
}

const parse = (dateType: TTimelineDateType) => (string: string) => {
  if (dateType === 'month+year') {
    const fullRegex = /^(\d{1,2})\/(\d{4})$/
    const fullMatch = string.match(fullRegex)
    if (fullMatch) {
      const [, month, year] = fullMatch.map(Number)
      return new CalendarDate(year, month, 1)
    }
  }
}

const dateFormat = {
  'month+year': 'mm/yyyy',
  'date': 'dd/mm/yyyy',
  'date+time': 'dd/mm/yyyy HH:MM',
}

export const formatDateTime = new DateFormatter("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

export const formatDate = new DateFormatter("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

export const formatDateMonthYear = new DateFormatter("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
})

interface ScrollToIndexDetails {
  index: number
  getElement: () => HTMLElement | null
  immediate?: boolean
}

function useListboxVirtualizer(props: { count: number }) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null)
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const clearScrollTimeout = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = null
    }
  }

  const virtualizer = useVirtualizer({
    count: props.count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 32,
    overscan: 10,
  })

  const virtualizerRef = useLiveRef(virtualizer)

  const scrollToIndexFn = (details: ScrollToIndexDetails) => {
    clearScrollTimeout()

    const scrollToIndex = () => {
      const virtualizer = virtualizerRef.current
      const virtualItems = virtualizer.getVirtualItems()
      const virtualItem = virtualItems.find(
        (item) => item.index === details.index,
      )

      if (virtualItem) {
        const element = details.getElement()
        element?.scrollIntoView({ block: "nearest" })
        clearScrollTimeout()
        return
      }

      // Scroll towards the target index
      virtualizer.scrollToIndex(details.index)

      // Continue scrolling in intervals until we reach the target
      if (!details.immediate) {
        scrollTimeoutRef.current = setTimeout(scrollToIndex, 16) // ~60fps
      }
    }

    scrollToIndex()
  }

  // Cleanup timeout on unmount
  React.useEffect(() => clearScrollTimeout, [])

  const totalSize = virtualizer.getTotalSize()

  return {
    scrollRef,
    scrollToIndexFn,
    totalSize,
    virtualItems: virtualizer.getVirtualItems(),
    getViewportProps(
      props: React.ComponentProps<"div"> = {},
    ): React.ComponentProps<"div"> {
      return {
        ...props,
        style: {
          ...props.style,
          height: `${totalSize}px`,
          width: "100%",
          position: "relative",
        },
      }
    },
    getItemProps(
      props: React.ComponentProps<"div"> & { virtualItem: VirtualItem },
    ): React.ComponentProps<"div"> {
      const { virtualItem, ...rest } = props
      return {
        ...rest,
        "aria-posinset": virtualItem.index + 1,
        "aria-setsize": totalSize,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          ...rest.style,
          height: `${virtualItem.size}px`,
          transform: `translateY(${virtualItem.start}px)`,
        },
      }
    },
  }
}

export default TimelineForm;