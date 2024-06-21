import { Box, Text } from '@chakra-ui/react'

interface MessageProps {
  text: string
  isUser: boolean
  isArabic: boolean
}

const Message = ({ text, isUser, isArabic }: MessageProps) => {
  return (
    <Box
      alignSelf={isUser ? 'flex-end' : 'flex-start'}
      bg={isUser ? 'blue.500' : 'gray.600'}
      color="white"
      borderRadius="lg"
      px={4}
      py={2}
      maxWidth="70%"
    >
      <Text
        dir={isArabic ? 'rtl' : 'ltr'}
        textAlign={isArabic ? 'right' : 'left'}
      >
        {text}
      </Text>
    </Box>
  )
}

export default Message