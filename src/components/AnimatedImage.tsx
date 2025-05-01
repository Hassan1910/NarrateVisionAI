import { useState, useEffect, useRef } from 'react';

interface AnimatedImageProps {
  src: string;
  alt: string;
  duration?: number; // Duration in seconds
  className?: string;
}

// Animation types
type AnimationType = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'panUp' | 'panDown';

const AnimatedImage: React.FC<AnimatedImageProps> = ({ 
  src, 
  alt, 
  duration = 10, 
  className = '' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animationType, setAnimationType] = useState<AnimationType>('zoomIn');
  
  // Choose a random animation type on mount
  useEffect(() => {
    const animations: AnimationType[] = [
      'zoomIn', 'zoomOut', 'panLeft', 'panRight', 'panUp', 'panDown'
    ];
    const randomIndex = Math.floor(Math.random() * animations.length);
    setAnimationType(animations[randomIndex]);
  }, [src]); // Reset animation when image changes
  
  // Get animation style based on type
  const getAnimationStyle = () => {
    switch (animationType) {
      case 'zoomIn':
        return {
          animation: `zoomIn ${duration}s ease-in-out infinite alternate`
        };
      case 'zoomOut':
        return {
          animation: `zoomOut ${duration}s ease-in-out infinite alternate`
        };
      case 'panLeft':
        return {
          animation: `panLeft ${duration}s ease-in-out infinite alternate`
        };
      case 'panRight':
        return {
          animation: `panRight ${duration}s ease-in-out infinite alternate`
        };
      case 'panUp':
        return {
          animation: `panUp ${duration}s ease-in-out infinite alternate`
        };
      case 'panDown':
        return {
          animation: `panDown ${duration}s ease-in-out infinite alternate`
        };
      default:
        return {};
    }
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width: '100%', height: '100%' }}
    >
      <style jsx>{`
        @keyframes zoomIn {
          from { transform: scale(1); }
          to { transform: scale(1.2); }
        }
        @keyframes zoomOut {
          from { transform: scale(1.2); }
          to { transform: scale(1); }
        }
        @keyframes panLeft {
          from { transform: translateX(0); }
          to { transform: translateX(-10%); }
        }
        @keyframes panRight {
          from { transform: translateX(-10%); }
          to { transform: translateX(0); }
        }
        @keyframes panUp {
          from { transform: translateY(0); }
          to { transform: translateY(-10%); }
        }
        @keyframes panDown {
          from { transform: translateY(-10%); }
          to { transform: translateY(0); }
        }
      `}</style>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        style={{
          ...getAnimationStyle(),
          transformOrigin: 'center center'
        }}
      />
    </div>
  );
};

export default AnimatedImage;
