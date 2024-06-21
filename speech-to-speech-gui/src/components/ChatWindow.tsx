import { Box, Text, Center } from '@chakra-ui/react'
import MessageDisplay from './MessageDisplay'

interface ChatWindowProps {
  messages: Array<{
    text: string
    isUser: boolean
    isArabic: boolean
  }>
  error: string | null
}

const ChatWindow = ({ messages, error }: ChatWindowProps) => {
  return (
    <Box
      borderRadius="md"
      borderColor="gray.600"
      borderWidth={1}
      height="70vh"
      overflowY="auto"
      p={4}
      position="relative"
    >
      {error ? (
        <Center height="100%">
          <Text color="red.500">{error}</Text>
        </Center>
      ) : (
        <MessageDisplay messages={messages} />
      )}
    </Box>
  )
}

export default ChatWindow