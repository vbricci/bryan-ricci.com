import { Box } from "@chakra-ui/react"
import { useHeader } from "@vrobots/storybook"
import { motion } from "motion/react"

const AiSection = ({ children }: { children: React.ReactNode }) => {
  const { ref: headerRef } = useHeader()
  return <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    style={{
      backgroundBlendMode: 'multiply',
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
        height: `inherit`,
        width: '100%',
        overflowY: 'scroll',
      }}
    >
      <Box w={'100%'} maxW={'1100px'} mx={'auto'} px={4} pt={6} pb={36}>
        {children}
      </Box>

    </motion.div>
  </motion.div>
}
export default AiSection