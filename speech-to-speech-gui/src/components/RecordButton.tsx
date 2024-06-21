import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'

export interface RecordButtonProps {
  onNewMessage: (text: string, isUser: boolean, isArabic: boolean) => void
  onError: (error: string) => void
  onRecordingStart: () => void
  onRecordingStop: () => void
  isProcessing: boolean
}

const RecordButton: React.FC<RecordButtonProps> = ({
  onNewMessage,
  onError,
  onRecordingStart,
  onRecordingStop,
  isProcessing
}) => {
  const [isRecording, setIsRecording] = useState(false)

  const handleRecordClick = () => {
    try {
      if (!isRecording) {
        setIsRecording(true)
        onRecordingStart()
      } else {
        setIsRecording(false)
        onRecordingStop()
      }
    } catch (err) {
      onError('Failed to start/stop recording. Please try again.')
      console.error(err)
    }
  }

  return (
    <Button
      colorScheme={isRecording ? 'red' : 'blue'}
      size="lg"
      borderRadius="full"
      onClick={handleRecordClick}
      isDisabled={isProcessing}
    >
      {isRecording ? 'Stop' : 'Record'}
    </Button>
  )
}

export default RecordButton