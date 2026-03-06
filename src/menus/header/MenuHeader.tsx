import { useSession } from "@/app/session/SessionProvider"
import { Box, HStack, Link } from "@chakra-ui/react"
import { ColorModeButton, SidebarToggleButton, useColorMode, AvatarIconMenu } from "@vrobots/storybook"
import NextLink from "next/link"
import { useRouter } from "next/navigation"

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

export type MenuHeaderAuthenticatedDesktopMenuValues = 'profile' | 'settings' | 'logout' | 'color-mode'

export const MenuHeaderAuthenticatedDesktop = () => {
  const { session: { user} } = useSession()
  const { colorMode, toggleColorMode } = useColorMode()
  const isLightMode = colorMode === 'light'

  const handleClick = (value: MenuHeaderAuthenticatedDesktopMenuValues) => {
    if (value === 'color-mode') {
      toggleColorMode()
      return
    }
    router.push(`/${value}`)
  }

  const router = useRouter()

  if (!user) return null
  
  return (
    <Box>
      <AvatarIconMenu 
        src={user.profilePictureUrl as string}
        name={`${user.firstName} ${user.lastName}`}
        menu={[
          { label: 'Profile', value: 'profile', icon: 'MdPerson' },
          { label: 'Settings', value: 'settings', icon: 'MdSettings' },
          { label: 'Color Mode', value: 'color-mode', icon: isLightMode ? 'MdLightMode': 'MdDarkMode' },
          { label: 'Logout', value: 'logout', icon: 'MdLogout' },
        ]}
        onClick={handleClick as any}
      />
    </Box>
  )
}