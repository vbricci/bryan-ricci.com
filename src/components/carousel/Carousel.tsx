import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Carousel as ChakraCarousel, IconButton, Image } from "@chakra-ui/react";
import { ITimelineMedia } from "@vrobots/writing";
import React from "react";

export interface ICarouselProps {
  media: ITimelineMedia[]
}

const Carousel = ({ media }: ICarouselProps) => {
  return (
    <ChakraCarousel.Root slideCount={media.length} gap="4">
      <ChakraCarousel.Control justifyContent="center" gap="4" width="full">
        {
          media.length > 1 && (
            <ChakraCarousel.PrevTrigger asChild>
              <IconButton size="xs" variant="outline">
                <LuChevronLeft />
              </IconButton>
            </ChakraCarousel.PrevTrigger>
          )
        }

        <ChakraCarousel.ItemGroup width="full">
          {media.map((item, index) => (
            <ChakraCarousel.Item key={index} index={index} display={'block'}>
              <Image
                margin={'auto'}
                src={item.src}
                alt={item.alt}
              />
            </ChakraCarousel.Item>
          ))}
        </ChakraCarousel.ItemGroup>

        {
          media.length > 1 && (
            <ChakraCarousel.NextTrigger asChild>
              <IconButton size="xs" variant="outline">
                <LuChevronRight />
              </IconButton>
            </ChakraCarousel.NextTrigger>
          )
        }
      </ChakraCarousel.Control>

      {
        media.length > 1 && (
          <ChakraCarousel.IndicatorGroup>
            {media.map((item, index) => (
              <ChakraCarousel.Indicator
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
              </ChakraCarousel.Indicator>
            ))}
          </ChakraCarousel.IndicatorGroup>
        )
      }
    </ChakraCarousel.Root>
  )
}

export default Carousel