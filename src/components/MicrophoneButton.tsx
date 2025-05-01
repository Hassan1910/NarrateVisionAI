'use client';

import React from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'react-toastify';

interface MicrophoneButtonProps {
  onTranscriptChange: (text: string) => void;
  appendToExisting?: boolean;
  existingText?: string;
  className?: string;
}

const MicrophoneButton: React.FC<MicrophoneButtonProps> = ({
  onTranscriptChange,
  appendToExisting = false,
  existingText = '',
  className = ''
}) => {
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport
  } = useSpeechRecognition();

  // Handle click on the microphone button
  const handleMicrophoneClick = () => {
    if (!hasRecognitionSupport) {
      toast.error('Your browser does not support speech recognition');
      return;
    }

    if (isListening) {
      stopListening();
      if (transcript) {
        const newText = appendToExisting
          ? `${existingText} ${transcript}`.trim()
          : transcript;
        onTranscriptChange(newText);
      }
      resetTranscript();
    } else {
      startListening();
    }
  };

  // Show error if there's any
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // If speech recognition is not supported, don't render the button
  if (!hasRecognitionSupport) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleMicrophoneClick}
      className={`p-2.5 rounded-full shadow-sm ${
        isListening
          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white animate-pulse shadow-md'
          : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600 hover:shadow-md'
      } transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transform hover:-translate-y-0.5 ${className}`}
      title={isListening ? 'Stop recording' : 'Start speech recognition'}
      aria-label={isListening ? 'Stop recording' : 'Start speech recognition'}
    >
      {isListening ? (
        // Recording icon (stop) with animation
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
          </svg>
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-300 animate-ping"></span>
        </div>
      ) : (
        // Microphone icon (start)
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

export default MicrophoneButton;
