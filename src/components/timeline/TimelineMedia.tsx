import React from "react"
import Carousel from "../carousel/Carousel"
import { Box } from "@chakra-ui/react"
import { ITimelineMedia } from "@vrobots/writing"

export interface ITimelineMediaProps {
  media: ITimelineMedia[]
}

const TimelineMedia = ({ media }: ITimelineMediaProps) => {
  return (
    <React.Fragment>
      {
        media[0]?.type === 'image' && (
          <Carousel media={media} />
        )
      }
      {
        media[0]?.type === 'video' && (
          <Box key={'uploaded-video'}>
            <video controls width="100%">
              <source src={media[0].src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        )
      }
      {
        media[0]?.type === 'document' && (
          <object data={media[0].src} type="application/pdf" width="100%" height="600px">
            <p>Your browser does not support objects. <a href={media[0].src}>Download the PDF</a>.</p>
          </object>
        )
      }
      {
        media[0]?.type === 'audio' && (
          <audio controls>
            <source src={media[0].src} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        )
      }
    </React.Fragment>
  )
}

export default TimelineMedia