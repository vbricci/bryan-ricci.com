import { LuChevronLeft, LuChevronRight } from "react-icons/lu"
import { Carousel as ChakraCarousel, IconButton, Image } from "@chakra-ui/react";
import { ITimelineMedia } from "@vrobots/writing";

export interface ICarouselProps {
  media: ITimelineMedia[]
}

const Carousel = ({ media }: ICarouselProps) => {
  return (
    <ChakraCarousel.Root slideCount={media.length} gap="4">
      <ChakraCarousel.Control justifyContent="center" gap="4" width="full">
        <ChakraCarousel.PrevTrigger asChild>
          <IconButton size="xs" variant="outline">
            <LuChevronLeft />
          </IconButton>
        </ChakraCarousel.PrevTrigger>

        <ChakraCarousel.ItemGroup width="full">
          {media.map((item, index) => (
            <ChakraCarousel.Item key={index} index={index}>
              <Image
                aspectRatio="16/9"
                src={item.src}
                alt={item.alt}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </ChakraCarousel.Item>
          ))}
        </ChakraCarousel.ItemGroup>

        <ChakraCarousel.NextTrigger asChild>
          <IconButton size="xs" variant="outline">
            <LuChevronRight />
          </IconButton>
        </ChakraCarousel.NextTrigger>
      </ChakraCarousel.Control>

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
    </ChakraCarousel.Root>
  )
}

export default Carousel