'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import MicrophoneButton from './MicrophoneButton';

// Define image style options
const IMAGE_STYLE_OPTIONS = [
  { id: 'natural', name: 'Natural', description: 'Photorealistic style' },
  { id: 'vivid', name: 'Vivid', description: 'Vibrant and colorful' },
  { id: 'artistic', name: 'Artistic', description: 'Creative and stylized' },
];

interface FormState {
  prompt: string;
  selectedImageStyle: string;
  isGeneratingImage: boolean;
  imageUrl: string | null;
  progress: 'idle' | 'generating-image' | 'complete' | 'error';
  error: string | null;
}

export default function TextToImageForm() {
  const [formState, setFormState] = useState<FormState>({
    prompt: '',
    selectedImageStyle: 'vivid',
    isGeneratingImage: false,
    imageUrl: null,
    progress: 'idle',
    error: null,
  });

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formState.prompt.trim()) {
      toast.error('Please enter a text prompt');
      return;
    }

    try {
      // Generate image from prompt
      setFormState(prev => ({
        ...prev,
        isGeneratingImage: true,
        progress: 'generating-image',
        error: null
      }));

      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: formState.prompt,
          style: formState.selectedImageStyle
        }),
      });

      if (!imageResponse.ok) {
        const error = await imageResponse.json();
        throw new Error(error.details || 'Failed to generate image');
      }

      const imageData = await imageResponse.json();
      console.log('Image generation response:', imageData);

      // Update state with the generated image
      setFormState(prev => ({
        ...prev,
        isGeneratingImage: false,
        imageUrl: imageData.imageUrl,
        progress: 'complete'
      }));

      toast.success('Image generated successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      setFormState(prev => ({
        ...prev,
        isGeneratingImage: false,
        error: error.message || 'An unexpected error occurred',
        progress: 'error'
      }));

      toast.error(error.message || 'Failed to generate image');
    }
  };

  // Function to reset the form
  const handleReset = () => {
    setFormState({
      prompt: '',
      selectedImageStyle: 'vivid',
      isGeneratingImage: false,
      imageUrl: null,
      progress: 'idle',
      error: null,
    });
  };

  return (
    <div className="w-full mx-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-2 sm:mb-3">Text to Image Generator</h2>
        <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          Enter a text prompt to generate an AI image
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        {/* Text Prompt Input */}
        <div>
          <label htmlFor="prompt" className="form-label text-sm sm:text-base mb-2">
            Text Prompt
          </label>
          <div className="relative">
            <textarea
              id="prompt"
              rows={3}
              className="form-input text-sm sm:text-base pr-12 sm:pr-14"
              placeholder="Describe the image you want to generate..."
              value={formState.prompt}
              onChange={(e) => setFormState(prev => ({ ...prev, prompt: e.target.value }))}
              disabled={formState.isGeneratingImage}
            />
            <div className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3">
              <MicrophoneButton
                onTranscriptChange={(text) => setFormState(prev => ({ ...prev, prompt: text }))}
                appendToExisting={true}
                existingText={formState.prompt}
                className="h-9 w-9 sm:h-11 sm:w-11"
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Click the microphone icon to use speech-to-text
          </p>
        </div>

        {/* Image Style Selection */}
        <div>
          <label className="form-label text-sm sm:text-base mb-2 sm:mb-3">
            Image Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {IMAGE_STYLE_OPTIONS.map((style) => (
              <div
                key={style.id}
                className={`border rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 hover:shadow-md active:bg-indigo-50/80 dark:active:bg-indigo-900/30 ${
                  formState.selectedImageStyle === style.id
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-700'
                }`}
                onClick={() => setFormState(prev => ({ ...prev, selectedImageStyle: style.id }))}
              >
                <div className="font-medium text-gray-900 dark:text-white text-sm sm:text-base mb-0.5 sm:mb-1">{style.name}</div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{style.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Section - Only show when complete */}
        {formState.progress === 'complete' && (
          <div className="mt-6 sm:mt-8 card border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 sm:px-6 py-4 sm:py-5 flex items-center">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/20 flex items-center justify-center mr-2 sm:mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Your Image is Ready!
              </h3>
            </div>

            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 gap-6 sm:gap-8">
                {/* Image Preview */}
                <div className="space-y-3 sm:space-y-5">
                  <h4 className="text-base sm:text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">Generated Image</h4>
                  <div className="relative aspect-square max-h-[512px] bg-black rounded-xl overflow-hidden shadow-inner border border-gray-800/50">
                    {formState.imageUrl && (
                      <img
                        src={formState.imageUrl}
                        alt="Generated image"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          console.error(`Error loading image from URL: ${formState.imageUrl}`);
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <a
                    href={formState.imageUrl || '#'}
                    download="narratevision-image.jpg"
                    className="btn-primary py-2.5 sm:py-3 text-center flex items-center justify-center text-sm sm:text-base"
                    disabled={!formState.imageUrl}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Image
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary py-2.5 sm:py-3 text-sm sm:text-base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Generate Another Image
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {formState.progress === 'generating-image' && (
          <div className="glass rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center">
            <div className="mb-3 sm:mb-0 sm:mr-6">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                Creating your image...
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                AI is generating an image based on your text prompt
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {formState.progress === 'error' && (
          <div className="glass border-2 border-red-200 dark:border-red-800/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
              <div className="flex-shrink-0 mb-3 sm:mb-0">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-0 sm:ml-5 text-center sm:text-left">
                <h3 className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400 mb-1 sm:mb-2">
                  Error Creating Your Image
                </h3>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-5">
                  <p>{formState.error || 'Something went wrong. Please try again.'}</p>
                </div>
                <div className="flex justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setFormState(prev => ({ ...prev, error: null, progress: 'idle' }))}
                    className="btn-primary py-2 px-4 text-sm sm:text-base"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {(formState.progress === 'idle' || formState.progress === 'error') && (
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={!formState.prompt.trim() || formState.isGeneratingImage}
              className="btn-primary py-2.5 sm:py-3 px-5 sm:px-6 text-sm sm:text-base w-full"
            >
              {formState.isGeneratingImage ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Image...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  Generate Image
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
