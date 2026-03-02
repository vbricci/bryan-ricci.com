import { Box, HStack, Link } from "@chakra-ui/react"
import { ColorModeButton, SidebarToggleButton, useColorMode } from "@vrobots/storybook"
import NextLink from "next/link"

export const MenuHeaderUnauthenticatedMobile = () => {
  return (
    <Box>
      <ColorModeButton />
      <SidebarToggleButton position={'static'} />
    </Box>
  )
}

export const MenuHeaderUnauthenticatedDesktop = () => {
  const { colorMode } = useColorMode()
  return (
    <HStack gap={20}>
      <Link
        as={NextLink}
        href="/resume.pdf"
        style={{ textDecoration: 'none' }}
        colorPalette={'cyan'}
        >
        Resume
      </Link>
      <ColorModeButton colorPalette={colorMode === 'light' ? 'orange' : 'white'} />
    </HStack>
  )
}

export const MenuHeaderAuthenticatedMobile = () => {
  return (
    <Box>
      <SidebarToggleButton top={1} />
    </Box>
  )
}

export const MenuHeaderAuthenticatedDesktop = () => {
  return (
    <Box>
      Test
      <ColorModeButton />
    </Box>
  )
}