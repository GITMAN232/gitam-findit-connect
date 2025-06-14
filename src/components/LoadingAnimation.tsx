
import React, { useState, useEffect } from "react";

interface LoadingAnimationProps {
  onComplete: () => void;
}

const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showGlowEffect, setShowGlowEffect] = useState(false);
  const [showFadeOut, setShowFadeOut] = useState(false);

  const phases = [
    "Loading...",
    "Getting things ready...",
    "Almost there..."
  ];

  useEffect(() => {
    const duration = 3500; // 3.5 seconds total animation
    const interval = 50; // Smooth 50ms updates
    const steps = duration / interval;
    const progressStep = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + progressStep;
        
        // Update phase based on progress
        if (newProgress <= 40) {
          setCurrentPhase(0);
        } else if (newProgress <= 80) {
          setCurrentPhase(1);
        } else {
          setCurrentPhase(2);
        }
        
        // Show glow effect when magnifying glass reaches the end (95%)
        if (newProgress >= 95 && !showGlowEffect) {
          setShowGlowEffect(true);
        }
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setIsComplete(true);
          
          // Start fade out transition
          setTimeout(() => {
            setShowFadeOut(true);
          }, 300);
          
          // Complete transition to homepage
          setTimeout(() => {
            onComplete();
          }, 1000);
        }
        
        return Math.min(newProgress, 100);
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete, showGlowEffect]);

  return (
    <div 
      className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center transition-all duration-700 px-4 ${
        showFadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Logo Text */}
      <div className="mb-16">
        <h1 className="text-5xl font-bold text-center mb-2">
          <span className="text-maroon">G-Lost</span>
          <span className="text-mustard mx-2">&</span>
          <span className="text-maroon">Found</span>
        </h1>
        <p className="text-gray-500 text-center text-lg font-medium">
          Campus Item Recovery System
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-96 md:w-[500px] mb-12">
        {/* Progress Bar Background */}
        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          {/* Progress Bar Fill */}
          <div 
            className="h-full bg-gradient-to-r from-maroon to-mustard rounded-full transition-all duration-100 ease-out"
            style={{ 
              width: `${progress}%`
            }}
          />
        </div>

        {/* Magnifying Glass Emoji */}
        <div 
          className={`absolute top-1/2 transform -translate-y-1/2 transition-all duration-100 ease-out text-2xl ${
            showGlowEffect ? 'scale-125' : 'scale-100'
          }`}
          style={{ 
            left: `${Math.min(progress, 95)}%`,
            transform: `translate(-50%, -50%) ${showGlowEffect ? 'scale(1.25)' : 'scale(1)'}`,
            filter: showGlowEffect ? 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))' : 'none',
            zIndex: 10
          }}
        >
          🔎
        </div>

        {/* Pin Emoji at the end */}
        <div 
          className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-2xl"
          style={{ zIndex: 5 }}
        >
          📍
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center min-h-[60px] flex flex-col justify-center">
        <div className="text-xl text-gray-600 font-medium transition-all duration-300">
          {phases[currentPhase]}
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="text-sm text-gray-400">
            {Math.round(progress)}% complete
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-mustard rounded-full animate-pulse"
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        </div>
        
        {isComplete && (
          <div className="text-green-600 font-semibold text-lg mt-4 flex items-center justify-center gap-2">
            <span>Ready to go!</span>
            <span>✨</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingAnimation;
