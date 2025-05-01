import { useState, FormEvent, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import AnimatedImage from './AnimatedImage';
import VideoEffects from './VideoEffects';
import VideoSimulation from './VideoSimulation';
import ImageSequence from './ImageSequence';
import MicrophoneButton from './MicrophoneButton';

// Voice options for narration
const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral, balanced voice' },
  { id: 'echo', name: 'Echo', description: 'Lower pitch, clear voice' },
  { id: 'fable', name: 'Fable', description: 'Expressive, bright voice' },
  { id: 'onyx', name: 'Onyx', description: 'Deep, authoritative voice' },
  { id: 'nova', name: 'Nova', description: 'Warm, pleasant voice' },
  { id: 'shimmer', name: 'Shimmer', description: 'Crisp, higher-pitched voice' }
];

// Image style options
const IMAGE_STYLE_OPTIONS = [
  { id: 'natural', name: 'Natural', description: 'Realistic, detailed images' },
  { id: 'vivid', name: 'Vivid', description: 'Colorful, enhanced images' },
  { id: 'artistic', name: 'Artistic', description: 'Creative, stylized images' }
];

interface FormState {
  narration: string;
  selectedVoice: string;
  selectedImageStyle: string;
  selectedVideoEffect: 'simple' | 'effects' | 'simulation' | 'sequence';
  imagePath: string | null;
  imageUrl: string | null;
  imageUrls: string[]; // Array of multiple image URLs
  textSegments: string[]; // Array of text segments for each image
  audioUrl: string | null;
  isGeneratingImage: boolean;
  isGeneratingAudio: boolean;
  isGeneratingVideo: boolean;
  videoUrl: string | null;
  progress: 'idle' | 'generating-image' | 'generating-audio' | 'generating-video' | 'complete' | 'error';
  error: string | null;
}

