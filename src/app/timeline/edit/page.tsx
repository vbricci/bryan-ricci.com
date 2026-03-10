
'use client'

import useFileUpload from "@/hooks/useFileUpload";
import { Box, Button, Heading, Image } from "@chakra-ui/react";
import { Page, Form, toaster } from "@vrobots/storybook";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import React from "react";

const TimelineEditPage = () => {
  const [filePreviews, setFilePreviews] = React.useState<string[]>([])
  const [files, setFiles] = React.useState<File[]>([])
  const [percentageComplete, setPercentageComplete] = React.useState<number[]>([])
  const router = useRouter()
  const fileUpload = useFileUpload()

  console.log('percentageComplete:', percentageComplete)

  const handleFilesSelected = (files: File[]) => {
    console.log('Selected files:', files);
    setFiles(files)
  }

  const handleUpload = async () => {
    try {
      const uploadPromises = files.map((file, index) =>
        fileUpload.upload(file, (percent) => {
          setPercentageComplete((prev) => {
            const next = [...prev]
            next[index] = percent
            return next
          })
        })
      )
      const uploadedFiles = await Promise.all(uploadPromises)
      setTimeout(
        () => setFilePreviews(prevFilePreviews => ([...prevFilePreviews, ...uploadedFiles.map((file: any) => process.env.NEXT_PUBLIC_API_HOST_FILE + `/api/v1/file/${file._id}` as any)])),
        1000
      )

      console.log('Uploaded files:', uploadedFiles)
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

  return (
    <Page
      breadcrumbs={[
        { title: 'Dashboard', nav: '/dashboard', onClick: (nav) => router.push(nav!) },
        { title: 'Timeline' },
      ]}
    >
      <Heading>Timeline Edit Form</Heading>
      <Form.FileUploader
        onFilesSelected={handleFilesSelected}
      >
        {
          files.length > 0 && (
            <Button mt={4} colorScheme="blue" onClick={handleUpload}>
              Upload Files
            </Button>
          )
        }
      </Form.FileUploader>

      {filePreviews.map((src, key) => (
        <Image
          key={'uploaded-image-' + key}
          src={src}
          alt={'Uploaded Image'}
        />
      ))}
    </Page >
  );
}

export default TimelineEditPage;