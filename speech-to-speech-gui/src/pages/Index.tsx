import React, { useState } from 'react'
import { VStack, Text, useToast } from '@chakra-ui/react'
import Layout from '../components/Layout'
import ChatWindow from '../components/ChatWindow'
import RecordButton, { RecordButtonProps } from '../components/RecordButton'

const Home: React.FC = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', isUser: false, isArabic: false },
  ])
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const toast = useToast()

  const handleNewMessage: RecordButtonProps['onNewMessage'] = (text, isUser, isArabic) => {
    setMessages([...messages, { text, isUser, isArabic }])
  }

  const handleError: RecordButtonProps['onError'] = (errorMessage) => {
    setError(errorMessage)
    toast({
      title: 'Error',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    })
  }

  const handleRecordingStart = () => {
    setIsProcessing(true)
    setError(null)
    handleNewMessage('Recording started...', true, false)
  }

  const handleRecordingStop = async () => {
    handleNewMessage('Recording stopped. Processing...', true, false)
    
    try {
      // Simulating transcription process
      await new Promise(resolve => setTimeout(resolve, 2000))
      const transcription = 'This is a simulated transcription.'
      handleNewMessage(transcription, true, false)

      // Simulating LLM process
      await new Promise(resolve => setTimeout(resolve, 2000))
      const llmResponse = 'This is a simulated LLM response.'
      handleNewMessage(llmResponse, false, false)

    } catch (err) {
      handleError('An error occurred during processing. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Layout>
      <VStack spacing={4}>
        <ChatWindow messages={messages} error={error} />
        <RecordButton
          onNewMessage={handleNewMessage}
          onError={handleError}
          onRecordingStart={handleRecordingStart}
          onRecordingStop={handleRecordingStop}
          isProcessing={isProcessing}
        />
        {isProcessing && <Text>Processing... Please wait.</Text>}
      </VStack>
    </Layout>
  )
}

export default Home