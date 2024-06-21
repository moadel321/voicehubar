import { VStack } from '@chakra-ui/react'
import Message from './Message'

interface MessageDisplayProps {
  messages: Array<{
    text: string
    isUser: boolean
    isArabic: boolean
  }>
}

const MessageDisplay = ({ messages }: MessageDisplayProps) => {
  return (
    <VStack spacing={4} align="stretch">
      {messages.map((message, index) => (
        <Message
          key={index}
          text={message.text}
          isUser={message.isUser}
          isArabic={message.isArabic}
        />
      ))}
    </VStack>
  )
}

export default MessageDisplay