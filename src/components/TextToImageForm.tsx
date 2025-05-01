import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';

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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Text to Image Generator</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter a text prompt to generate an AI image
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Text Prompt Input */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Text Prompt
          </label>
          <textarea
            id="prompt"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Describe the image you want to generate..."
            value={formState.prompt}
            onChange={(e) => setFormState(prev => ({ ...prev, prompt: e.target.value }))}
            disabled={formState.isGeneratingImage}
          />
        </div>

        {/* Image Style Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Image Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {IMAGE_STYLE_OPTIONS.map((style) => (
              <div
                key={style.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  formState.selectedImageStyle === style.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setFormState(prev => ({ ...prev, selectedImageStyle: style.id }))}
              >
                <div className="font-medium text-gray-900 dark:text-white">{style.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{style.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Results Section - Only show when complete */}
        {formState.progress === 'complete' && (
          <div className="mt-8 border dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your Image is Ready!
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Image Preview */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Generated Image</h4>
                  <div className="relative aspect-square max-h-[512px] bg-black rounded-lg overflow-hidden shadow-inner">
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
                <div className="flex flex-col space-y-3">
                  <a
                    href={formState.imageUrl || '#'}
                    download="narratevision-image.jpg"
                    className="btn-primary py-2 text-center flex items-center justify-center"
                    disabled={!formState.imageUrl}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Image
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-secondary py-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center">
            <div className="mr-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">
                Creating your image...
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                AI is generating an image based on your text
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {formState.progress === 'error' && (
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Error creating your image
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-400">
                  <p>{formState.error || 'Something went wrong. Please try again.'}</p>
                </div>
                <div className="mt-4">
                  <div className="-mx-2 -my-1.5 flex">
                    <button
                      type="button"
                      onClick={() => setFormState(prev => ({ ...prev, error: null, progress: 'idle' }))}
                      className="bg-red-50 dark:bg-red-900/30 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        {(formState.progress === 'idle' || formState.progress === 'error') && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!formState.prompt.trim() || formState.isGeneratingImage}
              className="btn-primary py-3 px-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Generate Image
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
