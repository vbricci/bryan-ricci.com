import { Box, Image, ImageProps, Text } from "@chakra-ui/react";

export interface ITimelineItemProps extends ImageProps {
  title: string;
  click: (src: string, title: string) => void;
}

const TimelineItem = ({ title, click, ...props }: ITimelineItemProps) => {
  const handleClick = () => {
    click(props.src as string, title);
  }
  return (
    <Box>
      <Text fontSize={'xl'} fontWeight={'bold'} mb={2} cursor={'pointer'} onClick={handleClick}>{title}</Text>
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
        onClick={handleClick}
      />
    </Box>
  );
}

export default TimelineItem;