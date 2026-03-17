
'use client'

import { Page } from "@vrobots/storybook";
import { useParams, useRouter } from "next/navigation";
import TimelineForm from "@/components/timeline/TimelineForm";
import { useTimelineItem } from "@/components/timeline/TimelineItem";
import { Suspense } from "react";

const TimelineEditPage = () => {
  const router = useRouter()
  const params = useParams()
  const { _id } = params
  const { timelineItem } = useTimelineItem(_id as string)

  if (!timelineItem) return null
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page
        breadcrumbs={[
          { title: 'Timeline', nav: '/timeline', onClick: (nav) => router.push(nav!) },
          { title: 'Item' },
          { title: _id as string },
          { title: 'Edit' },
        ]}
      >
        <TimelineForm timelineItem={timelineItem}/>
      </Page >
    </Suspense>
  );
}

export default TimelineEditPage;