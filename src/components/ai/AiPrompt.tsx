import { Box, Card, HStack, IconButton, Input } from "@chakra-ui/react";
import { FaPlay, FaStop } from 'react-icons/fa6'

export interface IAiPromptProps {
  isStreaming: boolean;
  prompt: string;
  onSetPrompt: React.Dispatch<React.SetStateAction<string>>;
  onStream: (e: React.ChangeEvent<HTMLFormElement>) => void;
}

const AiPrompt: React.FC<IAiPromptProps> = ({ isStreaming, prompt, onSetPrompt, onStream }) => {
  return (
    <Card.Root
      position={'fixed'}
      bottom={4}
      left={'50%'}
      transform={'translateX(-50%)'}
      width={{ base: '92%', md: '680px' }}
      backdropFilter={'blur(18px) saturate(140%)'}
      borderRadius={'2xl'}
      borderWidth={'1px'}
      borderColor={{ _light: 'rgba(15, 23, 42, 0.08)', _dark: 'rgba(255, 255, 255, 0.12)' }}
      bg={{
        _light:'linear-gradient(180deg, rgba(255,255,255,0.92), rgba(237,242,248,0.9))',
        _dark: 'linear-gradient(180deg, rgba(31,39,50,0.88), rgba(22,28,36,0.92))'
      }}
      boxShadow={{
        _light: '0 18px 50px rgba(148, 163, 184, 0.28), 0 2px 8px rgba(255,255,255,0.6) inset',
        _dark: '0 18px 50px rgba(0, 0, 0, 0.42), 0 1px 0 rgba(255,255,255,0.04) inset'
      }}
    >
      <Card.Body p={{ base: 3, md: 4 }}>
        <form onSubmit={onStream}>
          <HStack gap={3} align={'stretch'}>
            <Box
              flex={'1'}
              px={{ base: 4, md: 5 }}
              py={{ base: 3, md: 3.5 }}
              borderRadius={'xl'}
              borderWidth={'1px'}
              borderColor={{ _light: 'rgba(15, 23, 42, 0.08)', _dark: 'rgba(255, 255, 255, 0.08)' }}
              bg={{ _light: 'rgba(248, 250, 252, 0.9)', _dark: 'rgba(10, 14, 20, 0.4)' }}
              boxShadow={{
                _light: 'inset 0 1px 1px rgba(255,255,255,0.9), inset 0 -1px 2px rgba(148,163,184,0.12)',
                _dark: 'inset 0 1px 1px rgba(255,255,255,0.03), inset 0 -1px 2px rgba(0,0,0,0.2)'
              }}
            >
              <Input
                placeholder="Provide a treatment plan for aortic stenosis..."
                bg={'transparent'}
                border={'none'}
                shadow={'none'}
                px={0}
                fontSize={{ base: 'md', md: 'lg' }}
                color={{ _light: 'gray.800', _dark: 'whiteAlpha.950' }}
                _placeholder={{ color: { _light: 'gray.500', _dark: 'whiteAlpha.500' } }}
                _focus={{ shadow: 'none', border: 'none', outline: 'none' }}
                autoFocus
                value={prompt}
                onChange={(e) => onSetPrompt(e.target.value)}
              />
            </Box>
            <IconButton
              aria-label="Send"
              loadingText="Sending"
              type={'submit'}
              minW={{ base: '56px', md: '64px' }}
              h={'auto'}
              borderRadius={'xl'}
              variant={'ghost'}
              colorPalette={isStreaming ? 'red' : 'teal'}
              _hover={{
                transform: 'translateY(-1px)',
                outline: isStreaming
                  ? { _light: 'red.600', _dark: 'red.400' }
                  : { _light: 'teal.600', _dark: 'teal.300' },
              }}
              _active={{ transform: 'translateY(0)' }}
              transition={'all 0.18s ease'}
              animation={isStreaming ? 'pulse 2s infinite' : undefined}
            >
              {isStreaming ? <FaStop color="red" /> : <FaPlay />}
            </IconButton>
          </HStack>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
export default AiPrompt;