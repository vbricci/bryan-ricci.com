import { Button, CloseButton, Dialog, IconButton, Portal } from "@chakra-ui/react"
import Ai from "./Ai"
import React from "react"
import { FaRobot } from 'react-icons/fa6'

const AiModal: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  return (
    <React.Fragment>
      <IconButton
        aria-label="Open AI Modal"
        onClick={() => setOpen(true)}
        position="fixed"
        bottom={{ base: 4, md: 5 }}
        right={{ base: 4, md: 5 }}
        zIndex={1000}
        size={'lg'}
        borderRadius={'full'}
        color={{ _light: 'white', _dark: 'gray.900' }}
        bgGradient={{ _light: 'linear(to-br, cyan.500, blue.600)', _dark: 'linear(to-br, cyan.200, blue.300)' }}
        borderWidth={'1px'}
        borderColor={{ _light: 'whiteAlpha.800', _dark: 'whiteAlpha.400' }}
        boxShadow={{
          _light: '0 14px 30px rgba(37, 99, 235, 0.34), inset 0 1px 0 rgba(255,255,255,0.5)',
          _dark: '0 14px 30px rgba(56, 189, 248, 0.28), inset 0 1px 0 rgba(255,255,255,0.25)',
        }}
        backdropFilter={'blur(6px)'}
        transition={'all 0.2s ease'}
        _hover={{
          transform: 'translateY(-1px) scale(1.02)',
          bgGradient: { _light: 'linear(to-br, cyan.400, blue.500)', _dark: 'linear(to-br, cyan.100, blue.200)' },
          boxShadow: {
            _light: '0 18px 34px rgba(37, 99, 235, 0.4)',
            _dark: '0 18px 34px rgba(56, 189, 248, 0.34)',
          },
        }}
        _active={{
          transform: 'translateY(0) scale(0.98)',
        }}
        _focusVisible={{
          outline: '2px solid',
          outlineColor: { _light: 'blue.500', _dark: 'cyan.300' },
          outlineOffset: '3px',
        }}
      >
        <FaRobot />
      </IconButton>  
      <Dialog.Root open={open} onOpenChange={() => setOpen(!open)} size={'full'}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content 
              bg={{ _light: 'rgba(231, 240, 246, 0.8)', _dark: 'rgba(0, 0, 0, 0.9)' }}
              backdropFilter={'blur(10px)'}
              >
              <Dialog.Body>
                <Ai />
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger position={'fixed'} bottom={4} asChild>
                  <Button>Close</Button>
                </Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </React.Fragment>
  )
}

export default AiModal