
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [magnifyingGlassPosition, setMagnifyingGlassPosition] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const duration = 3000; // 3 seconds total animation
    const interval = 50; // Update every 50ms
    const steps = duration / interval;
    const progressStep = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressStep;
        setMagnifyingGlassPosition(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setShowPulse(true);
          
          // Wait for pulse animation then complete
          setTimeout(() => {
            onComplete();
          }, 500);
        }
        
        return Math.min(newProgress, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-maroon rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="font-bold text-2xl">
            <span className="text-maroon">FindIt</span>
            <span className="text-mustard">@</span>
            <span className="text-maroon">GITAM</span>
          </span>
        </div>
        <p className="text-gray-600 text-center">Connecting lost items with their owners</p>
      </div>

      {/* Animation Container */}
      <div className="relative w-80 mb-8">
        {/* Progress Bar Background */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
          <div 
            className="h-full bg-gradient-to-r from-maroon to-mustard rounded-full transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Animation Icons */}
        <div className="relative w-full h-12 flex items-center">
          {/* Magnifying Glass moving across */}
          <div 
            className="absolute transition-all duration-75 ease-out"
            style={{ left: `${magnifyingGlassPosition}%`, transform: 'translateX(-50%)' }}
          >
            <span 
              className="text-2xl"
              style={{ 
                transform: magnifyingGlassPosition >= 100 ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.3s ease'
              }}
            >
              🔍
            </span>
          </div>

          {/* Location Pin at the end */}
          <div 
            className="absolute right-0"
            style={{ transform: 'translateX(50%)' }}
          >
            <MapPin 
              className={`w-8 h-8 text-mustard transition-all duration-300 ${
                showPulse ? 'scale-125 animate-pulse' : 'scale-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <div className="text-lg font-medium text-gray-700 mb-2">
          {progress < 50 ? 'Searching...' : progress < 95 ? 'Almost there...' : 'Found it!'}
        </div>
        <div className="text-sm text-gray-500">
          {Math.round(progress)}% complete
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-maroon/5 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-mustard/5 rounded-full"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 bg-maroon/5 rounded-full"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
