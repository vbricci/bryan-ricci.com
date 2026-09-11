'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { Box, IconButton, Link, Text } from "@chakra-ui/react";
import { motion } from "motion/react"
import { useColorMode, useHeader, useSidebar } from "@vrobots/storybook";
import React, { Suspense } from "react";
import { FaLinkedin } from 'react-icons/fa6'
import Ai from "@/components/ai/Ai";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
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
          position: 'fixed',
          height: `calc(100vh - ${headerRef.current?.offsetHeight || 0}px)`,
          overflow: 'auto'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}

        >
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            width={'100%'}
            height={'100%'}
          >
            <Ai />
          </Box>
        </motion.div>
      </motion.div>
    </Suspense>
  );
}
