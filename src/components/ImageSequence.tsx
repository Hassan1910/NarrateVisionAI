import React, { useState, useEffect, useRef } from 'react';

interface ImageSequenceProps {
  images: string[];
  audioUrl?: string;
  textSegments?: string[];
  duration?: number; // Total duration in seconds
  className?: string;
}

const ImageSequence: React.FC<ImageSequenceProps> = ({
  images,
  audioUrl,
  textSegments = [],
  duration = 30,
  className = ''
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Calculate time per image
  const timePerImage = audioDuration > 0 
    ? audioDuration / images.length 
    : duration / images.length;
  
  // Handle audio loading
  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setAudioDuration(audioRef.current.duration);
        }
      };
      
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        }
      };
    }
  }, [audioUrl]);
  
  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
        
        // Start animation loop
        const animate = () => {
          if (audioRef.current) {
            const currentTime = audioRef.current.currentTime;
            setCurrentTime(currentTime);
            
            // Calculate which image to show based on current time
            if (audioDuration > 0) {
              const newIndex = Math.min(
                Math.floor(currentTime / timePerImage),
                images.length - 1
              );
              setCurrentImageIndex(newIndex);
            }
          }
          
          animationRef.current = requestAnimationFrame(animate);
        };
        
        animationRef.current = requestAnimationFrame(animate);
      } else {
        audioRef.current.pause();
        
        // Stop animation loop
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, images.length, timePerImage, audioDuration]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Calculate progress percentage
  const progressPercentage = audioDuration > 0 ? (currentTime / audioDuration) * 100 : 0;
  
  return (
    <div className={`relative ${className}`}>
      {/* CSS for transitions */}
      <style jsx>{`
        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 0.375rem;
          background-color: black;
        }
        
        .sequence-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }
        
        .sequence-image.active {
          opacity: 1;
        }
        
        .progress-bar {
          height: 4px;
          background-color: rgba(255, 255, 255, 0.3);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
        }
        
        .progress-fill {
          height: 100%;
          background-color: #3b82f6;
          transition: width 0.1s linear;
        }
        
        .text-overlay {
          position: absolute;
          bottom: 2rem;
          left: 1rem;
          right: 1rem;
          background-color: rgba(0, 0, 0, 0.7);
          color: white;
          padding: 0.75rem;
          border-radius: 0.375rem;
          text-align: center;
          z-index: 5;
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Video container */}
      <div className="relative aspect-video">
        <div className="image-container">
          {/* Render all images, but only show the current one */}
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Sequence image ${index + 1}`}
              className={`sequence-image ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
          
          {/* Text overlay */}
          {textSegments[currentImageIndex] && (
            <div className="text-overlay">
              <p>{textSegments[currentImageIndex]}</p>
            </div>
          )}
          
          {/* Progress bar */}
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all z-10"
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )}
        </button>
        
        {/* Time display */}
        <div className="absolute bottom-6 right-4 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs z-10">
          {formatTime(currentTime)} / {formatTime(audioDuration)}
        </div>
      </div>
      
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          className="hidden"
          onEnded={() => setIsPlaying(false)}
        />
      )}
      
      {/* Image thumbnails */}
      <div className="mt-4 flex overflow-x-auto space-x-2 pb-2">
        {images.map((src, index) => (
          <div 
            key={index}
            className={`flex-shrink-0 w-16 h-16 cursor-pointer border-2 ${
              index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => {
              setCurrentImageIndex(index);
              if (audioRef.current && isPlaying) {
                audioRef.current.currentTime = index * timePerImage;
              }
            }}
          >
            <img 
              src={src} 
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageSequence;
