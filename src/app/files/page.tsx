'use client'
import { Heading } from "@chakra-ui/react"
import { Page } from "@vrobots/storybook"
import { useRouter } from "next/navigation"

const FilesPage = () => {
  const router = useRouter()
  return (
    <Page
      breadcrumbs={[
        { title: 'Dashboard', nav: '/dashboard', onClick: (nav) => router.push(nav!) },
        { title: 'Files' },
      ]}
    >
      <Heading>Files Page</Heading>
    </Page>
  )
}

export default FilesPage