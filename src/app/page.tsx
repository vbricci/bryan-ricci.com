'use client'
import { Geist, Geist_Mono } from "next/font/google";
import { Box, IconButton, Link, Text } from "@chakra-ui/react";
import { motion } from "motion/react"
import { ITimelineItem, useHeader, useSidebar } from "@vrobots/storybook";
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

const MAKE_TIMELINE_ITEMS: (onClick: (src: string, title: string) => void) => ITimelineItem[] = (onClick) => [
  {
    date: "1981 - January",
    component: <TimelineItem
      _id={''}
      title="Born in Nashville, Tennessee."
      src="/timeline_1.jpg"
      alt="Baby Bryan"
      click={onClick}
    />,
    icon: 'MdBabyChangingStation'
  },
  {
    date: "1981 - December",
    component: <TimelineItem
      _id={''}
      title="Discovered a love for music."
      src="/timeline_2.jpg"
      alt="Bryan playing an organ"
      click={onClick}
    />,
    icon: 'MdMusicNote'
  },
  {
    date: "1983 - December",
    component: <TimelineItem
      _id={''}
      title="Started learning to play guitar."
      src="/timeline_3.jpg"
      alt="Bryan playing a guitar"
      click={onClick}
    />,
    icon: 'MdMusicNote'
  },
  {
    date: "1984 - December",
    component: <TimelineItem
      _id={''}
      title="Started learning to play drums."
      src="/timeline_4.jpg"
      alt="Bryan playing drums"
      click={onClick}
    />,
    icon: 'MdMusicNote'
  },
  {
    date: "1988 - August",
    component: <TimelineItem
      _id={''}
      title="First use of a computer - a Commodore 64."
      src="/timeline_10.jpg"
      alt="Bryan using a Commodore 64"
      click={onClick}
    />,
    icon: 'MdMusicNote'
  },
  {
    date: "1991 - February",
    component: <TimelineItem
      _id={''}
      title="Moved to Santa Ana, California."
      src="/timeline_5.jpg"
      alt="Santa Ana California"
      click={onClick}
    />,
    icon: 'MdLocationOn'
  },
  {
    date: "1991 - March",
    component: <TimelineItem
      _id={''}
      title="Wrote first app - 'Hello, World!' in BASIC on an Apple Classic ii."
      src="/timeline_6.jpg"
      alt="Apple Classic ii"
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "1991 - June",
    component: <TimelineItem
      _id={''}
      title="Moved to Nashville, Tennessee."
      src="/timeline_7.jpg"
      alt="Nashville Tennessee"
      click={onClick}
    />,
    icon: 'MdLocationOn'
  },
  {
    date: "1999 - April",
    component: <TimelineItem
      _id={''}
      title="First time using Photoshop"
      src="/timeline_8.jpg"
      alt="Photoshop interface"
      click={onClick}
    />,
    icon: 'MdPhotoSizeSelectSmall'
  },
  {
    date: "1999 - April",
    component: <TimelineItem
      _id={''}
      title="First time using Microsoft Office - Word, Excel, and PowerPoint"
      src="/timeline_9.jpg"
      alt="Microsoft Office interface"
      click={onClick}
    />,
    icon: 'MdDescription'
  },
  {
    date: "1999 - May",
    component: <TimelineItem
      _id={''}
      title="First time writing HTML and CSS"
      src="/timeline_11.jpg"
      alt="Writing HTML and CSS"
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "1999 - May",
    component: <TimelineItem
      _id={''}
      title="First job as a Jr. Software Engineer at a small web design company in Nashville."
      src="/timeline_59.jpg"
      alt="Jr. Software Engineer at a small web design company"
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "2001 - February",
    component: <TimelineItem
      _id={''}
      title="Moved to Venice Beach, California."
      src="/timeline_12.jpg"
      alt="Venice Beach California"
      click={onClick}
    />,
    icon: 'MdLocationOn'
  },
  {
    date: "2001 - April",
    component: <TimelineItem
      _id={''}
      title="First time using Flash and ActionScript"
      src="/timeline_13.jpg"
      alt="Flash and ActionScript interface"
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "2004 - August",
    component: <TimelineItem
      _id={''}
      title="Freshman year of college at the Pierce College, Woodland Hills, California."
      src="/timeline_14.jpg"
      alt="Pierce College Woodland Hills California"
      click={onClick}
    />,
    icon: 'MdSchool'
  },
  {
    date: "2004 - December",
    component: <TimelineItem
      _id={''}
      title="Moved to Nashville, Tennessee."
      src="/timeline_15.jpg"
      alt="Nashville Tennessee"
      click={onClick}
    />,
    icon: 'MdLocationOn'
  },
  {
    date: "2005 - September",
    component: <TimelineItem
      _id={''}
      title="First independent project - a website for a local realtor."
      src="/timeline_16.jpg"
      alt="First independent project - a website for a local realtor."
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "2008 - April",
    component: <TimelineItem
      _id={''}
      title="Fulltime employment as a Graphic Designer at an environmental development company in Nashville."
      src="/timeline_55.jpg"
      alt="Graphic Designer at an environmental development company"
      click={onClick}
    />,
    icon: 'MdPhotoSizeSelectSmall'
  },
  {
    date: "2008 - April",
    component: <TimelineItem
      _id={''}
      title="First time using Illustrator"
      src="/timeline_17.jpg"
      alt="Illustrator interface"
      click={onClick}
    />,
    icon: 'MdPhotoSizeSelectSmall'
  },
  {
    date: "2009 - August",
    component: <TimelineItem
      _id={''}
      title="Fulltime employment as a FileMaker Pro Developer at an appliance company in Nashville."
      src="/timeline_18.jpg"
      alt="FileMaker Pro interface"
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "2010 - March",
    component: <TimelineItem
      _id={''}
      title="Founded the Eraselet company."
      src="/timeline_54.jpg"
      alt="Eraselet company"
      click={onClick}
    />,
    icon: 'MdBusiness'
  },
  {
    date: "2010 - March",
    component: <TimelineItem
      _id={''}
      title="First time LAMP development - Linux, Apache, MySQL, PHP."
      src="/timeline_19.jpg"
      alt="LAMP stack development"
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "2010 - July",
    component: <TimelineItem
      _id={''}
      title="First time writing JavaScript - I FELL IN LOVE WITH IT."
      src="/timeline_20.jpg"
      alt="JavaScript and love"
      click={onClick}
    />,
    icon: 'MdCode'
  },
  {
    date: "2011 - January",
    component: <TimelineItem
      _id={''}
      title="Became a spokesmodel to raise awareness for adolescent homelessness."
      src="/timeline_21.jpg"
      alt="The Oasis Center for Adolescent Homelessness"
      click={onClick}
    />,
    icon: 'MdPeople'
  },
  {
    date: "2012 - May",
    component: <TimelineItem
      _id={''}
      title="Raised over $60K for Cambodian orphanages."
      src="/timeline_22.jpg"
      alt="Cambodian Orphanages"
      click={onClick}
    />,
    icon: 'MdPeople'
  },
  {
    date: "2013 - August",
    component: <TimelineItem
      _id={''}
      title="Sold the Eraselet company."
      src="/timeline_56.jpg"
      alt="Sold the Eraselet company"
      click={onClick}
    />,
    icon: 'MdMonetizationOn'
  },
  {
    date: "2013 - August",
    component: <TimelineItem
      _id={''}
      title="Founded Str8wire.com."
      src="/timeline_57.jpg"
      alt="Str8wire.com"
      click={onClick}
    />,
    icon: 'MdBusiness'
  },
  {
    date: "2013 - August",
    component: <TimelineItem
      _id={''}
      title="Moved to Berkeley, California."
      src="/timeline_23.jpg"
      alt="Berkeley California"
      click={onClick}
    />,
    icon: 'MdLocationOn'
  },
  {
    date: "2013 - September",
    component: <TimelineItem
      _id={''}
      title="Became a member of the Hacker Dojo in Mountain View, California."
      src="/timeline_24.jpg"
      alt="Hacker Dojo Mountain View California"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2013 - September",
    component: <TimelineItem
      _id={''}
      title="Became a member of Stanford University Brainstorm in Palo Alto, California."
      src="/timeline_25.jpg"
      alt="Stanford University Palo Alto California"
      click={onClick}
    />,
    icon: 'MdSchool',
  },
  {
    date: "2013 - December",
    component: <TimelineItem
      _id={''}
      title="First exposure to Agile Methodologies - RallyDev."
      src="/timeline_26.jpg"
      alt="Agile Methodologies"
      click={onClick}
    />,
    icon: 'MdNextPlan',
  },
  {
    date: "2013 - December",
    component: <TimelineItem
      _id={''}
      title="First exposure to DevOps and Automation - Jenkins."
      src="/timeline_27.jpg"
      alt="DevOps"
      click={onClick}
    />,
    icon: 'MdAutoMode',
  },
  {
    date: "2014 - August",
    component: <TimelineItem
      _id={''}
      title="Sold Str8wire.com."
      src="/timeline_60.jpg"
      alt="US Department of Energy"
      click={onClick}
    />,
    icon: 'MdMonetizationOn',
  },
  {
    date: "2014 - August",
    component: <TimelineItem
      _id={''}
      title="Moved to Nashville, Tennessee."
      src="/timeline_28.jpg"
      alt="Nashville Tennessee"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
  {
    date: "2014 - December",
    component: <TimelineItem
      _id={''}
      title="First time MEAN stack development - MongoDB, Express.js, Angular, Node.js."
      src="/timeline_29.jpg"
      alt="MEAN stack development"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2015 - January",
    component: <TimelineItem
      _id={''}
      title="First time using AWS."
      src="/timeline_30.jpg"
      alt="AWS Cloud"
      click={onClick}
    />,
    icon: 'MdComputer',
  },
  {
    date: "2015 - May",
    component: <TimelineItem
      _id={''}
      title="Became a paid mentor for entrepreneurship and software development."
      src="/timeline_31.jpg"
      alt="Mentoring"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2015 - July",
    component: <TimelineItem
      _id={''}
      title="Moved to Melbourne, Florida."
      src="/timeline_32.jpg"
      alt="Melbourne Florida"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
  {
    date: "2015 - October",
    component: <TimelineItem
      _id={''}
      title="Hired as a Senior Software Engineer at Accent Technologies in Melbourne, Florida."
      src="/timeline_33.jpg"
      alt="Accent Technologies"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2016 - March",
    component: <TimelineItem
      _id={''}
      title="Moved to Franklin, Tennessee."
      src="/timeline_34.jpg"
      alt="Franklin Tennessee"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
  {
    date: "2016 - June",
    component: <TimelineItem
      _id={''}
      title="First time using React."
      src="/timeline_35.jpg"
      alt="React.js"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2016 - May",
    component: <TimelineItem
      _id={''}
      title="Hired as a Senior Software Engineer at a ArborHealth."
      src="/timeline_36.jpg"
      alt="ArborHealth"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2016 - June",
    component: <TimelineItem
      _id={''}
      title="First time using Postgres."
      src="/timeline_37.jpg"
      alt="PostgreSQL"
      click={onClick}
    />,
    icon: 'MdDataObject',
  },
  {
    date: "2017 - March",
    component: <TimelineItem
      _id={''}
      title="ArborHealth was acquired by a Equian, LLC."
      src="/timeline_38.jpg"
      alt="Equian, LLC"
      click={onClick}
    />,
    icon: 'MdMonetizationOn',
  },
  {
    date: "2017 - March",
    component: <TimelineItem
      _id={''}
      title="I married the Love of My Life."
      src="/timeline_58.jpg"
      alt="Ana Ricci"
      click={onClick}
    />,
    icon: 'MdMonitorHeart',
  },
  {
    date: "2018 - July",
    component: <TimelineItem
      _id={''}
      title="Moved to Melbourne, Florida."
      src="/timeline_39.jpg"
      alt="Melbourne Florida"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
  {
    date: "2019 - April",
    component: <TimelineItem
      _id={''}
      title="Equian, LLC was acquired by a Optum."
      src="/timeline_40.jpg"
      alt="Optum"
      click={onClick}
    />,
    icon: 'MdMonetizationOn',
  },
  {
    date: "2020 - January",
    component: <TimelineItem
      _id={''}
      title="Moved to Port St. Lucie, Florida."
      src="/timeline_41.jpg"
      alt="Port St. Lucie Florida"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
  {
    date: "2020 - May",
    component: <TimelineItem
      _id={''}
      title="Awarded the UHG Blue Diamond Award - for outstanding contributions to healthcare technology."
      src="/timeline_42.jpg"
      alt="UHG Blue Diamond Award"
      click={onClick}
    />,
    icon: 'MdStar',
  },
  {
    date: "2020 - June",
    component: <TimelineItem
      _id={''}
      title="Massachusetts Institute of Technology Coursework on Artificial Intelligence."
      src="/timeline_43.jpg"
      alt="MIT"
      click={onClick}
    />,
    icon: 'MdSchool',
  },
  {
    date: "2020 - July",
    component: <TimelineItem
      _id={''}
      title="First time using Kubernetes."
      src="/timeline_44.jpg"
      alt="Kubernetes"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2020 - September",
    component: <TimelineItem
      _id={''}
      title="Promoted to Lead Software Engineer."
      src="/timeline_45.jpg"
      alt="Lead Software Engineer"
      click={onClick}
    />,
    icon: 'MdOutlinePanoramaHorizontal',
  },
  {
    date: "2020 - November",
    component: <TimelineItem
      _id={''}
      title="First time using Terraform."
      src="/timeline_46.jpg"
      alt="Terraform"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2020 - November",
    component: <TimelineItem
      _id={''}
      title="First time using Azure."
      src="/timeline_47.jpg"
      alt="Azure Cloud"
      click={onClick}
    />,
    icon: 'MdComputer',
  },
  {
    date: "2020 - November",
    component: <TimelineItem
      _id={''}
      title="First time using CosmosDB."
      src="/timeline_48.jpg"
      alt="CosmosDB"
      click={onClick}
    />,
    icon: 'MdDataObject',
  },
  {
    date: "2022 - March",
    component: <TimelineItem
      _id={''}
      title="Hired as a Principal Software Engineer at ShuttleHealth."
      src="/timeline_49.jpg"
      alt="ShuttleHealth"
      click={onClick}
    />,
    icon: 'MdCode',
  },
  {
    date: "2022 - July",
    component: <TimelineItem
      _id={''}
      title="Moved to Seabrook, Texas."
      src="/timeline_50.jpg"
      alt="Seabrook Texas"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
  {
    date: "2022 - June",
    component: <TimelineItem
      _id={''}
      title="Promoted to Distinquished Engineer and Chief Technology Officer at ShuttleHealth."
      src="/timeline_51.jpg"
      alt="Distinguished Engineer and CTO"
      click={onClick}
    />,
    icon: 'MdOutlinePanoramaHorizontal',
  },
  {
    date: "2023 - December",
    component: <TimelineItem
      _id={''}
      title="Moved to Spring Branch, Texas."
      src="/timeline_52.jpg"
      alt="Spring Branch Texas"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
  {
    date: "2024 - January",
    component: <TimelineItem
      _id={''}
      title="Founded Hyperion Healthcare, Inc."
      src="/timeline_61.jpg"
      alt="Hyperion Healthcare, Inc."
      click={onClick}
    />,
    icon: 'MdBusiness',
  },
  {
    date: "2025 - September",
    component: <TimelineItem
      _id={''}
      title="Moved to Indian Harbour Beach, Florida."
      src="/timeline_53.jpg"
      alt="Indian Harbour Beach Florida"
      click={onClick}
    />,
    icon: 'MdLocationOn',
  },
];

export default function Home() {
  const { timeline } = useTimeline()
  const [hasMounted, setHasMounted] = React.useState(false)
  const { ref: headerRef } = useHeader()
  const { isOpen } = useSidebar()

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
