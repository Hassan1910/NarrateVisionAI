import React, { useState, useEffect, useRef } from 'react';

interface VideoSimulationProps {
  imageUrl: string;
  audioUrl?: string;
  text?: string;
  className?: string;
}

const VideoSimulation: React.FC<VideoSimulationProps> = ({
  imageUrl,
  audioUrl,
  text,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [textSegments, setTextSegments] = useState<string[]>([]);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Split text into segments for animation
  useEffect(() => {
    if (text) {
      // Split text into sentences or segments
      const segments = text
        .split(/(?<=[.!?])\s+/)
        .filter(segment => segment.trim().length > 0);
      
      setTextSegments(segments.length > 0 ? segments : [text]);
    } else {
      setTextSegments([]);
    }
  }, [text]);
  
  // Handle audio loading
  useEffect(() => {
    if (audioRef.current) {
      const handleLoadedMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
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
            setCurrentTime(audioRef.current.currentTime);
            
            // Update current text segment based on time
            if (textSegments.length > 0 && duration > 0) {
              const segmentDuration = duration / textSegments.length;
              const newSegment = Math.min(
                Math.floor(audioRef.current.currentTime / segmentDuration),
                textSegments.length - 1
              );
              setCurrentSegment(newSegment);
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
  }, [isPlaying, textSegments, duration]);
  
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
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  // Get animation style based on current time
  const getAnimationStyle = () => {
    // Different animations based on current segment
    const animations = [
      'animate-kenBurns',
      'animate-slowZoom',
      'animate-panLeft',
      'animate-panRight'
    ];
    
    // Use modulo to cycle through animations
    const animationIndex = currentSegment % animations.length;
    return animations[animationIndex];
  };
  
  return (
    <div className={`relative ${className}`}>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes kenBurns {
          0% { transform: scale(1) translate(0, 0); }
          25% { transform: scale(1.1) translate(-2%, -1%); }
          50% { transform: scale(1.15) translate(1%, -2%); }
          75% { transform: scale(1.1) translate(2%, 1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.2); }
        }
        
        @keyframes panLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-5%); }
        }
        
        @keyframes panRight {
          0% { transform: translateX(-5%); }
          100% { transform: translateX(0); }
        }
        
        .animate-kenBurns {
          animation: kenBurns 10s ease-in-out infinite;
        }
        
        .animate-slowZoom {
          animation: slowZoom 8s ease-in-out infinite alternate;
        }
        
        .animate-panLeft {
          animation: panLeft 8s ease-in-out infinite alternate;
        }
        
        .animate-panRight {
          animation: panRight 8s ease-in-out infinite alternate;
        }
        
        .progress-bar {
          height: 4px;
          background-color: rgba(255, 255, 255, 0.3);
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
        }
        
        .progress-fill {
          height: 100%;
          background-color: #3b82f6;
          transition: width 0.1s linear;
        }
        
        .text-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      {/* Video container */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-lg bg-black aspect-video"
      >
        {/* Image with animation */}
        <img
          src={imageUrl}
          alt="Video content"
          className={`w-full h-full object-cover ${getAnimationStyle()}`}
        />
        
        {/* Text overlay */}
        {textSegments.length > 0 && (
          <div className="absolute bottom-8 left-0 right-0 px-6">
            <div className="bg-black bg-opacity-60 p-4 rounded-lg text-white text-fade-in">
              <p className="text-center text-lg">
                {textSegments[currentSegment]}
              </p>
            </div>
          </div>
        )}
        
        {/* Progress bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
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
        <div className="absolute bottom-6 right-4 bg-black bg-opacity-50 px-2 py-1 rounded text-white text-xs">
          {formatTime(currentTime)} / {formatTime(duration)}
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
    </div>
  );
};

export default VideoSimulation;