export default function ImageToVideoForm() {
  const [formState, setFormState] = useState<FormState>({
    narration: '',
    selectedVoice: 'alloy',
    selectedImageStyle: 'natural',
    selectedVideoEffect: 'sequence', // Default to image sequence
    imagePath: null,
    imageUrl: null,
    imageUrls: [], // Initialize empty array for multiple images
    textSegments: [], // Initialize empty array for text segments
    audioUrl: null,
    isGeneratingImage: false,
    isGeneratingAudio: false,
    isGeneratingVideo: false,
    videoUrl: null,
    progress: 'idle',
    error: null,
  });

  // Audio player reference
  const audioRef = useRef<HTMLAudioElement>(null);

  // Function to split narration text into segments
  const splitTextIntoSegments = (text: string, maxSegments: number = 4): string[] => {
    // First try to split by paragraphs (double newlines)
    const paragraphRegex = /\n\s*\n/;
    let segments = text.split(paragraphRegex).filter(segment => segment.trim().length > 0);

    // If we have a good number of paragraphs, use those
    if (segments.length >= 2 && segments.length <= maxSegments) {
      console.log('Using paragraph-based segmentation');
      return segments;
    }

    // Next try to split by single newlines
    if (segments.length < 2) {
      const newlineRegex = /\n/;
      segments = text.split(newlineRegex).filter(segment => segment.trim().length > 0);

      if (segments.length >= 2 && segments.length <= maxSegments) {
        console.log('Using newline-based segmentation');
        return segments;
      }
    }

    // Next try to split by sentences
    if (segments.length < 2 || segments.length > maxSegments) {
      const sentenceRegex = /[.!?]+\s+/g;
      segments = text.split(sentenceRegex).filter(segment => segment.trim().length > 0);

      if (segments.length >= 2 && segments.length <= maxSegments) {
        console.log('Using sentence-based segmentation');
        return segments;
      }
    }

    // If we have too few segments, try to split by commas or other punctuation
    if (segments.length < 2) {
      const punctuationRegex = /[,;:]\s+/g;
      segments = text.split(punctuationRegex).filter(segment => segment.trim().length > 0);

      if (segments.length >= 2 && segments.length <= maxSegments) {
        console.log('Using punctuation-based segmentation');
        return segments;
      }
    }

    // If we still have too few segments, split by length
    if (segments.length < 2) {
      const avgLength = Math.ceil(text.length / maxSegments);
      segments = [];

      for (let i = 0; i < text.length; i += avgLength) {
        const segment = text.substring(i, Math.min(i + avgLength, text.length));
        if (segment.trim().length > 0) {
          segments.push(segment);
        }
      }

      console.log('Using length-based segmentation');
    }

    // Limit to max segments
    if (segments.length > maxSegments) {
      // Combine some segments to reduce the count
      const newSegments: string[] = [];
      const segmentsPerGroup = Math.ceil(segments.length / maxSegments);

      for (let i = 0; i < segments.length; i += segmentsPerGroup) {
        const combinedSegment = segments
          .slice(i, Math.min(i + segmentsPerGroup, segments.length))
          .join(' ');

        newSegments.push(combinedSegment);
      }

      segments = newSegments;
      console.log('Combined segments to meet max limit');
    }

    return segments;
  };

  // Function to reset the form
  const handleReset = () => {
    // Reset to initial state
    setFormState({
      narration: '',
      selectedVoice: 'alloy',
      selectedImageStyle: 'natural',
      selectedVideoEffect: 'sequence',
      imagePath: null,
      imageUrl: null,
      imageUrls: [],
      textSegments: [],
      audioUrl: null,
      isGeneratingImage: false,
      isGeneratingAudio: false,
      isGeneratingVideo: false,
      videoUrl: null,
      progress: 'idle',
      error: null,
    });

    // Also reset audio player if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Scroll to top of form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formState.narration.trim()) {
      toast.error('Please enter narration text');
      return;
    }

    try {
      // Step 1: Generate images from narration segments
      setFormState(prev => ({
        ...prev,
        isGeneratingImage: true,
        progress: 'generating-image',
        error: null
      }));

      // Split text into segments for multiple images
      const textSegments = splitTextIntoSegments(formState.narration, 4);
      console.log('Text segments:', textSegments);

      // Function to generate a single image
      async function generateSingleImage() {
        const imageResponse = await fetch('/api/generate-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: formState.narration,
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
          isGeneratingAudio: true,
          imagePath: imageData.imagePath,
          imageUrl: imageData.imageUrl,
          imageUrls: imageData.imageUrl ? [imageData.imageUrl] : [],
          textSegments: [formState.narration],
          progress: 'generating-audio'
        }));

        return imageData;
      }

      // Function to generate multiple images
      async function generateMultipleImages(segments: string[]) {
        const multipleImagesResponse = await fetch('/api/generate-multiple-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompts: segments,
            style: formState.selectedImageStyle
          }),
        });

        if (!multipleImagesResponse.ok) {
          const error = await multipleImagesResponse.json();
          throw new Error(error.details || 'Failed to generate multiple images');
        }

        const multipleImagesData = await multipleImagesResponse.json();
        console.log('Multiple images generation response:', multipleImagesData);

        // Extract image URLs and first image path
        const imageUrls = multipleImagesData.images.map((img: any) => img.imageUrl);
        const firstImagePath = multipleImagesData.images[0]?.imagePath || null;
        const firstImageUrl = multipleImagesData.images[0]?.imageUrl || null;

        // Update state with the generated images
        setFormState(prev => ({
          ...prev,
          isGeneratingImage: false,
          isGeneratingAudio: true,
          imagePath: firstImagePath,
          imageUrl: firstImageUrl,
          imageUrls: imageUrls,
          textSegments: segments,
          progress: 'generating-audio'
        }));

        return multipleImagesData.images[0];
      }

      // Generate images based on selected effect
      let imageData;

      if (formState.selectedVideoEffect === 'sequence' && textSegments.length > 1) {
        try {
          // Generate multiple images for sequence effect
          imageData = await generateMultipleImages(textSegments);
        } catch (multipleImagesError) {
          console.error('Error generating multiple images:', multipleImagesError);
          toast.error('Failed to generate multiple images. Falling back to single image.');

          // Fall back to single image generation
          imageData = await generateSingleImage();
        }
      } else {
        // Generate a single image for other effects
        imageData = await generateSingleImage();
      }

      // Step 2: Generate audio from narration
      const audioResponse = await fetch('/api/generate-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: formState.narration,
            voice: formState.selectedVoice
          }),
        });

        if (!audioResponse.ok) {
          const error = await audioResponse.json();
          throw new Error(error.details || 'Failed to generate audio');
        }

        const audioData = await audioResponse.json();
        console.log('Audio generation response:', audioData);

        // Step 3: Generate video from image and audio
        setFormState(prev => ({
          ...prev,
          isGeneratingAudio: false,
          isGeneratingVideo: true,
          audioUrl: audioData.audioUrl, // Store the audio URL for playback
          progress: 'generating-video'
        }));

        // Create form data for video generation
        const videoRequestData: any = {
          audioPath: audioData.audioPath,
          text: formState.narration, // Pass the narration text for the fallback
          effect: formState.selectedVideoEffect // Pass the selected effect
        };

        // Handle multiple images for sequence effect
        if (formState.selectedVideoEffect === 'sequence' && formState.imageUrls.length > 1) {
          // Get all image paths from the multiple images response
          const allImagePaths = multipleImagesData?.images?.map((img: any) => img.imagePath) || [];

          if (allImagePaths.length > 1) {
            // If we have multiple image paths, use them for slideshow
            videoRequestData.imagePaths = allImagePaths;
            console.log('Using multiple images for slideshow:', allImagePaths.length);

            // Add extra logging for debugging
            console.log('Image paths being sent to API:', allImagePaths);
          } else {
            // Fallback to single image if we don't have multiple paths
            videoRequestData.imagePath = imageData.imagePath;
          }
        } else {
          // For other effects, use single image
          videoRequestData.imagePath = imageData.imagePath;
        }

        const videoResponse = await fetch('/api/generate-video', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(videoRequestData),
        });

        if (!videoResponse.ok) {
          const error = await videoResponse.json();
          throw new Error(error.details || 'Failed to generate video');
        }

        const videoData = await videoResponse.json();
        console.log('Video generation response:', videoData);

        // Log detailed information about the response for debugging
        console.log('Video URL:', videoData.videoUrl);
        console.log('Image URL:', videoData.imageUrl);
        console.log('Image URLs:', videoData.imageUrls);
        console.log('Is Vercel Environment:', videoData.isVercelEnvironment);

        // Ensure we have valid image URLs
        const imageUrl = videoData.imageUrl || prev.imageUrl;
        let imageUrls = videoData.imageUrls || prev.imageUrls;

        // If we have no image URLs but have a single image URL, use that
        if ((!imageUrls || imageUrls.length === 0) && imageUrl) {
          imageUrls = [imageUrl];
        }

        // Update state with video URL and image URLs from video generation
        setFormState(prev => ({
          ...prev,
          isGeneratingVideo: false,
          videoUrl: videoData.videoUrl,
          imageUrl: imageUrl,
          imageUrls: imageUrls,
          progress: 'complete'
        }));

        // Show success message with details about the generated content
        toast.success(`Video generated successfully! ${imageUrls.length} image(s) created.`);
      } catch (error: any) {
        console.error('Error:', error);
        setFormState(prev => ({
          ...prev,
          isGeneratingImage: false,
          isGeneratingAudio: false,
          isGeneratingVideo: false,
          error: error.message || 'An unexpected error occurred',
          progress: 'error'
        }));

        toast.error(error.message || 'Failed to generate video');
      }
  }

  // The reset function is already defined above

  return (
    <div className="w-full mx-auto">
      <div className="mb-6">
        <h2 className="section-title">Create Your Video</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your narration text below and customize your video settings
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Narration Text */}
        <div className="space-y-2">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            <label htmlFor="narration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Narration Text
            </label>
          </div>
          <div className="relative">
            <textarea
              id="narration"
              rows={5}
              value={formState.narration}
              onChange={(e) => setFormState(prev => ({ ...prev, narration: e.target.value }))}
              className="form-input pr-12"
              placeholder="Enter your story or message here. This text will be used for narration and to generate matching visuals..."
              disabled={formState.progress !== 'idle' && formState.progress !== 'error'}
            />
            <div className="absolute right-2 bottom-2">
              <MicrophoneButton
                onTranscriptChange={(text) => setFormState(prev => ({ ...prev, narration: text }))}
                appendToExisting={true}
                existingText={formState.narration}
                className="h-10 w-10"
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            For best results, use descriptive language and separate paragraphs with line breaks. Click the microphone icon to use speech-to-text.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Voice Selection */}
          <div className="space-y-2">
            <div className="flex items-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              <label htmlFor="voice" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Narration Voice
              </label>
            </div>
            <select
              id="voice"
              value={formState.selectedVoice}
              onChange={(e) => setFormState(prev => ({ ...prev, selectedVoice: e.target.value }))}
              className="form-select"
              disabled={formState.progress !== 'idle' && formState.progress !== 'error'}
            >
              {VOICE_OPTIONS.map(voice => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} - {voice.description}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Choose a voice that matches the tone of your content
            </p>
          </div>

          {/* Image Style Selection */}
          <div className="space-y-2">
            <div className="flex items-center mb-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <label htmlFor="imageStyle" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Image Style
              </label>
            </div>
            <select
              id="imageStyle"
              value={formState.selectedImageStyle}
              onChange={(e) => setFormState(prev => ({ ...prev, selectedImageStyle: e.target.value }))}
              className="form-select"
              disabled={formState.progress !== 'idle' && formState.progress !== 'error'}
            >
              {IMAGE_STYLE_OPTIONS.map(style => (
                <option key={style.id} value={style.id}>
                  {style.name} - {style.description}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select a visual style for the AI-generated images
            </p>
          </div>
        </div>

        {/* Video Effect Selection */}
        <div className="space-y-2">
          <div className="flex items-center mb-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <label htmlFor="videoEffect" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Video Effect
            </label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                formState.selectedVideoEffect === 'simple'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
              onClick={() => formState.progress === 'idle' && setFormState(prev => ({ ...prev, selectedVideoEffect: 'simple' }))}
            >
              <div className="font-medium mb-1">Simple Animation</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Basic pan and zoom effects</div>
            </div>

            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                formState.selectedVideoEffect === 'effects'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
              onClick={() => formState.progress === 'idle' && setFormState(prev => ({ ...prev, selectedVideoEffect: 'effects' }))}
            >
              <div className="font-medium mb-1">Multiple Effects</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Various animation styles</div>
            </div>

            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                formState.selectedVideoEffect === 'simulation'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
              onClick={() => formState.progress === 'idle' && setFormState(prev => ({ ...prev, selectedVideoEffect: 'simulation' }))}
            >
              <div className="font-medium mb-1">Video Simulation</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Advanced with text overlay</div>
            </div>

            <div
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                formState.selectedVideoEffect === 'sequence'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
              }`}
              onClick={() => formState.progress === 'idle' && setFormState(prev => ({ ...prev, selectedVideoEffect: 'sequence' }))}
            >
              <div className="font-medium mb-1">Image Sequence</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Multiple images with transitions</div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Choose how your images will be animated in the final video
          </p>
        </div>

        {/* Results Section - Only show when complete */}
        {formState.progress === 'complete' && (
          <div className="mt-8 border dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your Video is Ready!
              </h3>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Video Preview */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Video Preview</h4>
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-inner">
                    {/* Try to display video if available, otherwise fallback to animated image */}
                    {formState.videoUrl && formState.videoUrl.endsWith('.mp4') ? (
                      <video
                        controls
                        className="w-full h-full"
                        src={formState.videoUrl}
                        poster={formState.imageUrl || undefined}
                      >
                        Your browser does not support the video element.
                        <source src={formState.videoUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <div className="w-full h-full">
                        {formState.imageUrl && (
                          <>
                            {/* Render different video effects based on selection */}
                            {formState.selectedVideoEffect === 'simple' && (
                              <AnimatedImage
                                src={formState.imageUrl}
                                alt="Generated image"
                                className="w-full h-full"
                                duration={15}
                              />
                            )}

                            {formState.selectedVideoEffect === 'effects' && (
                              <VideoEffects
                                imageUrl={formState.imageUrl}
                                audioUrl={formState.audioUrl}
                                text={formState.narration}
                                className="w-full h-full"
                              />
                            )}

                            {formState.selectedVideoEffect === 'simulation' && (
                              <VideoSimulation
                                imageUrl={formState.imageUrl}
                                audioUrl={formState.audioUrl}
                                text={formState.narration}
                                className="w-full h-full"
                              />
                            )}

                            {formState.selectedVideoEffect === 'sequence' && formState.imageUrls.length > 0 && (
                              <ImageSequence
                                images={formState.imageUrls}
                                audioUrl={formState.audioUrl}
                                textSegments={formState.textSegments}
                                className="w-full h-full"
                              />
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Details and Controls */}
                <div className="space-y-6">
                  {/* Generated Images */}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Generated Images</h4>
                    {/* Debug info - will be removed in production */}
                    {process.env.NODE_ENV === 'development' && (
                      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400">
                        <p>Image URLs: {formState.imageUrls.length > 0 ? formState.imageUrls.join(', ') : 'None'}</p>
                        <p>Single Image URL: {formState.imageUrl || 'None'}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                      {formState.imageUrls.length > 0 ? (
                        formState.imageUrls.map((url, index) => (
                          <div key={index} className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src={url}
                              alt={`Generated image ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`Error loading image ${index} from URL: ${url}`);
                                // Set a fallback image or placeholder
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        ))
                      ) : (
                        formState.imageUrl && (
                          <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                            <img
                              src={formState.imageUrl}
                              alt="Generated image"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error(`Error loading image from URL: ${formState.imageUrl}`);
                                // Set a fallback image or placeholder
                                e.currentTarget.src = '/placeholder.svg';
                              }}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Audio Preview */}
                  {formState.audioUrl && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Audio Narration</h4>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                        <audio
                          ref={audioRef}
                          controls
                          className="w-full"
                          src={formState.audioUrl}
                        >
                          Your browser does not support the audio element.
                        </audio>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                          Voice: {VOICE_OPTIONS.find(v => v.id === formState.selectedVoice)?.name || 'Default'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3">
                    <a
                      href={formState.videoUrl || '#'}
                      download="narratevision-video.mp4"
                      className="btn-primary py-2 text-center flex items-center justify-center"
                      disabled={!formState.videoUrl}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Download Video
                    </a>

                    <a
                      href={formState.imageUrl || '#'}
                      download="narratevision-image.jpg"
                      className="btn-secondary py-2 text-center flex items-center justify-center"
                      disabled={!formState.imageUrl}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                      </svg>
                      Download Images
                    </a>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn-secondary py-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Create Another Video
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        {formState.progress !== 'idle' && formState.progress !== 'error' && formState.progress !== 'complete' && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-center">
            <div className="mr-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
            </div>
            <div>
              <h3 className="font-medium text-blue-800 dark:text-blue-300">
                {formState.progress === 'generating-image' && 'Creating visuals...'}
                {formState.progress === 'generating-audio' && 'Generating narration...'}
                {formState.progress === 'generating-video' && 'Assembling video...'}
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {formState.progress === 'generating-image' && 'AI is creating images based on your text'}
                {formState.progress === 'generating-audio' && 'Converting your text to natural speech'}
                {formState.progress === 'generating-video' && 'Combining visuals and audio into a video'}
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
                  Error creating your video
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
              disabled={!formState.narration.trim()}
              className="btn-primary py-3 px-6"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Create My Video
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
