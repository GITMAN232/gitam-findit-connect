
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-colors duration-300">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-maroon rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">🔍</span>
          </div>
          <span className="font-bold text-2xl">
            <span className="text-maroon">G-Lost</span>
            <span className="text-mustard">&</span>
            <span className="text-maroon">Found</span>
          </span>
        </div>
        <p className="text-gray-600 text-center">Connecting lost items with their owners</p>
      </div>

      {/* Animation Container */}
      <div className="relative w-80 mb-8">
        {/* Progress Bar Background */}
        <div className="w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-maroon to-mustard rounded-full transition-all duration-75 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>

        {/* Animation Icons */}
        <div className="relative w-full h-12 flex items-center">
          {/* Magnifying Glass moving across */}
          <div 
            className="absolute transition-all duration-75 ease-out z-10"
            style={{ left: `${magnifyingGlassPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div 
              className="text-2xl transform transition-transform duration-300"
              style={{ 
                transform: `translateX(-50%) ${magnifyingGlassPosition >= 100 ? 'scale(1.3)' : 'scale(1)'}`,
                filter: magnifyingGlassPosition >= 100 ? 'drop-shadow(0 0 8px rgba(122, 18, 28, 0.5))' : 'none'
              }}
            >
              🔍
            </div>
          </div>

          {/* Location Pin at the end */}
          <div 
            className="absolute right-0"
            style={{ transform: 'translateX(50%)' }}
          >
            <MapPin 
              className={`w-8 h-8 text-mustard transition-all duration-300 ${
                showPulse ? 'scale-125 animate-pulse drop-shadow-lg' : 'scale-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <div className="text-lg font-medium text-gray-700 mb-2">
          {progress < 30 ? 'Searching...' : progress < 70 ? 'Scanning campus...' : progress < 95 ? 'Almost there...' : 'Found it!'}
        </div>
        <div className="text-sm text-gray-500">
          {Math.round(progress)}% complete
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-maroon/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-mustard/5 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/6 w-16 h-16 bg-maroon/5 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
