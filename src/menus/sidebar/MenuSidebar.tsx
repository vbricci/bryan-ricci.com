'use client'
import { Box } from "@chakra-ui/react"
import { Menu, SidebarToggleButton, useSidebar } from "@vrobots/storybook"
import { useRouter }  from "next/navigation"
import React from "react"

export const MenuSidebarUnauthenticatedMobile = () => {
  const [selected, setSelected] = React.useState<string>('')
  const { toggleSidebar } = useSidebar()
  const router = useRouter()  
  const ref = React.useRef<HTMLDivElement>(null)

  const handleMenuClick = (value: string) => {
    setSelected(value)
    !!toggleSidebar && toggleSidebar()
    router.push(value)
  }

  return (
    <Box>
      <Menu
        menuItems={[
          { label: 'Resume', value: '/resume.pdf' },
        ]}
        onClick={handleMenuClick}
        selected={selected}
        ref={ref}
      />
    </Box>
  )
}

export const MenuSidebarUnauthenticatedDesktop = () => {
  return (
    <Box>
      Test
    </Box>
  )
}

export const MenuSidebarAuthenticatedMobile = () => {
  return (
    <Box>
      <SidebarToggleButton top={1} />
    </Box>
  )
}

export const MenuSidebarAuthenticatedDesktop = () => {
  return (
    <Box>
      Test
    </Box>
  )
}