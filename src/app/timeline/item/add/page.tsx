
'use client'

import { Page } from "@vrobots/storybook";
import { useParams, useRouter } from "next/navigation";
import TimelineForm from "@/components/timeline/TimelineForm";

const TimelineItemEditPage = () => {
  const router = useRouter()
  const params = useParams()
  const { _id } = params
  return (
    <Page
      breadcrumbs={[
        { title: 'Timeline', nav: '/timeline', onClick: (nav) => router.push(nav!) },
        { title: 'Add' },
      ]}
    >
      <TimelineForm />
    </Page >
  );
}

export default TimelineItemEditPage;