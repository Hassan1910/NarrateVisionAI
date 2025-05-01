import React, { useState, useEffect, useRef } from 'react';

interface VideoEffectsProps {
  imageUrl: string;
  audioUrl?: string;
  text?: string;
  className?: string;
}

const VideoEffects: React.FC<VideoEffectsProps> = ({
  imageUrl,
  audioUrl,
  text,
  className = ''
}) => {
  const [currentEffect, setCurrentEffect] = useState<string>('kenBurns');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // List of available effects
  const effects = [
    { id: 'kenBurns', name: 'Ken Burns Effect' },
    { id: 'slowZoom', name: 'Slow Zoom' },
    { id: 'panningShot', name: 'Panning Shot' },
    { id: 'fadeInOut', name: 'Fade In/Out' },
    { id: 'pulse', name: 'Pulse Effect' }
  ];
  
  // Play/pause audio when isPlaying changes
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Get CSS class for current effect
  const getEffectClass = () => {
    switch (currentEffect) {
      case 'kenBurns':
        return 'animate-kenBurns';
      case 'slowZoom':
        return 'animate-slowZoom';
      case 'panningShot':
        return 'animate-panningShot';
      case 'fadeInOut':
        return 'animate-fadeInOut';
      case 'pulse':
        return 'animate-pulse';
      default:
        return 'animate-kenBurns';
    }
  };
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Change effect
  const changeEffect = (effectId: string) => {
    setCurrentEffect(effectId);
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
        
        @keyframes panningShot {
          0% { transform: translateX(0); }
          50% { transform: translateX(-5%); }
          100% { transform: translateX(0); }
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0.8; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }
        
        .animate-kenBurns {
          animation: kenBurns 20s ease-in-out infinite;
        }
        
        .animate-slowZoom {
          animation: slowZoom 15s ease-in-out infinite alternate;
        }
        
        .animate-panningShot {
          animation: panningShot 15s ease-in-out infinite;
        }
        
        .animate-fadeInOut {
          animation: fadeInOut 8s ease-in-out infinite;
        }
      `}</style>
      
      {/* Image with animation effect */}
      <div 
        ref={containerRef}
        className="relative overflow-hidden rounded-lg bg-black aspect-video"
      >
        <img
          src={imageUrl}
          alt="Animated content"
          className={`w-full h-full object-cover ${getEffectClass()}`}
        />
        
        {/* Text overlay */}
        {text && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4 text-white">
            <p className="text-center italic">{text}</p>
          </div>
        )}
        
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
      </div>
      
      {/* Audio element (hidden) */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          loop={false}
          className="hidden"
        />
      )}
      
      {/* Effect selector */}
      <div className="mt-4 flex flex-wrap gap-2">
        {effects.map(effect => (
          <button
            key={effect.id}
            onClick={() => changeEffect(effect.id)}
            className={`px-3 py-1 text-sm rounded-full transition-all ${
              currentEffect === effect.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {effect.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoEffects;
