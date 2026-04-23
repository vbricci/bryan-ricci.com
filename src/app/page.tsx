'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { Box, IconButton, Link, Text } from "@chakra-ui/react";
import { motion } from "motion/react"
import { ITimelineItem, useColorMode, useHeader, useSidebar } from "@vrobots/storybook";
import React, { Suspense } from "react";
import { FaLinkedin } from 'react-icons/fa6'
import TimelineItem from "@/components/timeline/TimelineItem";
import Timeline, { useTimeline } from "@/components/timeline/Timeline";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const { timeline } = useTimeline()
  const [hasMounted, setHasMounted] = React.useState(false)
  const { ref: headerRef } = useHeader()
  const { isOpen } = useSidebar()
  const { colorMode } = useColorMode()

  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: `url('ricci_background.jpg')`,
          backgroundBlendMode: 'multiply',
          backgroundColor: colorMode === 'light' ? 'rgba(161, 161, 170, 0.8)' : 'rgba(39, 39, 42, 0.8)',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          width: '100%',
          height: `calc(100vh - ${headerRef.current?.offsetHeight || 0}px)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            height: `calc(100vh - ${headerRef.current?.offsetHeight || 0}px)`,
            width: '100%',
            overflowY: 'scroll',
          }}
        >
          {
            !isOpen && (
              <Link
                href={'https://www.linkedin.com/in/bryan-ricci-180803152/'}
                target="_blank"
              >
                <IconButton
                  aria-label="LinkedIn"
                  position="absolute"
                  top={4 + (headerRef.current?.offsetHeight || 0)}
                  right={4}
                  colorScheme="blue"
                  size="xs"
                  opacity={.8}
                >
                  <FaLinkedin />
                </IconButton>
              </Link>
            )
          }
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            width={'100%'}
            height={'100%'}
          >
            <Text
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight={'bold'}
              color={'white'}
              className={geistSans.variable}
              fontFamily={'var(--font-geist-sans)'}
              textShadow={'4px 4px 20px black'}
              mt={`-${headerRef.current?.offsetHeight || 0}px`}
            >
              Bryan Ricci
            </Text>
            <Text
              fontSize={{ base: '2xl', md: '3xl' }}
              color={'whiteAlpha.800'}
              className={geistMono.variable}
              fontFamily={'var(--font-geist-mono)'}
              textShadow={'4px 4px 20px black'}
            >
              Software Engineer
            </Text>
          </Box>
          
          <Timeline timeline={timeline} />
        </motion.div>
      </motion.div>
    </Suspense>
  );
}
