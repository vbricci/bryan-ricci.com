'use client'
import { Box } from "@chakra-ui/react"
import { Menu, SidebarToggleButton, useSidebar } from "@vrobots/storybook"
import { usePathname, useRouter }  from "next/navigation"
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
  const pathname = usePathname()
  const [selected, setSelected] = React.useState<string>(pathname || '')
  const router = useRouter()  
  const ref = React.useRef<HTMLDivElement>(null)

  const handleMenuClick = (value: string) => {
    setSelected(value)
    router.push(value)
  }

  React.useEffect(() => {
    if (selected !== pathname) {
      setSelected(pathname)
    }
  }, [pathname, selected])
  
  return (
    <Box>
      <Menu
        menuItems={[
          { label: 'Dashboard', value: '/dashboard' },
          { label: 'Timeline', value: '/timeline/edit' },
          { label: 'Journal', value: '/journal' },
          { label: 'Blog', value: '/blog' },
        ]}
        onClick={handleMenuClick}
        selected={selected}
        ref={ref}
      />
    </Box>
  )
}